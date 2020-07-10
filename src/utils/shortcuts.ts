import { onMounted, onBeforeUnmount, getCurrentInstance, ComponentOptionsMixin } from 'vue'
import { keyEventIsEnded, KeyDown, KeyModifiers, getKeySeq, updateKeySeq, endLastKeyDown } from './keydown'

// Type defs

type ShortcutsOptions =
  | Array<ShortcutConfig>
  | Record<string, ShortcutsConfig>

type ShortcutsConfig = ShortcutConfig | ShortcutConfig[]

type ShortcutConfig = {
  modifiers?: KeyModifiers
  // TODO
  handle: Function
} & (Key | Keys)

type Key = {
  key: string
}

type Keys = {
  keys: string[]
}

type HandleShortcuts = (event: KeyboardEvent) => void

// Implementation

function matchShortcut(shortcut: ShortcutConfig, target: EventTarget): boolean {
  const keySeq = getKeySeq(target)
  const { modifiers } = shortcut
  const keys = shortcut.hasOwnProperty('keys') ? (shortcut as Keys).keys : [(shortcut as Key).key]
  const keyDownList = keys.map(key => new KeyDown(key, modifiers))

  if (!keyDownList.length) {
    return false
  }

  const keySeqLength = keySeq.length

  return keyDownList.every((keyDown, index) => {
    const existingKeydown = keySeq[keySeqLength - 1 - index]
    return existingKeydown && existingKeydown.equals(keyDown)
  })
}

const getShortcutsByName = (shortcutsOptions: ShortcutsOptions, name: string = 'default'): ShortcutConfig[] => {
  if (!shortcutsOptions) {
    return []
  }
  if (Array.isArray(shortcutsOptions)) {
    if (name === 'default') {
      return shortcutsOptions
    }
    return []
  }
  const shortcuts = shortcutsOptions[name]
  return Array.isArray(shortcuts) ? shortcuts : (shortcuts ? [shortcuts] : [])
}

const handleShortcuts = (event: KeyboardEvent, config: ShortcutsConfig): void => {
  const target = event.currentTarget
  if (!target) {
    return
  }

  // TODO: vm
  const vm = getCurrentInstance()

  // update global unique key seq
  const updated = updateKeySeq(event, target)

  // match shortcuts
  if (updated) {

    // check whether end rule matched
    const touchedEndBefore = keyEventIsEnded(target, event)
    if (!touchedEndBefore) {
      const shortcuts = Array.isArray(config) ? config : [config]
      shortcuts.some((shortcut: ShortcutConfig) => {

        // match new rules in current shortcut config
        if (matchShortcut(shortcut, target)) {

          // do the job and make sure whether to end the matching process
          const ended = shortcut.handle.call(vm, event)
          if (ended) {
            endLastKeyDown(target, event)
          }

          return keyEventIsEnded(target, event)
        }
        return false
      })
    }
  }
}

// Exports

export const useShortcuts = (config: ShortcutsConfig): HandleShortcuts => event => handleShortcuts(event, config)

export const useGlobalShortcuts = (config: ShortcutsConfig): void => {
  const handler: HandleShortcuts = event => handleShortcuts(event, config)
  onMounted(() => {
    window.addEventListener('keydown', handler)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handler)
  })
}

export const useShortcutsMixin = (methodName: string = 'bindShortcuts', options: ShortcutsOptions): ComponentOptionsMixin => {
  return {
    beforeMount() {
      if (this.$options.$shortcuts) {
        window.addEventListener(
          'keydown',
          this[methodName]
        )
      }
    },
    beforeDestroy() {
      if (this.$options.$shortcuts) {
        window.removeEventListener(
          'keydown',
          this[methodName]
        )
      }
    },
    methods: {
      [methodName](event: KeyboardEvent, name: string = 'default'): void {
        const config = getShortcutsByName(options, name)
        handleShortcuts(event, config)
      }
    }
  }
}
