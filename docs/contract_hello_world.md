---
id: contract_hello_world
title: BUMO 智能合约（hello world）
sidebar_label: 智能合约（hello world）
---

## 概述
合约是一段`JavaScript`代码,标准(`ECMAScript` as specified in `ECMA-262`)。合约的初始化函数是`init`, 执行的入口函数是`main`函数，您写的合约代码中必须有`init`和`main`函数的定义。该函数的入参是字符串`input`，是调用该合约的时候指定的。

- 详细的合约的介绍，请看[合约](introduction_to_smart_contract)。
- 详细的合约的语法，请看[合约语法]()。
- 详细的合约编辑器的用户手册，请看[合约编辑器的介绍](introduction_to_smart_contract)。

下面的示例是在[合约编辑器](https://cme.bumo.io)下来实现的。



## 智能合约（hello world）

　　下面通过一个简单的示例来介绍一下合约的使用。



### 合约代码

- 合约源码

编辑一段合约代码，如下：

```javascript
"use strict";
function init(bar)
{
  assert(typeof bar === 'string' && bar.length > 0, 'The param of init must be a not empty string');
  storageStore(bar, 'init : ' + bar);
}

function main(input)
{
  assert(typeof input === 'string' && input.length > 0, 'The param of main must be a not empty string');
  storageStore(input, 'main : ' + input);
}

function query(input)
{ 
  assert(typeof input === 'string' && input.length > 0, 'The param of query must be a not empty string');
  return storageLoad(input);
}
```

- 简单介绍

  `assert`：全局函数，断言，当第一个参数的条件不满足时，则抛出第二个参数的字符串内容。

  `storageStore`：全局函数，将指定的key-value对保存到区块链中。key是第一个参数，value是第二个参数。

- 效果展示
<img src="/docs/assets/contractcodehelloworld.png" style= "margin-left: 20px">



### 发布合约

- 操作

  该操作是点击界面右侧的Deploy按钮来完成的。Deploy按钮上的编辑框用来输入init函数参数。

- 函数运行

  该操作会运行合约代码中的init函数，init函数有一个参数bar。

  在执行init函数第一行代码时，发现参数bar不能空，且必须是字符串。

- 函数参数

  在Deploy按钮上的编辑框中输入`hello`.

- 运行效果

  点击Deploy按钮，效果如下：
  <img src="/docs/assets/contractdeploy.png" style= "margin-left: 20px">



### main函数

- 操作

  点击界面右下边的main标签，此时下方的编辑框是用来输入main函数参数，再下面还有一个编辑器，此处是输入待转移给合约账户的BU的数量。

- 函数运行

  该操作会运行合约代码中的main函数，main函数有一个参数input。

  在执行main函数第一行代码时，发现参数input不能空，且必须是字符串。

- 函数参数

  在main下的第一个编辑框中输入`world`.

- 运行效果

  点击最下面的Invoke按钮，运行效果如下：

  <img src="/docs/assets/contractmain.png" style= "margin-left: 20px">



### query函数

- 操作

  点击界面右下边的query标签，此时下方的编辑框是用来输入query函数参数。

- 函数运行

  该操作会运行合约代码中的query函数，query函数有一个参数input。

- 函数参数

  在query下的编辑框中输入`hello`。

- 运行效果

  点击最下面的Invoke按钮，运行效果如下：

  <img src="/docs/assets/contractquery.png" style= "margin-left: 20px">