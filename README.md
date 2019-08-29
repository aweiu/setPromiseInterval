# set-promise-interval

用于定时执行异步任务，调用方式类似原生 setInterval

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
// clearPromiseInterval 会返回一个 Promise，你可以由此来判断是否一个异步定时器被真正终止了
clearPromiseInterval(intervalId).then(() => console.log('stop'))
```

### 其他

值得一提的是本插件的间隔处理，假设代码如下：

```
setPromiseInterval(somePromiseFun, 3000)
```

- 假设上次 somePromiseFun 的执行用了 1 秒，那下次的执行只会间隔 2s
- 假设上次 somePromiseFun 的执行用了 4 秒，会立即执行下次
- 首次会立即执行，原生 setInterval 需要等 3 秒

也就是说插件不会傻乎乎地在上次异步任务结束后严格等待你传入的那个间隔数，而是会尽量贴近它
