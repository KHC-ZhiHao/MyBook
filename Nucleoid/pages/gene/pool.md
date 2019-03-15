# Gene Pool

**適應各種模式。**

`Nucleoid`並不是框架，並沒有一套擴展的機制，但保留了一些接口協助模組化`Gene`。

---

## 使用isGene

使用require動態宣告引入的gene file，設定別名後清空模板確認是一組乾淨的Gene。

```js
// pool.js
module.exports = function(name, geneName) {
    let gene = require('./' + geneName)
    if (Nucleoid.isGene(gene)) {
        gene.setAlias(name)
        gene.clearTemplate()
        return gene
    } else {
        throw new Error('Not a gene.')
    }
}
```

---

## 建立兩支不同使命的Gene

### Event是針對cloud watch event呼叫的lambda對象

```js
// event.js

module.exports = Nucleoid.createGene('event', {

    timeoutMode: {
        ms: 60000,
        enable: true,
        action: (base, exit, fail) => {
            base.finish = true
        }
    },

    initiation: {
        enable: true,
        action: (base, enzy, next, exit, fail) => {
            base.finish = false
        }
    },

    elongation: {
        enable: true,
        action: (base, exit, fail) => {
            if (base.finish) {
                exit()
            }
        }
    }

})
```

---

### Request是針對api getway呼叫的lambda對象

```js
// request.js

module.exports = Nucleoid.createGene('request', {

    timeoutMode: {
        ms: 20000,
        enable: true,
        action: (base, exit, fail) => {
            base.body = 'time out'
            base.status = 408
        }
    },

    initiation: {
        enable: true,
        action: (base, enzy, next, exit, fail) => {
            base.body = ''
            base.status = null
        }
    },

    elongation: {
        enable: true,
        action: (base, exit, fail) => {
            if (base.status) {
                exit()
            }
        }
    },

    termination: {
        enable: true,
        action: (base, status) => {
            base.response = {
                statusCode: base.status,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(base.body)
            }
        }
    }

})
```

---

## 使用基因庫

我們已經成功定義了一個Gene Pool，接下來只要在宣告的接口指定我們要的`Gene`。

以下是一支藉由`api getway`請求2+2的結果的`lambda`。

```js
let pool = require('./pool')

exports.handler = async(event, context, callback) => {
    var gene = pool('2 + 2', 'request')
    
    gene.template('2 + 2', (base, enzy, next) => {
        base.body = 4
        base.status = 200
        next()
    })

    let messenger = await gene.transcription()
    return messenger.base.response
}
```

---

_gene pool(基因庫)是指同一種群中全部個體所含有的全部基因的集合，各式人種都來自人類基因庫_