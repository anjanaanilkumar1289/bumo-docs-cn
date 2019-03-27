---
id: sto_10
title: BUMO STO 10 协议
sidebar_label: STO 10
---

## 简介

STO 10 ∂(Security Token Standard)是指基于 BUMO 智能合约发行证券型 token 的标准协议。该标准在 CTP 10 的基础上制定了增发 token，销毁 token，存储相关法律文件，将 token进行分片 ( tranche )，为 tranche 设置锁定期等约束条件，允许将指定 tranche 的 token 授权给第三方操作人，添加控制者 ( 如监控部门 ) 的相关功能。

## 目标

基于该协议标准发行的 token，能够在任何司法管辖区内发行和管理，并能够符合相关的监管限制。


## 规则

BUMO 智能合约由 JavaScript 语言实现, 包含初始化函数 init 和两个入口函数 main、query 。init 函数用于合约创建时初始化，main 函数主要负责数据写入，query 函数负责数据查询。

## STO 属性

### Token 基本信息

```
key: global_attribute
value: {
    "version": "1.0",
    "name": "Security Token",
    "symbol": "STO",
    "decimals": 8,
    "totalSupply": "100000",
    "scheduledTotalSupply":"100000",
    "owner":""
}
```
- version: 版本
- name: Token 名称
- symbol: Token 符号
- decimals: Token 精度
- totalSupply: Token 已发行总量，其值等于 10^decimals*已发行量。**假如,当前已发行总量是 10000, 精度为 8的 token，totalSupply = 10 ^ 8 * 10000, 结果是 1000000000000。**
- scheduledTotalSupply: Token 计划发行的总量, 0 表示不限制发行量， 大于 0 表示限制发行总量。其值等于10^decimals*计划发行量。**假如,计划要发行总量是 10000, 精度为 8 的 Token，scheduledTotalSuppl = 10 ^ 8 * 10000, 结果是 1000000000000。**
- owner: Token 所有权拥有者

### Tranche 属性及限制

```
key: tranche_attribute_id
value: {
    "description": "private",
    "limits": [{
        "name": "lockupPeriod",
        "value": "1517470155872949",
    },
    ……
    ]
}
```
- id: tranche 的 id
- description: tranche 的描述信息
- limits: 约束
- name: 约束名称
- value: 约束内容

### 所有 tranche 余额总和

```
key: balance_tokenHolder
value: {
	"value": "100000000", 
	"tranches": ["0", "1",……]
}
```
- tokenHolder: Token 持有人
- value: 余额总数
- tranches: trancheId 列表

### Tranche 余额

```
key: tranche_tokenHolder_id
value: "10000"
```
- tokenHolder: Token 持有人
- id: trancheId
- value: tranche 余额总量

### 操作者

```
key: operator_tokenHolder_operatorAddress
value: ["0", "1", ……]
```
- tokenHolder: Token 持有人
- operatorAddress: 操作者地址
- tranches: trancheId 列表, 空列表表示授权所有分片，非空列表表示授权到指定的分片

### 控制者

```
key: global_controller
value: [address1, addres2, ...]
```
- controllers: 控制者列表
- address: 控制者地址

### 授权

```
key: allowance_tokenHolder_tranche_spenderAddress
value: "1000"
```
- tokenHolder: Token 持有人
- tranche: 指定 trancheId
- spenderAddress: 被授权的账户地址
- value: 授权数量



### 文档

```
key: document_documentName
value: {
	"url": "https://BUMO.io/BUMO-Technology-White-Paper-cn",
    "hashType": "sha256",
    "documentHash": "ad67d57ae19de8068dbcd47282146bd553fe9f684c57c8c114453863ee41abc3",
    "provider": "buQXRbzyDaVpX3JT3Wd2gj2U2ZzVWZRpwcng",
    "date": 1544595438978280
}

```
- documentName: 文档名称
- url: 文档链接地址
- hashType: 哈希类型
- documentHash: 哈希的 16 进制字符串
- provider: 文档提供者
- data: 提供日期

## 事件

