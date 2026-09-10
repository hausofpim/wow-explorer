<script setup lang="ts">
import SectionsSideMenu from '@/components/SectionsSideMenu.vue'
import SequentialSections, { type SectionLoader } from '@/components/SequentialSections.vue'
import { uiStrings } from '@/locales/ui'

const sectionLoaders: SectionLoader[] = [
  () => import('@/sections/HeroSection.vue'),
  () => import('@/sections/ShipsGridSection.vue'),
  () => import('@/sections/NationsSection.vue'),
]

const sectionTitles = [uiStrings.sectionMain, uiStrings.sectionShips, uiStrings.sectionNations]
</script>

<template>
  <SequentialSections :sections="sectionLoaders" />
  <SectionsSideMenu :items="sectionTitles" />
</template>
