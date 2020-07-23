<template>
  <div :ref="$el => el = $el">
    <h3>Composition API</h3>
    <p>Hello <span>World</span></p>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useOverwriteAttrs, AttrsInput } from './utils/overwrite'

export default {
  setup() {
    const el = ref<HTMLElement>(null)

    useOverwriteAttrs(el, 'span', { x: 'a', y: 'b' })

    return { el }
  }
}
</script>