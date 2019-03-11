# Mode

**監視每一步**

`Nucleoid`提供了幾種監聽模式，主要是讓測試環境能帶來更良好的回饋。

> 監聽模式非常消耗效能，請謹慎使用於正式環境上。

---

## Catch Exception Mode

啟用該模式會使所有的template都用try-catch的模式進行，抓到錯誤會加入一筆訊息至status並執行。

> 該模式必得宣告exit or fail，否則程序不會結束

```js
let enable = process.env.dev // true
gene.setCatchExceptionMode(enable, (base, exception, exit, fail) => {
    base.error = exception.message
    fail()
})

gene.template('test try-catch-mode', (base, skill, next, exit, fail) => {
    let a = 5
    a()
    next()
})

gene.transctiption().catch((messenger) => {
    cosnole.log(messenger.base.error) // a not a function
})
```

---

## Catch Uncaught Exception Mode

非同步進行的程式不會被try-catch給捕捉到，必須宣告該函數才有辦法更全面的監聽。

> 該模式必得宣告exit or fail，否則程序不會結束

```js
let enable = process.env.dev // true
gene.setCatchUncaughtExceptionMode(enable, (base, exception, exit, fail) => {
    base.error = exception.message
    fail()
})

gene.template('test uncaught-catch-mode', (base, skill, next, exit, fail) => {
    let a = 5
    setTimeout(() => {
        a()
        next()
    }, 500)
})

gene.transctiption().catch((messenger) => {
    cosnole.log(messenger.base.error) // a not a function
})
```

---

## 鹼基追蹤

`TraceBase`會在每次運行完`template`時宣告一次，並把複製的`base`和當下`template`的`status`帶到參數中。

```js
let enable = process.env.dev // true
gene.setTraceBaseMode(enable, (cloneBase, status) => {
    status.addAttr('trace base', cloneBase)
})
```

---

## 逾時處理

避免設定錯誤`template`沒有辦法往下進行，`timeout`可以強制跳脫整個流程。

```js
let ms = 20000
let enable = process.env.dev // true
gene.setTimeoutMode(enable, ms, (base, exit, fail) => {
    fail('Timeout')
})
```