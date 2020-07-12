<template>
  <div id="id-example">
    <h3>Using Implicit ID</h3>
    <CustomInput v-for="field in list" :key="field.name" :label="field.label" :type="field.type" v-model="field.value" />

    <h3>Using Explicit ID</h3>
    <CustomInput id="foo" />
    <button aria-controls="foo-input">Clear</button>

    <h3>Debug info</h3>
    <pre>{{ JSON.stringify(list, null, 2) }}</pre>
  </div>
</template>

<script lang="ts">
import { reactive } from 'vue'
import CustomInput from './id-example-input.vue'

type FieldProps = {
  name: string
  type: string
  label: string
  value: string
}

export default {
  components: { CustomInput },
  setup() {
    const list: FieldProps[] = reactive([
      { name: 'username', label: 'Username', type: 'text', value: 'Jinjiang' },
      { name: 'password', label: 'Password', type: 'password', value: '' }
    ])
    return { list }
  }
}
</script>