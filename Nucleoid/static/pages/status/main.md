# Status

**一切都是為了追蹤狀態而生**

在講述細節前，需要先了解狀態，狀態是`Nucleoid`的主幹，`Gene`大部分的表現都會建立狀態，這些狀態會依序堆疊再一起，直到`Transcription`結束後擲出。

這是難以繼續使用`async.js`的主因，在`Lambda`上要追蹤整個過程實在太過困難。

---

## 編譯過後的JS

身為JS專家的你，我相信對於`babel`和`eslint`、`uglify`都不陌生，這些好用的工具經常伴隨著`webpack`、`CI/CD`一起運作，`serverless`也不例外。

以下是經常出現在cloud watch log的錯誤訊息：

```json
{
    "errorMessage": "a is not a function",
    "errorType": "TypeError",
    "stackTrace": [
        "update (/var/task/functions/index.js:1989:9)"
    ]
}
```

**變數名稱：不可考**

**錯誤行數：不可考**

![黑人問號](../../images/wtf.jpg)

---

## 所有行為都有狀態

所有狀態的注入都是被動行為，在每一塊`template`運行時就會產生專屬的`status`物件，並把當下的表現綁定在該`status`中。

```js
var gene = Nucleoid.createGene()

gene.template('template1', (base, skill, next) => {
    // 這兩塊都有各自的status物件，但無法在這觀測它
    next()
})

gene.template('template2', (base, skill, next) => {
    // 這兩塊都有各自的status物件，但無法在這觀測它
    next()
})
```

---

## 手動加入註記

`template`中只能藉由下列兩支API添加參考給`status`。

> skill是一個小型函式庫，後面的章節會介紹。

```js
skill.setStatusAttr(key, value)
skill.setRootStatusAttr(key, value)
```

```js
gene.template('template1', (base, skill, next) => {
    // 註記當下的Status
    skill.setStatusAttr('now', 'now status.')
    // 註記源頭Status
    skill.setRootStatusAttr('root', 'hello root.')
    next()
})
```

---

## 特殊表現下的Status

### termination

`termination`的執行會配給一個`status`作為參數，它是所有`status`樹中的最外層，也就是root status。

```js
gene.setTermination((base, status) => {
    if (base.$error) {
        status.addAttr('error', base.$error)
    }
})
```

### traceBaseMode

`traceBaseMode`則會得到當下狀態和一個clone base。

```js
gene.setTraceBaseMode(true, (cloneBase, status) => {
    status.addAttr('base', cloneBase)
})
```
