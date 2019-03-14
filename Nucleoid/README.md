![logo](./images/logo.png)

`Nucleoid`是一個流程控制函式庫，基本靈感來自`Async`函式庫，基本上如果你熟悉`Async.js`，那你很快就能上手。

[![npm][npm-image]](https://npmjs.org/package/nucleoid)
[![github][github-image]](https://github.com/KHC-ZhiHao/Nucleoid)

[Document](https://khc-zhihao.github.io/Nucleoid/document/document.html)

[Version Log](https://github.com/KHC-ZhiHao/Nucleoid/blob/master/document/version.md)

[Example](https://github.com/KHC-ZhiHao/Nucleoid/blob/master/example)

---

## 目的

當你使用`AWS Lambda` + `API Gateway`‎建立一個標準的無伺服器架構來扮演後端的腳色時，你會發現你需要串接大量的`AWS`服務，此時使用大量的`await`會使程式變得非常慢，不使用code又不能看，`Nucleoid`為你提供了一個簡易良好的**流程控制**系統。

---

## 安裝

> 支援環境有 Nodejs 8+ or support ES6 browser.

##### web

```html
<script src="https://khc-zhihao.github.io/Nucleoid/dist/index.js"></script>
```

##### webpack

```js
import Nucleoid from 'nucleoid'
```

##### nodejs

```js
var Nucleoid = require('nucleoid')
```
---

## 流程控制

在寫出`Nucleoid`之前，我使用了`async.js`。

這是一個非常棒的函式庫，給了我許多初步的概念。

`Nucleoid`的整體改念來自`waterfall` :

```js
async.waterfall([
    function(next) {
        next()
    },
    function(rst1, next) {
        next()
    },
], function(err, rst){
    // do something...
})
```

---

## Packhouse

[![NPM Version][pk-npm-image]](https://www.npmjs.com/package/packhouse)
[![github][pk-github-image]](https://github.com/KHC-ZhiHao/Packhouse)

`Packhouse`是一支細粒化函式的類函式導向library，他會是你使用`Nucleoid`的好夥伴。

```js
let Packhouse = require('packhouse')
let factory = new Packhouse()
gene.setGenetic(() => {
    return {
        $fn: factory,
    }
})
```

---

_Nucleoid命名來自原核細胞，中文為擬核，是儲藏GENE的地方。_

[github-image]: https://img.shields.io/github/stars/KHC-ZhiHao/Nucleoid.svg?style=social

[npm-image]: https://img.shields.io/npm/v/nucleoid.svg

[pk-github-image]: https://img.shields.io/github/stars/KHC-ZhiHao/Packhouse.svg?style=social

[pk-npm-image]: https://img.shields.io/npm/v/packhouse.svg