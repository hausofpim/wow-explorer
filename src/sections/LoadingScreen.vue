<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/useGlobalStore'
import { useT } from '@/composables/useT'
import { uiStrings } from '@/locales/ui'

const { loadingPercent } = storeToRefs(useGlobalStore())
const { t } = useT()
</script>

<template>
  <div class="container">
    <div class="logo">
      <img src="/images/logo.webp" alt="" />
      <p class="logo-text" aria-live="polite">
        <span class="logo-text-label">{{ t(uiStrings.loading) }}</span>
        <span class="logo-text-percent">{{ loadingPercent }}%</span>
      </p>
    </div>
    <div
      class="fight"
      :class="{ 'is-hit': loadingPercent >= 100 }"
      :style="{ '--progress': loadingPercent / 100 }"
    >
      <img src="/images/leftship.webp" class="leftship" alt="" />
      <img src="/images/rightship.webp" class="rightship" alt="" />

      <div class="shot">
        <div class="missile">
          <img src="/images/rocket.webp" alt="" />
        </div>
      </div>

      <img src="/images/explosion.webp" class="boom" alt="" />
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow: hidden;
  background-image:
    linear-gradient(20deg, rgb(50, 50, 87) 0%, rgb(91, 117, 132) 55%, rgb(231, 242, 247) 100%),
    url('/images/waves.webp');
  background-blend-mode: hard-light;
  background-size: initial;
}

.logo {
  position: absolute;
  top: 5vh;
  width: min(28vw, 18rem);
  max-width: 42vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.logo img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.logo-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);

  margin: 0;
  color: var(--color-white);
  text-align: center;
}

.logo-text-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}

.logo-text-percent {
  font-size: var(--font-size-xl);
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.fight {
  --progress: 0;
  --fly: 0.7s;
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 100%;
  max-width: 800px;
  height: 60vh;
}

.leftship {
  position: absolute;
  left: 0;
  top: 0;
  width: 40%;

  z-index: 1;
}

.rightship {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 40%;

  z-index: 1;
}

.shot {
  position: absolute;
  left: 22%;
  top: 12%;
  width: 56%;
  height: 66%;

  pointer-events: none;

  z-index: 0;
}

.missile {
  position: absolute;
  left: calc(var(--progress) * 100%);
  top: calc(var(--progress) * 100%);
  width: 45%;

  transform: translate(-50%, -50%) rotate(10deg);
  transition:
    left var(--fly) cubic-bezier(0.22, 1, 0.36, 1),
    top var(--fly) cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.15s var(--fly);
}

.fight.is-hit .missile {
  opacity: 0;
}

.missile img {
  display: block;
  width: 100%;
  height: auto;
}

.boom {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 42%;
  opacity: 0;

  transform: scale(0.45);
  transform-origin: center;

  pointer-events: none;

  z-index: 3;
}

.fight.is-hit .boom {
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 0.1s var(--fly) linear,
    transform 0.1s var(--fly) linear;
}
</style>
