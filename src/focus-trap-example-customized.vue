<template>
  <div id="focus-trap-example">
    <p>
      <button class="trigger" @click="bodyToLogin">
        Login ...
      </button>
    </p>

    <div v-if="shown" class="dialog">
      <div v-if="loading">Loading ...</div>
      <div v-else>
        <FocusTrap
          v-if="loginShown"
          :ref="el => login = el"
          @focusFirst="firstInLogin.focus()"
          @focusLast="lastInLogin.focus()"
        >
          <h1>Login Dialog</h1>
          <label>
            Email:
            <input :ref="el => firstInLogin = el" type="email" />
          </label>
          <label>
            Password
            <input type="password" />
          </label>
          <button @click="loginToBody">Login</button>
          <button @click="loginToBody">Back</button>
          <br />
          <button :ref="el => { lastInLogin = el, signinButton = el }" @click="loginToSignup">Sign up ...</button>
        </FocusTrap>

        <FocusTrap
          v-if="signupShown"
          :ref="el => signup = el"
          autoFocus
          @focusFirst="firstInSignup.focus()"
          @focusLast="lastInSignup.focus()"
        >
          <h1>Sign up Dialog</h1>
          <label>
            Email:
            <input :ref="el => firstInSignup = el" type="email" />
          </label>
          <label>
            Password
            <input type="password" />
          </label>
          <button @click="signupToLogin">Create</button>
          <button @click="signupToLogin">Back</button>
          <br />
          <button :ref="el => lastInSignup = el" @click="signupToBody">Cancel</button>
        </FocusTrap>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, nextTick } from 'vue'
import { TrapItem, push, remove, clear, baseTrapItem } from './utils/trap-history'
import FocusTrap from './utils/focus-trap.vue'

export default {
  components: { FocusTrap },
  setup() {
    const current = ref('body')

    const loading = computed(() => current.value === 'loading')
    const loginShown = computed(() => current.value === 'login')
    const signupShown = computed(() => current.value === 'signup')
    const shown = computed(() => loading.value || loginShown.value || signupShown.value)

    const login = ref(null)
    const signinButton = ref(null)
    const loginTrapItem: TrapItem = {
      instance: Symbol('login'),
      onEnter() {
        nextTick(() => {
          if (this.activeElement) {
            this.activeElement.focus()
          } else {
            login.value.$emit('focusFirst')
          }
        })
      },
      onLeave() {}
    }

    const signup = ref(null)
    const signupTrapItem = {
      instance: Symbol('signup'),
      onLeave() {}
    }

    const bodyToLogin = () => {
      baseTrapItem.activeElement = document.activeElement as HTMLElement
      current.value = 'loading'
      setTimeout(() => {
        current.value = 'login'
        nextTick(() => {
          push(loginTrapItem)
        })
      }, 500);
    }

    const loginToBody = () => {
      loginTrapItem.activeElement = undefined
      current.value = 'loading'
      setTimeout(() => {
        current.value = 'body'
        nextTick(() => {
          remove(loginTrapItem)
        })
      }, 500);
    }

    const loginToSignup = () => {
      loginTrapItem.activeElement = {
        focus() {
          signinButton.value?.focus()
        }
      }
      current.value = 'loading'
      setTimeout(() => {
        current.value = 'signup'
        nextTick(() => {
          signup.trapItem = signupTrapItem
          push(signupTrapItem)
        })
      }, 500);
    }

    const signupToLogin = () => {
      current.value = 'loading'
      setTimeout(() => {
        current.value = 'login'
        nextTick(() => {
          remove(signupTrapItem)
        })
      }, 500);
    }

    const signupToBody = () => {
      loginTrapItem.activeElement = undefined
      current.value = 'loading'
      setTimeout(() => {
        current.value = 'body'
        nextTick(() => {
          clear()
        })
      }, 500);
    }

    return {
      current, loading, shown, loginShown, signupShown,

      login,
      firstInLogin: ref(null),
      lastInLogin: ref(null),
      signinButton,

      signup,
      firstInSignup: ref(null),
      lastInSignup: ref(null),

      bodyToLogin, loginToBody, loginToSignup, signupToLogin, signupToBody
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