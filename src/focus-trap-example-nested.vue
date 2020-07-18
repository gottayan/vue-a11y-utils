<template>
  <div id="focus-trap-example">
    <p>
      <button class="trigger" @click="current = 'login'">
        Login ...
      </button>
    </p>

    <div v-if="shown" class="dialog">
      <FocusTrap
        v-if="loginShown || signupShown"
        v-show="loginShown"
        autoHistory
        @focusFirst="firstInLogin.focus()"
        @focusLast="lastInLogin.focus()"
      >
        <h1>Login dialog</h1>
        <label>
          Email:
          <input :ref="el => firstInLogin = el" type="email" />
        </label>
        <label>
          Password
          <input type="password" />
        </label>
        <button @click="current = 'body'">Login</button>
        <button @click="current = 'body'">Back</button>
        <br />
        <button :ref="el => lastInLogin = el" @click="current = 'signup'">Sign up ...</button>
      </FocusTrap>

      <FocusTrap
        v-if="signupShown"
        autoHistory
        @focusFirst="firstInSignup.focus()"
        @focusLast="lastInSignup.focus()"
      >
        <h1>Sign up dialog</h1>
        <label>
          Email:
          <input :ref="el => firstInSignup = el" type="email" />
        </label>
        <button @click="current = 'login'">Sign up</button>
        <button :ref="el => lastInSignup = el" @click="current = 'login'">Back</button>
        <!-- <button @click="current = 'body'">Cancel</button> -->
      </FocusTrap>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { TrapHistoryMixin } from './utils/trap-history'
import FocusTrap from './utils/focus-trap.vue'

export default {
  components: { FocusTrap },
  mixins: [TrapHistoryMixin],
  setup() {
    const current = ref('body')

    const loginShown = computed(() => current.value === 'login')
    const signupShown = computed(() => current.value === 'signup')
    const shown = computed(() => loginShown.value || signupShown.value)

    return {
      current, shown, loginShown, signupShown,
      firstInLogin: ref(null),
      lastInLogin: ref(null),
      firstInSignup: ref(null),
      lastInSignup: ref(null)
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