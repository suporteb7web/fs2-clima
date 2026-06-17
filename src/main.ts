import './style.css'
import { searchWeather } from './services/openMeteo'

type AppState = 'empty' | 'loading' | 'result'

const searchForm = document.querySelector<HTMLFormElement>('#search-form')!
const cityInput = document.querySelector<HTMLInputElement>('#city-input')!
const searchButton = document.querySelector<HTMLButtonElement>('#search-button')!
const emptyState = document.querySelector<HTMLElement>('#empty-state')!
const loadingState = document.querySelector<HTMLElement>('#loading-state')!
const cardContent = document.querySelector<HTMLElement>('#card-content')!

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
