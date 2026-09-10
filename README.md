# World of Warships ships explorer

> **Demo:**

Single page app for browsing World of Warships ships: hero carousel, filterable ship grid, and nations overview with data comes from the public Vortex API.

## Decisions

- Since the backend data is static (I couldn't find query parameters for filtering or pagination in the requests provided for the test task), I load all the necessary data first and only then display the main content.
- I decided to show an animated loading screen while the data is being fetched. If the Vortex backend is unavailable for any reason, an error message appears with an option to retry loading the data.
- To allow for the gradual loading of site sections, I split the three sections into separate chunks and load them only when the user needs them.
- I used a Web Worker in `ShipsGridSection.vue` to filter local data in the background, ensuring the page rendering isn't blocked. I also applied debouncing to the filters to avoid triggering the filtering process on every keystroke in the name search field.
- To generate the ship data on that same page, I iterated through the array using chunking; this ensures the page remains fast even if the number of ships received from the backend increases.
- I virtualized the list of ships in `ShipsGridSection.vue` so that all 1,000 ships aren't stored in the DOM tree simultaneously.
- I also implemented a simple localization system supporting two languages: English and Russian. Names, descriptions, and other localized data come from the backend response, while static UI labels are sourced from `ui.ts`. I wrote a `useT` hook to handle localization, allowing the language of the labels to be changed dynamically.
- The site is responsive and optimized for desktop, tablet, and mobile devices.
- I also added some tests for the utility functions.

## Project structure

```text
src/
  components/     # UI pieces (navbar, selects, section menu, etc.)
  composables/    # ships catalog, virtual grid, i18n helper, nav
  locales/        # UI strings
  pages/          # Home page
  sections/       # Hero, ships grid, nations, loading screen
  stores/         # Pinia (global data, language)
  types/          # Shared TypeScript types
  utils/          # mapping, filters, debounce, fetch helpers
  workers/        # ship filter Web Worker
public/images/    # static assets
```

## Stack

- Vue 3 + TypeScript
- Pinia
- Vite
- GSAP
- Vitest

## Features

- Loading screen while encyclopedia data is fetched
- Hero carousel with featured ships
- Ships grid with name/nation/type/tier filters
- Horizontal virtualized grid for smoother scrolling
- Filtering offloaded to a Web Worker
- Nations section with per-nation ship samples
- EN and RU UI language switch
- Responsive layout for desktop, tablet, and mobile

## Getting started

### Requirements

- Node.js `^22.18.0` or `>=24.12.0`
- npm

### Install

```sh
npm install
```

### Development

```sh
npm run dev
```

The development server proxies requests to `/api/*` to `https://vortex.worldofwarships.eu` due to CORS restrictions on the backend server (see `vite.config.ts`).

### Production build

```sh
npm run build
npm run preview
```

### Tests

```sh
npm run test
```

### Lint / format

```sh
npm run lint
npm run format
```

## Scripts reference

| Command              | Description                      |
| -------------------- | -------------------------------- |
| `npm run dev`        | Start Vite dev server            |
| `npm run build`      | Type-check + production build    |
| `npm run preview`    | Preview production build locally |
| `npm run test`       | Run unit tests once              |
| `npm run test:watch` | Vitest watch mode                |
| `npm run lint`       | ESLint                           |
| `npm run format`     | Prettier                         |
