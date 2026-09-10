<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGlobalStore } from './stores/useGlobalStore'
import LoadingScreen from '@/sections/LoadingScreen.vue'
import FetchErrorScreen from '@/sections/FetchErrorScreen.vue'
import NavBar from '@/components/NavBar.vue'
import gsap from 'gsap'
import { defineAsyncComponent } from 'vue'
import '@/assets/styles/main.css'

const HomePage = defineAsyncComponent(() => import('@/pages/HomePage.vue'))

const globalStore = useGlobalStore()
const { isFetching, fetchError } = storeToRefs(globalStore)

const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 0,
    duration: 0.8,
    delay: 1.0,
    ease: 'power2.out',
    onComplete: done,
  })
}
</script>

<template>
  <Transition :css="false" @leave="onLeave">
    <div v-if="isFetching" class="loading-wrapper">
      <LoadingScreen />
    </div>
  </Transition>

  <FetchErrorScreen v-if="!isFetching && fetchError" />

  <div v-if="!isFetching && !fetchError" class="app-wrapper">
    <NavBar />
    <HomePage />
  </div>
</template>

<style scoped>
.app-wrapper {
  position: relative;
  z-index: 1;
}

.loading-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
}
</style>
