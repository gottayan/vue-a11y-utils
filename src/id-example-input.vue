<template>
  <div :id="id">
    <label ref="label" :id="`${id}-label`">{{ label }}</label>
    <input
      ref="input"
      :id="`${id}-input`"
      :aria-labelledby="`${id}-label`"
      :type="type || 'text'"
      v-model="value"
    />
  </div>
</template>

<script lang="ts">
import { ref, watch, computed, toRefs } from 'vue';
import { useId } from "./utils/id";

export default {
  props: {
    id: String,
    type: String,
    label: String,
    value: String
  },
  setup(props, context) {
    const id = useId(props.id)
    const value = computed({
      get: () => props.value,
      set: v => context.emit('input', v)
    })
    const { type, label } = toRefs(props)
    return { id, value, type, label }
  }
}
</script>