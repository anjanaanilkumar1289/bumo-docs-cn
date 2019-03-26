---
id: version-1.0.0.10-introduction_to_smart_contract
title: BUMO 智能合约介绍
sidebar_label: 介绍
original_id: introduction_to_smart_contract
---

## 合约定义

合约是一段`JavaScript`代码,标准(`ECMAScript` as specified in `ECMA-262`)。合约的初始化函数是`init`, 执行的入口函数是`main`函数，您写的合约代码中必须有`init`和`main`函数的定义。该函数的入参是字符串`input`，是调用该合约的时候指定的。 语法请参考[合约语法](../syntax_in_smart_contract)。

下面是一个简单的例子

```JavaScript
"use strict";
function init(bar)
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



## 全局函数和内置变量

> **注意：自定义的函数和变量不要与**全局函数**和**内置变量**重名，否则会造成不可控的数据错误。**



### 全局函数

系统提供了几个全局函数, 这些函数可以获取区块链的一些信息，也可驱动账号发起所有交易，除了设置门限和权重这两种类型的操作。



#### 函数读写权限

1. 每个函数都有固定的只读或者可写权限：

- 只读权限是指不会写数据到区块链，比如获取余额函数 [getBalance](#getbalance) 具有只读权限。

- 可写权限是指会写数据到区块链，比如转账函数 [payCoin](#paycoin) 具有可写权限。


2. 在编写智能合约的时候，不同的入口函数拥有不同的调用权限：

- `init` 和 `main` 能调用所有的内置函数。
-  `query` 只能调用具有只读权限的函数，否则在调试或者执行过程中会提示接口未定义。



#### 函数返回值

所有内部函数的调用，如果失败则返回 **false** 或者直接抛出异常终止执行。如果遇到参数错误，会在错误描述中提示出错的参数位置，这里的位置指参数的索引号，即从 0 开始计数。
例如，parameter 1 表示第 2 个参数错误。

如下例子：

```JavaScript
issueAsset("CNY", 10000);
 /*
 错误描述：Contract execute error,issueAsset parameter 1 should be a string 指第 2 个参数应该为字符串
  */
