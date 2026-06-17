const WEATHER_CODE_DESCRIPTIONS: Readonly<Record<number, string>> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo, parcialmente nublado e nublado',
  2: 'Predominantemente limpo, parcialmente nublado e nublado',
  3: 'Predominantemente limpo, parcialmente nublado e nublado',
  45: 'Neblina e neblina com geada',
  48: 'Neblina e neblina com geada',
  51: 'Garoa: leve, moderada e intensa',
  53: 'Garoa: leve, moderada e intensa',
  55: 'Garoa: leve, moderada e intensa',
  56: 'Garoa congelante: leve e intensa',
  57: 'Garoa congelante: leve e intensa',
  61: 'Chuva: leve, moderada e forte',
  63: 'Chuva: leve, moderada e forte',
  65: 'Chuva: leve, moderada e forte',
  66: 'Chuva congelante: leve e forte',
  67: 'Chuva congelante: leve e forte',
  71: 'Neve: leve, moderada e forte',
  73: 'Neve: leve, moderada e forte',
  75: 'Neve: leve, moderada e forte',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva: leve, moderada e violenta',
  81: 'Pancadas de chuva: leve, moderada e violenta',
  82: 'Pancadas de chuva: leve, moderada e violenta',
  85: 'Pancadas de neve: leve e forte',
  86: 'Pancadas de neve: leve e forte',
  95: 'Tempestade: leve ou moderada',
  96: 'Tempestade com granizo leve e forte',
  99: 'Tempestade com granizo leve e forte',
}

const UNKNOWN_CONDITION = 'Condição desconhecida'

export function getWeatherDescription(code: number): string {
  return WEATHER_CODE_DESCRIPTIONS[code] ?? UNKNOWN_CONDITION
}
