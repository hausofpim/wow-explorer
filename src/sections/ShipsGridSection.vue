<script setup lang="ts">
import BaseSelect from '@/components/BaseSelect.vue'
import ShipHoverCard from '@/components/ShipHoverCard.vue'
import TextField from '@/components/TextField.vue'
import { useShipsCatalog } from '@/composables/useShipsCatalog'
import { useVirtualShipGrid } from '@/composables/useVirtualShipGrid'
import { useT } from '@/composables/useT'
import { uiStrings } from '@/locales/ui'
import type { MappedShip } from '@/types/HeroShip'
import { onMounted, onUnmounted, ref, type ComponentPublicInstance } from 'vue'

const HOVER_OFFSET = 16
const CARD_WIDTH = 320
const CARD_HEIGHT_ESTIMATE = 260

const { t } = useT()
const {
  filters,
  filteredShips,
  isLoading,
  nationOptions,
  typeOptions,
  levelOptions,
  resetFilters,
  hasActiveFiltersState,
} = useShipsCatalog()

const { viewportRef, cellHeight, totalWidth, visibleItems, onScroll, cellWidth } =
  useVirtualShipGrid(filteredShips)

const bindViewport = (el: Element | ComponentPublicInstance | null) => {
  viewportRef.value = el instanceof HTMLElement ? el : null
}

const hoveredShip = ref<MappedShip | null>(null)
const pointer = ref({ x: 0, y: 0 })

const isTouchLike = () => window.matchMedia('(hover: none), (pointer: coarse)').matches

const clampPointer = (clientX: number, clientY: number) => {
  const cardWidth = Math.min(CARD_WIDTH, window.innerWidth - 16)
  const maxX = Math.max(8, window.innerWidth - cardWidth - 8)
  const maxY = Math.max(8, window.innerHeight - CARD_HEIGHT_ESTIMATE - 8)

  return {
    x: Math.min(Math.max(clientX + HOVER_OFFSET, 8), maxX),
    y: Math.min(Math.max(clientY + HOVER_OFFSET, 8), maxY),
  }
}

const updatePointer = (event: MouseEvent) => {
  pointer.value = clampPointer(event.clientX, event.clientY)
}

const showHoverCard = (ship: MappedShip, event: MouseEvent) => {
  hoveredShip.value = ship
  updatePointer(event)
}

const hideHoverCard = () => {
  hoveredShip.value = null
}

const onShipHoverEnter = (ship: MappedShip, event: MouseEvent) => {
  if (isTouchLike()) return
  showHoverCard(ship, event)
}

const onShipHoverMove = (event: MouseEvent) => {
  if (isTouchLike() || !hoveredShip.value) return
  updatePointer(event)
}

const onShipHoverLeave = () => {
  if (isTouchLike()) return
  hideHoverCard()
}

const onShipTap = (ship: MappedShip, event: MouseEvent) => {
  if (!isTouchLike()) return

  if (hoveredShip.value?.id === ship.id) {
    hideHoverCard()
    return
  }

  showHoverCard(ship, event)
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!hoveredShip.value || !isTouchLike()) return

  const target = event.target
  if (!(target instanceof Element) || !target.closest('.ship-card')) {
    hideHoverCard()
  }
}

const handleGridScroll = () => {
  hideHoverCard()
  onScroll()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})
</script>

