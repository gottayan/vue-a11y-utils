<template>
  <div>
    <div tabindex="0" ref="start"></div>
    <slot></slot>
    <div tabindex="0" ref="end"></div>
  </div>
</template>

<script lang="ts">
import { TrapItem, push, remove, getCurrent } from './trap-history'

const trapItemKey = Symbol('TrapItem')
const trapFocusKey = Symbol('TrapFocus')

export default {
  props: {
    autoHistory: Boolean
  },
  mounted() {
    if (this.autoHistory) {
      const trapItem: TrapItem = {
        instance: this,
        activeElement: document.activeElement as HTMLElement,
        onFocus: (): void => {
          trapItem.activeElement.focus() 
        },
        onBlur: (): void => {
          trapItem.activeElement = document.activeElement as HTMLElement
        }
      }
      push(trapItem)
      this[trapItemKey] = trapItem
    }
    document.addEventListener("focus", this[trapFocusKey], true);
  },
  beforeUnmount() {
    if (this.autoHistory) {
      remove(this[trapItemKey])
    }
    document.removeEventListener("focus", this[trapFocusKey], true);
  },
  methods: {
    [trapFocusKey](event: FocusEvent) {
      const trapItem = getCurrent()
      if (!trapItem) {
        return
      }
      const root = this.$el as HTMLElement
      const { start, end } = this.$refs as Record<string, HTMLElement>
      const target = event.target as HTMLElement
      if (!root.contains(target)) {
        event.preventDefault()
        this.$emit('focusFirst')
      } else if (target === start) {
        event.preventDefault()
        this.$emit('focusLast')
      } else if (target === end) {
        event.preventDefault()
        this.$emit('focusFirst')
      }
    },
    focus() {
      if (this.autoHistory) {
        this.$nextTick(() => {
          this[trapItemKey].onFocus()
        })
      }
    },
    blur() {
      if (this.autoHistory) {
        this.$nextTick(() => {
          this[trapItemKey].onBlur()
        })
      }
    }
  }
}
</script>
