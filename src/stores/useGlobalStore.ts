import type { Nation } from '@/types/Nation'
import type { ServerResponse } from '@/types/ServerResponse'
import type { RawShip } from '@/types/Ship'
import type { VehicleType } from '@/types/VehicleType'
import { fetchApi } from '@/utils/fetch'
import { defineStore } from 'pinia'
import { onMounted, ref, watch } from 'vue'

const EXCLUDED_TAGS = new Set(['preserved', 'clan'])

type LoaderItem = {
  isReady: boolean
  fetch: () => Promise<void>
}

export const useGlobalStore = defineStore('global', () => {
  const ships = ref<RawShip[]>([])
  const mediaPath = ref<string>('')
  const nations = ref<Map<string, Nation>>(new Map())
  const vehicleTypes = ref<Map<string, VehicleType>>(new Map())

  const loadingPercent = ref<number>(0)
  const fetchError = ref<string>('')
  const isFetching = ref<boolean>(true)

  const handleError = (error: Error) => {
    isFetching.value = false
    fetchError.value = error.message
  }

  const loader = ref<LoaderItem[]>([
    {
      isReady: false,
      fetch: async function fetch() {
        const response = await fetchApi<
          ServerResponse<{
            [key: string]: RawShip
          }>
        >('/api/encyclopedia/en/vehicles/')
        ships.value = Object.values(response.data).filter(
          (ship) => !ship.tags.some((tag) => EXCLUDED_TAGS.has(tag)),
        )
        this.isReady = true
      },
    },
    {
      isReady: false,
      fetch: async function fetch() {
        const response = await fetchApi<ServerResponse<string>>('/api/encyclopedia/en/media_path/')
        mediaPath.value = response.data
        this.isReady = true
      },
    },
    {
      isReady: false,
      fetch: async function fetch() {
        const response = await fetchApi<ServerResponse<Nation[]>>('/api/encyclopedia/en/nations/')
        nations.value = new Map(
          Object.entries(response.data).map(([, value]) => [value.name, value as Nation]),
        )
        this.isReady = true
      },
    },
    {
      isReady: false,
      fetch: async function fetch() {
        const response = await fetchApi<
          ServerResponse<{
            [key: string]: VehicleType
          }>
        >('/api/encyclopedia/en/vehicle_types_common/')
        vehicleTypes.value = new Map(Object.entries(response.data))
        this.isReady = true
      },
    },
  ])

  const fetchAll = async () => {
    isFetching.value = true
    fetchError.value = ''
    loadingPercent.value = 0

    for (const item of loader.value) {
      item.isReady = false
    }

    try {
      await Promise.all(loader.value.map((item) => item.fetch()))
      isFetching.value = false
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)))
    }
  }

  onMounted(() => {
    void fetchAll()
  })

  watch(
    loader,
    () => {
      loadingPercent.value =
        (loader.value.filter((item) => item.isReady).length / loader.value.length) * 100
    },
    { deep: true },
  )

  return {
    ships,
    mediaPath,
    nations,
    vehicleTypes,
    isFetching,
    loadingPercent,
    fetchError,
    fetchAll,
  }
})