<template>
  <section class="ships-grid-section">
    <div class="ships-grid-header">
      <h2>{{ t(uiStrings.exploreShips) }}</h2>
      <button
        v-if="hasActiveFiltersState"
        type="button"
        class="filters-reset"
        @click="resetFilters"
      >
        {{ t(uiStrings.resetFilters) }}
      </button>
    </div>

    <div class="filters">
      <TextField id="ship-name" v-model="filters.name" :placeholder="t(uiStrings.searchByName)" />
      <BaseSelect
        v-model="filters.nation"
        :options="nationOptions"
        :placeholder="t(uiStrings.allNations)"
      />
      <BaseSelect
        v-model="filters.type"
        :options="typeOptions"
        :placeholder="t(uiStrings.allTypes)"
      />
      <BaseSelect
        v-model="filters.level"
        :options="levelOptions"
        :placeholder="t(uiStrings.allLevels)"
      />
    </div>

    <p v-if="isLoading" class="ships-status">
      {{ t(uiStrings.loadingShips) }}
    </p>
    <p v-else class="ships-status">{{ filteredShips.length }} {{ t(uiStrings.shipsCount) }}</p>

    <div :ref="bindViewport" class="ships-grid" @scroll.passive="handleGridScroll">
      <div class="ships-grid-track" :style="{ width: `${totalWidth}px` }">
        <div
          v-for="item in visibleItems"
          :key="item.ship.id"
          class="ship-card"
          :style="{
            width: `${cellWidth}px`,
            height: `${cellHeight}px`,
            opacity: item.edgeOpacity,
            transformOrigin: item.edgeOrigin,
            transform: `translate(${item.x}px, ${item.y}px) scale(${item.edgeScale})`,
          }"
          :class="{ 'is-active': hoveredShip?.id === item.ship.id }"
          @mouseenter="onShipHoverEnter(item.ship, $event)"
          @mousemove="onShipHoverMove"
          @mouseleave="onShipHoverLeave"
          @click="onShipTap(item.ship, $event)"
        >
          <div class="ship-card-inner">
            <img :src="item.ship.image" :alt="item.ship.name" loading="lazy" decoding="async" />
            <div class="ship-card-info">
              <h3>{{ item.ship.name }}</h3>
              <p>{{ t(uiStrings.tier) }} {{ item.ship.level }}</p>
              <p>{{ item.ship.type }}</p>
              <p>{{ item.ship.nation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <ShipHoverCard v-if="hoveredShip" :ship="hoveredShip" :x="pointer.x" :y="pointer.y" />
    </Teleport>
  </section>
</template>

<style scoped>
.ships-grid-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);

  width: 100%;
  height: 100%;

  padding: var(--space-xl);
  padding-top: calc(var(--navbar-height) + var(--space-xl));
  padding-right: var(--space-xl);

  box-sizing: border-box;
  background-image: url('/images/ships_bg.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.ships-grid-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-md);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.ships-grid-header h2 {
  margin: 0;
}

.filters-reset {
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.filters-reset:hover {
  color: var(--color-white);
}

.filters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 240px));
  gap: var(--space-lg);
  align-items: end;
  flex-shrink: 0;
}

.filters > :deep(*) {
  max-width: none;
}

.ships-status {
  flex-shrink: 0;
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ships-grid {
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.ships-grid-track {
  position: relative;
  height: 100%;
}

.ship-card {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  will-change: transform;
  cursor: pointer;
  border: 1px solid var(--color-border-white);
  background: radial-gradient(
    circle,
    rgba(63, 94, 87, 0.5) 0%,
    rgba(35, 75, 87, 0.5) 50%,
    rgba(50, 51, 46, 0.5) 100%
  );
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.ship-card:hover,
.ship-card.is-active {
  border-color: var(--color-primary);
  box-shadow: var(--primary-box-shadow);
}

.ship-card-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ship-card-inner img {
  width: 90%;
  flex: 1;
  align-self: center;
  min-height: 0;
  object-fit: cover;
}

.ship-card-info {
  display: flex;
  flex-direction: column;
  padding: var(--space-sm);
}

.ship-card-inner h3 {
  font-size: var(--font-size-md);
  color: var(--color-white);
  text-transform: uppercase;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ship-card-inner p {
  color: var(--color-gray);
  font-size: var(--font-size-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 1023px) {
  .ships-grid-section {
    gap: var(--space-lg);
    padding: var(--space-lg);
    padding-top: calc(var(--navbar-height) + var(--space-lg));
    padding-right: var(--space-lg);
  }

  .filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ship-card-info {
    padding: var(--space-xs) var(--space-sm) var(--space-sm);
  }

  .ship-card-inner h3 {
    font-size: var(--font-size-sm);
  }

  .ship-card-inner p {
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 767px) {
  .ships-grid-section {
    gap: var(--space-md);
    padding: var(--space-md);
    padding-top: calc(var(--navbar-height) + var(--space-md));
    padding-right: var(--space-md);
  }

  .ships-grid-header h2 {
    font-size: var(--font-size-lg);
  }

  .filters {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }

  .ship-card-inner {
    gap: var(--space-xs);
  }

  .ship-card-inner img {
    width: 100%;
  }

  .ship-card-info {
    padding: var(--space-xs);
  }

  .ship-card-inner p:nth-child(n + 3) {
    display: none;
  }
}
</style>
