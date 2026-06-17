/** Resposta bruta do endpoint de geocoding (campos utilizados). */
export interface GeocodingApiResponse {
  results?: GeocodingResult[]
}

export interface GeocodingResult {
  name: string
  latitude: number
  longitude: number
  country_code: string
  timezone: string
}

/** Dados atuais do forecast (campos obrigatórios + weather_code). */
export interface WeatherCurrent {
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: number
  wind_speed_10m: number
  wind_direction_10m: number
  precipitation_probability: number
  weather_code: number
  precipitation: number
}

export interface WeatherCurrentUnits {
  temperature_2m: string
  relative_humidity_2m: string
  apparent_temperature: string
  wind_speed_10m: string
  wind_direction_10m: string
  precipitation_probability: string
  weather_code: string
  precipitation: string
}

/** Resposta do endpoint de forecast (campos utilizados). */
export interface WeatherApiResponse {
  current?: WeatherCurrent
  current_units?: WeatherCurrentUnits
}

export interface WeatherResult {
  current: WeatherCurrent
  current_units: WeatherCurrentUnits
}

/** Dados combinados de geocoding + forecast para a UI. */
export interface CombinedWeatherData {
  name: string
  country_code: string
  timezone: string
  latitude: number
  longitude: number
  current: WeatherCurrent
  current_units: WeatherCurrentUnits
}
