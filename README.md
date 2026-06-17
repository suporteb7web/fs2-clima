# Clima

Aplicação web para consultar o clima de qualquer cidade do mundo. Digite o nome da cidade e visualize temperatura, umidade, vento, precipitação e condição do tempo em tempo real.

**Demo:** [suporteb7web.github.io/fs2-clima](https://suporteb7web.github.io/fs2-clima/)

## Funcionalidades

- Busca de cidades por nome (Enter ou botão **Buscar**)
- Exibição de temperatura, localização, data local, dia/noite e condição do tempo
- Métricas adicionais: umidade, sensação térmica, probabilidade de precipitação e vento (velocidade + direção cardinal)
- Descrições meteorológicas em português (códigos WMO)
- Estados de interface: vazio, carregamento e resultado

## Tecnologias

- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Open-Meteo](https://open-meteo.com/) — geocoding e previsão do tempo (sem autenticação)

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm

## Como executar

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Visualizar o build localmente
npm run preview
```

O servidor de desenvolvimento abre em `http://localhost:5173` por padrão.

## Estrutura do projeto

```
clima/
├── index.html              # Markup principal
├── src/
│   ├── main.ts             # Lógica da aplicação e renderização
│   ├── style.css           # Estilos
│   ├── services/
│   │   └── openMeteo.ts    # Integração com a API Open-Meteo
│   ├── types/
│   │   └── weather.ts      # Tipos TypeScript
│   ├── utils/
│   │   ├── weatherCode.ts  # Mapeamento WMO → português
│   │   └── windDirection.ts
│   └── assets/             # Ícones (sol, lua)
└── public/                 # Favicon e assets estáticos
```

## API

Os dados são obtidos em duas etapas:

1. **Geocoding** — `geocoding-api.open-meteo.com` para resolver o nome da cidade em coordenadas
2. **Forecast** — `api.open-meteo.com` para obter as condições meteorológicas atuais

Não é necessária chave de API.

## Deploy

O projeto é publicado automaticamente no GitHub Pages a cada push na branch `main`, via workflow em `.github/workflows/deploy.yml`.

Para deploy manual, execute `npm run build` e publique o conteúdo da pasta `dist/`.

## Licença

Projeto privado.