函数[setDocument](#setdocument)、[createTranche](#createtranche)、[transferWithData](#transferwithdata)、[transferFromWithData](#transferfromwithdata)、[transferFromToTranche](#transferfromtotranche)、[transferTranche](#transfertranche)、[transferToTranche](#transfertotranche)、[transfersToTranche](#transferstotranche)、[controllerTransfer](#controllertransfer)、[controllerRedeem](#controllerredeem)、[authorizeOperator](#authorizeoperator)、[revokeOperator](#revokeoperator)、[authorizeOperatorForTranche](#authorizeoperatorfortranche)、[revokeOperatorForTranche](#revokeoperatorfortranche)、[operatorTransferTranche](#operatortransfertranche)、[operatorRedeemTranche](#operatorredeemtranche)、[issue](#issue)、[issueToTranche](#issuetotranche)、[redeem](#redeem)、[redeemFrom](#redeemfrom)、[redeemTranche](#redeemtranche)、[redeemFromTranche](#redeemfromtranche)、[transfer](#transfer)、[approve](#approve)、[approveTranche](#approvetranche)、[transferFrom](#transferfrom)会触发事件，事件是调用tlog接口，在区块链上记录一条交易日志，该日志记录了函数调用详情，方便用户阅读。

tlog定义如下:

```
tlog(topic,args...);

```

- tlog会产生一笔交易写在区块上
- topic: 日志主题，必须为字符串类型,参数长度(0,128]
- args...: 最多可以包含5个参数，参数类型可以是字符串、数值或者布尔类型,每个参数长度(0,1024]



## 功能函数

BUMO ATP 20 协议中的函数包括[tokenInfo](#tokeninfo)、[setDocument](#setdocument)、[getDocument](#getdocument)、[createTranche](#createtranche)、[balanceOf](#balanceof)、[balanceOfTranche](#balanceoftranche)、[tranchesOf](#tranchesof)、[transferWithData](#transferwithdata)、[transferFromToTranche](#transferfromtotranche)、[transferTranche](#transfertranche)、[transferToTranche](#transfertotranche)、[transfersToTranche](#transferstotranche)、[isControllable](#iscontrollable)、[controllerTransfer](#controllertransfer)、[controllerRedeem](#controllerredeem)、[authorizeOperator](#authorizeoperator)、[revokeOperator](#revokeoperator)、[authorizeOperatorForTranche](#authorizeoperatorfortranche)、[revokeOperatorForTranche](#revokeoperatorfortranche)、[isOperator](#isoperator)、[isOperatorForTranche](#isoperatorfortranche)、[operatorTransferTranche](#operatortransfertranche)、[operatorRedeemTranche](#operatorredeemtranche)、[isIssuable](#isissuable)、[issue](#issue)、[issueToTranche](#issuetotranche)、[redeem](#redeem)、[redeemFrom](#redeemfrom)、[redeemTranche](#redeemtranche)、[redeemFromTranche](#redeemfromtranche)、[canTransfer](#cantransfer)、[canTransferTranche](#cantransfertranche)、[canTransferToTranche](#cantransfertotranche)、[transfer](#transfer)、[transferFrom](#transferfrom)、[approve](#approve)、[approveTranche](#approvetranche)、[allowance](#allowance)、[allowanceForTranche](#allowancefortranche)。



### tokenInfo

- 功能

  查询 token 详情。

- 入口函数

  `query`

- 参数

    ```json
    {
        "method": "tokenInfo
    }
    ```

- 返回值

    ```json
    {
        "result":{
            "type": "string",
            "value": {
                "tokenInfo": {
                    "name": "DemoToken",
                    "symbol": "STP",
                    "decimals": 8,
                    "totalSupply": "10000000",
                    "scheduledTotalSupply": "10000000",
                    "owner": "buQXRbzyDaVpX3JT3Wd2gj2U2ZzVWZRpwcng",
                    "version": "1.0"
                }
            }
        }
    } 
    ```



### setDocument

> **注意：**仅限于 token 的所有权拥有人和控制者使用。

- 功能

  设置法律文件或其他参考资料

- 入口函数

   `main`

- 参数

    ```json
    {
        "method":"setDocument",
        "params":{
            "name": "BUMO-Technology-White-Paper-cn",
            "url": "https://BUMO.io/BUMO-Technology-White-Paper-cn",
            "hashType": "sha256",
            "documentHash": "ad67d57ae19de8068dbcd47282146bd553fe9f684c57c8c114453863ee41abc3"
        }
    }
    - name: 文档名称，长度范围[1,256]
    - url: 文档在线链接地址，长度范围[10,128k]
    - hashType: 计算文档哈希的类型，长度范围[1,16]
    - documentHash: 文档哈希的16进制字符串
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

    ```javascript
    tlog('setDocument', sender, name, url, hashType, documentHash);
    ```

    topic: 方法名，这里是 'setDocument'

    sender:  合约调用账户地址

    name: 文档名称

    url: 文档在线链接地址

    hashType: 哈希类型

    documentHash: 哈希16进制字符串



### getDocument

- 功能

  查询法律文件或其他参考资料

- 入口函数

  `query`

- 参数

    ```json
    {
        "method":"getDocument",
        "params":{
            "name": "BUMO-Technology-White-Paper-cn"
        }
    }
    - name: 文档名称
    ```

- 返回值
    ```json
    {
        "result": {
            "type": "string",
            "value": {
                "document": {
                    "url": "https://BUMO.io/BUMO-Technology-White-Paper-cn",
                    "hashType": "sha256",
                    "documentHash": "ad67d57ae19de8068dbcd47282146bd553fe9f684c57c8c114453863ee41abc3",
                    "provider": "buQXRbzyDaVpX3JT3Wd2gj2U2ZzVWZRpwcng",
                    "date": 1544595438978280
                }
            }
        }
    }
    - url: 文档在线链接地址
    - hashType: 计算哈希的方式
    - documentHash: 哈希的 16 进制字符串
    - provider: 文档提供者
    - date: 上传日期
    ```

### createTranche

> **注意：**仅限于 token 的所有权拥有者使用。

- 功能

  创建分支(只允许发行人操作)。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method":"createTranche",
        "params":{
            "tranche":{
                "id": "1",
                "description": "private",
                "limits":[{
                    "name":"lockupPeriod",
                    "value":"1517470155872949"
                }],
                "tokenHolders":{
                    "buQoqGbz7o6RSkDympf8LrqSe8z4QkiBjcHw": "1000",
                    ...
                }
            }
        }
    }
    - id: trancheid，大小范围[1,2^63-1]
    - description: tranche 描述，长度范围[1,64k]
    - limits: 约束条件
    - name: 约束名称，长度范围[1,64]
    - value: 约束内容，长度范围[1,256]
    - tokenHolders: 分发的账户列表，最多支持8个
    ```
> 注意: 最多只允许分配给8个 tokenHolders

- 返回值

  成功：true

  失败：抛出异常

- 事件

  ```javascript
  tlog('createTranche', sender, id, description, limits, tokenHolders);
  ```

  topic: 方法名，这里是 'createTranche'

  sender:  合约调用账户地址

  id: trancheid

  description: tranche描述

  limits: 约束条件, json 字符串

  tokenHolders: 分发的账户列表, json 字符串

### balanceOf

- 功能

  查询指定账户下的所有 tranche 的 token 总和。

- 入口函数

  `query`

- 参数

    ```json
    {
        "method": "balanceOfTranche",
        "params":{
            "address": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
        }
    }
    ```

- 返回值

    ```json
    {
        "result": {
            "type": "string",
            "value": {
                "balance": "0.01"
            }
        }
    }
    ```

### balanceOfTranche

- 功能

  查询指定账户下的指定 tranche 的 token 余额

- 入口函数

  `query`

- 参数

    ```json
    {
        "method":"balanceOfTranche",
        "params":{
            "tranche": "1",
            "address": "buQZW68otiwmNPgzcBceuQ7NzFLX46FVyh65"
        }
    }
    ```

- 返回值

    ```json
    {
        "result": {
            "type": "string",
            "value": {
                "balance": "1000"
            }
        }
    }
    ```

### tranchesOf

- 功能

  查询与特定 token 持有者地址关联的所有 tranche 数量

- 入口函数

  `query`

- 参数

    ```json
    {
        "method":"tranchesOf",
        "params":{
            "address": "buQZW68otiwmNPgzcBceuQ7NzFLX46FVyh65"
        }
    }
    ```

- 返回值

    ```json
    {
        "result": {
            "type": "string",
            "value": {
                "balance": "30000"
            }
        }
    }
    ```

### transferWithData

- 功能

  将合约触发者的 token 转移给目标账户，并允许携带任意数据。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "transferWithData",
        "params":{
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "value": "100",
            "data": ""
        }
    }
    
    - to: Token 收入方地址
    - value: Token 数量，大小范围[0,2^63-1]
    - data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。长度范围[0,128k]
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

    ```javascript
    tlog('transferWithData', sender, to, value, data);
    ```

    topic: 方法名，这里是 'transferWithData'

    ​sender:  合约调用账户地址

    ​to: 目标账户地址

    value: 转移数量(字符串类型)

    ​data: 附加信息



### transferFromWithData

- 功能

  将指定 token 持有人的 token 转移给目标账户(合约触发者必须被授予足够的份额)，并允许携带任意数据。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "transferFromWithData",
        "params":{
            "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "value": "100",
            "data": ""
        }
    }
    - from: Token 支出方地址
    - to: Token 收入方地址
    - value: Token 数量，大小范围[0,2^63-1]
    - data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。长度范围[0,128k]
    
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

    ```javascript
      tlog('transferFromWithData', sender, from, to, value, data);
    ```

    ​          topic: 方法名，这里是 'transferFromWithData'

    ​          sender:  合约调用账户地址

    ​          from: Token 支出方地址

    ​          to: 目标账户地址

    ​          value: 转移数量(字符串类型)

    ​          data: 附加信息



