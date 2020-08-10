<template>
  <!-- https://github.com/AlmeroSteyn/react-aria-live -->
  <div>
    <slot></slot>
    <div style="
      position: absolute;
      height: 1px;
      width: 1px;
      margin: -1px;
      clip: rect(0 0 0 0);
      overflow: hidden
    ">
      <div v-bind="aria.assertive">{{ assertive.alternate ? assertive.message : '' }}</div>
      <div v-bind="aria.assertive">{{ !assertive.alternate ? assertive.message : '' }}</div>
      <div v-bind="aria.polite">{{ polite.alternate ? polite.message : '' }}</div>
      <div v-bind="aria.polite">{{ !polite.alternate ? polite.message : '' }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { inject, InjectionKey } from 'vue'
import { getAriaAttrs } from './aria'

type LiveInstance = {
  message: string
  alternate: boolean
}

type LiveData = {
  assertive: LiveInstance,
  polite: LiveInstance,
  busy: boolean
}

type Announce = (message: string, important: boolean) => void

type SetBusy = (busy: boolean) => void

// TODO: Symbol doesn't work
export const keyAnnounce: string = "Symbol('announce')"
export const keySetBusy: string = "Symbol('setBusy')"

export const useLive = (): [Announce?, SetBusy?] => {
  return [
    inject<Announce>(keyAnnounce),
    inject<SetBusy>(keySetBusy)
  ]
}

export default {
  props: {
    role: String,
    label: String
  },
  data(): LiveData {
    return {
      assertive: { message: '', alternate: false },
      polite: { message: '', alternate: false },
      busy: false
    }
  },
  computed: {
    localRole(): string {
      return this.role || 'log'
    },
    aria(): Record<string, any> {
      const { localRole, label, busy } = this
      return {
        assertive: getAriaAttrs(localRole, { live: 'assertive', label, busy }),
        polite: getAriaAttrs(localRole, { live: 'polite', label, busy })
      }
    }
  },
  provide() {
    const self = this
    return {
      [keyAnnounce](message: string, important: boolean): void {
        const instance: LiveInstance = important ? self.assertive : self.polite
        instance.message = message;
        instance.alternate = !instance.alternate;
      },
      [keySetBusy](busy: boolean): void {
        self.busy = busy;
      }
    };
  }
}
</script>
