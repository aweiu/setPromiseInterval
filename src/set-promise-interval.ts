const clearResolves = new Map<number, () => any>()
let id = 0

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run(
  id: number,
  ...[handler, interval = 0]: Parameters<typeof setPromiseInterval>
) {
  while (true) {
    const clearResolve = clearResolves.get(id)
    if (clearResolve) {
      clearResolves.delete(id)
      clearResolve()
      break
    }
    const startTime = new Date().getTime()
    await handler()
    await delay(interval - new Date().getTime() + startTime)
  }
}

export function clearPromiseInterval(intervalId?: number) {
  return typeof intervalId === 'number'
    ? new Promise((resolve) => clearResolves.set(intervalId, resolve))
    : Promise.resolve()
}

export default function setPromiseInterval(
  handler: (...args: any[]) => Promise<any>,
  interval?: number,
) {
  id += 1
  run(id, handler, interval)
  return id
}