```



#### 函数详情

本章节主要介绍智能合约开发过程涉及的一些函数，包括 [assert](#assert)、[getBalance](#getbalance)、[storageStore](#storagestore)、[storageLoad](#storageload)、[storageDel](#storagedel)、[getAccountAsset](#getaccountasset)、[getBlockHash](#getblockhash)、[addressCheck](#addresscheck)、[stoI64Check](#stoi64check)、[int64Add](#int64add)、[int64Sub](#int64sub)、[int64Mul](#int64mul)、[int64Div](#int64div)、[int64Mod](#int64mod)、[int64Compare](#int64compare)、[toBaseUnit](#tobaseunit)、[log](#log)、[tlog](#tlog)、[issueAsset](#issueasset)、[payAsset](#payasset)、[payCoin](#paycoin)。

##### assert

- **函数描述**

  `assert` 函数用于断言验证。

- **函数调用**
  ```JavaScript
  assert(condition[, message]);
  ```

- **参数说明**

  - condition：断言变量。
  - message：可选，失败时抛出异常的消息。

- **示例**

  ```JavaScript
  assert(1===1, "Not valid");
  /*
  权限：只读
  返回：成功返回 true，失败抛异常
  */
  ```



##### getBalance

- **函数描述**

  `getBalance` 函数用于获取账号信息（不包含 metada 和资产信息）。

- **函数调用**

  ```JavaScript
  getBalance(address);
  ```

- **参数说明**

  - address：账号地址。

- **示例**

  ```JavaScript
  let balance = getBalance('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY');
  /*
      权限：只读
      返回：字符串格式数字 '9999111100000'
  */
  ```

##### storageStore

- **函数描述**

  `storageStore` 函数用于存储合约账号的 metadata 信息。

- **函数调用**

  ```JavaScript
  storageStore(metadata_key, metadata_value);
  ```

- **参数说明**

  - metadata_key：metadata 的 key 值。
  - metadata_value：metadata 的 value 值。

- **示例**

  ```JavaScript
  storageStore('abc', 'values');
  /* 权限：可写
      返回：成功返回true, 失败抛异常
  */
  ```

##### storageLoad

- **函数描述**

  `storageLoad` 函数用于获取合约账号的 metadata 信息。

- **函数调用**

  ```JavaScript
  storageLoad(metadata_key);
  ```

- **参数说明**

  - metadata_key：metadata 的 key 值。

- **示例**

  ```JavaScript
  let value = storageLoad('abc');
  /* 权限：只读
      返回：成功返回字符串，如 'values', 失败返回 false
      本示例得到合约账号中自定数据的 abc 的值
  */
  ```

##### storageDel

- **函数描述**

  `storageDel` 函数用于删除合约账号的 metadata 信息。

- **函数调用**

  ```JavaScript
  storageDel(metadata_key);
  ```

- **参数说明**

  - metadata_key：metadata 的 key 值。

- **示例**

  ```JavaScript
  storageDel('abc');
  /*
    权限：可写
    返回：成功返回 true, 失败抛异常
    本示例删除本合约账号中自定数据的 abc 的值
  */
  ```

##### getAccountAsset

- **函数描述**

  `getAccountAsset` 函数用于获取某个账号的资产信息。

- **函数调用**

  ```JavaScript
  getAccountAsset(account_address, asset_key);
  ```

- **参数说明**

  - account_address：账号地址。
  - asset_key：资产属性。

- **示例**

  ```JavaScript
  let asset_key =
  {
  'issuer' : 'buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY',
  'code' : 'CNY'
  };
  let bar = getAccountAsset('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY',
  asset_key);
  /*
  权限：只读
  返回：成功返回资产数字如'10000'，失败返回 false
  */
  ```

##### getBlockHash

- **函数描述**

  `getBlockHash` 函数用于获取区块信息。

- **函数调用**

  ```JavaScript
  getBlockHash(offset_seq);
  ```

- **参数说明**

  - offset_seq：距离最后一个区块的偏移量，最大为1024。

- **示例**

  ```JavaScript
  let ledger = getBlockHash(4);
  /*
  权限：只读
  返回：成功返回字符串，如
  'c2f6892eb934d56076a49f8b01aeb3f635df3d51aaed04ca521da3494451afb3'，
  失败返回 false
  */
  ```

##### addressCheck

- **函数描述**

  `addressCheck` 函数用于地址合法性检查。

- **函数调用**

  ```JavaScript
  addressCheck(address);
  ```

- **参数说明**

  - address：地址参数，类型为字符串型。

- **示例**

  ```JavaScript
  let ret = addressCheck('buQgmhhxLwhdUvcWijzxumUHaNqZtJpWvNsf');
  /*
  权限：只读
  返回：成功返回 true，失败返回 false
  */
  ```

##### stoI64Check

- **函数描述**

  `stoI64Check` 函数用于字符串数字合法性检查。

- **函数调用**

  ```JavaScript
  stoI64Check(strNumber);
  ```

- **参数说明**

  - strNumber：字符串数字参数。

- **示例**

  ```JavaScript
  let ret = stoI64Check('12345678912345');
  /*
  权限：只读
  返回：成功返回 true，失败返回 false
  */
  ```

##### int64Add

- **函数描述**

  `int64Add` 函数用于64 位加法运算。

- **函数调用**

  ```JavaScript
  int64Add(left_value, right_value);
  ```

- **参数说明**

  - left_value：左值。
  - right_value：右值。

- **示例**

  ```JavaScript
  let ret = int64Add('12345678912345', 1);
  /*
  权限：只读
  返回：成功返回字符串 '12345678912346', 失败抛异常
  */
  ```

##### int64Sub

- **函数描述**

  `int64Sub` 函数用于64位减法运算。

- **函数调用**

  ```JavaScript
  int64Sub(left_value, right_value);
  ```

- **参数说明**

  - left_value：左值。
  - right_value：右值。

- **示例**

  ```JavaScript
  let ret = int64Sub('12345678912345', 1);
  /*
  权限：只读
  返回：成功返回字符串 '123456789123464'，失败抛异常
  */
  ```

##### int64Mul

- **函数描述**

  `int64Mul` 函数用于64位乘法运算。

- **函数调用**

  ```JavaScript
  int64Mul(left_value, right_value);
  ```

- **参数说明**

  - left_value：左值。
  - right_value：右值。

- **示例**

  ```JavaScript
  let ret = int64Mul('12345678912345', 2);
  /*
  权限：只读
  返回：成功返回字符串 '24691357824690'，失败抛异常
  */
  ```

##### int64Div

- **函数描述**

  `int64Div` 函数用于64位除法运算。

- **函数调用**

  ```JavaScript
  int64Div(left_value, right_value);
  ```

- **参数说明**

  - left_value：左值。
  - right_value：右值。

- **示例**

  ```JavaScript
  let ret = int64Div('12345678912345', 2);
  /*
  权限：只读
  返回：成功返回 '6172839456172'，失败抛异常
  */
  ```

##### int64Mod

- **函数描述**

  `int64Mod` 函数用于64位取模运算。

- **函数调用**

  ```JavaScript
  int64Mod(left_value, right_value);
  ```

- **参数说明**

  - left_value：左值。
  - right_value：右值。

- **示例**

  ```JavaScript
  let ret = int64Mod('12345678912345', 2);
  /*
  权限：只读
  返回：成功返回字符串 '1'，失败抛异常
  */
  ```

##### int64Compare

- **函数描述**

  `int64Compare` 函数用于64位比较运算。

- **函数调用**

  ```JavaScript
  int64Compare(left_value, right_value);
  ```

- **参数说明**

  - left_value：左值。
  - right_value：右值。
- **返回值**
  - 1：左值大于右值。
  - 0：左值等于右值。
  - 1 ：左值小于右值。
- **示例**

  ```JavaScript
  let ret = int64Compare('12345678912345', 2);
  /*
  权限：只读
  返回：成功返回数字 1（左值大于右值），0(相等)，-1(小于)，失败抛异常
  */
  ```
##### toBaseUnit

- **函数描述**

  `toBaseUnit` 函数用于变换单位。

- **函数调用**

  ```JavaScript
  toBaseUnit(value);
  ```

- **参数说明**

  - value：被转换的数字，只能传入字符串，可以包含小数点，且小数点之后最多保留 8 位数字。

- **示例**

  ```JavaScript
  let ret = toBaseUnit('12345678912');
  /*
  权限：只读
  返回：成功会返回乘以 108 的字符串，本例返回字符串 '1234567891200000000'，失败抛异常
  */
  ```

##### log

- **函数描述**

  `log` 函数用于输出日志。

- **函数调用**

  ```JavaScript
  log(info);
  ```

- **参数说明**

  - info：日志内容。

- **示例**

  ```JavaScript
   let ret = log('buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY');
   /*
   权限：只读
   返回：成功无返回值，失败返回 false
   */
  ```

##### tlog

- **函数描述**

  `tlog` 函数用于输出交易日志，调用该函数会产生一笔交易写在区块上。

- **函数调用**

  ```JavaScript
  tlog(topic,args...);
  ```

- **参数说明**

  - topic：日志主题，必须为字符串类型，参数长度为(0,128]。
  - args...：最多可以包含 5 个参数，参数类型可以是字符串、数值或者布尔类型，每个参数长度为 (0,1024]。

- **示例**

  ```JavaScript
   tlog('transfer',sender +' transfer 1000',true);
   /*
   权限：可写
   返回：成功返回 true，失败抛异常
   */
  ```

##### issueAsset

- **函数描述**

  `issueAsset` 函数用于发行资产。

- **函数调用**

  ```JavaScript
  issueAsset(code, amount);
  ```

- **参数说明**

  - code：资产代码。
  - amount：发行资产数量。

- **示例**

  ```JavaScript
   issueAsset("CNY", "10000");
   /*
   权限：可写
   返回：成功返回 true，失败抛异常
   */
  ```

##### payAsset

- **函数描述**

  `payAsset` 函数用于转移资产。

- **函数调用**

  ```JavaScript
  payAsset(address, issuer, code, amount[, input]);
  ```

- **参数说明**

  - address：转移资产的目标地址。
  - issuer：资产发行方。
  - code：资产代码。
  - amount：转移资产的数量。
  - input：可选，合约参数，默认为空字符串。

- **示例**

  ```JavaScript
   payAsset("buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY",
   "buQgmhhxLwhdUvcWijzxumUHaNqZtJpWvNsf", "CNY", "10000", "{}");
   /*
   权限：可写
   返回：成功返回 true，失败抛异常
   */
  ```

##### payCoin

- **函数描述**

  `payCoin` 函数用于转账资产。

- **函数调用**

  ```JavaScript
  payCoin(address, amount[, input]);
  ```

- **参数说明**

  - address：发送 BU 的目标地址。
  - amount：发送 BU 的数量。
  - input：可选，合约参数，默认为空字符串。

- **示例**

  ```JavaScript
   payCoin("buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY", "10000", "{}");
   /*
   权限：可写
   返回：成功返回 true，失败抛异常
   */
  ```

### 内置变量

本章节介绍智能合约开发过程涉及的一些内置变量，包括 [thisAddress](#thisaddress)、 [thisPayCoinAmount](#thispaycoinamount)、 [thisPayAsset](#thispayasset)、 [blockNumber](#blocknumber)、 [blockTimestamp](#blocktimestamp)、 [sender](#sender)、 [triggerIndex](#triggerindex)。

#### thisAddress

- **变量描述**

  内置变量 **thisAddress** 的值等于该合约账号的地址。

- **示例**

  例如，账号 x 发起了一笔交易调用合约 Y ，本次执行过程中，thisAddress 的值就是 Y 合约账号的地址。

  ```JavaScript
  let bar = thisAddress;
    /*
    bar的值是Y合约的账号地址。
  */
  ```

#### thisPayCoinAmount

- **变量描述**

  本次支付操作的 BU Coin。

#### thisPayAsset

- **变量描述**

  本次支付操作的 Asset，为对象类型，如下：

- **示例**
  ```JavaScript
  {"amount": 1000, "key" : {"issuer": "buQsZNDpqHJZ4g5hz47CqVMk5154w1bHKsHY", "code":"CNY"}}。
  ```

#### blockNumber

- **变量描述**

  当前区块高度。

#### blockTimestamp

- **变量描述**

  当前区块时间戳。

#### sender

- **变量描述**

  调用者的地址。sender 的值为本次调用该合约的账号。

- **示例**

  例如，某账号发起了一笔交易，该交易中某个操作是调用合约 Y（该操作的 source_address 是 x），那么在合约 Y 的执行过程中，sender 的值就是 x 账号的地址。

  ```JavaScript
  let bar = sender;
  /*
  那么bar的值是x的账号地址。
  */
  ```

#### triggerIndex

- 变量描述
  triggerIndex 的值为触发本次合约的操作的序号。

- **示例**

  例如，某账号 A 发起了一笔交易 tx0，tx0 中第 0（从 0 开始计数）个操作是给某个合约账户转移资产（调用合约），那么 triggerIndex 的值就是 0。

  ```JavaScript
   let bar = triggerIndex;
    /*
     bar 是一个非负整数
   */
  ```



## 异常处理

- JavaScript异常

  当合约运行中出现未捕获的JavaScript异常时，处理规定：

  1. 本次合约执行失败，合约中做的所有交易都不会生效。
  2. 触发本次合约的这笔交易为失败。错误代码为`151`。

- 执行交易失败

  <font color=red>合约中可以执行多个交易，只要有一个交易失败，就会抛出异常，导致整个交易失败</font>

