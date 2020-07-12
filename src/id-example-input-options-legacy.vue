<template>
  <div :id="localId">
    <label :id="`${localId}-label`">{{ label }}</label>
    <input
      :id="`${localId}-input`"
      :aria-labelledby="`${localId}-label`"
      :type="type || 'text'"
      v-model="localValue"
    />
  </div>
</template>

<script lang="ts">
import { MixinId } from "./utils/id";

export default {
  props: {
    type: String,
    label: String,
    modelValue: String
  },
  mixins: [MixinId],
  data() {
    return {
      localValue: this.modelValue || ''
    }
  },
  watch: {
    modelValue(v) {
      this.localValue = v
    },
    localValue(v) {
      if (this.modelValue !== v) {
        this.$emit('update:modelValue', v)
      }
    }
  }
}
</script>
