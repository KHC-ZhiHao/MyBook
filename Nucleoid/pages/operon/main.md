# Operon

**不只處裡Request Response**

在運行`Cloud Function`時，呼叫端不一定來自客戶端，更多的是定時器、topic等event，他們得各自處裡自己的行為，但仍然有些共用的接口，`Operon`就是為了統一IO而生。

---

## 定義IO

```js
class IO {
    constructor(context) {
        this.context = context
        this.message = ''
        this.success = false
        this.complete = false
    }

    get() {
        return this.context
    }

    set(success, message) {
        this.success = success
        this.message = message
        this.complete = true
    }

    done() {
        return 'complete'
    }

    getMessage() {
        return this.message
    }

    isComplete() {
        return this.complete
    }
}

class Request extends IO {
    constructor(context) {
        super(context)
    }

    // Request的done處裡了response
    done() {
        return {
            statusCode: this.success,
            body: this.message
        }
    }
}

class Event extends IO {
    constructor(context) {
        super(context)
    }
}
```

定義Operon：

* structure: 規定必須要有的接口，當宣告use時也只會獲取這些接口。
* units: 必須是個constructor，乘載所有可能的class。

```js
let operon = Nucleoid.createOperon({
    structure: ['set', 'isComplete', 'get', 'getMessage'],
    units: {
        request: Request,
        event: Event
    }
})

// 藉由遺傳引入operon
gene.setGenetic(() => {
    return {
        $io: operon.use('request')
    }
})

// 當io被設定後跳出
gene.setElongation((base, exit, fail) => {
    if (base.$io.isComplete()) {
        exit()
    }
})

let messenger = await gene.transcription()
return messenger.$io.done()
```

---

### Context

`Operon`使用時可以傳入一個物件，這個物件會藉由context傳入每個實例化的constructor。

```js
class Context{
    constructor(context) {
        console.log(context.data.foo) // bar
    }
}

let operon = Nucleoid.createOperon({
    structure: [],
    units: {
        context: Context
    }
})

operon.use('context', {
    foo: 'bar'
})
```

---

_操縱基因是DNA的一節能調控與操縱子連結的結構基因的活動，這種調控是透過獨特阻遏基因或活躍基因的相互作用。這是一個調控過程將基因「關掉」或「開啟」。_