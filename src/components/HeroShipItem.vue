<script setup lang="ts">
import type { MappedShip } from '@/types/HeroShip'

defineProps<{
  ship: MappedShip
}>()
</script>

<template>
  <div class="container">
    <div class="ship-image">
      <img :src="ship.image" :alt="ship.name" fetchpriority="high" decoding="async" />
    </div>
    <div class="ship-info-container">
      <div class="ship-info">
        <div class="ship-name">
          <h1>{{ ship.name }}</h1>
          <img :src="ship.nationImage" alt="" />
        </div>
        <div class="ship-description">
          <p>{{ ship.description }}</p>
        </div>
      </div>
      <div class="ship-type">
        <img class="ship-type-image" :src="ship.typeImage" alt="" />
        <p class="ship-type-name">{{ ship.type }}</p>
        <img class="ship-type-description" :src="ship.contourImage" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  height: 100%;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.ship-image {
  position: absolute;
  bottom: 10%;
  left: 0;
  width: 70%;
  transform-origin: 40% 70%;
}

.ship-image img {
  display: block;
  width: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

.ship-info-container {
  position: absolute;
  top: 10%;
  right: 5%;
  width: calc(45% - 3rem);
  max-height: calc(50% - 3rem);

  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.ship-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);

  background: linear-gradient(180deg, rgba(32, 32, 32, 0.2) 0%, rgba(108, 154, 120, 0.2) 100%);
  border: 0.5px solid var(--color-border-white);
  backdrop-filter: blur(25px);
  border-radius: var(--radius-sm);
  padding: var(--space-xl);
}

.ship-name {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.ship-name img {
  height: clamp(2rem, 1.5rem + 2vw, 3.375rem);
  object-fit: contain;
}

.ship-name h1 {
  font-size: var(--font-size-2xl);
  font-weight: bolder;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);

  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 40%,
    rgba(181, 186, 181, 1) 100%
  );
}

.ship-description p {
  font-size: var(--font-size-base);
  font-weight: 400;
  color: var(--color-white);
}

.ship-type {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-xl);

  background: linear-gradient(180deg, rgba(32, 32, 32, 0.2) 0%, rgba(108, 154, 120, 0.2) 100%);
  border: 0.5px solid var(--color-border-white);
  backdrop-filter: blur(25px);
  border-radius: var(--radius-sm);
  padding: var(--space-xl);
}

.ship-type-image {
  width: clamp(1.5rem, 1.25rem + 0.8vw, 2rem);
  height: clamp(1.5rem, 1.25rem + 0.8vw, 2rem);
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.24));
}

.ship-type-name {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-white);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);
}

.ship-type-description {
  height: clamp(1.25rem, 1.1rem + 0.6vw, 1.75rem);
}

@media (max-width: 1023px) {
  .ship-image {
    width: 92%;
    left: 4%;
    bottom: 18%;
  }

  .ship-info-container {
    top: 10%;
    right: 4%;
    left: 4%;
    width: auto;
    max-height: none;

    gap: var(--space-lg);
  }

  .ship-info,
  .ship-type {
    padding: var(--space-lg);
    gap: var(--space-lg);
  }

  .ship-description p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

@media (max-width: 767px) {
  .ship-info,
  .ship-type {
    padding: var(--space-md);
    gap: var(--space-md);
  }

  .ship-description p {
    font-size: var(--font-size-sm);
    -webkit-line-clamp: unset;
    line-clamp: unset;
  }
}
</style>
