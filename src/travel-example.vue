<template>
  <div id="key-travel-example">
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
    <TravelExampleOptions />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useKeyboardTravel, TravelConfig } from './utils/travel'
import TravelExampleOptions from './travel-example-options.vue'

type ExampleOption = {
  text: string
  value: string
}

export default {
  components: { TravelExampleOptions },
  setup() {
    const items: ExampleOption[] = [
      { text: 'Foo', value: 'x' },
      { text: 'Bar', value: 'y' },
      { text: 'Baz', value: 'z' }
    ]
    const activeIndex = ref(-1)
    const activeValue = ref('y')
    const elements = ref([])

    const getItems = () => elements.value
    const getIndex = () => activeIndex.value
    const setIndex = (vm, index: number) => {
      const element = elements.value[index]
      if (element) {
        element.focus()
        activeIndex.value = index
      }
    }
    const move = (vm, event: KeyboardEvent, newIndex: number) => {
      event.preventDefault()
      setIndex(vm, newIndex)
      return true
    }
    const action = (vm, event: KeyboardEvent, index: number) => {
      activeValue.value = items[index].value
      return true
    }

    const travelHandler = useKeyboardTravel({
      looped: true,
      getItems, getIndex, setIndex, move, action
    })

    const focus = () => {
      setIndex(null, activeIndex.value)
    }

    return { items, elements, activeIndex, activeValue, travelHandler, focus }
  }
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