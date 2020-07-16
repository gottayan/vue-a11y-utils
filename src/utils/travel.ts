import { getCurrentInstance, ComponentOptionsMixin } from 'vue'
import { endedEvents } from './shared'

// Type defs

type Vue = any

type NameMap = Record<string, string>

export type TravelOptions = TravelConfig | Record<string, TravelConfig>

export type TravelConfig<T = any> = {
  orientation?: string
  looped?: boolean
  hasPagination?: boolean
  hasSearch?: boolean

  getIndex(vm: Vue): number
  setIndex(vm: Vue, index: number): void
  getItems(vm: Vue): Array<T>

  move?(vm: Vue, event: KeyboardEvent, newIndex: number, oldIndex: number, items: Array<T>): boolean
  search?(vm: Vue, event: KeyboardEvent, keyword: string, index: number, items: Array<T>): boolean
  nextPage?(vm: Vue, event: KeyboardEvent, index: number, items: Array<T>): boolean
  prevPage?(vm: Vue, event: KeyboardEvent, index: number, items: Array<T>): boolean

  action?(vm: Vue, event: KeyboardEvent, index: number, items: Array<T>): boolean
  enter?(vm: Vue, event: KeyboardEvent, index: number, items: Array<T>): boolean
  space?(vm: Vue, event: KeyboardEvent, index: number, items: Array<T>): boolean
  esc?(vm: Vue, event: KeyboardEvent, index: number, items: Array<T>): boolean
}

type keyboardMethod = (vm: Vue, event: KeyboardEvent, config: TravelConfig) => void

type HandleTravel = (event: KeyboardEvent) => void

// Type helpers

const parseTravelConfig = (
  travelOptions?: TravelOptions,
  name: string = 'default'
): TravelConfig | undefined => {
  if (!travelOptions) {
    return
  }
  if (isSingleConfig(travelOptions)) {
    return travelOptions
  }
  if (name === 'default') {
    return travelOptions[name]
  }
}

const isSingleConfig = (travelOptions: TravelOptions): travelOptions is TravelConfig => {
  return typeof travelOptions.getItems === 'function'
}

// Constants

const defaultKeyToMethod: NameMap = {
  Home: 'first',
  End: 'last',
  Enter: 'enter',
  ' ': 'space',
  Escape: 'esc'
}

const verticalKeyToMethod: NameMap = {
  ArrowUp: 'prev',
  ArrowDown: 'next'
}

const horizontalKeyToMethod: NameMap = {
  ArrowLeft: 'prev',
  ArrowRight: 'next'
}

const paginationKeyToMethod: NameMap = {
  PageUp: 'prevPage',
  PageDown: 'nextPage'
}

// Implementation

const prev: keyboardMethod = (vm, event, config) => {
  const index = config.getIndex(vm)
  const items = config.getItems(vm)
  const length = items.length
  if (typeof config.move === 'function' && length > 0) {
    if (length === 1 && index === 0) {
      return
    }
    let newIndex = index === -1 ? length - 1 : index - 1
    if (config.looped && index === 0) {
      newIndex = length - 1
    }
    config.move(vm, event, newIndex, index, items) && endedEvents.add(event)
  }
}

const next: keyboardMethod = (vm, event, config) => {
  const index = config.getIndex(vm)
  const items = config.getItems(vm)
  const length = items.length
  if (typeof config.move === 'function' && length > 0) {
    if (length === 1 && index === 0) {
      return
    }
    let newIndex = index + 1
    if (config.looped && newIndex === length) {
      newIndex = 0
    }
    config.move(vm, event, newIndex, index, items) && endedEvents.add(event)
  }
}

const first: keyboardMethod = (vm, event, config) => {
  const index = config.getIndex(vm)
  const items = config.getItems(vm)
  const length = items.length
  if (typeof config.move === 'function' && length > 0 && index !== 0) {
    config.move(vm, event, 0, index, items) && endedEvents.add(event)
  }
}

