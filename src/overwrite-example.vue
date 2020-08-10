<template>
  <div>
    <h3>Composition API</h3>
    <p :ref="$el => el = $el">
      A normal <span>element</span>.
    </p>
    <p :ref="$el => el2 = $el">
      A normal <span>element</span> with attrs function.
      <button @click="increment2">update</button>
    </p>
    <p :ref="$el => el3 = $el">
      An <span :x="x3" :z="z3">element</span> with <code>v-bind</code>.
      x: {{x3}} z: {{z3}}
      <button @click="incrementX3">update x</button>
      <button @click="incrementZ3">update z</button>
    </p>
    <p :ref="$el => el4 = $el">
      An <span v-if="x4 % 2 === 0" :x="x4">element</span> with <code>v-if</code>.
      x: {{x4}}
      <button @click="increment4">update x</button>
    </p>
    <p :ref="$el => el5 = $el">
      Real DOM mutation on a normal <span>element</span>.
      x: {{x5}}
      <button @click="increment5">mutate</button>
    </p>
    <h3>Options API</h3>
    <OverwriteAttrs selector="span" :attrs="{ x: x6.toString(), y: 'b' }">
      <p>
        A normal <span :z="x6">element</span> with attrs function.
        x: {{x6}}
        <button @click="increment6">update</button>
      </p>
    </OverwriteAttrs>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, markRaw } from 'vue'
import { useOverwriteAttrs, OverwriteAttrs } from './utils/overwrite'

export default {
  components: { OverwriteAttrs },
  setup() {
    const el = ref<HTMLElement | null>(null)
    useOverwriteAttrs(el, 'span', { x: 'a', y: 'b' })

    const el2 = ref<HTMLElement | null>(null)
    const x2 = ref(0)
    const increment2 = () => x2.value++
    useOverwriteAttrs(el2, 'span', () => ({ x: (x2.value % 3).toString(), y: 'b' }))

    const el3 = ref<HTMLElement | null>(null)
    const xValues = ['x', '1', undefined, '']
    const xIndex = ref(0)
    const x3 = computed(() => xValues[xIndex.value % 4])
    const incrementX3 = () => xIndex.value++
    const z3 = ref(0)
    const incrementZ3 = () => z3.value++
    useOverwriteAttrs(el3, 'span', { x: 'a', y: 'b' })

    const el4 = ref<HTMLElement | null>(null)
    const x4 = ref(0)
    const increment4 = () => x4.value++
    useOverwriteAttrs(el4, 'span', { x: 'a', y: 'b' })

    const el5 = ref<HTMLElement | null>(null)
    const x5 = ref(0)
    const increment5 = () => {
      x5.value++
      el5.value?.querySelector('span')?.setAttribute('x', x5.value.toString())
      el5.value?.querySelector('span')?.setAttribute('z', x5.value.toString())
    }
    useOverwriteAttrs(el5, 'span', { x: 'a', y: 'b' })

    const x6 = ref(0)
    const increment6 = () => x6.value++

    return {
      el,
      el2, increment2,
      el3, x3, incrementX3, z3, incrementZ3,
      el4, x4, increment4,
      el5, x5, increment5,
      x6, increment6
    }
  }
}
</script>

<style scoped>
[x] {
  color: blue;
}
[x="1"] {
  color: green;
}
[x="2"] {
  color: grey;
}
[y] {
  display: inline-block;
  padding: 0 0.25em;
  border-radius: 5px;
  background-color: lime;
}
</style>