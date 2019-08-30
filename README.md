# set-promise-interval

用于定时执行异步任务，调用方式类似原生 setInterval。

## 安装

```
npm install set-promise-interval --save
```

## 使用

```
// const { default: setPromiseInterval, clearPromiseInterval } = require('set-promise-interval')
import setPromiseInterval, { clearPromiseInterval } from 'set-promise-interval'

async somePromiseFun () {}

// 开始一个每隔 3秒（理想情况）的定时任务
const intervalId = setPromiseInterval(somePromiseFun, 3000)
// 停止该定时任务
clearPromiseInterval(intervalId)
// clearPromiseInterval 会返回一个 Promise，你可以等待它来确保没有异步任务在执行
clearPromiseInterval(intervalId).then(() => console.log('stop'))
```

## 特性

### 尽量保持间隔

```javascript
setPromiseInterval(somePromiseFun, 3000)
```

- 假设上次 somePromiseFun 的执行用了 1 秒，那下次的执行只会间隔 2s
- 假设上次 somePromiseFun 的执行用了 4 秒，会立即执行下次
- 首次会立即执行，原生 setInterval 需要等 3 秒

也就是说插件不会傻乎乎地在上次异步任务结束后严格等待你传入的那个间隔数，而是会尽量贴近它。

### 尽量早地「结束」

```javascript
function test() {
  return new Promise((resolve) => setTimeout(() => resolve(), 1000))
}

const id = setPromiseInterval(test, 3000)
setTimeout(async () => {
  await clearPromiseInterval(id)
}, 2000)
```

上面代码启动了一个**3**秒的定时器，而异步任务本身耗时为**1**秒。

然后我在**2**秒钟时调用结束定时任务，这时已经没有实际任务在执行了，所以 `clearPromiseInterval` 会立刻 resolve，而不是**1**秒后。

换句话说，`clearPromiseInterval` 只会等待正在进行的异步任务，一旦异步任务结束了，它就 resolve。
