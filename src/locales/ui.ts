import type { LocaleMessage } from '@/utils/getLocalizedString'

export const uiStrings = {
  exploreShips: {
    en: 'Explore our ships',
    ru: 'Исследуйте наши корабли',
  },
  sectionMain: {
    en: 'Main',
    ru: 'Главная',
  },
  sectionShips: {
    en: 'Ships',
    ru: 'Корабли',
  },
  sectionNations: {
    en: 'Nations',
    ru: 'Нации',
  },
  name: {
    en: 'Name',
    ru: 'Название',
  },
  searchByName: {
    en: 'Search by name',
    ru: 'Поиск по названию',
  },
  nation: {
    en: 'Nation',
    ru: 'Нация',
  },
  allNations: {
    en: 'All nations',
    ru: 'Все нации',
  },
  type: {
    en: 'Type',
    ru: 'Тип',
  },
  allTypes: {
    en: 'All types',
    ru: 'Все типы',
  },
  level: {
    en: 'Level',
    ru: 'Уровень',
  },
  allLevels: {
    en: 'All levels',
    ru: 'Все уровни',
  },
  resetFilters: {
    en: 'Reset filters',
    ru: 'Сбросить фильтры',
  },
  tier: {
    en: 'Tier',
    ru: 'Уровень',
  },
  loadingShips: {
    en: 'Loading ships…',
    ru: 'Загрузка кораблей…',
  },
  shipsCount: {
    en: 'ships',
    ru: 'кораблей',
  },
  select: {
    en: 'Select...',
    ru: 'Выберите...',
  },
  loading: {
    en: 'Loading',
    ru: 'Загрузка',
  },
  fetchError: {
    en: 'Failed to load data',
    ru: 'Не удалось загрузить данные',
  },
  fetchErrorEyebrow: {
    en: 'Connection issue',
    ru: 'Проблема со связью',
  },
  fetchErrorHint: {
    en: 'Check your connection and try again. The fleet is waiting.',
    ru: 'Проверьте соединение и попробуйте ещё раз. Флот ждёт.',
  },
  retry: {
    en: 'Retry',
    ru: 'Повторить',
  },
} as const satisfies Record<string, LocaleMessage>
