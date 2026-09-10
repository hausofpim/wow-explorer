<script setup lang="ts">
import { useSectionsNav } from '@/composables/useSectionsNav'
import { useT } from '@/composables/useT'
import type { LocaleMessage } from '@/utils/getLocalizedString'

defineProps<{
  items: LocaleMessage[]
}>()

const { isOpen, activeIndex, open, close, goToSection } = useSectionsNav()
const { t } = useT()

const onHotzoneEnter = () => {
  if (window.matchMedia('(max-width: 767px)').matches) return
  open()
}

const onMenuLeave = () => {
  if (window.matchMedia('(max-width: 767px)').matches) return
  close()
}
</script>

<template>
  <div class="side-menu" :class="{ 'is-open': isOpen }" @mouseleave="onMenuLeave">
    <div class="side-menu-hotzone" @mouseenter="onHotzoneEnter" />

    <button v-if="isOpen" type="button" class="side-menu-backdrop" @click="close" />

    <div class="side-menu-panel">
      <nav class="side-menu-nav">
        <button
          v-for="(item, index) in items"
          :key="index"
          type="button"
          class="side-menu-link"
          :class="{ 'is-active': activeIndex === index }"
          @click.stop="goToSection(index)"
        >
          <span class="side-menu-link-label">{{ t(item) }}</span>
          <span class="side-menu-link-dot" :class="{ 'is-active': activeIndex === index }" />
        </button>
      </nav>
    </div>

    <div class="side-menu-dots">
      <span
        v-for="(_, index) in items"
        :key="index"
        class="side-menu-dot"
        :class="{ 'is-active': activeIndex === index }"
      />
    </div>
  </div>
</template>

<style scoped>
.side-menu {
  position: fixed;
  inset: 0 0 0 auto;

  pointer-events: none;

  z-index: 1100;
}

.side-menu-hotzone {
  position: absolute;
  top: 0;
  right: 0;
  width: 42px;
  height: 100%;

  pointer-events: auto;

  z-index: 1;
}

.side-menu-backdrop {
  display: none;
}

.side-menu-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 320px;
  height: 100%;

  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(25px);
  transform: translateX(100%);
  transition: transform 0.2s ease;

  pointer-events: none;

  z-index: 3;
}

.side-menu.is-open .side-menu-panel {
  transform: translateX(0);
  pointer-events: auto;
}

.side-menu-nav {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 28px;

  height: 100%;
  padding: 0 36px 0 24px;
  box-sizing: border-box;
}

.side-menu-link {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;

  padding: 0;
  border: 0;
  background: none;
  opacity: 0.45;

  font-size: var(--font-size-md);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: right;
  color: var(--color-white);

  cursor: pointer;
  transition:
    opacity 0.2s ease,
    color 0.2s ease;
}

.side-menu-link:hover,
.side-menu-link.is-active {
  opacity: 1;
  color: var(--color-white);
}

.side-menu-link-dot {
  display: none;
  flex-shrink: 0;

  width: 10px;
  height: 10px;

  border-radius: var(--radius-full);
  background: var(--color-white);
  opacity: 0.35;
}

.side-menu-link-dot.is-active {
  opacity: 1;
}

.side-menu-dots {
  position: absolute;
  top: 50%;
  right: 12px;

  display: flex;
  flex-direction: column;
  gap: 40px;

  transform: translateY(-50%);
  pointer-events: none;
  z-index: 4;
}

.side-menu-dot {
  width: 12px;
  height: 12px;

  border-radius: var(--radius-full);
  background: var(--color-white);
  opacity: 0.35;
  transition: all 0.2s ease;
}

.side-menu-dot.is-active {
  opacity: 1;
  transform: scale(1.15);
}

@media (max-width: 767px) {
  .side-menu-hotzone {
    display: none;
  }

  .side-menu-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    border: 0;
    padding: 0;
    background: rgba(0, 0, 0, 0.35);

    pointer-events: auto;
    cursor: pointer;
    z-index: 2;
  }

  .side-menu-panel {
    width: 300px;
  }

  .side-menu-nav {
    gap: 24px;
    padding: 0 28px;
  }

  .side-menu-dots {
    display: none;
  }

  .side-menu-link-dot {
    display: block;
  }
}
</style>
