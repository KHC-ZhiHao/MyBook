# Template

**模板切的越細，系統可維護的程度就越高。**

模板負責主要的邏輯層，若以MVC架構來比喻，可以視為Controller的部分。

---

## API

建立模板有三種方法：

### 獨立建立一個模板

```js
gene.template('templateName', (base, skill, next, exit, fail) => {
    // do something...
    next()
})
```

### `Clone`模板

```js
let templates = {
    'templateName1': (base, skill, next, exit, fail) => {
        // do something...
        next()
    },
    'templateName2': (base, skill, next, exit, fail) => {
        // do something...
        next()
    }
}

gene.cloning(templates)
```

### 建立基因時產生模板

>這是一個接口，但不推薦使用這方法，定義表現跟定義邏輯因該分開。

```js
var gene = Nucleoid.createGene('template', {
    templates: {
        'templateName': (base, skill, next, exit, fail) => {
            // do something...
            next()
        }
    }
})
```

## 清空模板

`Gene`定義後大多是通用的，但模板不是，為了保險不被快取等狀態影響，在開始執行`transcription`時可以清空模板。

```js
gene.clearTemplate()
```

---

_Template(模板)是指DNA複製出mRNA的樣板_