<template>
  <div tabindex="0">
    <div tabindex="0" ref="start"></div>
    <slot></slot>
    <div tabindex="0" ref="end"></div>
  </div>
</template>

<script lang="ts">
import { nextTick } from 'vue'
import { useTrapHistoryMixin, push, remove, TrapItem } from './trap-history'

export default {
  mixins: [useTrapHistoryMixin('trapItem', 'autoHistory')],
  props: {
    autoHistory: Boolean,
    autoFocus: Boolean,
    disabled: Boolean
  },
  mounted() {
    if (this.trapItem && this.trapItem.activeElement) {
      this.trapItem.activeElement.focus()
    } else {
      if (this.autoFocus) {
        this.$emit('focusFirst')
      }
    }
    document.addEventListener("focus", this.trapFocus, true);
  },
  beforeUnmount() {
    document.removeEventListener("focus", this.trapFocus, true);
  },
  methods: {
    trapFocus(event: FocusEvent) {
      if (this.disabled) {
        return
      }
      const root = this.$el as HTMLElement
      const { start, end } = this.$refs as Record<string, HTMLElement>
      const target = event.target as HTMLElement
      if (root === target || !root.contains(target)) {
        event.preventDefault()
        this.$emit('focusFirst')
      } else if (target === start) {
        event.preventDefault()
        this.$emit('focusLast')
      } else if (target === end) {
        event.preventDefault()
        this.$emit('focusFirst')
      }
    }
  }
}
</script>
