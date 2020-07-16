<template>
  <div>
    <p>Selectable List</p>
    <p class="tip">
      Please active the list first and use <kbd>Arrow</kbd> keys
      and <kbd>Enter</kbd>/<kbd>Space</kbd> key to choose option.
      The current value is <output>{{ activeValue }}</output>.</p>
    <ul
      class="list"
      tabindex="0"
      @keydown="travelHandler"
      @keydown.enter="focus"
    >
      <li
        v-for="(item, i) in items"
        :key="item.value"
        :ref="el => { elements[i] = el }"
        tabindex="-1"
        :class="{ current: item.value === activeValue }"
      >{{ item.text }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useKeyboardTravelMixin } from './utils/travel'

type ExampleOption = {
  text: string
  value: string
}

export default {
  data() {
    const items: ExampleOption[] = [
      { text: 'Foo', value: 'x' },
      { text: 'Bar', value: 'y' },
      { text: 'Baz', value: 'z' }
    ]
    return {
      items,
      elements: [],
      activeIndex: -1,
      activeValue: 'y'
    }
  },
  methods: {
    getElements() {
      return this.elements
    },
    getIndex() {
      return this.activeIndex
    },
    setIndex(index: number) {
      if (this.elements) {
        const element = this.elements[index]
        if (element) {
          element.focus()
          this.activeIndex = index
        }
      }
    },
    move(event: KeyboardEvent, newIndex: number) {
      event.preventDefault()
      this.setIndex(newIndex)
      return true
    },
    action(event: KeyboardEvent, index: number) {
      this.activeValue = this.items[this.activeIndex].value
      return true
    },
    focus() {
      this.setIndex(this.activeIndex)
    }
  },
  mixins: [useKeyboardTravelMixin('travelHandler', {
    looped: true,
    getItems: vm => vm.getElements(),
    getIndex: vm => vm.getIndex(),
    setIndex: (vm, index) => vm.setIndex(index),
    move: (vm, event, newIndex) => vm.move(event, newIndex),
    action: (vm, event, index) => vm.action(event, index)
  })]
}
</script>

<style scoped>
.current {
  font-weight: bold;
}
.tip {
  padding: 0.25em 0.5em;
  background-color: InfoBackground;
}
</style>