import './style.css'
import sunIcon from './assets/sun.svg'
import moonIcon from './assets/moon.svg'
import { searchWeather } from './services/openMeteo'
import type { CombinedWeatherData } from './types/weather'
import { getWeatherDescription } from './utils/weatherCode'
import { getWindDirection } from './utils/windDirection'

type AppState = 'empty' | 'loading' | 'result'

const searchForm = document.querySelector<HTMLFormElement>('#search-form')!
const cityInput = document.querySelector<HTMLInputElement>('#city-input')!
const searchButton = document.querySelector<HTMLButtonElement>('#search-button')!
const emptyState = document.querySelector<HTMLElement>('#empty-state')!
const loadingState = document.querySelector<HTMLElement>('#loading-state')!
const cardContent = document.querySelector<HTMLElement>('#card-content')!

const sidebarTemperature = document.querySelector<HTMLElement>('#sidebar-temperature')!
const sidebarLocation = document.querySelector<HTMLElement>('#sidebar-location')!
const sidebarDate = document.querySelector<HTMLElement>('#sidebar-date')!
const daynightIcon = document.querySelector<HTMLImageElement>('#daynight-icon')!
const daynightText = document.querySelector<HTMLElement>('#daynight-text')!
const sidebarCondition = document.querySelector<HTMLElement>('#sidebar-condition')!

const humidityValue = document.querySelector<HTMLElement>('#humidity-value')!
const apparentTemperatureValue = document.querySelector<HTMLElement>('#apparent-temperature-value')!
const precipitationValue = document.querySelector<HTMLElement>('#precipitation-value')!
const windValue = document.querySelector<HTMLElement>('#wind-value')!

const dateFormatterCache = new Map<string, Intl.DateTimeFormat>()

function getDateFormatter(timezone: string): Intl.DateTimeFormat {
  let formatter = dateFormatterCache.get(timezone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: timezone,
    })
    dateFormatterCache.set(timezone, formatter)
  }
  return formatter
}

function formatValueWithUnit(value: number, unit: string): string {
  return `${value}${unit}`
}

function renderWeatherData(data: CombinedWeatherData): void {
  const { current, current_units: units } = data

  sidebarTemperature.textContent = formatValueWithUnit(
    current.temperature_2m,
    units.temperature_2m,
  )
  sidebarLocation.textContent = `${data.name}, ${data.country_code}`
  sidebarDate.textContent = getDateFormatter(data.timezone).format(new Date())

  const isDay = current.is_day === 1
  daynightIcon.src = isDay ? sunIcon : moonIcon
  daynightIcon.alt = isDay ? 'Dia' : 'Noite'
  daynightText.textContent = isDay ? 'Dia' : 'Noite'

  sidebarCondition.textContent = getWeatherDescription(current.weather_code)

  humidityValue.textContent = formatValueWithUnit(
    current.relative_humidity_2m,
    units.relative_humidity_2m,
  )
  apparentTemperatureValue.textContent = formatValueWithUnit(
    current.apparent_temperature,
    units.apparent_temperature,
  )
  precipitationValue.textContent = formatValueWithUnit(
    current.precipitation_probability,
    units.precipitation_probability,
  )

  const cardinal = getWindDirection(current.wind_direction_10m)
  const roundedDirection = Math.round(current.wind_direction_10m)
  windValue.textContent = `${current.wind_speed_10m} ${units.wind_speed_10m} · ${roundedDirection}° (${cardinal})`
}

function setState(state: AppState): void {
  emptyState.classList.toggle('is-hidden', state !== 'empty')
  loadingState.classList.toggle('is-hidden', state !== 'loading')
  cardContent.classList.toggle('is-hidden', state !== 'result')

  const isLoading = state === 'loading'
  cityInput.disabled = isLoading
  searchButton.disabled = isLoading
  cityInput.setAttribute('aria-busy', String(isLoading))
}

async function handleSearch(): Promise<void> {
  const cityName = cityInput.value.trim()
  if (!cityName) {
    return
  }

  setState('loading')

  const data = await searchWeather(cityName)

  if (data) {
    renderWeatherData(data)
    setState('result')
  } else {
    setState('empty')
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault()
  handleSearch()
})

setState('empty')
