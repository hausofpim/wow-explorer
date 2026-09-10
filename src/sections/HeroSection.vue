<script setup lang="ts">
import HeroShipItem from '@/components/HeroShipItem.vue'
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue'
import { useGlobalStore } from '@/stores/useGlobalStore'
import { useLangStore } from '@/stores/useLangStore'
import type { MappedShip } from '@/types/HeroShip'
import { mapRawShips } from '@/utils/mapRawShip'
import gsap from 'gsap'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, ref } from 'vue'

const activeIndex = ref(0)
const slideEl = ref<HTMLElement | null>(null)
const isAnimating = ref(false)

const globalStore = useGlobalStore()
const langStore = useLangStore()
const { ships, mediaPath, nations, vehicleTypes } = storeToRefs(globalStore)
const { currentLang } = storeToRefs(langStore)

const heroShips = computed<MappedShip[]>(() =>
  mapRawShips(ships.value.slice(0, 5), {
    mediaPath: mediaPath.value,
    lang: currentLang.value,
    nations: nations.value,
    vehicleTypes: vehicleTypes.value,
  }),
)

const currentShip = computed(() => heroShips.value[activeIndex.value])

const wrap = (index: number) => {
  const n = heroShips.value.length
  return ((index % n) + n) % n
}

const preloadNeighbors = () => {
  const prev = heroShips.value[wrap(activeIndex.value - 1)]
  const next = heroShips.value[wrap(activeIndex.value + 1)]

  for (const ship of [prev, next]) {
    if (!ship) continue
    const img = new Image()
    img.src = ship.image
  }
}

const animateOut = (direction: 1 | -1) => {
  const root = slideEl.value
  if (!root) return Promise.resolve()

  const image = root.querySelector('.ship-image')
  const info = root.querySelector('.ship-info')
  const type = root.querySelector('.ship-type')

  return gsap
    .timeline()
    .to(
      image,
      { opacity: 0, scale: 1.08, x: -40 * direction, duration: 0.35, ease: 'power2.in' },
      0,
    )
    .to(info, { opacity: 0, y: 16, duration: 0.3, ease: 'power2.in' }, 0)
    .to(type, { opacity: 0, y: 16, duration: 0.3, ease: 'power2.in' }, 0.05)
    .then()
}

const animateIn = (direction: 1 | -1) => {
  const root = slideEl.value
  if (!root) return Promise.resolve()

  const image = root.querySelector('.ship-image')
  const info = root.querySelector('.ship-info')
  const type = root.querySelector('.ship-type')

  return gsap
    .timeline()
    .fromTo(
      image,
      { opacity: 0, scale: 0.92, x: 48 * direction },
      { opacity: 1, scale: 1, x: 0, duration: 0.45, ease: 'power2.out' },
      0,
    )
    .fromTo(
      info,
      { opacity: 0, y: 16 },
      { opacity: 1, x: 0, y: 0, duration: 0.4, ease: 'power2.out' },
      0.05,
    )
    .fromTo(
      type,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      0.1,
    )
    .then()
}

const goTo = async (index: number, direction: 1 | -1 = 1) => {
  const nextIndex = wrap(index)
  if (isAnimating.value || nextIndex === activeIndex.value) return

  isAnimating.value = true
  await animateOut(direction)
  activeIndex.value = nextIndex
  await nextTick()
  preloadNeighbors()
  await animateIn(direction)
  isAnimating.value = false
}

const goNext = () => goTo(activeIndex.value + 1, 1)
const goPrev = () => goTo(activeIndex.value - 1, -1)

onMounted(() => {
  nextTick(preloadNeighbors)
})
</script>

<template>
  <div class="hero-section">
    <div class="vignette" />

    <div v-if="currentShip" class="hero-slider">
      <div ref="slideEl" class="slide">
        <HeroShipItem :ship="currentShip" />
      </div>

      <button
        class="nav-button nav-button-prev"
        type="button"
        aria-label="Previous"
        @click="goPrev"
      >
        <ChevronLeftIcon />
      </button>
      <button class="nav-button nav-button-next" type="button" aria-label="Next" @click="goNext">
        <ChevronRightIcon />
      </button>

      <div class="dots">
        <button
          v-for="(ship, index) in heroShips"
          :key="ship.id"
          type="button"
          class="dot"
          :class="{ 'dot-active': index === activeIndex }"
          @click="goTo(index, index > activeIndex ? 1 : -1)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  position: relative;
  height: 100vh;
  width: 100%;

  overflow: hidden;

  background-image: url('/images/hero_bg.webp');
  background-size: cover;
  background-position: center;
}

.vignette {
  position: absolute;
  inset: 0;

  background: radial-gradient(circle, rgba(32, 32, 32, 0) 50%, rgb(0, 7, 46) 100%);
  opacity: 0.5;

  pointer-events: none;

  z-index: 4;
}

.hero-slider {
  position: relative;
  height: 100%;
  width: 100%;

  z-index: 2;
}

.slide {
  height: 100%;
  width: 100%;
}

.nav-button {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  display: grid;
  place-items: center;
  width: clamp(2.5rem, 2rem + 1.5vw, 3rem);
  height: clamp(2.5rem, 2rem + 1.5vw, 3rem);
  padding: 0;

  border: 1px solid var(--color-border-white);
  border-radius: var(--radius-full);
  background: rgba(20, 28, 36, 0.45);
  backdrop-filter: blur(25px);
  color: var(--color-white);

  cursor: pointer;

  z-index: 5;
}

.nav-button svg {
  display: block;
  width: 1.15rem;
  height: 1.15rem;
}

.nav-button-prev {
  left: var(--space-lg);
}

.nav-button-next {
  right: var(--space-2xl);
}

.dots {
  position: absolute;
  left: 50%;
  bottom: clamp(3.5rem, 8vh, 5.5rem);
  translate: -50% 0;

  display: flex;
  gap: 0.625rem;

  z-index: 5;
}

.dot {
  width: 0.625rem;
  height: 0.625rem;

  border: none;
  border-radius: var(--radius-full);
  background: rgba(180, 188, 196, 0.7);

  padding: 0;

  cursor: pointer;
}

.dot-active {
  background: var(--color-white);
  transform: scale(1.2);
}

@media (max-width: 767px) {
  .nav-button-prev {
    left: var(--space-sm);
  }

  .nav-button-next {
    right: var(--space-sm);
  }

  .dots {
    bottom: clamp(4rem, 10vh, 6rem);
  }
}
</style>
