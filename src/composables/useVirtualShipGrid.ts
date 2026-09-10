import type { MappedShip } from '@/types/HeroShip'
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

export const SHIP_GRID_CELL_WIDTH = 220
export const SHIP_GRID_CELL_MIN_HEIGHT = 220
export const SHIP_GRID_GAP = 20

const OVERSCAN_COLS = 2
const EDGE_ZONE = SHIP_GRID_CELL_WIDTH + SHIP_GRID_GAP

export type VirtualShipItem = {
  ship: MappedShip
  index: number
  col: number
  x: number
  y: number
  edgeScale: number
  edgeOpacity: number
  edgeOrigin: string
}

const getEdgeFx = (x: number, scrollLeft: number, viewportWidth: number) => {
  const left = scrollLeft
  const right = left + viewportWidth
  const colRight = x + SHIP_GRID_CELL_WIDTH
  let progress = 1

  if (colRight <= left || x >= right) {
    progress = 0
  } else if (x < left) {
    progress = Math.min(1, (colRight - left) / EDGE_ZONE)
  } else if (colRight > right) {
    progress = Math.min(1, (right - x) / EDGE_ZONE)
  }

  const isLeftEdge = x < left
  const isRightEdge = colRight > right

  return {
    edgeScale: 0.88 + 0.12 * progress,
    edgeOpacity: 0.45 + 0.55 * progress,
    edgeOrigin: isLeftEdge ? '100% 50%' : isRightEdge ? '0% 50%' : '50% 50%',
  }
}

export function useVirtualShipGrid(ships: Ref<MappedShip[]>) {
  const viewportRef = ref<HTMLElement | null>(null)
  const scrollLeft = ref(0)
  const viewportWidth = ref(0)
  const viewportHeight = ref(0)

  let resizeObserver: ResizeObserver | null = null
  let scrollRaf = 0
  let viewportEl: HTMLElement | null = null

  const rowCount = computed(() => {
    const height = viewportHeight.value
    if (height <= 0) return 1
    return Math.max(
      1,
      Math.floor((height + SHIP_GRID_GAP) / (SHIP_GRID_CELL_MIN_HEIGHT + SHIP_GRID_GAP)),
    )
  })

  const cellHeight = computed(() => {
    const rows = rowCount.value
    const available = viewportHeight.value - 1 - SHIP_GRID_GAP * (rows - 1)
    return Math.max(1, Math.floor(available / rows))
  })

  const columnCount = computed(() => {
    const total = ships.value.length
    if (total === 0) return 0
    return Math.ceil(total / rowCount.value)
  })

  const totalWidth = computed(() => {
    const cols = columnCount.value
    if (cols === 0) return 0
    return cols * SHIP_GRID_CELL_WIDTH + (cols - 1) * SHIP_GRID_GAP
  })

  const visibleColRange = computed(() => {
    const stride = SHIP_GRID_CELL_WIDTH + SHIP_GRID_GAP
    const start = Math.max(0, Math.floor(scrollLeft.value / stride) - OVERSCAN_COLS)
    const visible = Math.ceil(viewportWidth.value / stride) + 1
    const end = Math.min(columnCount.value, start + visible + OVERSCAN_COLS)
    return { start, end }
  })

  const visibleItems = computed<VirtualShipItem[]>(() => {
    const { start, end } = visibleColRange.value
    const rows = rowCount.value
    const height = cellHeight.value
    const list = ships.value
    const left = scrollLeft.value
    const width = viewportWidth.value
    const items: VirtualShipItem[] = []

    for (let col = start; col < end; col++) {
      for (let row = 0; row < rows; row++) {
        const index = col * rows + row
        const ship = list[index]
        if (!ship) break

        const x = col * (SHIP_GRID_CELL_WIDTH + SHIP_GRID_GAP)

        items.push({
          ship,
          index,
          col,
          x,
          y: row * (height + SHIP_GRID_GAP),
          ...getEdgeFx(x, left, width),
        })
      }
    }

    return items
  })

  const onScroll = () => {
    if (scrollRaf) return

    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0
      const viewport = viewportRef.value
      if (!viewport) return
      scrollLeft.value = viewport.scrollLeft
    })
  }

  const measureViewport = () => {
    const viewport = viewportRef.value
    if (!viewport) return
    viewportWidth.value = viewport.clientWidth
    viewportHeight.value = viewport.clientHeight
  }

  const resetScroll = () => {
    if (viewportRef.value) {
      viewportRef.value.scrollLeft = 0
      scrollLeft.value = 0
    }
  }

  const onWheel = (event: WheelEvent) => {
    const viewport = viewportRef.value
    if (!viewport) return

    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return

    const delta = event.deltaY
    if (delta === 0) return

    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth
    if (maxScrollLeft <= 0) return

    const atStart = viewport.scrollLeft <= 0
    const atEnd = viewport.scrollLeft >= maxScrollLeft - 1

    if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return

    event.preventDefault()
    event.stopPropagation()
    viewport.scrollLeft += delta
  }

  onMounted(() => {
    measureViewport()

    viewportEl = viewportRef.value
    if (!viewportEl) return

    resizeObserver = new ResizeObserver(measureViewport)
    resizeObserver.observe(viewportEl)

    viewportEl.addEventListener('wheel', onWheel, { passive: false })
  })

  onUnmounted(() => {
    viewportEl?.removeEventListener('wheel', onWheel)
    viewportEl = null
    resizeObserver?.disconnect()
    resizeObserver = null
    if (scrollRaf) cancelAnimationFrame(scrollRaf)
  })

  watch(ships, resetScroll)

  return {
    viewportRef,
    cellHeight,
    totalWidth,
    visibleItems,
    onScroll,
    cellWidth: SHIP_GRID_CELL_WIDTH,
  }
}
