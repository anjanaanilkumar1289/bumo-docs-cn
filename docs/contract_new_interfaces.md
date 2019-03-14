---
id: contract_new_interfaces
title: BUMO 智能合约新接口
sidebar_label: 新接口
---


## 概述

BUMO 智能合约是一段`JavaScript`代码,标准(ECMAScript as specified in ECMA-262)。合约的初始化函数是 `init`, 执行的入口函数是 `main `函数，查询接口是 `query`。这些函数的参数字符串 `input`，是调用该合约的时候指定的。
下面是一个简单的例子

```javascript
"use strict";
function init(input)
{
  /*init whatever you want*/
  return;
}

function main(input)
{
  let para = JSON.parse(input);
  if (para.do_foo)
  {
    let x = {
      'hello' : 'world'
    };
  }
}

function query(input)
{ 
  return input;
}
```



## 接口对象

BUMO 智能合约内提供了全局对象 `Chain` 和 `Utils`, 这两个对象提供了多样的方法和变量，可以获取区块链的一些信息，也可驱动账号发起所有交易，除了设置门限和权重这两种类型的操作。

> **注意，自定义的变量不要与内置对象重复，否则会造成不可控的数据错误。**



### 使用方法

对象.方法(变量)

- 获取账号余额

  ```javascript
  Chain.getBalance('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY');
  ```

- 打印日志	

  ```javascript
  Utils.log('hello');
  ```

- 当前区块号

  ```javascript
  Chain.block.number;
  ```


### 读写权限
1. 对象里的每个函数都有固定的**只读**或者**可写**权限

