---
id: atp_30
title: BUMO ATP 30 协议
sidebar_label: BUMO ATP 30 协议
---

## 简介

ATP 30(Account based Tokenization Protocol) 是“Non-Fungible Tokens”，英文简写为”NFT”，可以翻译为不可互换的Tokens。简单地说，就是每个Token都是独一无二的，是不能互换的；

**注意**：
- 在合约范围内tokenId是唯一的
- tokenId只能被一个owner(i.e. address) 所拥有
- 一个owner可以拥有多个NFTs，它的balance只记数量
- ATP 30提供approve, transfer, transferFrom 接口用于所属权转移


## 标准

### NTF ID

```
NTF ID，即tokenId，在合约中用唯一标识符，每个NFT的ID在智能合约的生命周期内不允许改变。推荐的实现方式有：从0开始，每新加一个NFT，NTF ID加1
```

## Token 属性

Token 属性可以通过合约的 `tokenInfo` 功能函数查询到，存储在智能合约的账号里。包含以下内容

| 变量         | 描述             |
| :----------- | ---------------- |
| id           | Token 惟一标识符 |
| owner        | Token 所有人     |
| description  | Token 描述       |
| creationTime | Token 创建时间   |

**注意**：

- id：从0开始，每创建一个Token，id递增1。
- description：字符串长度范围是 1 ~ 200k。

## 事件

函数issue、transfer，approve，transferFrom会触发事件，事件是调用tlog接口，在区块链上记录一条交易日志，该日志记录了函数调用详情，方便用户阅读。

tlog定义如下:

```
tlog(topic,args...);
```

- tlog会产生一笔交易写在区块上
- topic: 日志主题，必须为字符串类型,参数长度(0,128]
- args...: 最多可以包含5个参数，参数类型可以是字符串、数值或者布尔类型,每个参数长度(0,1024]

## 功能函数

