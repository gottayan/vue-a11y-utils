<template>
  <div id="focus-trap-example">
    <h3>Simple dialog</h3>

    <p>
      <button class="trigger" @click="shown = true">
        Open a Modal Dialog
      </button>
    </p>
    <div v-if="shown" class="dialog">
      <FocusTrap
        @focusFirst="email.focus()"
        @focusLast="cancel.focus()"
        autoHistory
        autoFocus
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
        <button @click="shown = false">Login</button>
        <button :ref="el => cancel = el" @click="shown = false">Cancel</button>
      </FocusTrap>
    </div>

    <h3>Nested dialogs</h3>

    <FocusTrapExampleNested />

    <h3>Customized dialogs</h3>

    <FocusTrapExampleCustomized />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import FocusTrap from './utils/focus-trap.vue'
import FocusTrapExampleNested from './focus-trap-example-nested.vue'
import FocusTrapExampleCustomized from './focus-trap-example-customized.vue'

export default {
  components: { FocusTrap, FocusTrapExampleNested, FocusTrapExampleCustomized },
  setup() {
    const shown = ref(false)

    const email = ref(null)
    const cancel = ref(null)

    return {
      shown,
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