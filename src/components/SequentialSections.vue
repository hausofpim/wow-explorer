<script setup lang="ts">
import {
  defineAsyncComponent,
  nextTick,
  onMounted,
  onUnmounted,
  shallowRef,
  type Component,
} from 'vue'
import { useSectionsNav } from '@/composables/useSectionsNav'

export type SectionLoader = () => Promise<{ default: Component }>

const props = defineProps<{
  sections: SectionLoader[]
}>()

const { setActiveIndex } = useSectionsNav()

const activated = shallowRef(props.sections.map((_, index) => index === 0))
const asyncComponents = shallowRef<(Component | null)[]>(
  props.sections.map((loader, index) => (index === 0 ? defineAsyncComponent(loader) : null)),
)

const sectionRefs: (HTMLElement | null)[] = []
let loadObserver: IntersectionObserver | null = null
let activeObserver: IntersectionObserver | null = null

const setSectionRef = (el: unknown, index: number) => {
  sectionRefs[index] = el instanceof HTMLElement ? el : null
}

const activate = (index: number) => {
  if (activated.value[index]) return

  const nextActivated = activated.value.slice()
  nextActivated[index] = true
  activated.value = nextActivated

  const nextComponents = asyncComponents.value.slice()
  const loader = props.sections[index]
  if (loader && !nextComponents[index]) {
    nextComponents[index] = defineAsyncComponent(loader)
    asyncComponents.value = nextComponents
  }
}

onMounted(async () => {
  await nextTick()

  loadObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const index = Number((entry.target as HTMLElement).dataset.sectionIndex)
        if (Number.isNaN(index)) continue
        activate(index)
        loadObserver?.unobserve(entry.target)
      }
    },
    { threshold: 0.2 },
  )

  activeObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      const top = visible[0]
      if (!top) return
      const index = Number((top.target as HTMLElement).dataset.sectionIndex)
      if (!Number.isNaN(index)) setActiveIndex(index)
    },
    { threshold: [0.35, 0.55, 0.75] },
  )

  sectionRefs.forEach((el, index) => {
    if (!el) return
    activeObserver?.observe(el)
    if (index === 0) return
    loadObserver?.observe(el)
  })
})

onUnmounted(() => {
  loadObserver?.disconnect()
  activeObserver?.disconnect()
  loadObserver = null
  activeObserver = null
})
</script>

<template>
  <section
    v-for="(_, index) in sections"
    :key="index"
    :ref="(el) => setSectionRef(el, index)"
    class="page-section"
    :data-section-index="index"
  >
    <div v-if="activated[index] && asyncComponents[index]" class="page-section-enter">
      <component :is="asyncComponents[index]" />
    </div>
  </section>
</template>

<style scoped>
.page-section {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.page-section-enter {
  height: 100%;
  animation: section-enter 0.55s ease both;
}

.page-section-enter > :deep(*) {
  height: 100%;
  box-sizing: border-box;
}

@keyframes section-enter {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
