# Gene

**Gene是一切的開始。**

`Gene`是Nucleoid的主核心，我們用`Gene`定義整個流程的表現，建立了一個完整的生命週期，基因模擬了Step、中介處理、追蹤、錯誤處理、愈時處理等，並在執行`Transcription`的過程中呼應這些行為。

```js
Nucleoid.createGene('my first gene')
```

---

## 定義你的表現

表現基本上是一個設定模型，這邊只大致上介紹這些模型的功能與語法，詳情後續會介紹。

`createGene`可以接收兩個參數，一個是基因名，另一個是表現選項。

```js
Nucleoid.createGene(geneName, options)
```

有些表現會有自己獨立的屬性，但全部的表現(templates除外)都有以下這幾種配置：

```js
option = {
    enable: 'boolean', // require 是否啟用
    action: 'function', // require，執行表現
    protect: 'boolean' // 是否保護，如果有，再被宣告一次會擲出錯誤
}
```

##### example :

```js
var gene = Nucleoid.createGene('my first gene', {

    timeoutMode: {
        ms: 30000,
        enable: true,
        protect: true,
        action: (base, exit, fail) => {
            // 如果該次Transcription的時間太長時執行該表現。
        }
    },

    catchMode: {
        enable: true,
        protect: true,
        action: (base, exception, exit, fail) => {
            // 檢查每隻template是否有語法錯誤，有則執行該行為。
        }
    },

    uncaughtCatchMode: {
        enable: true,
        protect: true,
        action: (base, exception, exit, fail) => {
            // 檢查每隻template是否有未捕捉的語法錯誤，有則執行該行為。
        }
    },

    traceBaseMode: {
        enable: true,
        protect: true,
        action: (cloneBase, status) => {
            // 追蹤template執行完成後的鹼基變化。
        }
    },

    initiation: {
        enable: true,
        protect: true,
        action: (base, enzy, next, exit, fail) => {
            // 初始化行為
        }
    },

    elongation: {
        enable: true,
        protect: true,
        action: (base, exit, fail) => {
            // 延長行為
        }
    },

    termination: {
        enable: true,
        protect: true,
        action: (base, status) => {
            // 末端行為
        }
    },

    genetic: {
        enable: true,
        protect: true,
        action: () => {
            // 定義遺傳因子
        }
    },

    templates: {
        'first template': (base, enzy, next, exit, fail) => {
            // 定義模板
        }
    }

})
```

---

## 執行基因

`Transcription`是基於`promise`運行的，宣告時便會執行所有`Gene`定義的行為，以下是一段AWS Lambda的例子：

```js
exports.handler = async(event, context, callback) => {
    var gene = Nucleoid.createGene('my first gene')

    gene.template('create hello template', (base, enzy, next) => {
        base.result = 'hello '
        next()
    })

    gene.template('create world template', (base, enzy, next) => {
        base.result += 'world.'
        next()
    })

    let messenger = await gene.transcription()
    return messenger.base.result // hello world.
}
```

---

_Gene指的是一段DNA序列，這段序列能夠表現出特定的行為_