### transferFromToTranche

- 功能

  将指定 token 持有人的指定 tranche 的 token 转移给目标账户，并允许携带任意数据。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "transferFromToTranche",
        "params":{
            "from": "buQm44k6VxqyLM8gQ7bJ49tJSjArhFsrVUKY",
            "fromTranche": "0",
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "toTranche": "1",
            "value": "100",
            "data": ""
        }
    }
    - from: Token 支出方地址
    - fromTranche: Token 支出方 tranche 的 id，大小范围[0,2^63-1]
    - to: Token 收入方地址
    - toTranche: Token 收入方 tranche 的 id，大小范围[0,2^63-1]
    - value: Token 数量，大小范围[0,2^63-1]
    - data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。长度范围[0,128k]
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

  ```javascript
  tlog('transferFromToTranche', sender, from + '_' + fromTranche, to + '_' + toTranche, value, data);
  ```

  topic: 方法名，这里是 'transferFromToTranche'

  sender:  合约调用账户地址

  from: Token 支出方地址

  fromTranche: Token 支出方 tranche 的 id

  to: Token 收入方地址

  toTranche: Token 收入方 tranche 的 id

  value: Token 数量

  data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。

### transferTranche

- 功能

  将合约触发者的指定 tranche 的 token 转移给目标账户的指定 tranche，并允许携带任意数据。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "transferTranche",
        "params":{
            "tranche": "0",
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "value": "100",
            "data": ""
        }
    }
    - tranche: Token 支出方和收入方 tranche 的 id，大小范围[0,2^63-1]
    - to: Token 收入方地址
    - value: Token 数量，大小范围[0,2^63-1]
    - data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。长度范围[0,128k]
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

    ```javascript
    tlog('transferTranche', sender, tranche, to, value, data);
    ```

    topic: 方法名，这里是 'transferTranche'

    sender:  合约调用账户地址

    tranche: tranche的id

    to: Token 收入方地址

    value: Token 数量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。

