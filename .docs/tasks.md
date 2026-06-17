# Tasks — Clima

**Referência:** [prd.md](./prd.md)  
**Versão:** 1.0  
**Data:** 17/06/2026

Este documento divide a implementação do PRD em tarefas incrementais. Cada tarefa deve ser executada **uma de cada vez** por um agente de IA. Detalhes funcionais, visuais e de API estão no PRD — aqui ficam apenas o escopo da tarefa e critérios de aprovação.

---

## Como usar

1. Escolha a **próxima tarefa não marcada** (respeite a ordem numérica).
2. Leia as seções do PRD referenciadas na tarefa antes de implementar.
3. Ao concluir, valide todos os critérios de aprovação.
4. Marque a tarefa como feita trocando `[ ]` por `[x]`.

---

## Fase 1 — Fundação

### Task 01 — Scaffold e estrutura de pastas

**PRD:** §3.1, §3.5

- [x] Remover código de exemplo do Vite (`counter.ts` e referências).
- [x] Criar a estrutura de pastas sugerida no PRD (`services/`, `utils/`, `types/`, `assets/`).
- [x] Garantir que `npm run build` conclui sem erros.

**Critérios de aprovação:**
- Estrutura `src/` corresponde à §3.5 do PRD.
- Não há arquivos ou imports órfãos do template Vite.
- `npm run dev` e `npm run build` executam com sucesso.

---

### Task 02 — Tipos TypeScript

**PRD:** §3.3, §3.4, §4.5

- [x] Criar `src/types/weather.ts` com interfaces para respostas da API (geocoding, forecast) e para `CombinedWeatherData`.
- [x] Habilitar strict mode no `tsconfig` (se ainda não estiver).

**Critérios de aprovação:**
- Interfaces cobrem os campos usados nas §3.3.1 e §3.3.2 do PRD.
- `CombinedWeatherData` agrupa dados de geocoding + forecast necessários à UI.
- Nenhum uso de `any` no arquivo de tipos.
- Projeto compila sem erros de tipo.

---

### Task 03 — Mapeamento de weather code (WMO → PT)

**PRD:** §2.5

- [x] Criar `src/utils/weatherCode.ts` com função que recebe um código WMO e retorna descrição em português.

**Critérios de aprovação:**
- Todos os códigos da tabela §2.5 do PRD retornam a descrição correta.
- Códigos não mapeados retornam descrição genérica (ex.: "Condição desconhecida").
- Função é pura, exportada e tipada.

---

### Task 04 — Direção cardinal do vento

**PRD:** §2.6

- [x] Criar `src/utils/windDirection.ts` com função que converte graus em direção cardinal.

**Critérios de aprovação:**
- Intervalos de graus seguem exatamente a tabela §2.6 do PRD (incluindo bordas como 337.5°–360° → N).
- Função retorna abreviações em português: N, NE, E, SE, S, SO, O, NO.
- Função é pura, exportada e tipada.

---

## Fase 2 — Camada de serviço (API)

### Task 05 — `searchCity`

**PRD:** §3.3.1, §3.4, §4.2, §4.3

- [x] Implementar `searchCity(cityName: string)` em `src/services/openMeteo.ts`.

**Critérios de aprovação:**
- Valida `cityName` (string não vazia após trim); retorna `null` sem requisição se inválido (§4.2).
- Chama o endpoint de geocoding conforme §3.3.1 (`count=1`, `language=pt`).
- Retorna objeto tipado com `name`, `latitude`, `longitude`, `country_code`, `timezone` ou `null`.
- `results` vazio/ausente, erro de rede ou resposta inválida → `null` (§4.3).
- Nenhum outro módulo da aplicação faz `fetch` direto à API.

---

### Task 06 — `getWeather`

**PRD:** §3.3.2, §3.4, §4.2, §4.3

- [x] Implementar `getWeather(latitude, longitude, timezone)` em `src/services/openMeteo.ts`.

