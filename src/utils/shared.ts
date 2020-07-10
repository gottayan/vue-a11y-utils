export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const endedEvents = new WeakSet<KeyboardEvent>()
