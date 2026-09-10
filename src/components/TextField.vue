<script setup lang="ts">
const modelValue = defineModel<string>({ default: '' })

defineProps<{
  placeholder?: string
  id?: string
}>()
</script>

<template>
  <div class="text-field">
    <input
      :id="id"
      v-model="modelValue"
      type="text"
      class="text-field-input"
      :placeholder="placeholder"
      autocomplete="off"
    />
  </div>
</template>

<style scoped>
.text-field {
  position: relative;
  width: 100%;
  max-width: 240px;

  font-family: sans-serif;
  color: var(--color-secondary);
}

.text-field-input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;

  text-transform: uppercase;
  font-weight: bold;
  font-size: var(--font-size-xs);

  background: linear-gradient(180deg, #16222f 0%, #1b2a2e 100%);
  border: 1px solid var(--color-border-white);
  color: var(--color-white);

  transition: all 0.2s ease;
  outline: none;
}

.text-field-input::placeholder {
  color: #6b7280;
  font-weight: normal;
  text-transform: none;
}

.text-field-input:focus-visible {
  border-color: var(--color-primary);
  box-shadow: var(--primary-box-shadow);
}
</style>
