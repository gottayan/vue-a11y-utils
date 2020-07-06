import { ComponentOptionsMixin } from 'vue'

let lastId = Date.now()

const generateNewId = (): string => {
  const now = Date.now()
  if (now <= lastId) {
    lastId++
  } else {
    lastId = now
  }
  return `vid-${lastId}`
}

export const useId = (externalId: string | undefined): string => externalId ? externalId.toString() : generateNewId()

export const useIdMixin = (externalName: string = 'id', internalName: string = 'localId'): ComponentOptionsMixin => {
  return {
    computed: {
      [internalName]() {
        return this[externalName]
      }
    }
  }
}

// deprecated
export const MixinId = useIdMixin()
