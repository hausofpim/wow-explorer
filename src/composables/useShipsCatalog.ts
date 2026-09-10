import { useGlobalStore } from '@/stores/useGlobalStore'
import { useLangStore } from '@/stores/useLangStore'
import type { BaseSelectOption } from '@/types/BaseSelectOption'
import type { FilterWorkerInbound, FilterWorkerOutbound } from '@/types/FilterWorker'
import type { MappedShip } from '@/types/HeroShip'
import type { RawShip } from '@/types/Ship'
import type { ShipsFilter } from '@/types/ShipsFilter'
import { uiStrings } from '@/locales/ui'
import { debounce } from '@/utils/debounce'
import { getLocalizedString } from '@/utils/getLocalizedString'
import { mapRawShips } from '@/utils/mapRawShip'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'

const CHUNK_SIZE = 100
const FILTER_DEBOUNCE_MS = 300

export function useShipsCatalog() {
  const globalStore = useGlobalStore()
  const langStore = useLangStore()
  const { ships, nations, vehicleTypes, mediaPath } = storeToRefs(globalStore)
  const { currentLang } = storeToRefs(langStore)

  const filters = ref<ShipsFilter>({
    name: '',
    type: '',
    nation: '',
    level: '',
  })

  const mappedShips = shallowRef<MappedShip[]>([])
  const filteredShips = shallowRef<MappedShip[]>([])
  const isMapping = ref(false)
  const isFiltering = ref(false)

  const isLoading = computed(() => isMapping.value || isFiltering.value)

  const mappingContext = () => ({
    mediaPath: mediaPath.value,
    lang: currentLang.value,
    nations: nations.value,
    vehicleTypes: vehicleTypes.value,
  })

  const nationOptions = computed<BaseSelectOption<string>[]>(() => [
    { value: '', label: getLocalizedString(uiStrings.allNations, currentLang.value) },
    ...Array.from(nations.value.values())
      .map((nation) => ({
        value: nation.name,
        label: getLocalizedString(nation.localization.mark, currentLang.value),
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ])

  const typeOptions = computed<BaseSelectOption<string>[]>(() => [
    { value: '', label: getLocalizedString(uiStrings.allTypes, currentLang.value) },
    ...Array.from(vehicleTypes.value.entries())
      .sort(([, a], [, b]) => a.sort_order - b.sort_order)
      .map(([key, vehicleType]) => ({
        value: key,
        label: getLocalizedString(vehicleType.localization.mark, currentLang.value),
      })),
  ])

  const levelOptions = computed<BaseSelectOption<string>[]>(() => {
    const levels = new Set(ships.value.map((ship) => ship.level))
    const tierLabel = getLocalizedString(uiStrings.tier, currentLang.value)

    return [
      { value: '', label: getLocalizedString(uiStrings.allLevels, currentLang.value) },
      ...Array.from(levels)
        .sort((a, b) => a - b)
        .map((level) => ({
          value: String(level),
          label: `${tierLabel} ${level}`,
        })),
    ]
  })

  let worker: Worker | null = null
  let latestRequestId = 0
  let mappingToken = 0
  let suppressFilterWatch = false

  const postFilter = (nextFilters: ShipsFilter) => {
    if (!worker || mappedShips.value.length === 0) return

    isFiltering.value = true
    latestRequestId += 1

    worker.postMessage({
      type: 'filter',
      filters: nextFilters,
      requestId: latestRequestId,
    } satisfies FilterWorkerInbound)
  }

  const debouncedFilter = debounce(postFilter, FILTER_DEBOUNCE_MS)

  const hasActiveFiltersState = computed(() =>
    Boolean(
      filters.value.name || filters.value.type || filters.value.nation || filters.value.level,
    ),
  )

  const handleWorkerMessage = (event: MessageEvent<FilterWorkerOutbound>) => {
    const data = event.data

    if (data.type === 'ready') {
      if (hasActiveFiltersState.value) {
        postFilter({ ...filters.value })
        return
      }
      filteredShips.value = data.ships
      isFiltering.value = false
      return
    }

    if (data.type === 'result' && data.requestId === latestRequestId) {
      filteredShips.value = data.ships
      isFiltering.value = false
    }
  }

  const initWorker = () => {
    worker = new Worker(new URL('../workers/filterShips.ts', import.meta.url), {
      type: 'module',
    })
    worker.onmessage = handleWorkerMessage
  }

  const startMapping = (rawShips: RawShip[]) => {
    const token = ++mappingToken
    isMapping.value = true

    let index = 0
    const acc: MappedShip[] = []

    const mapChunk = () => {
      if (token !== mappingToken) return

      const chunk = rawShips.slice(index, index + CHUNK_SIZE)
      acc.push(...mapRawShips(chunk, mappingContext()))
      index += CHUNK_SIZE

      if (index < rawShips.length) {
        requestAnimationFrame(mapChunk)
        return
      }

      mappedShips.value = acc
      isMapping.value = false
      isFiltering.value = true
      worker?.postMessage({ type: 'init', ships: acc } satisfies FilterWorkerInbound)
    }

    mapChunk()
  }

  onMounted(() => {
    initWorker()
    if (ships.value.length > 0) {
      startMapping(ships.value)
    }
  })

  onUnmounted(() => {
    mappingToken += 1
    debouncedFilter.cancel()
    worker?.terminate()
    worker = null
  })

  watch(
    filters,
    (value) => {
      if (suppressFilterWatch) {
        suppressFilterWatch = false
        return
      }
      if (mappedShips.value.length === 0) return
      debouncedFilter({ ...value })
    },
    { deep: true },
  )

  watch(currentLang, () => {
    if (ships.value.length === 0) return
    startMapping(ships.value)
  })

  const resetFilters = () => {
    debouncedFilter.cancel()
    suppressFilterWatch = true

    const emptyFilters: ShipsFilter = {
      name: '',
      type: '',
      nation: '',
      level: '',
    }

    filters.value = emptyFilters
    filteredShips.value = mappedShips.value
    isFiltering.value = false

    if (!worker || mappedShips.value.length === 0) return

    latestRequestId += 1
    worker.postMessage({
      type: 'filter',
      filters: emptyFilters,
      requestId: latestRequestId,
    } satisfies FilterWorkerInbound)
  }

  return {
    filters,
    filteredShips,
    isLoading,
    nationOptions,
    typeOptions,
    levelOptions,
    resetFilters,
    hasActiveFiltersState,
  }
}