### transferToTranche

- 功能

  将合约触发者的指定 tranche 的 token 转移给目标账户的指定 tranche，并允许携带任意数据。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "transferToTranche",
        "params":{
            "fromTranche": "0",
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "toTranche": "1",
            "value": "100",
            "data": ""
        }
    }
    - fromTranche: Token 支出方 tranche 的 id，大小范围[0,2^63-1]
    - to: Token 收入方地址
    - toTranche: Token 收入方 tranche 的 id，大小范围[0,2^63-1]
    - value: Token 数量，大小范围[0,2^63-1]
    - data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。长度范围[0,128k]
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

    ```javascript
    tlog('transferToTranche', sender, fromTranche, to + '_' + toTranche, value, data);
    ```

    topic: 方法名，这里是 'transferToTranche'

    sender:  合约调用账户地址

    fromTranche: Token 支出方 tranche 的 id

    to: Token 收入方地址

    toTranche: Token 收入方 tranche 的 id

    value: Token 数量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。

### transfersToTranche

- 功能

  将合约触发者的指定的 tranche 的 token 转移给多个目标账户的某个 tranche，并允许携带任意数据。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "transfersToTranche",
        "params":{
            "fromTranche": "0",
            "toTranche": "1",
            "tokenHolders": {
                Address1: value1,
                Address2: value2,
                 …
            },
            "data": ""
        }
    }
    - fromTranche: Token 支出方 tranche 的 id，大小范围[0,2^63-1]
    - toTranche: Token 收入方 tranche 的 id，大小范围[0,2^63-1]
    - tokenHolders: Token 收入方列表
    - Address1/Address2/...: Token 收入方地址
    - value1/value2/...: Token 转出数量，大小范围[0,2^63-1]
    - data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。长度范围[0,128k]
    ```

- 返回值

    成功：返回目标账户的 tranche

    失败：抛出异常

- 事件

    ```javascript
    tlog('transfersToTranche', sender, fromTranche, toTranche, tokenHolders, data);
    ```

    topic: 方法名，这里是 'transfersToTranche'

    sender:  合约调用账户地址

    fromTranche: Token 支出方 tranche 的 id

    tokenHolders: Token 收入方列表，json字符串

    toTranche: Token 收入方 tranche 的 id

    value: Token 数量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。



### isControllable

> 注意：如果 `isControllable` 是 `true`,那么 `controller` 在不需要授权的情况下，可以使用 [operatorTransferTranche](#operatortransfertranche) 和 [operatorRedeemTranche](#operatorredeemtranche) 。

- 功能

  判断当前 token 是否是可控制的，是否可由司法/指定账户(不需要授权)控制两个账户之间的流通。

- 入口函数

  `query`

- 参数

    ```json
    {
        "method": "isControllable"
    }
    ```

- 返回值

  成功: true

  失败: false

### controllerTransfer

> **注意：**在某些法域中，发行人（或由发行人委托的实体）可能需要保留强制转移 token 的能力。这可能是为了解决法律纠纷或法院命令，或补救投资者失去访问他们的私钥。

- 功能

  允许授权的地址在任何两个令牌持有者之间传递 token。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "controllerTransfer",
        "params":{
            "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "fromTranche": "1",
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "toTranche": "2",
            "value": "100",
            "data": "",
            "operatorData": ""
        }
    }
    - from: Token 支出方地址
    - fromTranche: Token 支出方 tranche 的 id，大小范围[0,2^63-1]
    - to: Token 收入方地址
    - toTranche: Token 收入方 tranche 的 id，大小范围[0,2^63-1]
    - value: Token 数量，大小范围[0,2^63-1]
    - data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。长度范围[0,64k]
    - operatorData: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。长度范围[0,64k]
    ```

- 返回值

    成功: true

    失败: 抛出异常

- 事件

    ```javascript
    tlog('controllerTransfer', sender, from + '_' + fromTranche, to + '_' + toTranche, value, data + "; " + operatorData);
    ```

    topic: 方法名，这里是 'controllerTransfer'

    sender:  合约调用账户地址

    from: Token 支出方地址

    fromTranche: Token 支出方 tranche 的 id

    to: Token 收入方地址

    toTranche: Token 收入方 tranche 的 id

    value: Token 数量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。

    operatorData: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。

### controllerRedeem

> **注意：**在某些法域中，发行人（或由发行人委托的实体）可能需要保留强制转移 token的能力。这可能是为了解决法律纠纷或法院命令，或补救投资者失去访问他们的私钥。

- 功能

  允许授权的地址为任何Token持有者赎回 token。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "controllerRedeem",
        "params":{
            "tokenHolder": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "tranche": "1",
            "value": "100",
            "data": "",
            "operatorData": ""
        }
    }
    
    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是签名数据（例如，动态白名单），但是足够灵活以适应其他用例。
    ```

- 返回值

  成功: true

  失败: 抛出异常

- 事件

    ```javascript
    tlog('controllerRedeem', sender, tokenHolder, tranche, value, data + '; ' + operatorData);
    ```

    topic: 方法名，这里是 'controllerRedeem'

    sender:  合约调用账户地址

    tokenHolder: Token 持有人地址

    tranche: Tranche 的 id

    value: Token 数量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。



### authorizeOperator

- 功能

  对合约触发者的所有 tranche 授权一个操作者。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "authorizeOperator",
        "params":{
            "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
        }
    }
    ```

