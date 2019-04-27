const ids: any = {}
let id = 0

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run(
  id: number,
  ...[handler, interval = 0]: Parameters<typeof setPromiseInterval>
) {
  while (true) {
    if (!ids.hasOwnProperty(id)) {
      break
    }
    const startTime = new Date().getTime()
    await handler()
    await delay(interval - new Date().getTime() + startTime)
  }
}

export function clearPromiseInterval(intervalId: number) {
  delete ids[intervalId]
}

export default function setPromiseInterval(
  handler: (...args: any[]) => Promise<any>,
  interval?: number,
) {
  id += 1
  ids[id] = null
  run(id, handler, interval)
  return id
}