**Critérios de aprovação:**
- Valida parâmetros obrigatórios; retorna `null` sem requisição se ausentes/inválidos (§4.2).
- Chama o endpoint de forecast conforme §3.3.2 (parâmetro `current` com todos os campos listados).
- Retorna `current` + `current_units` tipados ou `null`.
- `current` ausente ou sem todos os campos obrigatórios da §3.3.2 → `null`.
- Erro de rede → `null` (§4.3).

---

### Task 07 — `searchWeather`

**PRD:** §3.4, §4.1, §4.3

- [x] Implementar `searchWeather(cityName: string)` em `src/services/openMeteo.ts`, orquestrando geocoding → forecast.

**Critérios de aprovação:**
- Chama `searchCity` e, se sucesso, `getWeather` com lat/lon/timezone retornados.
- Retorna `CombinedWeatherData` combinando dados de ambas as chamadas ou `null` em qualquer falha.
- Requisições são sequenciais (geocoding antes do forecast), conforme §2.1 e diagrama §4.1.
- Toda comunicação com Open-Meteo permanece exclusivamente neste módulo.

---

## Fase 3 — Estrutura HTML e estilos base

### Task 08 — Markup semântico da aplicação

**PRD:** §2.2, §5.1, §5.3, §5.4

- [x] Atualizar `index.html` e/ou `main.ts` com a estrutura DOM da aplicação.

**Critérios de aprovação:**
- Área de busca (input + botão) fora e acima do card principal (§5.1).
- Card principal contém sidebar (esquerda) e área principal (direita).
- Elementos da sidebar e da área principal têm containers identificáveis para preenchimento posterior (§2.4).
- `lang="pt-BR"` no `<html>`.
- Título da página adequado (ex.: "Clima").

---

### Task 09 — Estilos globais e layout do card

**PRD:** §5.1, §5.2, §5.8

- [x] Implementar estilos base em `src/style.css`.

**Critérios de aprovação:**
- Fundo da página em cinza escuro; área de busca sem background próprio (§5.2).
- Card branco, borda arredondada, `max-width: 800px`, centralizado (§5.1, §5.2).
- Texto claro na área de busca; texto escuro dentro do card (§5.2).
- Fonte sans-serif do sistema e espaçamento consistente (múltiplos de 8px) (§5.8).
- Sidebar e área principal lado a lado em desktop (§5.7 — detalhamento completo na Task 16).

---

## Fase 4 — Estados e interação

### Task 10 — Campo de busca e validação de input

**PRD:** §2.2, §2.1 (passos 2–3)

- [ ] Conectar input e botão de busca em `main.ts`.

**Critérios de aprovação:**
- Placeholder conforme §2.2 (ex.: "Digite o nome da cidade").
- Busca dispara com **Enter** ou **clique no botão**.
- Campo vazio (ou só espaços após trim) **não** dispara requisição (§2.2, §4.3).
- Input é trimado antes da busca.

---

### Task 11 — Gerenciamento de estados (empty / loading / resultado)

**PRD:** §2.1, §2.3, §4.1

- [ ] Implementar máquina de estados da UI em `main.ts`.

**Critérios de aprovação:**
- Estado inicial é **empty** (§2.3).
- Ao buscar com input válido → **loading** → **resultado** ou **empty** (§2.1).
- Cidade não encontrada e falha no forecast retornam ao **mesmo empty state**, sem mensagem de erro diferenciada (§2.3).
- Apenas um estado visível por vez.

---

### Task 12 — Empty state

**PRD:** §2.3, §5.5

- [ ] Implementar visual do estado vazio.

**Critérios de aprovação:**
- Exibido no carregamento inicial e após busca sem resultado (§5.5).
- Mensagem convidativa (ex.: "Pesquise uma cidade para ver o clima").
- Sidebar e área principal sem dados reais (vazias ou com placeholder).
- Empty state some quando loading ou resultado estão ativos.

