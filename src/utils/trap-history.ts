export type TrapItem = {
  instance: any
  activeElement?: HTMLElement
  onFocus?: () => void
  onBlur?: () => void
}

let currentTrapItem: TrapItem | undefined
export const getCurrent = (): TrapItem | undefined => currentTrapItem

let trapHistory: TrapItem[] = []
export const getList = (): TrapItem[] => [...trapHistory]

const blurCurrent = (): void => {
  if (currentTrapItem && currentTrapItem.onBlur) {
    currentTrapItem.onBlur()
  }
}

const focusCurrent = (): void => {
  if (currentTrapItem && currentTrapItem.onFocus) {
    currentTrapItem.onFocus()
  }
}

export const push = (item: TrapItem): void => {
  blurCurrent()
  trapHistory.push(item)
  currentTrapItem = item
  focusCurrent()
}

export const replace = (item: TrapItem): TrapItem | undefined => {
  if (item === trapHistory[trapHistory.length - 1]) {
    return
  }
  blurCurrent()
  const previousItem = trapHistory.pop()
  trapHistory.push(item)
  currentTrapItem = item
  focusCurrent()
  return previousItem
}

export const remove = (item: TrapItem): void => {
  const lastItem = trapHistory[trapHistory.length - 1]
  trapHistory = trapHistory.filter(existingItem => existingItem.instance !== item.instance)
  currentTrapItem = trapHistory[trapHistory.length - 1]
  if (lastItem !== currentTrapItem) {
    lastItem.onBlur && lastItem.onBlur()
    focusCurrent()
  }
}

export const goto = (item: TrapItem): void => {
  const index = trapHistory.indexOf(item)
  if (index < 0 || index === trapHistory.length - 1) {
    return
  }
  blurCurrent()
  trapHistory = trapHistory.slice(0, index)
  currentTrapItem = trapHistory[trapHistory.length - 1]
  focusCurrent()
}

export const clear = (): void => {
  blurCurrent()
  trapHistory = []
  currentTrapItem = undefined
}