- 返回值

    成功: true

    失败: 抛出异常

- 事件

    ```javascript
    tlog('authorizeOperator', sender, operator);
    ```

    topic: 方法名，这里是 'authorizeOperator'

    sender:  合约调用账户地址

    operator: 操作人

### revokeOperator

- 功能

  撤消对之前合约触发者的所有 tranche 的操作者的授权。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "revokeOperator",
        "params":{
            "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
        }
    }
    ```

- 返回值

    成功: true

    失败: 抛出异常

- 事件

    ```javascript
    tlog('revokeOperator', sender, operator);
    ```

    topic: 方法名，这里是 'revokeOperator'

    sender:  合约调用账户地址

    operator: 操作人

### authorizeOperatorForTranche

- 功能

  对合约触发者的指定 tranche 授权一个操作者。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "authorizeOperatorForTranche",
        "params":{
            "tranche": "1",
            "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
        }
    }
    ```

- 返回值

    成功: true

    失败: 抛出异常

- 事件

    ```javascript
    tlog('authorizeOperatorForTranche', sender, tranche, operator);
    ```

    topic: 方法名，这里是 'authorizeOperatorForTranche'

    sender:  合约调用账户地址

    tranche: Tranche 的 id

    operator: 操作人

### revokeOperatorForTranche

- 功能

  撤消对之前合约触发者的指定 tranche 的操作者的授权。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "revokeOperatorForTranche",
        "params":{
            "tranche": "1",
            "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
        }
    }
    ```

- 返回值

    成功: true

    失败: 抛出异常

- 事件

    ```javascript
    tlog('revokeOperatorForTranche', sender, tranche, operator);
    ```

    topic: 方法名，这里是 'revokeOperatorForTranche'

    sender:  合约调用账户地址

    tranche: Tranche 的 id

    operator: 操作人



### isOperator

- 功能

  判断是否是 token 持有人的所有 tranche 的操作人。

- 入口函数

  `query`

- 参数

    ```json
    {
        "method": "isOperator",
        "params":{
            "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV"
        }
    }
    ```

- 返回值

    成功: true

    失败: false



### isOperatorForTranche

- 功能

  判断是否是 token 持有人的指定 tranche 的操作人。

- 入口函数

  `query`

- 参数

    ```json
    {
        "method": "isOperatorForTranche",
        "params":{
            "tranche": "1",
            "operator": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV"
        }
    }
    ```

- 返回值

    成功: true

    失败: false

### operatorTransferTranche

- 功能

  允许操作员代表 token 持有者在指定分段内转移 token。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "operatorTransferTranche",
        "params":{
            "tranche": "1",
            "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "value": "100",
            "data": "",
            "operatorData": ""
        }
    }
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

    ```javascript
    tlog('operatorTransferTranche', sender, tranche, from, to, value, data + '; ' + operatorData);
    ```

    topic: 方法名，这里是 'operatorTransferTranche'

    sender:  合约调用账户地址

    tranche: Tranche 的 id

    from: Token 支出方地址

    to: Token 收入方地址

    value: Token 数量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。

    operatorData: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。



### operatorRedeemTranche

- 功能

  允许操作员代表 token 持有者在指定分段内赎回 token（token 总量会减少）。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "operatorRedeemTranche",
        "params":{
            "tranche": "1",
            "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "value": "100",
            "operatorData": ""
        }
    }
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

    ```javascript
    tlog('operatorRedeemTranche', sender, tranche, tokenHolder, value, operatorData);
    ```

    topic: 方法名，这里是 'operatorRedeemTranche'

    sender:  合约调用账户地址

    tranche: Tranche 的 id

    tokenHolder: Token 持有人

    value: Token 数量

    operatorData: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。

### isIssuable

- 功能

  证券 token 发行者可以指定发行完成了 token（即没有新的 token 可以被铸造或发行）。

- 入口函数

  `query`

- 参数

    ```json
    {
        "method": "isIssuable"
    }
    ```

- 返回值

    成功: true

    失败: false

### issue

- 功能

  增加指定 token 持有人的总供给量。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "issue",
        "params":{
            "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "nowSupply": "1000000000000",
            "data": ""
        }
    }
    ```

- 返回值

    成功: true

    失败: 抛出异常

- 事件

    ```javascript
    tlog('issue', sender, tokenHolder, nowSupply, data);
    ```

    topic: 方法名，这里是 'issue'

    sender:  合约调用账户地址

    tokenHolder: Token 持有人

    nowSupply: 当前的发行量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。

### issueToTranche