- 只读权限是指**不会写数据到区块链**的接口函数，比如获取余额 [Chain.getBalance](#chaingetbalance)。

- 可写权限是指**会写数据到区块链**的接口函数，比如转账 [Chain.payCoin](#chainpaycoin)。

2. 在编写智能合约的时候，需要注意的是不同的入口函数拥有不同的调用权限

- `init` 和 `main` 能调用所有的内置函数

- `query`  只能调用只读权限的函数，否则在调试或者执行过程中会提示接口未定义



### 返回值

所有内部函数的调用，如果失败则返回 false 或者直接抛出异常执行终止，成功则为其他对象。如果遇到参数错误，会在错误描述中提示参数位置出错，这里的位置指参数的索引号，即从 __0__ 开始计数。例如 `parameter 1` 表示第 __2__ 个参数错误。如下例子：
```javascript 
Chain.issueAsset("CNY", 10000);
/*
    错误描述：
    Contract execute error,issueAsset parameter 1 should be a string

    指第 2 个参数应该为字符串
*/
```

## Chain 对象方法

本章节介绍Chain对象的一些方法，包括 [Chain.load](#chainload)、 [Chain.store](#chainstore)、 [Chain.del](#chaindel)、 [Chain.getBlockHash](#chaingetblockhash)、 [Chain.tlog](#chaintlog)、 [Chain.getAccountMetadata](#chaingetaccountmetadata)、 [Chain.getBalance](#chaingetbalance)、[Chain.getAccountAsset](#chaingetaccountasset)、[Chain.getContractProperty](#chaingetcontractproperty)、[Chain.payCoin](#chainpaycoin)、[Chain.issueAsset](#chainissueasset)、[Chain.payAsset](#chainpayasset)、[Chain.delegateCall](#chaindelegatecall)、[Chain.delegateQuery](#chaindelegatequery)、[Chain.contractCall](#chaincontractcall)、[Chain.contractQuery](#chaincontractquery)、[Chain.contractCreate](#chaincontractcreate)。

### Chain.load
- 函数描述

  获取合约账号的metadata信息。

- 函数调用

```javascript
Chain.load(metadata_key);
```
- 参数说明

  - metadata_key: metadata的关键字。

- 示例

  ```javascript
  let value = Chain.load('abc');
  /*
    权限：只读
    返回：成功返回字符串，如 'values', 失败返回false
  */
  ```

### Chain.store

- 函数描述

  存储合约账号的metadata信息。

- 函数调用

  ```javascript
  Chain.store(metadata_key, metadata_value);
  ```

- 参数说明

  - metadata_key: metadata 的关键字。
  - metadata_key: metadata 的内容。

- 示例

  ```javascript
  Chain.store('abc', 'values');
  /*
    权限：可写
    返回：成功返回true, 失败抛异常
  */
  ```
### Chain.del

- 函数描述

  删除合约账号的metadata信息。

- 函数调用

  ```javascript
  Chain.del(metadata_key);
  ```

- 参数说明

  - metadata_key: metadata 的关键字。
  - metadata_key: metadata 的内容。

- 示例

  ```javascript
  Chain.del('abc');
  /*
    权限：可写
    返回：成功返回true, 失败抛异常
  */
  ```

### Chain.getBlockHash

- 函数描述

  获取区块信息。

- 函数调用

  ```javascript
  Chain.getBlockHash(offset_seq);
  ```

- 参数说明

  - offset_seq: 距离最后一个区块的偏移量，范围：[0,1024)。

- 示例

  ```javascript
  let ledger = Chain.getBlockHash(4);
  /*
    权限：只读
    返回：成功返回字符串，如 'c2f6892eb934d56076a49f8b01aeb3f635df3d51aaed04ca521da3494451afb3'，失败返回 false
  */
  ```

### Chain.tlog

- 函数描述

  输出交易日志。

- 函数调用

  ```javascript
  Chain.tlog(topic,args...);
  ```

- 参数说明

  - tlog会产生一笔交易写在区块上。
  - topic: 日志主题，必须为字符串类型,参数长度(0,128]。
  - args...: 最多可以包含5个参数，参数类型可以是字符串、数值或者布尔类型,每个参数长度(0,1024]。

- 示例

  ```javascript
  Chain.tlog('transfer',sender +' transfer 1000',true);
  /*
    权限：可写
    返回：成功返回 true，失败抛异常
  */
  ```

### Chain.getAccountMetadata

- 函数描述

  获取指定账号的metadata

- 函数调用

  ```javascript
  Chain.getAccountMetadata(account_address, metadata_key);
  ```

- 参数说明

  - account_address: 账号地址。
  - metadata_key: metadata 的关键字。

- 示例

  ```javascript
  let value = Chain.getAccountMetadata('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY', 'abc');
  
  /*
    权限：只读
    返回：成功返回字符串，如 'values', 失败返回false
  */
  ```

### Chain.getBalance

- 函数描述

  获取账号coin amount

- 函数调用

  ```javascript
  Chain.getBalance(address);
  ```

- 参数说明

  - address: 账号地址

- 示例

  ```javascript
  let balance = Chain.getBalance('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY');
  /*
    权限：只读
    返回：字符串格式数字 '9999111100000'
  */
  ```

### Chain.getAccountAsset

- 函数描述

  获取某个账号的资产信息

- 函数调用

  ```javascript
  Chain.getAccountAsset(account_address, asset_key);
  ```

- 参数说明

  - account_address: 账号地址。
  - asset_key: 资产属性。

- 示例

  ```javascript
  let asset_key =
  {
    'issuer' : 'buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY',
    'code' : 'CNY'
  };
  let bar = Chain.getAccountAsset('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY', asset_key);
  
  /*
    权限：只读
    返回：成功返回资产数字如'10000'，失败返回 false
  */
  ```

### Chain.getContractProperty

- 函数描述

  获取合约账号属性

- 函数调用

  ```javascript
  Chain.getContractProperty(contract_address);
  ```

- 参数说明

  - contract_address: 合约地址

- 示例

  ```javascript
  let value = Chain.getContractProperty('buQcFSxQP6RV9vnFagZ31SEGh55YMkakBSGW');
  
  /*
    权限：只读
    返回：成功返回JSON对象，如 {"type":0, "length" : 416},  type 指合约类型， length 指合约代码长度，如果该账户不是合约则，length 为0.
    失败返回false
  */
  ```

### Chain.payCoin

- 函数描述

  转账

- 函数调用

  ```javascript
  Chain.payCoin(address, amount[, input]);
  ```

- 参数说明

  - address: 发送BU的目标地址
  - amount: 发送BU的数量
  - input: 可选，合约参数，如果用户未填入，默认为空字符串

- 示例

  ```javascript
  Chain.payCoin("buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY", "10000", "{}");
  /*
    权限：可写
    返回：成功返回 true，失败抛异常  
  */
  ```

### Chain.issueAsset

- 函数描述

  发行资产

- 函数调用

  ```javascript
  Chain.issueAsset(code, amount);
  ```

- 参数说明

  - code: 资产代码
  - amount: 发行资产数量

- 示例

  ```javascript
  Chain.issueAsset("CNY", "10000");
  /*
    权限：可写
    返回：成功返回 true，失败抛异常  
  */
  ```

### Chain.payAsset

- 函数描述

  转移资产

- 函数调用

  ```javascript
  Chain.payAsset(address, issuer, code, amount[, input]);
  ```

- 参数说明

  - address: 转移资产的目标地址
  - issuer: 资产发行方
  - code: 资产代码
  - amount: 转移资产的数量
  - input: 可选，合约参数，如果用户未填入，默认为空字符串

- 示例

  ```javascript
  Chain.payAsset("buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY", "buQgmhhxLwhdUvcWijzxumUHaNqZtJpWvNsf", "CNY", "10000", "{}");
  /*
    权限：可写
    返回：成功返回 true，失败抛异常    
  */
  ```

### Chain.delegateCall

- 函数描述

  委托调用

- 函数调用

  ```javascript
  Chain.delegateCall(contractAddress, input);
  ```

- 参数说明

  - contractAddress: 被调用的合约地址。
  - input：调用参数。

  Chain.delegateCall 函数会触发被调用的合约main函数入口，并且把当前合约的执行环境赋予被调用的合约。

- 示例

  ```javascript
  let ret = Chain.delegateCall('buQBwe7LZYCYHfxiEGb1RE9XC9kN2qrGXWCY'，'{}');
  /*
    权限：可写
    返回：成功会返回结果，失败抛出异常
  */
  ```

### Chain.delegateQuery

- 函数描述

  委托查询

- 函数调用

  ```javascript
  Chain.delegateQuery(contractAddress, input);
  ```

- 参数说明

  - contractAddress: 被调用的合约地址。
  - input：调用参数。

  Chain.delegateQuery 函数会触发被调用的合约query函数入口，且把当前合约的执行环境赋予被调用的合约

- 示例

  ```javascript
  let ret = Chain.delegateQuery('buQBwe7LZYCYHfxiEGb1RE9XC9kN2qrGXWCY'，"");
  /*
    权限：只读
    返回：如果目标账户为普通账户，则返回true，如果目标账户为合约，调用成功则返回字符串 {"result":"4"}，其中 result 字段的值即查询的具体结果，调用失败返回 {"error":true} 字符串。
  */
  ```

### Chain.contractCall

- 函数描述

  调用合约

- 函数调用

  ```javascript
  Chain.contractCall(contractAddress, asset, amount, input);
  ```

- 参数说明

  - contractAddress: 被调用的合约地址。
  - asset : 资产类别，true代表BU，对象{"issue": buxxx, "code" : USDT} 代表资产。
  - amount: 资产数量。
  - input：调用参数。

  Chain.contractCall 函数会触发被调用的合约main函数入口。

- 示例

  ```javascript
  let ret = Chain.contractCall('buQBwe7LZYCYHfxiEGb1RE9XC9kN2qrGXWCY'，true, toBaseUnit("10"), "");
  /*
    权限：可写
    返回：如果目标账户为普通账户，则返回true，如果目标账户为合约，调用成功则返回main函数的返回值，调用失败则抛出异常
  */
  ```

### Chain.contractQuery

- 函数描述

  查询合约

- 函数调用

  ```javascript
  Chain.contractQuery(contractAddress, input);
  ```

- 参数说明

  - contractAddress: 被调用的合约地址。
  - input：调用参数。

  Chain.contractQuery 会调用合约的查询接口

- 示例

  ```javascript
  let ret = Chain.contractQuery('buQBwe7LZYCYHfxiEGb1RE9XC9kN2qrGXWCY'，"");
  /*
    权限：只读
    返回：调用成功则返回字符串 {"result":"xxx"}，其中 result 字段的值即查询的具体结果，调用失败返回 {"error":true} 字符串。
  */
  ```

### Chain.contractCreate

- 函数描述

  创建合约

- 函数调用

  ```javascript
  Chain.contractCreate(balance, type, code, input);
  ```

- 参数说明

  - balance: 字符串类型，转移给被创建的合约的资产。
  - type : 整型，0代表javascript。
  - code: 字符串类型， 合约代码。
  - input：init函数初始化参数。

  Chain.contractCreate 创建合约。

- 示例

  ```javascript
  let ret = Chain.contractCreate(toBaseUnit("10"), 0, "'use strict';function init(input){return input;} function main(input){return input;} function query(input){return input;} ", "");
  /*
    权限：可写
    返回：创建成功返回合约地址，失败则抛出异常
  */
  ```

### 

## Chain 对象变量

本章节介绍Chain对象的一些变量，分别[区块信息（Chain.block）](#区块信息-chainblock)、[交易信息（Chain.tx）](#交易-chaintx)、[消息（Chain.msg）](#消息-chainmsg)相关变量和[Chain.thisAddress](#chainthisaddress)。区块信息的变量包括 [Chain.block.timestamp](#chainblocktimestamp)、[Chain.block.number](#chainblocknumber)。交易信息的变量包括[Chain.tx.initiator](#chaintxinitiator)、 [Chain.tx.sender](#chaintxsender)、[Chain.tx.gasPrice](#chaintxgasprice)、  [Chain.tx.hash](#chaintxhash)、 [chain.tx.feeLimit](#chaintxfeeLimit)。消息的变量包括 [Chain.msg.initiator](#chainmsginitiator)、[Chain.msg.sender](#chainmsgsender)、[Chain.msg.coinAmount](#chainmsgcoinamount)、[Chain.msg.asset](#chainmsgasset)、[Chain.msg.nonce](#chainmsgnonce)、[Chain.msg.operationIndex](#chainmsgoperationIndex)。



### 区块信息（Chain.block）



#### Chain.block.timestamp

- 变量描述

  当前交易执行时候所在的区块时间戳。



#### Chain.block.number

- 变量描述

  当前交易执行时候所在的区块高度。






### 交易（Chain.tx）
交易是用户签名的那笔交易信息。



#### Chain.tx.initiator

- 变量描述

  交易最原始的发起者，即交易的费用付款者。



#### Chain.tx.sender

- 变量描述

  交易最原始的触发者，即交易里触发合约执行的操作的账户。
  例如某账号发起了一笔交易，该交易中有个操作是调用合约Y（该操作的source_address是x），那么合约Y执行过程中，sender的值就是x账号的地址。

- 示例

  ```javascript
  let bar = Chain.tx.sender;
  /*
  那么bar的值是x的账号地址。
  */
  ```



#### Chain.tx.gasPrice

- 变量描述

  交易签名里的gas价格。



#### Chain.tx.hash

- 变量描述

  交易的hash值。



#### Chain.tx.feeLimit

- 变量描述

  交易的限制费用。



### 消息（Chain.msg）

消息是在交易里触发智能合约执行产生的信息。在触发的合约执行的过程中，交易信息不会被改变，消息会发生变化。例如在合约中调用`contractCall`，`contractQuery`的时候，消息会变化。



#### Chain.msg.initiator

- 变量描述

  本消息的原始的发起者账号。



#### Chain.msg.sender

- 变量描述

  本次消息的触发者账号。

- 示例

  例如某账号发起了一笔交易，该交易中有个操作是调用合约Y（该操作的source_address是x），那么合约Y执行过程中，sender的值就是x账号的地址。

  ```javascript
  let bar = Chain.msg.sender;
  /*
  那么bar的值是x的账号地址。
  */
  ```



#### Chain.msg.coinAmount

- 变量描述

  本次支付操作的 BU coin



#### Chain.msg.asset

- 变量描述

  本次支付操作的资产
  
- 示例
  ```json
  {
      "amount": 1000, 
      "key" : {
          "issuer": "buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY", 
          "code":"CNY"
      }
  }
  ```



#### Chain.msg.nonce
- 变量描述

  本次交易里的发起者的nonce值，即`Chain.msg.initiator`账号的 nonce值。



#### Chain.msg.operationIndex
- 变量描述

  触发本次合约调用的操作的序号

- 示例

  例如某账号A发起了一笔交易tx0，tx0中第0（从0开始计数）个操作是给某个合约账户转移资产(调用合约), 那么`Chain.msg.operationIndex`的值就是0。

  ```javascript
  let bar = Chain.msg.operationIndex;
  /* bar 是一个非负整数*/
  ```



### Chain.thisAddress
- 变量描述

  当前合约账号的地址

- 示例

  例如账号x发起了一笔交易调用合约Y，本次执行过程中，该值就是Y合约账号的地址。
  
  ```text
  let bar = Chain.msg.thisAddress;
  /*
  bar的值是Y合约的账号地址。
  */
  ```



## Utils 对象方法

本章节介绍Chain对象的一些方法，包括 [Utils.log](#utilslog)、[Utils.stoI64Check](#utilsstoi64check)、[Utils.int64Add](#utilsint64add)、[Utils.int64Sub](#utilsint64sub)、[Utils.int64Mul](#utilsint64mul)、[Utils.int64Mod](#utilsint64mod)、[Utils.int64Div](#utilsint64div)、

### Utils.log

- 函数描述

  输出日志。

- 函数调用

  ```javascript
  Utils.log(info);
  ```

- 参数说明

  - info: 日志内容

- 示例

  ```javascript
  let ret = Utils.log('hello');
  /*
    权限：只读
    返回：成功无返回值，会在对应的合约执行进程里，输出一段Trace级别的日志，如 V8contract log[buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY:hello]；失败返回 false。
  */
  ```

### Utils.stoI64Check

- 函数描述

  字符串数字合法性检查。

- 函数调用

  ```javascript
  Utils.stoI64Check(strNumber);
  ```

- 参数说明

  - strNumber：字符串数字参数

- 示例

  ```javascript
  let ret = Utils.stoI64Check('12345678912345');
  /*
    权限：只读
    返回：成功返回 true，失败返回 false
  */
  ```

### Utils.int64Add

- 函数描述

  64位加法。

- 函数调用

  ```javascript
  Utils.int64Add(left_value, right_value);
  ```

- 参数说明

  - left_value: 左值。
  - right_value：右值。

- 示例

  ```javascript
  let ret = Utils.int64Add('12345678912345', 1);
  /*
    权限：只读
    返回：成功返回字符串 '12345678912346', 失败抛异常
  */
  ```

### Utils.int64Sub

- 函数描述

  64位减法。

- 函数调用

  ```javascript
  Utils.int64Sub(left_value, right_value);
  ```

- 参数说明

  - left_value: 左值。
  - right_value：右值。

- 示例

  ```javascript
  let ret = Utils.int64Sub('12345678912345', 1);
  /*
    权限：只读
    返回：成功返回字符串 '123456789123464'，失败抛异常
  */
  ```

### Utils.int64Mul

- 函数描述

  64位乘法。

- 函数调用

  ```javascript
  Utils.int64Mul(left_value, right_value);
  ```

- 参数说明

  - left_value: 左值。
  - right_value：右值。

- 示例

  ```javascript
  let ret = Utils.int64Mul('12345678912345', 2);
  /*
    权限：只读
    返回：成功返回字符串 '24691357824690'，失败抛异常
  */
  ```

### Utils.int64Mod

- 函数描述

  64位取模。

- 函数调用

  ```javascript
  Utils.int64Mod(left_value, right_value);
  ```

- 参数说明

  - left_value: 左值。
  - right_value：右值。

- 示例

  ```javascript
  let ret = Utils.int64Mod('12345678912345', 2);
  /*
    权限：只读
    返回：成功返回字符串 '1'，失败抛异常
  */
  ```

### Utils.int64Div

- 函数描述

  64位除法。

- 函数调用

  ```javascript
  Utils.int64Div(left_value, right_value);
  ```

- 参数说明

  - left_value: 左值。
  - right_value：右值。

- 示例

  ```javascript
  let ret = Utils.int64Div('12345678912345', 2);
  /*
    权限：只读
    返回：成功返回 '6172839456172'，失败抛异常
  */
  ```

### Utils.int64Compare

- 函数描述

  64位比较。

- 函数调用

  ```javascript
  Utils.int64Compare(left_value, right_value);
  ```

- 参数说明

  - left_value: 左值。
  - right_value：右值。

- 示例

  ```javascript
  let ret = Utils.int64Compare('12345678912345', 2);
  /*
    权限：只读
    返回：成功返回数字 1（左值大于右值），失败抛异常
  */
  ```

- 返回值

  1：左值大于右值，0：等于，-1 ：小于

### Utils.assert

- 函数描述

  64断言。

- 函数调用

  ```javascript
  Utils.assert(condition[, message]);
  ```

- 参数说明

  - condition: 断言变量
  - message: 可选，失败时抛出异常的消息

- 示例

  ```javascript
  Utils.assert(1===1, "Not valid");
  /*
    权限：只读
    返回：成功返回 true，失败抛异常  
  */
  ```



### Utils.sha256

- 函数描述

  sha256计算。

- 函数调用

  ```javascript
  Utils.sha256(data[, dataType]);
  ```

- 参数说明

  - data: 待计算hash的原始数据，根据dataType不同，填不同格式的数据。
  - dataType：data 的数据类型，整数，可选字段，默认为0。0：base16编码后的字符串，如"61626364"；1：普通原始字符串，如"abcd"；2：base64编码后的字符串,如"YWJjZA=="。如果对二进制数据hash计算，建议使用base16或者base64编码。

- 返回值

  成功会hash之后的base16编码后的字符串，失败会返回 false。

- 示例

  ```javascript
  let ret = Utils.sha256('61626364');
  /*
    权限：只读
    功能：对
    返回：成功返回64个字节的base16格式字符串 '88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589'，失败返回false
  */
  ```

### Utils.ecVerify

- 函数描述

  校验签名是否合法。

- 函数调用

  ```javascript
  Utils.ecVerify(signedData, publicKey,blobData [, blobDataType]);
  ```

- 参数说明

  - signedData: 签名数据，base16编码的字符串。
  - publicKey：公钥，base16编码的字符串。
  - blobData：原始数据，根据blobDataType，填不同格式的数据。
  - blobDataType：blobData的数据类型，整数，可选字段，默认为0。0：base16编码后的字符串，如"61626364"；1：普通原始字符串，如"abcd"；2：base64编码后的字符串,如"YWJjZA=="。如果对二进制数据校验，建议使用base16或者base64编码。

- 返回值

  成功会返回true，失败会返回 false

- 示例

  ```javascript
  let ret = Utils.ecVerify('3471aceac411975bb83a22d7a0f0499b4bfcb504e937d29bb11ea263b5f657badb40714850a1209a0940d1ccbcfc095c4b2d38a7160a824a6f9ba11f743ad80a', 'b0014e28b305b56ae3062b2cee32ea5b9f3eccd6d738262c656b56af14a3823b76c2a4adda3c', 'abcd', 1);
  /*
    权限：只读
    返回：成功会返回true，失败会返回 false
  */
  ```



### Utils.toBaseUnit

- 函数描述

  变换单位。

- 函数调用

  ```javascript
  Utils.toBaseUnit(value);
  ```

- 参数说明

  - value: 被转换的数字，只能传入字符串，可以包含小数点，且小数点之后最多保留 8 位数字

- 返回值

  成功会返回乘以 10^8 的字符串，失败会返回 false

- 示例

  ```javascript
  let ret = Utils.toBaseUnit('12345678912');
  /*
    权限：只读
    返回：成功返回字符串 '1234567891200000000'，失败抛异常
  */
  ```

### Utils.addressCheck

- 函数描述

  地址合法性检查。

- 函数调用

  ```javascript
  Utils.addressCheck(address);
  ```

- 参数说明

  - address 地址参数，字符串

- 返回值

  成功返回 true，失败返回 false。

- 示例

  ```javascript
  let ret = Utils.addressCheck('buQgmhhxLwhdUvcWijzxumUHaNqZtJpWvNsf');
  /*
    权限：只读
    返回：成功返回 true，失败返回 false
  */
  ```

### Utils.toAddress

- 函数描述

  公钥转地址。

- 函数调用

  ```javascript
  Utils.toAddress(public_key);
  ```

- 参数说明

  - public_key 公钥，base16编码的字符串

- 返回值

  成功，返回账号地址；失败返回false

- 示例

  ```javascript
  let ret = Utils.toAddress('b0016ebe6191f2eb73a4f62880b2874cae1191183f50e1b18b23fcf40b75b7cd5745d671d1c8');
  /*
    权限：只读
    返回：成功返回 "buQi6f36idrKiGrno3RcdjUjGAibUC37FJK6"，失败返回false
  */
  ```



## 异常处理

- JavaScript异常

  当合约运行中出现未捕获的JavaScript异常时，处理规定：

  1. 本次合约执行失败，合约中做的所有交易都不会生效。
  1. 触发本次合约的这笔交易为失败。错误代码为`151`。

- 执行交易失败
  
  <font color=red>合约中可以执行多个交易，只要有一个交易失败，就会抛出异常，导致整个交易失败</font>

