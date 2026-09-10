<script setup lang="ts">
import BaseSelect from '@/components/BaseSelect.vue'
import { useSectionsNav } from '@/composables/useSectionsNav'
import { languages } from '@/consts'
import type { BaseSelectOption } from '@/types/BaseSelectOption'
import { useLangStore } from '@/stores/useLangStore'
import { storeToRefs } from 'pinia'

const langStore = useLangStore()
const { currentLang } = storeToRefs(langStore)
const { isOpen, toggle } = useSectionsNav()

const languagesOptions: BaseSelectOption<string>[] = languages.map((language) => ({
  value: language.value,
  label: language.label,
}))
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <img src="/images/logo_small.svg" alt="logo" />
      </div>

      <div class="navbar-actions">
        <div class="language-selector">
          <BaseSelect v-model="currentLang" :options="languagesOptions" />
        </div>

        <button type="button" class="burger" :class="{ 'is-open': isOpen }" @click="toggle">
          <span />
          <span />
          <span />
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-height: var(--navbar-height);

  background: #202020;
  background: radial-gradient(circle, rgba(32, 32, 32, 0.3) 0%, rgba(37, 37, 37, 0.47) 100%);
  backdrop-filter: blur(25px);
  border-bottom: 1px solid var(--color-border-white);

  z-index: 1200;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-2xl);
}

.navbar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-logo img {
  width: 1.625rem;
  height: 2rem;
  object-fit: contain;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.language-selector {
  width: 160px;
}

.burger {
  display: none;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--color-border-white);
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  position: relative;
}

.burger span {
  position: absolute;
  left: 10px;
  right: 10px;
  height: 2px;
  background: var(--color-white);
}

.burger span:nth-child(1) {
  top: 12px;
}
.burger span:nth-child(2) {
  top: 19px;
}
.burger span:nth-child(3) {
  top: 26px;
}

.burger.is-open span:nth-child(1) {
  top: 19px;
  transform: rotate(45deg);
}
.burger.is-open span:nth-child(2) {
  opacity: 0;
}
.burger.is-open span:nth-child(3) {
  top: 19px;
  transform: rotate(-45deg);
}

@media (max-width: 767px) {
  .navbar-container {
    padding: var(--space-md) var(--space-lg);
  }

  .burger {
    display: block;
  }
}
</style>
