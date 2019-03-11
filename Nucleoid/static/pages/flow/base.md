# Base

**定義Base是一門藝術。**

`Base`是每次執行`Transcription`所產生的一個空物件，它將在整個生命週期中被傳遞，直到最後被輸出。

>相比this，請相信base

---

## 遺傳因子

`genetic`是初始化`base`的表現，它所return的值會在進入流程開始前注入`base`。

### 定義

```js
gene.setGenetic(() => {
    return {
        count: 0
    }
})
```

### Template表現

```js
gene.template('conut plus1', (base, skill, next, exit, fail) => {
    base.count += 1
    next()
})

gene.template('conut plus2', (base, skill, next, exit, fail) => {
    base.count += 1
    console.log(base.count) // 2
    next()
})
```

---

## 保護鹼基

在宣告genetic時，參數名稱加入`$`字號便會受到保護，受保護的鹼基既不能修改，也不能被追蹤。

```js
gene.setGenetic(() => {
    return {
        $onlyFalse: false
    }
})

gene.template('impossible', (base, skill, next, exit, fail) => {
    base.$onlyFalse = true // throw error
    next()
})

```

---

## Case

當你在流程中每個動作輸出`this`時會得到一個名為`case`的物件，`this`一樣會伴隨整個流程，但不會被擲出。

---

_Base(鹼基)是建立DNA的基本單位_