const last: keyboardMethod = (vm, event, config) => {
  const index = config.getIndex(vm)
  const items = config.getItems(vm)
  const length = items.length
  if (
    typeof config.move === 'function' &&
    length > 0 &&
    index !== length - 1
  ) {
    config.move(vm, event, length - 1, index, items) && endedEvents.add(event)
  }
}

const prevPage: keyboardMethod = (vm, event, config) => {
  const index = config.getIndex(vm)
  const items = config.getItems(vm)
  const length = items.length
  if (typeof config.prevPage === 'function' && length > 0) {
    config.prevPage(vm, event, index, items) && endedEvents.add(event)
  }
}

const nextPage: keyboardMethod = (vm, event, config) => {
  const index = config.getIndex(vm)
  const items = config.getItems(vm)
  const length = items.length
  if (typeof config.nextPage === 'function' && length > 0) {
    config.nextPage(vm, event, index, items) && endedEvents.add(event)
  }
}

const enter: keyboardMethod = (vm, event, config) => {
  const index = config.getIndex(vm)
  const items = config.getItems(vm)
  const length = items.length
  if (typeof config.action === 'function' && length > 0) {
    config.action(vm, event, index, items) && endedEvents.add(event)
  }
  if (!endedEvents.has(event) && typeof config.enter === 'function' && length > 0) {
    config.enter(vm, event, index, items) && endedEvents.add(event)
  }
}

const space: keyboardMethod = (vm, event, config) => {
  const index = config.getIndex(vm)
  const items = config.getItems(vm)
  const length = items.length
  if (typeof config.action === 'function' && length > 0) {
    config.action(vm, event, index, items) && endedEvents.add(event)
  }
  if (!endedEvents.has(event) && typeof config.space === 'function' && length > 0) {
    config.space(vm, event, index, items) && endedEvents.add(event)
  }
}

const esc: keyboardMethod = (vm, event, config) => {
  const index = config.getIndex(vm)
  const items = config.getItems(vm)
  const length = items.length
  if (typeof config.esc === 'function' && length > 0) {
    config.esc(vm, event, index, items) && endedEvents.add(event)
  }
}

const methodMap: Record<string, keyboardMethod> = {
  prev, next, first, last, prevPage, nextPage, enter, space, esc
}

const handleTravel = (event: KeyboardEvent, config: TravelConfig, vm: any = getCurrentInstance()): void => {
  if (endedEvents.has(event)) {
    return
  }

  // get the current key and corresponding method
  const keyToMethod: NameMap = Object.assign(
    {},
    defaultKeyToMethod,
    config.orientation === 'horizontal'
      ? horizontalKeyToMethod
      : verticalKeyToMethod,
    config.hasPagination ? paginationKeyToMethod : {}
  )
  const methodName: string = keyToMethod[event.key]

  // make sure what to do next
  const method = methodMap[methodName]
  if (typeof method === 'function') {
    method(vm, event, config)
  }

  // make sure whether to search
  if (config.hasSearch && typeof config.search === 'function') {
    let keyword = ''
    if (event.key.match(/^Digit\d$/)) {
      keyword = event.key.substr(5)
    } else if (event.code.match(/^Key\w$/)) {
      keyword = event.code.substr(3).toLowerCase()
    }
    if (keyword) {
      config.search(
        vm,
        event,
        keyword,
        config.getIndex(vm),
        config.getItems(vm)
      ) && endedEvents.add(event)
    }
  }
}

// Exports

export const useKeyboardTravel = (config: TravelConfig): HandleTravel => event => handleTravel(event, config)

export const useKeyboardTravelMixin = (methodName: string = 'bindTravel', options: TravelOptions): ComponentOptionsMixin => {
  return {
    methods: {
      [methodName](event: KeyboardEvent, name: string = 'default'): void {
        const config = parseTravelConfig(options, name)
        if (config) {
          handleTravel(event, config, this)
        }
      }
    }
  }
}
