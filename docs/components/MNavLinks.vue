<script setup lang="ts">
import { computed } from 'vue'
import { slugify } from '@mdit-vue/shared'
import MNavLink from './MNavLink.vue'
import type { NavLink } from '../.vitepress/theme/utils/types'

const props = defineProps<{
  title: string
  noIcon?: boolean
  items: NavLink[]
}>()

const formatTitle = computed(() => {
  return slugify(props.title)
})
</script>

<template>
  <h2 v-if="title" :id="formatTitle" >
    {{ title }}
    <a class="header-anchor" :href="`#${formatTitle}`" aria-hidden="true"></a>
  </h2>
  <div class="m-nav-links">
    <MNavLink v-for="item in items" :noIcon="noIcon" v-bind="item" />
  </div>
</template>

<style scoped>
.m-nav-links {
  --m-nav-gap: 18px;
  display: grid;
  grid-row-gap: var(--m-nav-gap);
  grid-column-gap: var(--m-nav-gap);
  grid-auto-flow: row dense;
  justify-content: center;
  margin-top: var(--m-nav-gap);
}

@media (min-width: 500px) {
  .m-nav-links {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

@media (min-width: 640px) {
  .m-nav-links {
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  }
}

@media (min-width: 768px) {
  .m-nav-links {
    grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  }
}

@media (min-width: 960px) {
  .m-nav-links {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}



</style>
