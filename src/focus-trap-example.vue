<template>
  <div id="focus-trap-example">
    <p>
      <button class="trigger" @click="openDialog">
        Open a Modal Dialog
      </button>
    </p>
    <div v-if="shown" class="dialog">
      <FocusTrap
        ref="dialog"
        @focusFirst="goFirst"
        @focusLast="goLast"
        autoHistory
      >
        <h1>Modal Dialog</h1>
        <label>
          Email:
          <input :ref="el => email = el" type="email" />
        </label>
        <label>
          Password
          <input type="password" />
        </label>
        <button @click="closeDialog">Login</button>
        <button :ref="el => cancel = el" @click="closeDialog">Cancel</button>
      </FocusTrap>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, nextTick, onMounted, getCurrentInstance } from 'vue'
import { TrapHistoryMixin } from './utils/trap-history'
import FocusTrap from './utils/focus-trap.vue'

export default {
  components: { FocusTrap },
  mixins: [TrapHistoryMixin],
  setup() {
    const shown = ref(false)
    const trigger = ref(null)

    const email = ref(null)
    const cancel = ref(null)

    const goFirst = () => email.value.focus()
    const goLast = () => cancel.value.focus()

    const openDialog = () => shown.value = true
    const closeDialog = () => shown.value = false

    return {
      shown,
      openDialog,
      closeDialog,
      goFirst,
      goLast,
      trigger,
      email,
      cancel
    }
  }
}
</script>

<style scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background: white;
  opacity: 0.9;
  box-sizing: border-box;
  padding: 8em 4em;
  text-align: center;
}
</style>