import { nextTick, ref } from 'vue'

const isOpen = ref(false)
const activeIndex = ref(0)

export function useSectionsNav() {
  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const goToSection = async (index: number) => {
    activeIndex.value = index
    isOpen.value = false

    await nextTick()

    const el = document.querySelector<HTMLElement>(`[data-section-index="${index}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const setActiveIndex = (index: number) => {
    activeIndex.value = index
  }

  return {
    isOpen,
    activeIndex,
    open,
    close,
    toggle,
    goToSection,
    setActiveIndex,
  }
}
