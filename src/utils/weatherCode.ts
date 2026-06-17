const WEATHER_CODE_DESCRIPTIONS: Readonly<Record<number, string>> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Neblina com geada',
  51: 'Garoa: leve',
  53: 'Garoa: moderada',
  55: 'Garoa: intensa',
  56: 'Garoa congelante: leve',
  57: 'Garoa congelante: intensa',
  61: 'Chuva: leve',
  63: 'Chuva: moderada',
  65: 'Chuva: forte',
  66: 'Chuva congelante: leve',
  67: 'Chuva congelante: forte',
  71: 'Neve: leve',
  73: 'Neve: moderada',
  75: 'Neve: forte',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva: leve',
  81: 'Pancadas de chuva: moderada',
  82: 'Pancadas de chuva: violenta',
  85: 'Pancadas de neve: leve',
  86: 'Pancadas de neve: forte',
  95: 'Tempestade: leve',
  96: 'Tempestade com granizo leve',
  99: 'Tempestade com granizo forte',
}

const UNKNOWN_CONDITION = 'Condição desconhecida'

export function getWeatherDescription(code: number): string {
  return WEATHER_CODE_DESCRIPTIONS[code] ?? UNKNOWN_CONDITION
}
