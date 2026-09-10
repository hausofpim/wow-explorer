<script setup lang="ts">
import { useGlobalStore } from '@/stores/useGlobalStore'
import { useLangStore } from '@/stores/useLangStore'
import { useT } from '@/composables/useT'
import { uiStrings } from '@/locales/ui'
import { buildNationsShowcase, type NationShowcase } from '@/utils/buildNationsShowcase'
import { storeToRefs } from 'pinia'
import { computed, shallowRef, watch } from 'vue'

const { ships, nations, vehicleTypes, mediaPath } = storeToRefs(useGlobalStore())
const { currentLang } = storeToRefs(useLangStore())
const { t } = useT()

const showcase = computed(() =>
  buildNationsShowcase(ships.value, nations.value, {
    mediaPath: mediaPath.value,
    lang: currentLang.value,
    nations: nations.value,
    vehicleTypes: vehicleTypes.value,
  }),
)

const activeId = shallowRef(showcase.value[0]?.id ?? '')

watch(showcase, (list) => {
  if (!list.some((item) => item.id === activeId.value)) {
    activeId.value = list[0]?.id ?? ''
  }
})

const activeNation = computed<NationShowcase | undefined>(() =>
  showcase.value.find((item) => item.id === activeId.value),
)

const setActive = (id: string) => {
  activeId.value = id
}
</script>

<template>
  <div class="nations-section">
    <div
      v-if="activeNation"
      class="nations-section-bg"
      :style="{ backgroundImage: `url(${activeNation.flagBg})` }"
    />

    <div class="nations-section-inner">
      <aside class="nations-rail">
        <div class="nations-rail-line" />
        <button
          v-for="nation in showcase"
          :key="nation.id"
          type="button"
          class="nations-rail-item"
          :class="{ 'is-active': nation.id === activeId }"
          :title="nation.name"
          @mouseenter="setActive(nation.id)"
          @focus="setActive(nation.id)"
          @click="setActive(nation.id)"
        >
          <img :src="nation.flag" :alt="nation.name" loading="lazy" decoding="async" />
        </button>
      </aside>

      <div class="nations-content">
        <header v-if="activeNation" class="nations-content-header">
          <p class="nations-content-eyebrow">{{ t(uiStrings.nation) }}</p>
          <h2>{{ activeNation.name }}</h2>
        </header>

        <Transition name="nation-fade" mode="out-in">
          <ul v-if="activeNation" :key="`${activeNation.id}-${currentLang}`" class="nations-ships">
            <li v-for="ship in activeNation.ships" :key="ship.id" class="nations-ship">
              <img :src="ship.image" :alt="ship.name" loading="lazy" decoding="async" />
              <div class="nations-ship-info">
                <h3>{{ ship.name }}</h3>
                <p>{{ t(uiStrings.tier) }} {{ ship.level }} - {{ ship.type }}</p>
                <p class="nations-ship-desc">{{ ship.description }}</p>
              </div>
            </li>
          </ul>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nations-section {
  position: relative;
  width: 100%;
  height: 100%;

  overflow: hidden;
  background: var(--color-bg);
}

.nations-section-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: min(58vw, 720px);
  height: 100%;

  background-size: cover;
  background-position: center;
  filter: blur(25px) brightness(0.35) saturate(1.1);
  transform: scale(1.12);
  transform-origin: center;
  mask-image: linear-gradient(90deg, transparent 0%, #000 42%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 42%);

  pointer-events: none;

  transition: background-image 0.2s ease;
}

.nations-section-inner {
  position: relative;

  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2xl);

  height: 100%;
  padding: calc(var(--navbar-height) + var(--space-xl)) var(--space-xl) var(--space-xl);
  box-sizing: border-box;

  z-index: 1;
}

.nations-rail {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);

  padding: var(--space-sm) 0;
}

.nations-rail-line {
  position: absolute;
  top: 8%;
  bottom: 8%;
  left: 50%;
  width: 1px;

  background: linear-gradient(
    180deg,
    transparent,
    var(--color-border-white) 20%,
    var(--color-border-white) 80%,
    transparent
  );
  transform: translateX(-50%);
}

.nations-rail-item {
  position: relative;
  width: 52px;
  height: 52px;
  padding: 0;

  border: 1px solid transparent;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;

  z-index: 1;
}

