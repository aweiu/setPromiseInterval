const clearTasks = new Map<
  number,
  null | { promise: Promise<any>; resolve: () => any }
>()
let id = 0

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run(
  id: number,
  ...[handler, interval = 0]: Parameters<typeof setPromiseInterval>
) {
  while (true) {
    const task = clearTasks.get(id)
    if (task) {
      clearTasks.delete(id)
      task.resolve()
      break
    }
    const startTime = new Date().getTime()
    await handler()
    await delay(interval - new Date().getTime() + startTime)
  }
}

export function clearPromiseInterval(intervalId?: number) {
  if (typeof intervalId === 'number' && clearTasks.has(intervalId)) {
    const task = clearTasks.get(intervalId)
    if (!task) {
      let _resolve
      const promise = new Promise((resolve) => (_resolve = resolve))
      // @ts-ignore
      clearTasks.set(intervalId, { resolve: _resolve, promise })
    }
    // @ts-ignore
    return clearTasks.get(intervalId).promise
  }
  return Promise.resolve()
}

export default function setPromiseInterval(
  handler: (...args: any[]) => Promise<any>,
  interval?: number,
) {
  id += 1
  clearTasks.set(id, null)
  run(id, handler, interval)
  return id
}
