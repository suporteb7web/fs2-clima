# Projeto: Clima

Este projeto vai pegar a cidade e baseado nisso, consultar o clima daquela região, exibindo as principais informações de clima, temperatura, humidade e etc.

### Aspectos Técnicos

O projeto vai ser feito em Vite + Vanilla + Typescript

### Informações da API que será usada no projeto:
Ele vai usar a API OpenMeteo, com os seguintes endpoints:

#### Para pegar a latitude, longitude e timezone, baseado no nome da cidade:
https://geocoding-api.open-meteo.com/v1/search?name={NOME_DA_CIDADE}&count=1&language=pt&format=json

{NOME_DA_CIDADE} = Nome da cidade que o usuário digitou

Exemplo de resposta:
{
  "results": [
    {
      "id": 3451190,
      "name": "Rio de Janeiro",
      "latitude": -22.90642,
      "longitude": -43.18223,
      "elevation": 12,
      "feature_code": "PPLA",
      "country_code": "BR",
      "admin1_id": 3451189,
      "admin2_id": 6322060,
      "timezone": "America/Sao_Paulo",
      "population": 6747815,
      "country_id": 3469034,
      "country": "Brasil",
      "admin1": "Rio de Janeiro",
      "admin2": "Rio de Janeiro"
    }
  ],
  "generationtime_ms": 1.1940002
}

Informações que PRECISAMOS:
- name
- latitude
- longitude
- country_code
- timezone

#### Para pegar as informações de clima:
https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&current=precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,precipitation,weather_code&timezone={TIMEZONE}

{LATITUDE} = Latitude
{LONGITUDE} = Longitude
{TIMEZONE} = Timezone

Exemplo de resposta:
{
  "latitude": -22.952549,
  "longitude": -43.215027,
  "generationtime_ms": 0.18155574798584,
  "utc_offset_seconds": -10800,
  "timezone": "America/Sao_Paulo",
  "timezone_abbreviation": "GMT-3",
  "elevation": 12,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "precipitation_probability": "%",
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "apparent_temperature": "°C",
    "is_day": "",
    "wind_speed_10m": "km/h",
    "wind_direction_10m": "°",
    "precipitation": "mm",
    "weather_code": "wmo code"
  },
  "current": {
    "time": "2026-06-17T09:45",
    "interval": 900,
    "precipitation_probability": 73,
    "temperature_2m": 19.3,
    "relative_humidity_2m": 92,
    "apparent_temperature": 21.4,
    "is_day": 1,
    "wind_speed_10m": 5.8,
    "wind_direction_10m": 277,
    "precipitation": 0,
    "weather_code": 2
  }
}

Informações que precisamos da resposta:
Na resposta eu tenho 2 itens:
- current_units tem as unidades de medida das propriedades
- current tem os valroes das propriedades

Propriedades obrigatórias:
- temperature_2m
- relative_humidity_2m
- apparent_temperature
- is_day
- wind_speed_10m
- wind_direction_10m
- precipitation_probability

#### Informação importante:
Teremos um arquivo com as funções do OpenMeteo, para que o projeto não faça requisição direta a API mas sim use as funções desse arquivo.

Fluxo de pesquisa para receber o nome da cidade e pegar as informações de clima:
- O usuário digita o nome da cidade
- O projeto pega o nome e usa o OpenMeteo para pegar a latitude, longitude e timezone dessa cidade.
- Ao pegar latitude, longitude e timezone, o projeto usa essas informações para fazer a requisição e pegar as informações do clima dessa localização.
- Caso não ache as informações da cidade, se comportar como se não tivesse achado nada.
- Caso ache as informações da cidade mas não as de clima, se comportar como se não tivesse achado nada.

A busca envolve as 2 requisições (buscar latitude/longitude/timezone + buscar clima), mas para o usuário é uma só, com loading.

As funções do OpenMeteo devem verificar se os parâmetros vieram, caso contrário, age como se não tivesse vindo.

### Aspectos visuais (design e UX)

Tem que ter Empty State.

Teremos uma área SUPERIO centralizada que tem apenas o campo de busca da cidade

O projeto terá um sidebar na esquerda com as seguintes informações:
- Temperatura
- Nome da cidade, Código do pais
- Dia atual
- Se é dia/noite (baseado no is_day)
- Weather Code

Na área principal:
- HUmidade relativa
- Temperatura aparente
- Probabilidade de precipitação
- Velocidade/Direção do vento

Design geral:
- O projeto terá um fundo cinza escuro
- A parte superior não terá background, mas tanto sidebar quanto a área principal ficarão dentro de uma div com borda bem arredondada, fundo branco, centralizada e largura máxima de 800px.

Informações de interpretação sobre o Weather Code:
WMO Weather interpretation codes (WW)
Code	Description
0	Clear sky
1, 2, 3	Mainly clear, partly cloudy, and overcast
45, 48	Fog and depositing rime fog
51, 53, 55	Drizzle: Light, moderate, and dense intensity
56, 57	Freezing Drizzle: Light and dense intensity
61, 63, 65	Rain: Slight, moderate and heavy intensity
66, 67	Freezing Rain: Light and heavy intensity
71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
77	Snow grains
80, 81, 82	Rain showers: Slight, moderate, and violent
85, 86	Snow showers slight and heavy
95 *	Thunderstorm: Slight or moderate
96, 99 *	Thunderstorm with slight and heavy hail