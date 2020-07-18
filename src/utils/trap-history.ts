import { ComponentOptionsMixin } from "vue"

export type TrapItem = {
  instance: any
  activeElement?: HTMLElement
  onLeave?: () => void
  onEnter?: () => void
}

let currentTrapItem: TrapItem | undefined
export const getCurrent = (): TrapItem | undefined => currentTrapItem

let trapHistory: TrapItem[] = []
export const getList = (): TrapItem[] => [...trapHistory]

const enterCurrent = (): void => {
  if (currentTrapItem && currentTrapItem.onEnter) {
    currentTrapItem.onEnter()
  }
}

const leaveCurrent = (): void => {
  if (currentTrapItem && currentTrapItem.onLeave) {
    currentTrapItem.onLeave()
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
  leaveCurrent()
  const firstItem = trapHistory[0]
  trapHistory = []
  currentTrapItem = undefined
}

export const TrapHistoryMixin: ComponentOptionsMixin = {
  mounted() {
    const trapItem: TrapItem = {
      instance: this,
      activeElement: undefined,
      onEnter: (): void => {
        this.$nextTick(() => {
          if (trapItem.activeElement) {
            trapItem.activeElement.focus()
          }
        })
      },
      onLeave: (): void => {
        trapItem.activeElement = document.activeElement as HTMLElement
      }
    }
    push(trapItem)
    this.trapItem = trapItem
  },
  unmounted() {
    remove(this.trapItem)
  }
}