<template>
  <main id="app" class="text-sm">
    <Tournament />
  </main>
</template>

<script setup lang="ts">
import Tournament from '@/components/Tournament.vue'
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #fff;
  max-width: 1400px;
  margin: 0 auto;
}

.app-header h1 {
  font-size: 3rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.app-header p {
  font-size: 1.2rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2.5rem;
  }
  
  .app-header p {
    font-size: 1rem;
  }
}
</style>
