<script setup lang="ts" generic="T extends string | number">
import type { BaseSelectOption } from '@/types/BaseSelectOption'
import { useT } from '@/composables/useT'
import { uiStrings } from '@/locales/ui'
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  options: BaseSelectOption<T>[]
  placeholder?: string
}>()

const modelValue = defineModel<T>()
const { t } = useT()

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(-1)

const currentLabel = () => {
  const selected = props.options.find((opt) => opt.value === modelValue.value)
  return selected ? selected.label : props.placeholder || t(uiStrings.select)
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    const currentIndex = props.options.findIndex((opt) => opt.value === modelValue.value)
    focusedIndex.value = currentIndex >= 0 ? currentIndex : 0
  }
}

const closeDropdown = () => {
  isOpen.value = false
  focusedIndex.value = -1
}

const selectOption = (option: BaseSelectOption<T>) => {
  modelValue.value = option.value
  closeDropdown()
  selectRef.value?.querySelector('button')?.focus()
}

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  const maxIndex = props.options.length - 1

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        isOpen.value = true
        focusedIndex.value = 0
      } else {
        focusedIndex.value = focusedIndex.value < maxIndex ? focusedIndex.value + 1 : 0
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (!isOpen.value) {
        isOpen.value = true
        focusedIndex.value = maxIndex
      } else {
        focusedIndex.value = focusedIndex.value > 0 ? focusedIndex.value - 1 : maxIndex
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (isOpen.value && focusedIndex.value >= 0) {
        selectOption(props.options[focusedIndex.value]!)
      } else {
        toggleDropdown()
      }
      break
    case 'Escape':
    case 'Tab':
      closeDropdown()
      break
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div ref="selectRef" class="custom-select-container" @keydown="handleKeyDown">
    <button
      type="button"
      class="select-trigger"
      :class="{ 'is-open': isOpen }"
      @click="toggleDropdown"
    >
      <span class="trigger-text">{{ currentLabel() }}</span>
      <span class="trigger-arrow">▼</span>
    </button>

    <Transition name="slide-fade">
      <ul v-if="isOpen" class="select-options-list">
        <li
          v-for="(option, index) in options"
          :key="String(option.value)"
          :id="`opt-${index}`"
          class="select-option"
          :class="{
            'is-selected': option.value === modelValue,
            'is-focused': index === focusedIndex,
          }"
          @click="selectOption(option)"
          @mouseenter="focusedIndex = index"
        >
          {{ option.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.custom-select-container {
  position: relative;
  width: 100%;
  max-width: 240px;

  font-family: sans-serif;
  color: var(--color-secondary);
}

.select-trigger {
  width: 100%;
  padding: 10px 14px;
  background: linear-gradient(180deg, #16222f 0%, #1b2a2e 100%);
  border: 1px solid var(--color-border-white);
  text-align: left;
  cursor: pointer;

  display: flex;
  justify-content: space-between;
  align-items: center;

  text-transform: uppercase;
  font-weight: bold;
  font-size: var(--font-size-xs);
  color: var(--color-white);
  color: var(--color-white);

  transition: all 0.2s ease;
}

.select-trigger:focus-visible,
.select-trigger.is-open {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--primary-box-shadow);
}

.trigger-arrow {
  font-size: 10px;
  color: var(--color-primary);
}

.select-trigger.is-open .trigger-arrow {
  transform: rotate(180deg);
}

.select-options-list {
  position: absolute;
  top: 102%;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;

  background-color: #0d1620;
  border: 1px solid #2a3f54;
  z-index: 100;
}

.select-option {
  display: flex;
  align-items: center;

  padding: 10px 14px;

  cursor: pointer;
  font-size: var(--font-size-xs);
  text-transform: uppercase;
}

.select-option.is-focused {
  background-color: #1a2a3a;
  border-left-color: var(--color-primary);

  color: var(--color-white);
}

.select-option.is-selected {
  font-weight: bold;
  color: var(--color-primary);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.15s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-4px);
  opacity: 0;
}
</style>
