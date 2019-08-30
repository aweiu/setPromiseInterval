const runningTasks = new Set<number>()
const runningHandlers = new Map<number, Promise<any>>()

let id = 0

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run(
  id: number,
  ...[handler, interval = 0]: Parameters<typeof setPromiseInterval>
) {
  while (runningTasks.has(id)) {
    const startTime = new Date().getTime()
    runningHandlers.set(id, handler())
    try {
      await runningHandlers.get(id)
    } catch (e) {
      throw e
    } finally {
      runningHandlers.delete(id)
    }
    await delay(interval - new Date().getTime() + startTime)
  }
}

export async function clearPromiseInterval(intervalId?: number) {
  if (typeof intervalId === 'number' && runningTasks.has(intervalId)) {
    if (runningHandlers.has(intervalId)) {
      await runningHandlers.get(intervalId)
    }
    runningTasks.delete(intervalId)
  }
}

export default function setPromiseInterval(
  handler: (...args: any[]) => Promise<any>,
  interval?: number,
) {
  id += 1
  runningTasks.add(id)
  run(id, handler, interval)
  return id
}