.nations-rail-item img {
  width: 100%;
  height: 100%;

  object-fit: contain;
  padding: 8px;
  box-sizing: border-box;
}

.nations-rail-item:hover,
.nations-rail-item:focus-visible,
.nations-rail-item.is-active {
  transform: scale(1.18);
  border-color: var(--color-primary);
  box-shadow: var(--primary-box-shadow);
  outline: none;
}

.nations-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);

  min-width: 0;

  overflow: hidden;
}

.nations-content-eyebrow {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.nations-content-header h2 {
  font-weight: 900;

  margin-top: var(--space-xs);
  text-transform: uppercase;
}

.nations-ships {
  flex: 1;

  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1.15fr 0.85fr;
  gap: var(--space-md);

  list-style: none;

  overflow: hidden;
  min-height: 0;
}

.nations-ship {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);

  min-width: 0;
  min-height: 0;
  overflow: hidden;
  animation: ship-in 0.35s ease both;
}

.nations-ship:nth-child(1),
.nations-ship:nth-child(2) {
  grid-column: span 3;
}

.nations-ship:nth-child(3),
.nations-ship:nth-child(4),
.nations-ship:nth-child(5) {
  grid-column: span 2;
}

.nations-ship:nth-child(2) {
  animation-delay: 0.04s;
}
.nations-ship:nth-child(3) {
  animation-delay: 0.08s;
}
.nations-ship:nth-child(4) {
  animation-delay: 0.12s;
}
.nations-ship:nth-child(5) {
  animation-delay: 0.16s;
}

.nations-ship img {
  flex: 1;

  width: 100%;
  min-height: 0;

  box-sizing: border-box;
  object-fit: cover;
  background: #0d1620;
  border: 1px solid var(--color-border-white);
}

.nations-ship-info {
  flex-shrink: 0;
}

.nations-ship-info h3 {
  font-size: var(--font-size-md);
  text-transform: uppercase;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nations-ship:nth-child(n + 3) .nations-ship-info h3 {
  font-size: var(--font-size-sm);
}

.nations-ship-info p {
  color: var(--color-gray);
  font-size: var(--font-size-sm);
}

.nations-ship-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.nations-ship:nth-child(n + 3) .nations-ship-desc {
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

.nation-fade-enter-active,
.nation-fade-leave-active {
  transition: all 0.2s ease;
}

.nation-fade-enter-from,
.nation-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@keyframes ship-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1023px) {
  .nations-section-bg {
    width: 100%;
    height: 42%;

    mask-image: linear-gradient(180deg, #000 35%, transparent 100%);
    -webkit-mask-image: linear-gradient(180deg, #000 35%, transparent 100%);
  }

  .nations-section-inner {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    gap: var(--space-lg);
  }

  .nations-rail {
    flex-direction: row;
    justify-content: flex-start;
    gap: var(--space-sm);

    overflow-x: auto;

    padding: var(--space-sm) var(--space-xs);
  }

  .nations-rail-line {
    top: 50%;
    bottom: auto;
    left: 4%;
    right: 4%;
    width: auto;
    height: 1px;

    transform: translateY(-50%);
    background: linear-gradient(
      90deg,
      transparent,
      var(--color-border-white) 20%,
      var(--color-border-white) 80%,
      transparent
    );
  }

  .nations-rail-item {
    flex-shrink: 0;

    width: 44px;
    height: 44px;
  }
}

@media (max-width: 767px) {
  .nations-section-inner {
    padding: calc(var(--navbar-height) + var(--space-md)) var(--space-md) var(--space-md);
  }

  .nations-ships {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    align-content: start;

    overflow: auto;
  }

  .nations-ship:nth-child(1),
  .nations-ship:nth-child(2),
  .nations-ship:nth-child(3),
  .nations-ship:nth-child(4),
  .nations-ship:nth-child(5) {
    grid-column: auto;
  }

  .nations-ship {
    display: grid;
    grid-template-columns: 112px 1fr;
    align-items: start;

    overflow: visible;
  }

  .nations-ship img {
    flex: none;
    aspect-ratio: 1 / 1;
  }

  .nations-ship:nth-child(n + 3) .nations-ship-info h3 {
    font-size: var(--font-size-md);
  }

  .nations-ship-desc,
  .nations-ship:nth-child(n + 3) .nations-ship-desc {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
}
</style>
