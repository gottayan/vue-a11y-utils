<template>
  <div>
    <p>
      Press <input
        type="text" value="Ctrl + G HERE"
        @keydown="shortcutsHandler($event, 'foo')"
      /> or
      <input
        type="text" value="Ctrl + K HERE"
        @keydown="shortcutsHandler($event, 'bar')"
      /> or F-D-S-A anywhere.
    </p>
  </div>
</template>

<script lang="ts">
import { useShortcutsMixin } from './utils/shortcuts'

export default {
  mixins: [useShortcutsMixin('shortcutsHandler', {
    default: {
      keys: ['f', 'd', 's', 'a'],
      handle() {
        alert('You have pressed F-D-S-A. So are you boring now?')
      }
    },
    foo: [
      {
        key: 'g',
        modifiers: { ctrl: true },
        handle() {
          alert('trigger: CMD + G')
        }
      }
    ],
    bar: [
      {
        key: 'k',
        modifiers: { ctrl: true },
        handle() {
          alert('trigger: CMD + K')
        }
      }
    ]
  })]
}
</script>