---

### Task 13 — Loading state

**PRD:** §2.3, §5.6

- [ ] Implementar visual do estado de carregamento.

**Critérios de aprovação:**
- Indicador de carregamento visível (spinner ou skeleton) durante `searchWeather` (§5.6).
- Campo de busca desabilitado ou com feedback visual claro de indisponibilidade (§2.3).
- Loading permanece visível durante as duas requisições (geocoding + forecast).
- Transição correta: loading → resultado ou loading → empty.

---

## Fase 5 — Exibição dos dados

### Task 14 — Sidebar (dados principais)

**PRD:** §2.4 (sidebar), §4.4

- [ ] Preencher sidebar com dados do resultado.

**Critérios de aprovação:**
- **Temperatura** em destaque (fonte maior, bold) com unidade de `current_units` (§5.3).
- **Cidade e país** no formato `Nome, CC` (ex.: `Rio de Janeiro, BR`).
- **Dia atual** formatado em português no fuso da cidade via `Intl.DateTimeFormat` (§4.4).
- **Dia/Noite** com texto "Dia" ou "Noite" baseado em `is_day` (ícone na Task 17).
- **Condição do tempo** via `weatherCode.ts` (§2.5).

---

### Task 15 — Área principal (métricas secundárias)

**PRD:** §2.4 (área principal), §2.6, §5.4

- [ ] Preencher área principal com métricas do resultado.

**Critérios de aprovação:**
- Quatro itens com label + valor: Umidade, Sensação térmica, Precipitação, Vento (§5.4).
- Valores usam unidades de `current_units` (ex.: `92%`, `21.4°C`).
- Vento exibido como `{velocidade} {unidade} · {graus}° ({cardinal})` usando `windDirection.ts` (§2.6).
- Layout em grid ou lista dentro da área principal.

---

### Task 16 — Responsividade

**PRD:** §5.7

- [ ] Ajustar layout para mobile.

**Critérios de aprovação:**
- Desktop (> ~768px): sidebar à esquerda, área principal à direita.
- Mobile (≤ ~768px): sidebar empilha **acima** da área principal.
- Card mantém `max-width: 800px` e padding adequado em ambos os breakpoints.

---

### Task 17 — Ícones dia/noite

**PRD:** §2.4 (Dia/Noite), §5.3, §3.5 (`assets/`)

- [ ] Adicionar ícones de sol e lua em `src/assets/` e exibir na sidebar.

**Critérios de aprovação:**
- `is_day === 1` → ícone de sol + texto "Dia".
- `is_day === 0` → ícone de lua + texto "Noite".
- Ícones são SVG (ou equivalente leve), não dependem de CDN externo.

---

## Fase 6 — Validação final

### Task 18 — Revisão de aceite do PRD

**PRD:** §6 (Critérios de aceite)

- [ ] Percorrer a checklist completa da §6 do PRD e corrigir lacunas.

**Critérios de aprovação:**
- Todos os itens da §6 do PRD estão atendidos.
- `npm run build` conclui sem erros.
- Busca manual com cidade válida (ex.: "São Paulo") exibe todos os campos.
- Busca com cidade inexistente (ex.: "XyzAbc123") retorna ao empty state sem erro visível.
- Nenhum `fetch` fora de `src/services/openMeteo.ts`.
- Itens fora de escopo (§7) **não** foram implementados.

---

## Resumo de dependências

```
01 → 02 → 03, 04 (paralelo possível)
         ↓
      05 → 06 → 07
         ↓
      08 → 09 → 10 → 11 → 12, 13
                        ↓
                     14 → 15 → 16 → 17 → 18
```

**Nota:** Tasks 12 e 13 dependem da 11, mas podem ser feitas em qualquer ordem entre si. Tasks 03 e 04 são independentes e necessárias antes da 14 e 15, respectivamente.
