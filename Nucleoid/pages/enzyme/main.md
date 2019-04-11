# Enzyme

**更直覺的API**

`enzyme`是一個微型函式庫，綁定在所有的template內，有些enzyme的行為甚至會被加進status內以便追蹤。

---

## Fragment

`fragment`是一個非同步發送的整合`enzyme`，所有的`frag`都有獨立的`status`並加入追蹤。

>add, setError, eachAdd會回傳frag本身。

### 可由這兩種方式建立

```js
enzy.frag(fragName)
enzy.createFragment(fragName)
```

```js
gene.template('demo frag', (base, enzy, next, exit, fail) => {
    base.count = 0
    // 使用add註冊一個片段
    enzy.frag('my first fragment')
        .add({
            name: 'add1',
            action(error, onload) {
                base.count += 1
                onload()
            }
        })
        .add({
            name: 'add2',
            action(error, onload) {
                base.count += 1
                if (base.count > 2) {
                    error('impossible')
                } else {
                    onload()
                }
            }
        })
        .activate((err) => {
            // 執行所有片段執行onload時呼叫callback，或有任何一個片段呼叫error也會執行callbakc，並把第一個參數帶入error傳出的message
            if (err) {
                console.error(err)
            } else {
                console.log(base.count) // 2
                next()
            }
        })
})
```

### SetError & SetSuccess

#### SetError

註冊一個錯誤事件，當宣告`error`後會呼叫一次該function。

```js
frag.setError((err) => {
    console.error(err)
})
```

#### SetSuccess

註冊一個成功事件，當所有程序都宣告`onload`時呼叫該function。

```js
frag.setSuccess(() => {
    console.log('success')
})
```

### EachAdd

可以針對一個物件或陣列進行`frag`的加入，協助優化程式碼。

```js
frag.eachAdd(target, name, action)
```

```js
gene.template('demo frag', (base, enzy, next, exit, fail) => {
    base.count = 0
    enzy.frag('each add demo')
        .setError(console.error)
        .eachAdd([1, 2, 3, 4], 'name', (data, index, err, onload) => {
            base.count += data
            onload()
        }).activate(() => {
            console.log(base.count) // 10
            next()
        })
})
```

---

## Auto

執行一個非同步的行為，但只在背景運行，在運行結束前`Transcription`不會結束。

`Auto`有獨立的`status`加入追蹤，除非被`uncaught-exception-mode`抓到或進入`timeout`，宣告error並不會強行進入`termination`。

>宣告error的auto會被宣告為錯誤status

```js
gene.template('demo auto', (base, enzy, next, exit, fail) => {
    enzy.auto({
        name: 'auto',
        action(error, onload) {
            setTimeout(() => {
                base.auto = true
                onload()
            }, 2000)
        }
    })
    next()
})

gene.transcription().then((messenger) => {
    // wait 2000ms
    console.log(messenger.base.atuo) // true
})
```

---

## AddBase

加入一個鹼基，這個接口提供了賦予`$`字號的保護機制。

```js
gene.template('use add base', (base, enzy, next, exit, fail) => {
    enzy.addBase('$foo', 'foo')
    base.$foo = 'bar' // throw error
    next()
})
```

---

## Cross

運行另一隻基因並且整合該基因的`status`。

```js
let gene1 = Nucleoid.createGene({
    templates: {
        'get_number': (base, enzy, next, exit, fail) => {
            base.number = 1
            next()
        }
    }
})

let gene2 = Nucleoid.createGene({
    templates: {
        'use cross': (base, enzy, next, exit, fail) => {
            enzy.cross(gene1, (err, messenger) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log(messenger.base.number) // 1
                }
                next()
            })
        }
    }
})

```

---

## Polling

設置一個背景反覆執行的function。

> `transcription`不會等待`polling`宣告`stop`才結束，而沒有宣告`stop`的`status`會宣告為錯誤。

```js
gene.template('use polling', (base, enzy, next, exit, fail) => {
    base.count = 0
    enzy.polling({
        name: 'polling',
        action(stop) {
            base.count += 1
            if (base.count === 10) {
                stop()
            }
        }
    })
    next()
})
```

---

## Each

一個普通的同步迭代器。

```js
gene.template('use each', (base, enzy, next, exit, fail) => {
    enzy.each([1, 2, 3, 4], (item, index) => {
        console.log(item) // 1,2,3,4
    })
    next()
})
```

## DeepClone

深拷貝一個物件。

```js
gene.template('use deep clone', (base, enzy, next, exit, fail) => {
    let obj = {
        a: {
            b: 5
        }
    }
    base.clone = enzy.deepClone(obj)
    base.clone.a.b = 10 // 10
    console.log(obj.a.b) // 5
    next()
})
```

---

## Scan

`scan`會接收一串function，當宣告`scan()`後會把所有註冊的function執行一次並賦予宣告的參數。

```js
gene.template('use scan', (base, enzy, next, exit, fail) => {
    let flow1 = (n) => { console.log(n) }
    let flow2 = (n, d) => { console.log(n * d) }
    let scan = enzy.scan(flow1, flow2, next)
    scan(10, 2) // log => 10, log => 20
})
```

---

## Pump

賦予一個數字，並每次呼叫時增加一點，直到宣告至該總數為止。

```js
gene.template('use pump', (base, enzy, next, exit, fail) => {
    let pump = enzy.pump(10, next)
    for (let i = 0; i < 10; i++) {
        pump()
    }
})
```

---

_Enzyme是一類大分子生物催化劑，能加快Transcription的進行_