<template>
  <div id="key-shortcuts-example">
    <h3>Usage in Composition API</h3>

    <p>
      Press <input
        type="text" value="Ctrl + G HERE"
        @keydown="handlerG"
      /> or
      <input
        type="text" value="Ctrl + K HERE"
        @keydown="handlerK"
      /> or A-S-D-F anywhere.
    </p>

    <h3>Usage in Options API</h3>

    <ShortcutsExampleOptions />
  </div>
</template>

<script lang="ts">
import { useShortcuts, useGlobalShortcuts } from './utils/shortcuts'
import ShortcutsExampleOptions from './shortcuts-example-options.vue'

export default {
  components:{ ShortcutsExampleOptions },
  setup() {
    useGlobalShortcuts({
      keys: ['a', 's', 'd', 'f'],
      handle() {
        alert('You have pressed A-S-D-F. So are you boring now?')
      }
    })
    const handlerG = useShortcuts({
      key: 'g',
      modifiers: { ctrl: true },
      handle() {
        alert('trigger: Ctrl + G')
      }
    })
    const handlerK = useShortcuts({
      key: 'k',
      modifiers: { ctrl: true },
      handle() {
        alert('trigger: Ctrl + K')
      }
    })
    return { handlerG, handlerK }
  }
}
</script>