- 功能

  增加指定 token 持有人的指定 tranche 的供给量。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "issueToTranche",
        "params":{
            "tranche": "",
            "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "nowSupply": "1000000000000",
            "data": ""
        }
    }
    ```

- 返回值

    成功: true

    失败: 抛出异常

- 事件

    ```javascript
    tlog('issueToTranche', sender, tranche, tokenHolder, nowSupply, data);
    ```

    topic: 方法名，这里是 'issueToTranche'

    sender:  合约调用账户地址

    tranche: Tranche 的 id

    tokenHolder: Token 持有人

    nowSupply: 当前的发行量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。



### redeem

- 功能

  从合约触发者赎回指定量的 token (总供给量会减少)。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "redeem",
        "params":{
            "value": "1000000000000",
            "data": ""
        }
    }
    ```

- 返回值

    成功: true

    失败: 抛出异常

- 事件

    ```javascript
    tlog('redeem', sender, value, data);
    ```

    topic: 方法名，这里是 'redeem'

    sender:  合约调用账户地址

    value: 赎回的数量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。



### redeemFrom

- 功能

  从指定的 token 持有人中赎回指定量的 token (总供给量会减少)。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "redeemFrom",
        "params":{
            "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "value": "1000000000000",
            "data": ""
        }
    }
    ```

- 返回值

    成功: true

    失败: 抛出异常

- 事件

    ```javascript
    tlog('redeemFrom', sender, tokenHolder, value, data);
    ```

    topic: 方法名，这里是 'redeemFrom'

    sender:  合约调用账户地址

    tokenHolder: Token 持有人地址

    value: 赎回的数量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。



### redeemTranche

- 功能

  从合约触发者的指定的 tranche 赎回指定量的 token (总供给量会减少)。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "redeemTranche",
        "params":{
            "tranche": "1",
            "value": "1000000000000",
            "data": ""
        }
    }
    ```

- 返回值

    成功: true

    失败: 抛出异常

- 事件

    ```javascript
    tlog('redeemTranche', sender, tranche, value, data);
    ```

    topic: 方法名，这里是 'redeemTranche'

    sender:  合约调用账户地址

    tranche: Tranche 的 id

    value: 赎回的数量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。

### redeemFromTranche

- 功能

  从指定的 token 持有人中赎回指定量的 token (总供给量会减少)（必须被授予足够的份额）。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "redeemFromTranche",
        "params":{
            "tranche": "1",
            "tokenHolder": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "value": "1000000000000",
            "data": ""
        }
    }
    ```

- 返回值

    成功: true

    失败: 抛出异常

- 事件

    ```javascript
    tlog('redeemFrom', sender, tranche, tokenHolder, value, data);
    ```

    topic: 方法名，这里是 'redeemFrom'

    sender:  合约调用账户地址

    tranche: Tranche 的 id

    tokenHolder: Token 持有人地址

    value: 赎回的数量

    data: 允许随传输一起提交任意数据，以便进行解释或记录。这可以是授权传输的签名数据（例如，动态白名单），但是足够灵活以适应其他用例。

### canTransfer

- 功能

  能否传输成功。

- 入口函数

  `query`

- 参数

    ```json
    {
        "method": "canTransfer",
        "params":{
            "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "value": "100",
            "data": ""
        }
    }
    ```

- 返回值

成功: true

失败: 抛出错误信息

### canTransferTranche

- 功能

  指定 tranche 内的 token 能否被传输成功。

- 入口函数

  `query`

- 参数

    ```json
    {
        "method": "canTransferByTranche",
        "params":{
            "tranche": "",
            "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            “value”: "100",
            "data": ""
        }
    }
    ```

- 返回值

　　成功: true
　　
　　失败: 抛出错误信息

### canTransferToTranche

- 功能

  指定 tranche 内的 token 转移给目标指定 tranche 内能否被传输成功。

- 入口函数

  `query`

- 参数

    ```json
    {
        "method": "canTransferByTranche",
        "params":{
            "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "fromTranche": "1",
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "toTranche": "2",
            “value”: "100",
            "data": ""
        }
    }
    ```

- 返回值

　　成功: true
　　
　　失败: 抛出错误信息



### transfer

- 功能

  将合约触发者的 token 转移给目标账户。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "transfer",
        "params":{
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "value": "100"
        }
    }
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

    ```javascript
    tlog('transfer', sender, to, value);
    ```

    topic: 方法名，这里是'transfer'

    sender:  合约调用账户地址

    to: 目标账户地址

    value: 转移数量(字符串类型)



### transferFrom

- 功能

  将指定 token 持有人的 token 转移给目标账户 (合约触发者必须被授予足够的份额)。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "transferFrom",
        "params":{
            "from": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "to": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "value": "100"
        }
    }
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

    ```javascript
    tlog('transferFrom', sender, from, to, value);
    ```

    topic: 方法名，这里是'transferFrom'

    sender:  合约调用账户地址

    from: 源账户地址

    to: 目标账户地址

    value: 转移数量（字符串类型）



### approve

- 功能

  允许指定账户代表Token持有者操作 token。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "approve",
        "params":{
            "spender": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "value": "100"
        }
    }
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

    ```javascript
    tlog('approve', sender, spender, value);
    ```

    topic: 方法名，这里是'approve'

    sender:  合约调用账户地址

    spender: 被授权账户地址

    value: 被授权可转移数量（字符串类型）



### approveTranche

- 功能

  允许指定账户代表 token持有者操作 token。

- 入口函数

  `main`

- 参数

    ```json
    {
        "method": "approveTranche",
        "params":{
            "tranche": "1",
            "spender": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj",
            "value": "100"
        }
    }
    ```

- 返回值

    成功：true

    失败：抛出异常

- 事件

    ```javascript
    tlog('approveTranche', sender, tranche, spender, value);
    ```

    topic: 方法名，这里是 'approveTranche'

    sender:  合约调用账户地址

    tranche: Tranche 的 id

    spender: 被授权账户地址

    value: 被授权可转移数量（字符串类型）

### allowance

- 功能

  查询允许指定账户代表 token持有者操作 token数量。

- 入口函数

  `query`

- 参数

    ```json
    {
        "method": "allowance",
        "params":{
            "owner": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "spender": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
        }
    }
    ```

- 返回值

    ```json
    {
        "result": {
            "type": "string",
            "value": {
                "allowance": "10000000"
            }
        }
    }
    ```


### allowanceForTranche

- 功能

  查询允许指定账户代表 token 持有者操作 token 数量。

- 入口函数

  `query`

- 参数

    ```json
    {
        "method": "allowanceForTranche",
        "params":{
            "tranche": "1",
            "owner": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
            "spender": "buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"
        }
    }
    ```

- 返回值

    ```json
    {
        "result": {
            "type": "string",
            "value": {
                "allowance": "100000"
            }
        }
    }
    ```

## 合约入口

### init

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
            "name": "123",
            "symbol": "STP",
            "description": "STP",
            "decimals": 8,
            "nowSupply": "10000000",
            "scheduledTotalSupply": "10000000",
            "icon": "",
            "controllers": ["buQnTmK9iBFHyG2oLce7vcejPQ1g5xLVycsj"]
        }
    }
    - name: Token 名称，长度范围[1,64]
    - code: Token 符号，长度范围[1,64]
    - description: Token 描述，长度范围[1,64k]
    - decimals: Token 符号，即能支持的小数点位置，大小范围[0,8]
    - nowSupply: Token 当前发行量，大小范围[0,2^63-1]，其值等于10^decimals*发行量。假如当前要发行一笔数量是 10000, 精度为8的 token，nowSupply = 10 ^ 8 * 10000, 结果是 1000000000000。
    - scheduledTotalSuppl: Token 计划发行总量，大小范围[0,2^63-1]，0 表示不限量发行，大于 0 表示限量发行，其值等于10^decimals*计划发行量。假如计划要发行总量是 10000, 精度为 8 的 token，scheduledTotalSuppl = 10 ^ 8 * 10000, 结果是 1000000000000。
    - icon: base64位编码，图标文件大小是32k以内,推荐200*200像素。
    - controllers: Token 的控制者列表，即监管者列表
    ```
