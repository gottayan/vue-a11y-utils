import { Ref, computed, watchEffect, onMounted, onBeforeUnmount, nextTick } from "vue"

export type Attrs = Record<string, string>
export type MutateAttrs = (oldAttrs: Attrs) => Attrs
export type AttrsInput = Attrs | MutateAttrs
export type ElementInput = HTMLElement | Ref<HTMLElement | null> | null

const normalizeEl = (input: ElementInput): HTMLElement | null =>
  input instanceof HTMLElement
    ? input
    : input ? input.value : null

const normalizeAttrs = (input: Attrs): void => {
  for (const name in input) {
    const value = input[name]
    if (value !== null || value !== undefined) {
      input[name] = value.toString()
    }
  }
}

const getOldAttrs = (target: HTMLElement): Attrs => {
  const attrs: Attrs = {}
  const { attributes } = target
  const { length } = attributes
  for (let i = 0; i < length; i++) {
    const attr = attributes.item(i)
    if (attr) {
      attrs[attr.name] = attr.value
    }
  }
  return attrs
}

const setAttrs = (target: HTMLElement, attrs: Attrs): void => {
  for (const name in attrs) {
    if (target.getAttribute(name) !== attrs[name]) {
      target.setAttribute(name, attrs[name])
    }
  }
}

const updateAttrs = (target: HTMLElement, input: AttrsInput): void => {
  if (typeof input === 'function') {
    const oldAttrs = getOldAttrs(target)
    const newAttrs = computed(() => input(oldAttrs))
    watchEffect(() => {
      setAttrs(target, newAttrs.value)
    })
  } else {
    setAttrs(target, input)
  }
}

const observeTarget = (target: HTMLElement | null, input: AttrsInput): MutationObserver | null => {
  if (!target) {
    return null;
  }
  updateAttrs(target, input)
  const observer = new MutationObserver(() => {
    nextTick(() => {
      if (typeof input === 'function') {
        const newAttrs = input(getOldAttrs(target))
        setAttrs(target, newAttrs)
      } else {
        updateAttrs(target, input)
      }
    })
  })
  observer.observe(target, { attributes: true })
  return observer;
}

const observeTargetCreated = (el: HTMLElement, target: HTMLElement | null, observer: MutationObserver | null, selector: string, input: AttrsInput): MutationObserver => {
  let currentTarget = target
  let currentObserver = observer
  const elObserver = new MutationObserver(() => {
    const newTarget: HTMLElement | null = el.querySelector(selector)
    if (newTarget && newTarget !== currentTarget) {
      currentObserver?.disconnect()
      currentTarget = newTarget
      currentObserver = observeTarget(currentTarget, input)
    }
  })
  elObserver.observe(el, { childList: true })
  return elObserver
}

export const useOverwriteAttrs = (el: ElementInput, selector: string, attrs: AttrsInput): void => {
  let elObserver: MutationObserver
  onMounted(() => {
    const normalizedEl = normalizeEl(el)

    if (!normalizedEl) {
      return
    }

    if (typeof attrs !== 'function') {
      normalizeAttrs(attrs)
    }

    const target: HTMLElement | null = normalizedEl.querySelector(selector)
    const observer = observeTarget(target, attrs)

    elObserver = observeTargetCreated(normalizedEl, target, observer, selector, attrs)
  })
  onBeforeUnmount(() => {
    if (elObserver) {
      elObserver.disconnect()
    }
  })
}

const elObserverKey = Symbol('el-observer')

export const OverwriteAttrs = {
  props: {
    selector: String,
    attrs: Object
  },
  render() {
    const result = this.$slots.default()
    return result[0]
  },
  mounted() {
    const el = this.$el
    const { attrs, selector } = this
    if (el && selector) {
      const target: HTMLElement | null = el.querySelector(selector)
      const observer = observeTarget(target, attrs as Attrs)

      this[elObserverKey] = observeTargetCreated(el, target, observer, selector, attrs as Attrs)
    }
  },
  beforeUnmount() {
    const elObserver = this[elObserverKey] as MutationObserver | null
    if (elObserver) {
      elObserver.disconnect()
    }
  }
}
