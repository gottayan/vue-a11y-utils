import { capitalizeFirstLetter, endedEvents } from './shared'

// Type defs

export type KeyModifiers = {
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  window?: boolean
  cmd?: boolean
  option?: boolean
}

export interface KeyDown {
  [modifier: string]: boolean | string | number | Function
  name: string
  ctrl: boolean
  shift: boolean
  alt: boolean
  meta: boolean
  timestamp: number
  ended: boolean
  toString(): string
}

// Implementation

export class KeyDown {
  constructor(name: string, modifiers: KeyModifiers = {}) {
    this.name = parseKeyName(name)
    const { ctrl, shift, alt, meta, window, cmd, option } = modifiers
    this.ctrl = !!ctrl
    this.shift = !!shift
    this.alt = !!alt || !!option
    this.meta = !!meta || !!window || !!cmd
    this.timestamp = Date.now()
  }
  equals(keyDown: any) {
    if (!keyDown || typeof keyDown.toString !== 'function') {
      return false
    }
    return this.toString() === keyDown.toString()
  }
  toString(): string {
    const { name } = this
    const modifiers: string = ['ctrl', 'shift', 'alt', 'meta']
      .filter((modifier: string) => this[modifier])
      .join(',')
    return modifiers ? `${name}(${modifiers})` : name
  }
}

// Keydown utils

export const parseEvent = (event: KeyboardEvent): KeyDown | undefined => {
  const { key, code, ctrlKey, shiftKey, altKey, metaKey } = event

  // skip modifier key
  if (['Control', 'Shift', 'Alt', 'Meta'].indexOf(key) >= 0) {
    return
  }

  const keyModifiers: KeyModifiers = {
    ctrl: ctrlKey,
    shift: shiftKey,
    alt: altKey,
    meta: metaKey
  }

  // number: key
  if (key.match(/^Digit\d$/)) {
    return new KeyDown(key, keyModifiers)
  }

  // alphabet: code
  if (code.match(/^Key\w$/)) {
    return new KeyDown(code, keyModifiers)
  }

  // navigation: key
  if (
    [
      'Up',
      'Down',
      'Left',
      'Right',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'PageUp',
      'PageDown'
    ].indexOf(key) >= 0
  ) {
    return new KeyDown(key, keyModifiers)
  }

  // other: code
  return new KeyDown(code, keyModifiers)
}

export const parseKeyName = (name: string): string => {
  if (name.match(/^[a-z]$/)) {
    return `Key${name.toUpperCase()}`
  }
  if (name.match(/^[0-9]$/)) {
    return `Digit${name.toUpperCase()}`
  }
  const specialNameMap: Record<string, string> = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    home: 'Home',
    end: 'End',
    pagedown: 'PageDown',
    pageup: 'PageUp'
  }
  const specialName = specialNameMap[name.toLowerCase()]
  if (specialName) {
    return specialName
  }
  return capitalizeFirstLetter(name)
}

// Key sequence utils

const maxKeySeqLength = 32

const keySeqMap: WeakMap<EventTarget, KeyDown[]> = new WeakMap()

export const getKeySeq = (target: EventTarget): KeyDown[] => {
  const keySeq = keySeqMap.get(target) || []
  if (!keySeqMap.has(target)) {
    keySeqMap.set(target, keySeq)
  }
  return keySeq
}

export const updateKeySeq = (event: KeyboardEvent, target: EventTarget): boolean => {
  const keySeq = getKeySeq(target)
  const keyDown: KeyDown | void = parseEvent(event)

  if (keyDown) {
    keySeq.push(keyDown)
    if (keySeq.length > maxKeySeqLength) {
      keySeq.shift()
    }
    return true
  }

  return false
}

export const keyEventIsEnded = (target: EventTarget, event: KeyboardEvent): boolean => {
  if (endedEvents.has(event)) {
    return true
  }

  const keySeq = getKeySeq(target)
  const lastKeyDown = keySeq[keySeq.length - 1]

  return lastKeyDown ? !!lastKeyDown.ended : false
}

export function endLastKeyDown(target: EventTarget, event: KeyboardEvent): void {
  const keySeq = getKeySeq(target)
  const lastKeyDown = keySeq[keySeq.length - 1]
  if (lastKeyDown) {
    lastKeyDown.ended = true
  }
  endedEvents.add(event)
}
