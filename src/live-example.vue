<template>
  <div id="live-example">
    <p>
      <label>Message: <input type="text" v-model="value" /></label>
    </p>
    <p>
      <label><input type="checkbox" v-model="busy" /> Busy</label>
    </p>
    <p>
      <button @click="announce(value, true)">
        Announce Immediately
      </button>
      <button @click="announce(value, false)">
        Announce Politely
      </button>
    </p>
  </div>
</template>

<script lang="ts">
import { inject, ref, watch } from 'vue'
import { useLive } from './utils/live.vue'

export default {
  setup() {
    const [announce, setBusy] = useLive()
    const value = ref('')
    const busy = ref(false)
    watch(busy, () => {
      setBusy && setBusy(busy.value)
    })
    return {
      value, busy, announce
    }
  }
}
</script>