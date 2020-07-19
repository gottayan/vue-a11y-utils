import { ComponentOptionsMixin, nextTick, onMounted, getCurrentInstance, onUnmounted } from "vue"

export type Focusable = {
  focus: () => void
}

export type TrapItem = {
  instance: any
  activeElement?: HTMLElement | Focusable
  onLeave?: (this: TrapItem) => void
  onEnter?: (this: TrapItem) => void
}

export const baseTrapItem: TrapItem = {
  instance: {}
}

let currentTrapItem: TrapItem = baseTrapItem
export const getCurrent = (): TrapItem => currentTrapItem

let trapHistory: TrapItem[] = [baseTrapItem]
export const getList = (): TrapItem[] => [...trapHistory]

const enterCurrent = (): void => {
  if (currentTrapItem.onEnter) {
    currentTrapItem.onEnter()
  } else {
    const item = currentTrapItem
    nextTick(() => {
      item.activeElement?.focus()
    })
  }
}

const leaveCurrent = (): void => {
  if (currentTrapItem.onLeave) {
    currentTrapItem.onLeave()
  } else {
    currentTrapItem.activeElement = document.activeElement as HTMLElement
  }
}

export const push = (item: TrapItem): void => {
  leaveCurrent()
  trapHistory.push(item)
  currentTrapItem = item
  enterCurrent()
}

export const replace = (item: TrapItem): TrapItem | undefined => {
  if (item === trapHistory[trapHistory.length - 1]) {
    return
  }
  leaveCurrent()
  const previousItem = trapHistory.pop()
  trapHistory.push(item)
  currentTrapItem = item
  enterCurrent()
  return previousItem
}

export const remove = (item: TrapItem): void => {
  trapHistory = trapHistory.filter(existingItem => existingItem.instance !== item.instance)
  const lastItem = trapHistory[trapHistory.length - 1]
  if (lastItem !== currentTrapItem) {
    leaveCurrent()
    currentTrapItem = lastItem
    enterCurrent()
  }
}

export const goto = (item: TrapItem): void => {
  const index = trapHistory.indexOf(item)
  if (index < 0 || index === trapHistory.length - 1) {
    return
  }
  leaveCurrent()
  trapHistory = trapHistory.slice(0, index)
  currentTrapItem = trapHistory[trapHistory.length - 1]
  enterCurrent()
}

export const clear = (): void => {
  if (trapHistory.length > 1) {
    leaveCurrent()
    trapHistory = [baseTrapItem]
    currentTrapItem = baseTrapItem
    enterCurrent()
  }
}

export const useTrapHistoryMixin = (trapItemName: string = 'trapItem', autoHistoryName: string = ''): ComponentOptionsMixin => ({
  mounted() {
    if (autoHistoryName && !this[autoHistoryName]) {
      return
    }
    const trapItem: TrapItem = {
      instance: this
    }
    this[trapItemName] = trapItem
    push(trapItem)
  },
  unmounted() {
    if (autoHistoryName && !this[autoHistoryName]) {
      return
    }
    remove(this[trapItemName])
  }
})

export const useTrapHistory = (trapItem: TrapItem = {
  instance: getCurrentInstance()
}): void => {
  onMounted(() => push(trapItem))
  onUnmounted(() => remove(trapItem))
}

export const TrapHistoryMixin = useTrapHistoryMixin('trapItem')