返回值：

​	成功：无

​	失败：抛出异常


### main
- 负责数据写入，其中包含了 [setDocument](#setdocument)、[createTranche](#createtranche)、[transferWithData](#transferwithdata)、[transferFromWithData](#transferfromwithdata)、[transferFromToTranche](#transferfromtotranche)、[transferTranche](#transfertranche)、[transferToTranche](#transfertotranche)、[transfersToTranche](#transferstotranche)、[controllerTransfer](#controllertransfer)、[controllerRedeem](#controllerredeem)、[authorizeOperator](#authorizeoperator)、[revokeOperator](#revokeoperator)、[authorizeOperatorForTranche](#authorizeoperatorfortranche)、[revokeOperatorForTranche](#revokeoperatorfortranche)、[operatorTransferTranche](#operatortransfertranche)、[operatorRedeemTranche](#operatorredeemtranche)、[issue](#issue)、[issueToTranche](#issuetotranche)、[redeem](#redeem)、[redeemFrom](#redeemfrom)、[redeemTranche](#redeemtranche)、[redeemFromTranche](#redeemfromtranche)、[transfer](#transfer)、[approve](#approve)、[approveTranche](#approvetranche)、[transferFrom](#transferfrom) 等接口。
- 函数体

    ```js
    function main(input_str){
        let input = JSON.parse(input_str);
    
        if (input.method === 'setDocument'){
          setDocument(input.params.name, input.params.url, input.params.hashType, input.params.documentHash);
        }
        else if(input.method === 'createTranche'){
          createTranche(input.params.tranche);
        }
        else if(input.method === 'changeOwnership'){
          changeOwnership(input.params.owner);
        }
        else if(input.method === 'issue'){
          issue(input.params.tokenHolder, input.params.nowSupply, input.params.data);
        }
        else if(input.method === 'issueToTranche'){
          issueToTranche(input.params.tranche, input.params.tokenHolder, input.params.nowSupply, input.params.data);
        }
        else if (input.method === 'approveTranche'){
          approveTranche(input.params.tranche, input.params.spender, input.params.value, input.params.data);
        }
        else if(input.method === 'approve'){
          approve(input.params.spender, input.params.value);
        }
        else if(input.method === 'transfer'){
          transfer(input.params.to, input.params.value);
        }
        else if(input.method === 'transferFrom'){
          transferFrom(input.params.from, input.params.to, input.params.value);
        }
        else if(input.method === 'transferWithData'){
          transferWithData(input.params.to, input.params.value, input.params.data);
        }
        else if(input.method === 'transferFromWithData'){
          transferFromWithData(input.params.from, input.params.to, input.params.value, input.params.data);
        }
        else if(input.method === 'transferTranche'){
          transferTranche(input.params.tranche, input.params.to, input.params.value, input.params.data);
        }
        else if(input.method === 'transferToTranche'){
          transferToTranche(input.params.fromTranche, input.params.to ,input.params.toTranche, input.params.value, input.params.data);
        }
        else if(input.method === 'transfersToTranche'){
          transfersToTranche(input.params.fromTranche, input.params.toTranche, input.params.tokenHolders);
        }
        else if(input.method === 'transferFromToTranche'){
          transferFromToTranche(input.params.from, input.params.fromTranche, input.params.to ,input.params.toTranche, input.params.value, input.params.data);
        }
        else if (input.method === 'controllerTransfer'){
          controllerTransfer(input.params.from, input.params.fromTranche, input.params.to, input.params.toTranche, input.params.value, input.params.data, input.params.operatorData);
        }
        else if(input.method === 'controllerRedeem'){
          controllerRedeem(input.params.tokenHolder, input.params.tranche, input.params.value, input.params.data, input.params.operatorData);
        }
        else if(input.method === 'authorizeOperator'){
          authorizeOperator(input.params.operator);
        }
        else if(input.method === 'authorizeOperatorForTranche'){
          authorizeOperatorForTranche(input.params.tranche, input.params.operator);
        }
        else if(input.method === 'revokeOperator'){
          revokeOperator(input.params.operator);
        }
        else if(input.method === 'revokeOperatorForTranche'){
          revokeOperatorForTranche(input.params.tranche, input.params.operator);
        }
        else if(input.method === 'operatorTransferTranche'){
          operatorTransferTranche(input.params.tranche, input.params.from, input.params.to, input.params.value, input.params.data, input.params.operatorData);
        }
        else if(input.method === 'redeem'){
          redeem(input.params.value, input.params.data);
        }
        else if(input.method === 'redeemFrom'){
          redeemFrom(input.params.tokenHolder, input.params.value, input.params.data);
        }
        else if(input.method === 'redeemTranche'){
          redeemTranche(input.params.tranche, input.params.value, input.params.data);
        }
        else if(input.method === 'operatorRedeemTranche'){
          operatorRedeemTranche(input.params.tranche, input.params.tokenHolder, input.params.value, input.params.operatorData);
        }
        else{
            throw '<unidentified operation type>';
        }
    }
    ```

### query

- 负责数据查询，其中包含了 [getDocument](#getdocument)、[isIssuable](#isissuable)、[tokenInfo](#tokeninfo)、[balanceOf](#balanceof)、[tranchesOf](#tranchesof)、[balanceOfTranche](#balanceoftranche)、[allowance](#allowance)、[allowanceForTranche](#allowancefortranche)、[isControllable](#iscontrollable)、[isOperator](#isoperator)、[isOperatorForTranche](#isoperatorfortranche)、[canTransfer](#cantransfer)、[canTransferTranche](#cantransfertranche)、[canTransferToTranche](#cantransfertotranche) 等接口。

- 函数体

    ```js
    function query(input_str){
        let result = {};
        let input  = JSON.parse(input_str);

        if(input.method === 'getDocument'){
          result.document = getDocument(input.params.name);
        }
        else if(input.method === 'isIssuable'){
          result.isIssuable = isIssuable();
        }
        else if(input.method === 'tokenInfo'){
          globalAttribute = JSON.parse(storageLoad(globalAttributeKey));
          result.tokenInfo = globalAttribute;
        }
        else if(input.method === 'balanceOf'){
          result.balance = balanceOf(input.params.address);
        }
        else if(input.method === 'tranchesOf'){
          result.tranches = tranchesOf(input.params.address);
        }
        else if(input.method === 'balanceOfTranche'){
          result.balance = balanceOfTranche(input.params.tranche, input.params.address);
        }
        else if(input.method === 'allowance'){
          result.allowance = allowance(input.params.owner, input.params.spender);
        }
        else if (input.method === 'allowanceForTranche'){
          result.allowance = allowanceForTranche(input.params.tranche, input.params.owner, input.params.spender);
        }
        else if(input.method === 'isControllable'){
          result.isControllable = isControllable();
        }
        else if(input.method === 'isOperator'){
          result.isOperator = isOperator(input.params.operator, input.params.tokenHolder);
        }
        else if(input.method === 'isOperatorForTranche'){
          result.isOperator = isOperatorForTranche(input.params.tranche, input.params.operator, input.params.tokenHolder);
        }
        else if(input.method === 'canTransfer'){
          result.canTransfer = canTransfer(input.params.from, input.params.to, input.params.value, input.params.data);
        }
        else if(input.method === 'canTransferTranche'){
          result.canTransfer = canTransferTranche(input.params.from, input.params.to, input.params.tranche, input.params.value, input.params.data);
        }
        else if (input.method === 'canTransferToTranche'){
          result.canTransfer = canTransferToTranche(input.params.from, input.params.fromTranche, input.params.to, input.params.toTranche, input.params.value, input.params.data);
        }
        else{
            throw '<Query interface passes an invalid operation type>';
        }
        return JSON.stringify(result);
    }
    ```