BUMO ATP 30协议中的函数包括 [issue](#issue)、[totalSupply](#totalsupply)、[balanceOf](#balanceof)、[ownerOf](#ownerof)、[approve](#approve)、[transfer](#transfer)、[transferFrom](#transferfrom)、[tokensOfOwner](tokensofowner)、[tokenInfo](#tokeninfo)、[name](#name)、[symbol](#symbol)。

#### issue

- 发行新token。
- 入口函数 main。
- 参数json结构

```json
{
    "method":"issue",
    "params": {
        "description": "demo"
    }
}
```

description: Token的描述

- 函数

  ```js
  function issue(description)
  ```

- 返回值

  true 或者抛异常

- 事件：

```javascript
  tlog('issue', sender, tokenId, description);
```

topic: 方法名，这里是'issue'

sender:  合约调用账户地址

tokenId: 转移的tokenId

description：Token的描述

#### totalSupply

- 返回 发行的token的总数。
- 入口函数 query。
- 参数json结构

```json
{
    "method":"totalSupply"
}
```

- 函数：

  ```js
  function totalSupply()
  ```

- 返回值：

```json
{
    "result":{
        "type": "string",
        "value": {
            "totalSupply": "2"
        }
    }
} 
```

#### balanceOf

- 返回指定账户的 token的总和。
- 入口函数 query。
- 参数json结构

```json
{
    "method":"balanceOf",
    "params":{
        "address":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
}
```

address： 账户地址

- 函数：

  ```js
  function balanceOf(address)
  ```

- 返回值：指定地址的代币总和

```json
{
    "result":{
        "type": "number",
        "value": {
            "count": 1
        }
    }
} 
```

#### ownerOf

- 返回 token的拥有者。
- 入口函数 query。
- 参数json结构

```json
{
    "method":"ownerOf",
    "params": {
        "tokenId": 1
    }
}
```

- 函数：

  ```js
  function ownerOf(tokenId)
  ```

- 返回值：

```json
{
    "result":{
        "type": "string",
        "value": {
            "owner": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
        }
    }
} 
```

#### approve

- 授权账户 spender 可以从交易发送者账户转出指定TokenId 的token。只有token的拥有者才可以调用。
- 入口函数 main。

- 参数json结构

```json
{
    "method":"approve",
    "params":{
        "spender":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "tokenId": 2
    }
}
```

spender： 账户地址
tokenId： Token 标识符

- 函数

  ```js
  function approve(spender, tokenId)
  ```

- 返回值

  true 或者抛异常

- 事件：

```javascript
  tlog('approve', sender, spender, tokenId);
```

topic: 方法名，这里是'approve'

sender:  合约调用账户地址

spender: 被授权账户地址

tokenId: 转移的tokenId

#### transfer

- 转移指定tokenId的token 到目的地址 to，并且必须触发 log 事件。只有token的拥有者才可以调用。
- 入口函数 main。
- 参数 json 结构

```json
{
    "method":"transfer",
    "params":{
        "to":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "tokenId": 0
    }
}
```

to：目标账户地址
tokenId：Token 标识符

- 函数

  ```js
  function transfer(to, tokenId)
  ```

- 返回值

  true或者抛异常

- 事件：

  ```javascript
  tlog('transfer', sender, to, tokenId);
  ```

topic: 方法名，这里是'transfer'

sender:  合约调用账户地址

to: 目标账户地址

tokenId: 转移的tokenId

#### transferFrom

- 从from发送指定tokenId的 token 到 to，必须触发 log 事件。 在 transferFrom 之前，from 必须给当前交易的发起者进行授权额度(即approve操作)。只有token的授权地址才可以调用。
- 入口函数 main。

- 参数json结构

```json
{
    "method":"transferFrom",
    "params":{
        "from":"buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
        "to":"buQYH2VeL87svMuj2TdhgmoH9wSmcqrfBner",
        "tokenId": 1
    }
}
```

from： 源账户地址
to： 目标账户地址
tokenId： Token 标识符

- 函数

  ```js
  function transferFrom(from,to,tokenId)
  ```

- 返回值

  true或者抛异常

- 事件

```javascript
tlog('transferFrom', sender, from, to, tokenId);
```

topic: 方法名，这里是'transferFrom'

sender:  合约调用账户地址

from: 源账户地址

to: 目标账户地址

tokenId: 转移的tokenId

#### tokensOfOwner

- 返回 owner的所有token。
- 入口函数 query。
- 参数json结构

```json
{
    "method":"ownerOf",
    "params": {
        "owner": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
    }
}
```

- 函数：

  ```js
  function ownerOf(tokenId)
  ```

- 返回值：

```json
{
    "result":{
        "type": "Array",
        "value": {
            "tokens": [0, 2]
        }
    }
} 
```

#### tokenInfo

- 返回 Token 的基本信息。
- 入口函数 query。
- 参数json结构

```json
{
    "method":"tokenInfo",
    "params":{
        "tokenId": 0
    }
}
```

- 函数：

  ```js
  function tokenInfo(tokenId)
  ```

- 返回值：

```json
{
    "result":{
        "type": "string",
        "value": {
            "tokenInfo": {
                "title": "demo",
                "author": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
                "info": "demo",
                "creationTime": "135665626565612"
            }
        }
    }
} 
```

#### name

- 返回当前合约所含的代币集合的名称。
- 入口函数 query。
- 参数json结构

```json
{
    "method":"name"
}
```

- 函数：

  ```js
  function name()
  ```

- 返回值：

```json
{
    "result":{
        "type": "string",
        "value": {
            "name": "demo"
        }
    }
} 
```

#### symbol

- 返回当前合约所含的代币集合的符号。
- 入口函数 query。
- 参数json结构

```json
{
    "method":"symbol"
}
```

- 函数：

  ```js
  function symbol(tokenId)
  ```

- 返回值：

```json
{
    "result":{
        "type": "string",
        "value": {
            "symbol": "DM"
        }
    }
} 
```

## 合约入口

#### init

- 创建合约时候，触发合约 `init` 入口函数，负责合约创建时的初始化。

- 函数

```js
function init(input_str){
}

```

- 参数Json结构

```json
{
    "params":{
        "name":"DemoToken",
        "symbol":"DT"
    }
}
```

- 返回值

  true或者抛异常

#### main

- 负责数据写入，其中包含了 `transfer`、`transferFrom`、`approve`。

- 函数体

```javascript
function main(arg) {
  const data = JSON.parse(arg);
  const operation = data.operation || '';
  const param = data.param || {};

  switch (operation) {
    case 'createToken':
      createToken(param);
      break;
    case 'approve':
      approve(param.to, param.tokenId);
      break;
    case 'transfer':
      transfer(param.to, param.tokenId);
      break;
    case 'transferFrom':
      transferFrom(param.from, param.to, param.tokenId);
      break;
    default:
      throw '<Main interface passes an invalid operation type>';
  }
}
```

#### query

> 执行查询操作

```javascript
function query(arg) {
	
}
```

------

# 