<script setup lang="ts">
import type { MappedShip } from '@/types/HeroShip'
import { useT } from '@/composables/useT'
import { uiStrings } from '@/locales/ui'

defineProps<{
  ship: MappedShip
  x: number
  y: number
}>()

const { t } = useT()
</script>

<template>
  <div class="ship-hover-card" :style="{ transform: `translate3d(${x}px, ${y}px, 0)` }">
    <header class="ship-hover-card-header">
      <img v-if="ship.nationImage" class="ship-hover-card-nation" :src="ship.nationImage" alt="" />
      <div class="ship-hover-card-titles">
        <h4>{{ ship.name }}</h4>
        <p class="ship-hover-card-meta">
          <img v-if="ship.typeImage" :src="ship.typeImage" alt="" />
          <span
            >{{ t(uiStrings.tier) }} {{ ship.level }} - {{ ship.type }} - {{ ship.nation }}</span
          >
        </p>
      </div>
    </header>
    <p class="ship-hover-card-description">{{ ship.description }}</p>
  </div>
</template>

<style scoped>
.ship-hover-card {
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  max-width: calc(100vw - 16px);
  box-sizing: border-box;

  color: var(--color-white);

  padding: var(--space-md);
  backdrop-filter: blur(25px);
  border: 1px solid var(--color-border-white);

  pointer-events: none;

  z-index: 1000;
}

@media (max-width: 767px) {
  .ship-hover-card {
    padding: var(--space-sm);
  }

  .ship-hover-card-description {
    -webkit-line-clamp: 4;
    line-clamp: 4;
  }
}

.ship-hover-card-header {
  display: flex;
  gap: var(--space-sm);
  align-items: flex-start;

  margin-bottom: var(--space-sm);
}

.ship-hover-card-nation {
  flex-shrink: 0;

  width: 28px;
  height: 28px;

  object-fit: contain;
}

.ship-hover-card-titles h4 {
  font-size: var(--font-size-md);
  text-transform: uppercase;
  font-weight: 900;
  line-height: 1.2;

  margin: 0;
}

.ship-hover-card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-xs);

  color: var(--color-gray);
  font-size: var(--font-size-xs);
  text-transform: uppercase;

  margin: var(--space-xs) 0 0;
}

.ship-hover-card-meta img {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.ship-hover-card-description {
  color: var(--color-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.45;

  display: -webkit-box;
  -webkit-line-clamp: 6;
  line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;

  margin: 0;
}
</style>
