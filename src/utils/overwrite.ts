import { onMounted, nextTick, Ref } from "vue"

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
    const value = input[name].toString()
    input[name] = value
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

const observeTarget = (target: HTMLElement, input: AttrsInput): void => {
  const observer = new MutationObserver(() => {
    nextTick(() => {
      const newAttrs = typeof input === 'function' ? input(getOldAttrs(target)) : input
      for (const name in newAttrs) {
        if (target.getAttribute(name) === newAttrs[name]) {
          target.setAttribute(name, newAttrs[name])
        }
      }
    })
  })
  observer.observe(target, { attributes: true })
}

const observeTargetCreated = (el: HTMLElement, target: HTMLElement | null, selector: string, input: AttrsInput): void => {
  let currentTarget = target
  const observer = new MutationObserver(() => {
    const newTarget: HTMLElement | null = el.querySelector(selector)
    if (newTarget && newTarget !== currentTarget) {
      currentTarget = newTarget
      observeTarget(currentTarget, input)
    }
  })
  observer.observe(el, { childList: true })
}

export const useOverwriteAttrs = (elInput: ElementInput, selector: string, input: AttrsInput): void => {
  onMounted(() => {
    const el = normalizeEl(elInput)

    if (!el) {
      return
    }

    if (typeof input !== 'function') {
      normalizeAttrs(input)
    }

    const target: HTMLElement | null = el.querySelector(selector)
    if (target) {
      observeTarget(target, input)
    }

    observeTargetCreated(el, target, selector, input)
  })
}
