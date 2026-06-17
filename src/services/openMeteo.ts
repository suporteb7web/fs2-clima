import type {
  CombinedWeatherData,
  GeocodingApiResponse,
  GeocodingResult,
  WeatherApiResponse,
  WeatherCurrent,
  WeatherResult,
} from '../types/weather'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const FORECAST_CURRENT_FIELDS = [
  'precipitation_probability',
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'wind_speed_10m',
  'wind_direction_10m',
  'precipitation',
  'weather_code',
] as const

const REQUIRED_CURRENT_FIELDS: (keyof WeatherCurrent)[] = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'wind_speed_10m',
  'wind_direction_10m',
  'precipitation_probability',
]

function isGeocodingResult(value: unknown): value is GeocodingResult {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const result = value as Record<string, unknown>

  return (
    typeof result.name === 'string' &&
    typeof result.latitude === 'number' &&
    typeof result.longitude === 'number' &&
    typeof result.country_code === 'string' &&
    typeof result.timezone === 'string'
  )
}

function hasRequiredCurrentFields(current: WeatherCurrent): boolean {
  return REQUIRED_CURRENT_FIELDS.every((field) => current[field] !== undefined)
}

export async function searchCity(cityName: string): Promise<GeocodingResult | null> {
  const trimmedName = cityName.trim()
  if (!trimmedName) {
    return null
  }

  const params = new URLSearchParams({
    name: trimmedName,
    count: '1',
    language: 'pt',
    format: 'json',
  })

  try {
    const response = await fetch(`${GEOCODING_URL}?${params}`)
    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as GeocodingApiResponse
    const firstResult = data.results?.[0]

    if (!isGeocodingResult(firstResult)) {
      return null
    }

    return firstResult
  } catch {
    return null
  }
}

export async function getWeather(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<WeatherResult | null> {
  if (
    latitude === undefined ||
    longitude === undefined ||
    timezone === undefined ||
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    typeof timezone !== 'string' ||
    !timezone.trim()
  ) {
    return null
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: FORECAST_CURRENT_FIELDS.join(','),
    timezone: timezone.trim(),
  })

  try {
    const response = await fetch(`${FORECAST_URL}?${params}`)
    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as WeatherApiResponse
    const { current, current_units } = data

    if (!current || !current_units || !hasRequiredCurrentFields(current)) {
      return null
    }

    return { current, current_units }
  } catch {
    return null
  }
}

export async function searchWeather(cityName: string): Promise<CombinedWeatherData | null> {
  const city = await searchCity(cityName)
  if (!city) {
    return null
  }

  const weather = await getWeather(city.latitude, city.longitude, city.timezone)
  if (!weather) {
    return null
  }

  return {
    name: city.name,
    country_code: city.country_code,
    timezone: city.timezone,
    latitude: city.latitude,
    longitude: city.longitude,
    current: weather.current,
    current_units: weather.current_units,
  }
}
