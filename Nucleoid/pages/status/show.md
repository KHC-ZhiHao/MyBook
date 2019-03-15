# Status Data

**有狀態了，然後呢？**

`Status`是一個物件，而不是一個`export`出某些對外的API，這意味著你可以嘗試解讀輸出的狀態，而`Status`本身也有幾個API可以幫助你建立介面或直接產生介面。

---

## get

`get`會歷遍當下`status`對象以下的所有子節點，回傳一個結果物件。

```js
var gene = Nucleoid.createGene('look status')

gene.template('add status', (base, enzy, next) => {
    enzy.setStatusAttr('show', 'hello.')
    next()
})

gene.transcription().then((messenger) => {
    console.log(JSON.stringify(messenger.status.get(), null, 4))
})
```

以下是輸出root status的資料

```json
{
    "name": "look status",
    "type": "root",
    "detail": {
        "operationTime": 12
    },
    "message": "",
    "success": true,
    "attributes": {},
    "children": [
        {
            "name": "add status",
            "type": "template",
            "detail": {
                "operationTime": 0
            },
            "message": "",
            "success": true,
            "attributes": {
                "say": "hello."
            },
            "children": []
        }
    ]
}
```

---

## json

`json()`是取得`get`之後轉換成`json`字串，但與直接`stringify`不同的是，該function會檢查是否有迴圈結構。

```js
var gene = Nucleoid.createGene('look json')

gene.template('add status', (base, enzy, next) => {
    let loop = {}
    loop.target = loop
    enzy.setStatusAttr('show', loop)
    next()
})

gene.transcription().then((messenger) => {
    console.log(messenger.status.json())
})
```

輸出：

```json
{
    "name": "look json",
    "type": "root",
    "detail": {
        "operationTime": 12
    },
    "message": "",
    "success": true,
    "attributes": {},
    "children": [
        {
            "name": "add status",
            "type": "template",
            "detail": {
                "operationTime": 0
            },
            "message": "",
            "success": true,
            "attributes": {
                "show": {
                    "target": "Circular structure object." // 這個循環結構被阻擋掉了
                }
            },
            "children": []
        }
    ]
}
```

---

## html

看這函數名就知道尊爵不凡，它能產生一組簡單的HTML，提升最終狀態的可視度。

```js
var gene = Nucleoid.createGene('look html')

gene.template('add status', (base, enzy, next) => {
    let loop = {}
    loop.target = loop
    enzy.setStatusAttr('show', loop)
    next()
})

gene.transcription().then((messenger) => {
    document.body.innerHTML = messenger.status.html()
})
```
輸出：

<div style="padding:5px; margin: 5px; border:solid 1px blue">
    <div>type : root</div>
    <div>name : look json</div>
    <div>detail :
        <pre>{
    "operationTime": 13
}</pre>
    </div>
    <div style="padding:5px; margin: 5px; border:solid 1px blue">
        <div>type : template</div>
        <div>name : add status</div>
        <div>detail :
            <pre>{
    "operationTime": 1
}</pre>
        </div>
        <div> attributes(show) :
            <pre>{
    "target": "Circular structure object."
}</pre>
        </div>
    </div>
</div>

---

## Error Status

如果該模板執行`fail`或宣告錯誤，該模板會呈現錯誤狀態。

### 當節點有錯誤

```js
var gene = Nucleoid.createGene('look error')

gene.template('success', (base, enzy, next, exit, fail) => {
    next()
})

gene.template('fail', (base, enzy, next, exit, fail) => {
    // 宣告fail會擲出錯誤狀態
    fail('fail test')
    // 在try-catch-mode底下這樣也會擲出錯誤狀態
    let a = 5
    a()
})

gene.transcription().catch((messenger) => {
    document.body.innerHTML = messenger.status.html()
})
```

輸出：

<div style="padding:5px; margin: 5px; border:solid 1px red">
    <div>type : root</div>
    <div>name : look json</div>
    <div>message : <br>
        <pre>fail test</pre>
    </div>
    <div>detail :
        <pre>{
    "operationTime": 11
}</pre>
    </div>
    <div style="padding:5px; margin: 5px; border:solid 1px blue">
        <div>type : template</div>
        <div>name : success</div>
        <div>detail :
            <pre>{
    "operationTime": 0
}</pre>
        </div>
    </div>
    <div style="padding:5px; margin: 5px; border:solid 1px red">
        <div>type : template</div>
        <div>name : fail</div>
    </div>
</div>

### 只取得錯誤狀態

有時候會發現整包`status`太大包了，有時候我們只需要post一些訊息給`slack`之類的推播系統。

```js
// 該函數可以得到平面化的錯誤資料
var gene = Nucleoid.createGene('look error')

gene.template('success', (base, enzy, next, exit, fail) => {
    next()
})

gene.template('fail', (base, enzy, next, exit, fail) => {
    fail('fail test')
})

gene.transcription().catch((messenger) => {
    // status[0]是root，抓它形同抓整組出來
    console.log(status.getErrorStatus().slice(1))
})
```

輸出：

```js
[
    {
        "name": "fail",
        "type": "template",
        "detail": null,
        "message": "",
        "success": false,
        "attributes": {},
        "children": []
    }
]
```

---

