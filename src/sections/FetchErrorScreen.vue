<script setup lang="ts">
import BaseSelect from '@/components/BaseSelect.vue'
import { useT } from '@/composables/useT'
import { languages } from '@/consts'
import { uiStrings } from '@/locales/ui'
import { useGlobalStore } from '@/stores/useGlobalStore'
import { useLangStore } from '@/stores/useLangStore'
import type { BaseSelectOption } from '@/types/BaseSelectOption'
import { storeToRefs } from 'pinia'

const globalStore = useGlobalStore()
const langStore = useLangStore()
const { t } = useT()

const { fetchError } = storeToRefs(globalStore)
const { currentLang } = storeToRefs(langStore)

const languagesOptions: BaseSelectOption<string>[] = languages.map((language) => ({
  value: language.value,
  label: language.label,
}))

const onRetry = () => {
  void globalStore.fetchAll()
}
</script>

<template>
  <div class="error-screen">
    <div class="error-screen-lang">
      <BaseSelect v-model="currentLang" :options="languagesOptions" />
    </div>

    <div class="error-screen-content">
      <img class="error-screen-logo" src="/images/logo.webp" alt="logo" />

      <p class="error-screen-eyebrow">{{ t(uiStrings.fetchErrorEyebrow) }}</p>
      <h1 class="error-screen-title">{{ t(uiStrings.fetchError) }}</h1>
      <p class="error-screen-text">{{ t(uiStrings.fetchErrorHint) }}</p>

      <p v-if="fetchError" class="error-screen-detail">{{ fetchError }}</p>

      <button type="button" class="error-screen-retry" @click="onRetry">
        {{ t(uiStrings.retry) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-screen {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 100dvh;

  display: grid;
  place-items: center;

  overflow: hidden;
  box-sizing: border-box;
  padding: var(--space-xl);

  background-image:
    linear-gradient(20deg, rgb(50, 50, 87) 0%, rgb(91, 117, 132) 55%, rgb(231, 242, 247) 100%),
    url('/images/waves.webp');
  background-blend-mode: hard-light;
  background-size: initial;
}

.error-screen-lang {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  width: 160px;
  z-index: 2;
}

.error-screen-content {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);

  width: min(100%, 28rem);
  text-align: center;
}

.error-screen-logo {
  width: min(42vw, 11rem);
  height: auto;
  margin-bottom: var(--space-sm);
  object-fit: contain;
  filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.35));
}

.error-screen-eyebrow {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.error-screen-title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 800;
  line-height: 1.15;
  text-transform: uppercase;
  color: var(--color-white);
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.35);
}

.error-screen-text {
  margin: 0;
  max-width: 24rem;
  font-size: var(--font-size-md);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.88);
}

.error-screen-detail {
  margin: var(--space-xs) 0 0;
  max-width: 100%;
  padding: var(--space-sm) var(--space-md);

  font-size: var(--font-size-xs);
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.65);
  word-break: break-word;

  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(20, 28, 36, 0.35);
  backdrop-filter: blur(12px);
}

.error-screen-retry {
  margin-top: var(--space-lg);
  padding: 0.85rem 1.75rem;

  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: #1a1205;
  font-size: var(--font-size-sm);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: var(--primary-box-shadow);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.error-screen-retry:hover {
  background: transparent;
  color: var(--color-white);
  transform: translateY(-1px);
}

.error-screen-retry:active {
  transform: translateY(0);
}

@media (max-width: 767px) {
  .error-screen {
    padding: var(--space-lg);
    align-content: center;
  }

  .error-screen-lang {
    top: var(--space-md);
    right: var(--space-md);
    width: 140px;
  }

  .error-screen-retry {
    width: 100%;
  }
}
</style>
