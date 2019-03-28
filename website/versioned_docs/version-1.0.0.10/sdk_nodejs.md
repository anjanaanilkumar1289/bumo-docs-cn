---
id: version-1.0.0.10-sdk_nodejs
title: BUMO Nodejs SDK
sidebar_label: Nodejs
original_id: sdk_nodejs
---

## 概述
本文档详细说明Bumo Nodejs SDK常用接口文档, 使开发者更方便地操作和查询BU区块链。

## 包引入

Nodejs要求6.0.0或更高版本。

使用以下命令进行安装

```shell

npm install bumo-sdk --save
```

## 请求参数与响应数据格式

本章节将详细介绍请求参数与响应数据的格式。

### 请求参数

为了保证数字精度，请求参数中的 Number 类型，都按字符串处理。例如，amount = 500， 那么传递参数时将其更改为 amount = '500' 的字符串形式。

### 响应数据

接口的响应数据为 `JavaScript` 对象，数据格式如下：

```js
{
       errorCode: 0,
       errorDesc: '',
       result: {}
}
```

说明：

- errorCode: **错误码**。0表示无错误，大于0表示有错误
- errorDesc: 错误描述。
- result: 返回结果。因响应数据结构固定，方便起见，后续接口说明中的响应数据均指 result 对象的属性。

## 使用方法

这里介绍SDK的使用流程，首先需要生成SDK实现，然后调用相应服务的接口，其中服务包括[账户服务](#账户服务)、[资产服务](#资产服务)、[合约服务](#合约服务)、[交易服务](#交易服务)、[区块服务](#区块服务)，接口按使用分类分为查询、广播交易相关接口

### 生成SDK实例

生成SDK实例时的传入参数 options 是一个对象，options 包含如下参数：

| 参数 | 类型   | 描述        |
| ---- | ------ | ----------- |
| host | String | ip地址:端口 |

实例如下：

```js
const BumoSDK = require('bumo-sdk');

const options = {
    host: 'seed1.bumotest.io:26002',
};

const sdk = new BumoSDK(options);
```

### 查询
此接口用于查询BU区块链上的数据，直接调用相应的接口即可，比如，查询账户信息，具体调用如下：
```js
const address = 'buQemmMwmRQY1JkcU7w3nhruo%X5N3j6C29uo';

sdk.account.getInfo(address).then(info=> {
    console.log(info);
}).catch(err => {
    console.log(err.message);
});
```

### 广播交易
广播交易是指通过广播的方式发起交易。广播交易包括以下步骤：

1. [获取账户nonce值](#获取账户nonce值)
2. [构建操作](#构建操作)
3. [序列化交易](#序列化交易)
4. [签名交易](#签名交易)
5. [提交交易](#提交交易)

#### 获取账户nonce值

开发者可自己维护各个账户`nonce`，在提交完一个交易后，自动为nonce值递增1，这样可以在短时间内发送多笔交易，否则，必须等上一个交易执行完成后，账户的`nonce`值才会加1。接口详情请见[getNonce](#getnonce)，调用如下：：
```js
const address = 'buQemmMwmRQY1JkcU7w3nhruo%X5N3j6C29uo';

sdk.account.getNonce(address).then(info => {

    if (info.errorCode !== 0) {
        console.log(info);
        return;
    }

    const nonce = new BigNumber(info.result.nonce).plus(1).toString(10);
});

// 本例中使用了big-number.js 将nonce的值加1，并返回字符串类型
```

#### 构建操作

这里的操作是指在交易中做的一些动作，便于序列化交易和评估费用。操作详情请见[操作](#操作)。例如，构建发送BU操作(`BUSendOperation`)，接口调用如下：
```js
const destAddress = 'buQWESXjdgXSFFajEZfkwi5H4fuAyTGgzkje';

const info = sdk.operation.buSendOperation({
       destAddress,
       amount: '60000',
       metadata: '746573742073656e64206275',
});
```

#### 序列化交易

该接口用于序列化交易，并生成交易Blob串，便于网络传输。其中nonce和operation是上面接口得到的，接口详情请见[buildBlob](#buildblob)，调用如下：
```js
let blobInfo = sdk.transaction.buildBlob({
    sourceAddress: 'buQnc3AGCo6ycWJCce516MDbPHKjK7ywwkuo',
    gasPrice: '3000',
    feeLimit: '1000',
    nonce: '102',
    operations: [ sendBuOperation ],
    metadata: '74657374206275696c6420626c6f62',
});

const blob = blobInfo.result;
```

#### 签名交易

该接口用于交易发起者使用其账户私钥对交易进行签名。其中transactionBlob是上面接口得到的，接口详情请见[sign](#sign)，调用如下：
```js
const signatureInfo = sdk.transaction.sign({
    privateKeys: [ privateKey ],
    blob,
});

const signature = signatureInfo.result;
```

#### 提交交易

该接口用于向BU区块链发送交易请求，触发交易的执行。其中transactionBlob和signResult是上面接口得到的，接口详情请见 [submit](#submit)，调用如下：
```js
sdk.transaction.submit({
    blob,
    signature: signature,
}).then(data => {
    console.log(data);
});
```

## 交易服务

交易服务提供交易相关的接口，目前有5个接口：`buildBlob`、 `evaluateFee`、 `sign`、 `submit`、 `getInfo`。

### buildBlob

> **注意:** 调用**buildBlob**之前需要构建一些操作，详情见[操作](#操作)。

- **接口说明**

   该接口用于序列化交易，生成交易Blob串，便于网络传输

- **调用方法**

  `sdk.transaction.buildBlob(args);`

- **请求参数**

   args 为 Object 类型，其中包含如下参数：

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   sourceAddress|String|必填，发起该操作的源账户地址
   nonce|String|必填，待发起的交易序列号，函数里+1，大小限制[1, max(int64)]，不能以0开头
   gasPrice|String|必填，交易燃料单价，单位MO，1 BU = 10^8 MO，大小限制[1000, max(int64)]，不能以0开头
   feeLimit|String|必填，交易要求的最低的手续费，单位MO，1 BU = 10^8 MO，大小限制[1, max(int64)]，不能以0开头
   operation|BaseOperation[]|必填，待提交的操作列表，不能为空
   ceilLedgerSeq|String|选填，距离当前区块高度指定差值的区块内执行的限制，当区块超出当时区块高度与所设差值的和后，交易执行失败。必须大于等于0，是0时不限制，不能以0开头
   metadata|String|选填，备注

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   transactionBlob|String|Transaction序列化后的16进制字符串
   hash|String|交易hash

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_SOURCEADDRESS_ERROR|11002|Invalid sourceAddress
   INVALID_NONCE_ERROR|11048|Nonce must be between 1 and max(int64)
   INVALID_NONCE_ERROR|11048|Nonce must be between 1 and max(int64)
   INVALID_ GASPRICE_ERROR|11049|GasPrice must be between 1000 and max(int64)
   INVALID_FEELIMIT_ERROR|11050|FeeLimit must be between 1 and max(int64)
   OPERATIONS_EMPTY_ERROR|11051|Operations cannot be empty
   INVALID_CEILLEDGERSEQ_ERROR|11052|CeilLedgerSeq must be equal to or greater than 0
   OPERATIONS_ONE_ERROR|11053|One of the operations cannot be resolved
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   const args = {
       sourceAddress,
       gasPrice,
       feeLimit,
       nonce,
       operations: [ sendBuOperation ],
       metadata: '6f68206d79207478',
   };
   const blobInfo = sdk.transaction.buildBlob(args);
   ```

### evaluateFee

- **接口说明**

   该接口实现交易的费用评估。

- **调用方法**

  `sdk.transaction.evaluateFee(args)`

- **请求参数**

   args 为 Object 类型，其中包含如下参数：

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   sourceAddress|String|必填，发起该操作的源账户地址
   nonce|String|必填，待发起的交易序列号，大小限制[1, max(int64)]
   operation|Array|必填，待提交的操作列表，不能为空
   signtureNumber|Integer|选填，待签名者的数量，默认是1，大小限制[1, max(int32)]
   ceilLedgerSeq|String|选填，距离当前区块高度指定差值的区块内执行的限制，当区块超出当时区块高度与所设差值的和后，交易执行失败。必须大于等于0，是0时不限制
   metadata|String|选填，备注

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
    feeLimit | String | 交易费用 
   gasPrice | String | 打包费用 

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_SOURCEADDRESS_ERROR|11002|Invalid sourceAddress
    INVALID_ARGUMENTS           | 15016      | Arguments of the function are invalid 
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   const args = {
       sourceAddress: 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf',
       nonce: '101',
       operations: [sendBuOperation],
       signtureNumber: '1',
       metadata: '54657374206576616c756174696f6e20666565',
   };

   sdk.transaction.evaluateFee(args).then(data => {
       console.log(data);
   });

   ```

### sign

- **接口说明**

   该接口用于实现交易的签名

- **调用方法**

  `sdk.transaction.sign(args);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   blob|String|必填，待签名的交易Blob
   privateKeys|Array|必填，私钥列表


- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   signatures|Array<[Signature](#signature)>|签名后的数据列表

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_BLOB_ERROR|11056|Invalid blob
   PRIVATEKEY_NULL_ERROR|11057|PrivateKeys cannot be empty
   PRIVATEKEY_ONE_ERROR|11058|One of privateKeys is invalid
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   const signatureInfo = sdk.transaction.sign({
       privateKeys: [ 'privbyQCRp7DLqKtRFCqKQJr81TurTqG6UKXMMtGAmPG3abcM9XHjWvq' ],
       blob: '0A246275516E6E5545425245773268423670574847507A77616E5837643238786B364B566370102118C0843D20E8073A56080712246275516E6E5545425245773268423670574847507A77616E5837643238786B364B566370522C0A24627551426A4A443142534A376E7A41627A6454656E416870466A6D7852564545746D78481080A9E08704'
   });

   console.log(signatureInfo);
   ```

### submit

- **接口说明**

   该接口用于实现交易的提交。

- **调用方法**

  `sdk.transaction.submit(args);`

- **请求参数**

   参数 args 为 Object 类型, 包含如下参数：

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   blob|String|必填，交易blob
   signature|Array<[Signature](#signature)>|必填，签名列表

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   hash|String|交易hash

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_BLOB_ERROR|11056|Invalid blob
    INVALID_SIGNATURE_ERROR | 15027      | Invalid signature 
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   const args = {
       blob: '0A246275516E6E5545425245773268423670574847507A77616E5837643238786B364B566370102118C0843D20E8073A56080712246275516E6E5545425245773268423670574847507A77616E5837643238786B364B566370522C0A24627551426A4A443142534A376E7A41627A6454656E416870466A6D7852564545746D78481080A9E08704',
       signature: {
           signData: 'D2B5E3045F2C1B7D363D4F58C1858C30ABBBB0F41E4B2E18AF680553CA9C3689078E215C097086E47A4393BCA715C7A5D2C180D8750F35C6798944F79CC5000A',
           publicKey: 'b0011765082a9352e04678ef38d38046dc01306edef676547456c0c23e270aaed7ffe9e31477'
       },

       let transactionInfo = yield sdk.transaction.submit(args);
   ```

### getInfo

- **接口说明**

   该接口用于实现根据交易hash查询交易。

- **调用方法**

  `sdk.transaction.getInfo(hash);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   hash|String|交易hash

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   totalCount|String|返回的总交易数
   transactions|Array<[TransactionHistory](#transactionhistory)>|交易内容

- **错误码**

   异常       |     **错误码**   |        
   -----------  | ----------- |-----------  
   INVALID_HASH_ERROR|11055|Invalid transaction hash
   REQUEST_NULL_ERROR|12001|Request parameter cannot be null
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error
   INVALID_REQUEST_ERROR|17004|Request is invalid

- **示例**

   ```js
   const hash = '1653f54fbba1134f7e35acee49592a7c29384da10f2f629c9a214f6e54747705';
   sdk.transaction.getInfo(hash).then(data => {
       console.log(data);
   })
   ```

## 操作

操作是指在交易在要做的事情，在构建操作之前，需要构建操作。目前操作有10种，分别是: [激活账户](#激活账户)、[设置账户metadata](#设置账户metadata)、[设置账户权限](#设置账户权限)、[发送BU](#发送bu)、[发行资产](#发行资产)、[转移资产](#转移资产)、[创建合约](#创建合约)、[发送资产触发合约](#发送资产触发合约)、[发送BU触发合约](#发送bu触发合约)、[日志](#日志)。

### 激活账户

- **费用**

  feeLimit目前(2018.07.26)是0.01 BU。

- **调用方法**

  `sdk.operation.accountActivateOperation(args);`

- **请求参数**

  args 为 Object 类型，其中包含如下参数：

  | 参数          | 类型   | 描述                                                         |
  | ------------- | ------ | ------------------------------------------------------------ |
  | sourceAddress | String | 选填，合约触发账户地址                                       |
  | destAddress   | String | 必填，目标账户地址                                           |
  | initBalance   | String | 必填，初始化资产，其值只能是包含数字的字符 串且不能以0开头，大小[1, max(int64)]，单位是 MO，1 BU = 10 ^ 8 MO |
  | metadata      | String | 选填，备注                                                   |

- **响应数据**

  | 参数      | 类型                    | 描述               |
  | --------- | ----------------------- | ------------------ |
  | operation | [Operation](#operation) | 激活账户的操作对象 |

- **错误码**

  | 异常                                  | **错误码** | 描述                                         |
  | ------------------------------------- | ---------- | -------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR           | 11002      | Invalid sourceAddress                        |
  | INVALID_DESTADDRESS_ERROR             | 11003      | Invalid destAddress                          |
  | INVALID_INITBALANCE_ERROR             | 11004      | InitBalance must be between 1 and max(int64) |
  | SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR | 11005      | SourceAddress cannot be equal to destAddress |
  | INVALID_METADATA_ERROR                | 15028      | Invalid metadata                             |
  | SYSTEM_ERROR                          | 20000      | System error                                 |

### 设置账户metadata

- **费用**

  feeLimit目前(2018.07.26)是0.01 BU。

- **调用方法**

  `sdk.operation.accountSetMetadataOperation(args);`

- **请求参数**

  args 为 Object 类型，其中包含如下参数：

  | 参数       | 类型    | 描述                                  |
  | ---------- | ------- | ------------------------------------- |
  | key        | String  | 必填，metadata的关键词，长度[1, 1024] |
  | value      | String  | 选填，metadata的内容，长度[0, 256K]   |
  | version    | String  | 选填，metadata的版本                  |
  | deleteFlag | Boolean | 选填，是否删除metadata                |
  | metadata   | String  | 选填，备注                            |

- **响应数据**

  | 参数      | 类型                    | 描述                       |
  | --------- | ----------------------- | -------------------------- |
  | operation | [Operation](#operation) | 设置账户metadata的操作对象 |

- **错误码**

  | 异常                        | **错误码** | 描述                                             |
  | --------------------------- | ---------- | ------------------------------------------------ |
  | INVALID_SOURCEADDRESS_ERROR | 11002      | Invalid sourceAddress                            |
  | INVALID_DATAKEY_ERROR       | 11011      | The length of key must be between 1 and 1024     |
  | INVALID_DATAVALUE_ERROR     | 11012      | The length of value must be between 0 and 256000 |
  | INVALID_DATAVERSION_ERROR   | 11013      | The version must be equal to or greater than 0   |
  | SYSTEM_ERROR                | 20000      | System error                                     |

### 设置账户权限

- **费用**

  feeLimit目前(2018.07.26)是0.01 BU。

- **调用方法**

  `sdk.operation.accountSetPrivilegeOperation(args);`

- **请求参数**

  args 为 Object 类型，其中包含如下参数：

  | 成员变量      | 类型                                   | 描述                                         |
  | ------------- | -------------------------------------- | -------------------------------------------- |
  | sourceAddress | String                                 | 选填，操作源账户地址                         |
  | masterWeight  | String                                 | 选填，账户自身权重，大小限制[0, max(uint32)] |
  | signers       | Array<[Signer](#signer)>               | 选填，签名者权重列表                         |
  | txThreshold   | String                                 | 选填，交易门限，大小限制[0, max(int64)]      |
  | typeThreshold | Array<[TypeThreshold](#typethreshold)> | 选填，指定类型交易门限                       |
  | metadata      | String                                 | 选填，备注                                   |

- **响应数据**

  | 参数      | 类型                    | 描述                   |
  | --------- | ----------------------- | ---------------------- |
  | operation | [Operation](#operation) | 设置账户权限的操作对象 |

- **错误码**

  | 异常                         | **错误码** | 描述                                            |
  | ---------------------------- | ---------- | ----------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR  | 11002      | Invalid sourceAddress                           |
  | INVALID_MASTERWEIGHT_ERROR   | 11015      | MasterWeight must be between 0 and max(uint32)  |
  | INVALID_SIGNER_ADDRESS_ERROR | 11016      | Invalid signer address                          |
  | INVALID_SIGNER_WEIGHT_ERROR  | 11017      | Signer weight must be between 0 and max(uint32) |
  | INVALID_TX_THRESHOLD_ERROR   | 11018      | TxThreshold must be between 0 and max(int64)    |
  | INVALID_OPERATION_TYPE_ERROR | 11019      | The type of typeThreshold is invalid            |
  | INVALID_TYPE_THRESHOLD_ERROR | 11020      | TypeThreshold must be between 0 and max(int64)  |
  | SYSTEM_ERROR                 | 20000      | System error                                    |

### 发送BU

**注意**：若目标账户未激活，该操作也可使目标账户激活。

- **费用**

  feeLimit目前(2018.07.26)是0.01 BU。

- **调用方法**

  `sdk.operation.buSendOperation(args);`

- **请求参数**

  args 为 Object 类型，其中包含如下参数：

  | 成员变量      | 类型   | 描述                                                         |
  | ------------- | ------ | ------------------------------------------------------------ |
  | sourceAddress | String | 选填，操作源账户地址                                         |
  | destAddress   | String | 必填，目标账户地址                                           |
  | buAmount      | String | 必填，资产发行数量，大小限制[0, max(int64)]，单位是MO，1 BU = 10^8 MO |
  | metadata      | String | 选填，备注                                                   |

- **响应数据**

  | 参数      | 类型                    | 描述             |
  | --------- | ----------------------- | ---------------- |
  | operation | [Operation](#operation) | 发送BU的操作对象 |

- **错误码**

  | 异常                                  | **错误码** | 描述                                         |
  | ------------------------------------- | ---------- | -------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR           | 11002      | Invalid sourceAddress                        |
  | INVALID_DESTADDRESS_ERROR             | 11003      | Invalid destAddress                          |
  | SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR | 11005      | SourceAddress cannot be equal to destAddress |
  | INVALID_BU_AMOUNT_ERROR               | 11026      | BuAmount must be between 1 and max(int64)    |
  | INVALID_ISSUER_ADDRESS_ERROR          | 11027      | Invalid issuer address                       |
  | SYSTEM_ERROR                          | 20000      | System error                                 |

### 发行资产

- **费用**

  feeLimit目前(2018.07.26)是50.01 BU。

- **调用方法**

  `sdk.operation.assetIssueOperation(args);`

- **请求参数**

  args 为 Object 类型，其中包含如下参数：

  | 成员变量      | 类型   | 描述                                        |
  | ------------- | ------ | ------------------------------------------- |
  | sourceAddress | String | 选填，操作源账户地址                        |
  | code          | String | 必填，资产编码，长度限制[1, 64]             |
  | assetAmount   | String | 必填，资产发行数量，大小限制[0, max(int64)] |
  | metadata      | String | 选填，备注                                  |

- **响应数据**

  | 参数      | 类型                    | 描述               |
  | --------- | ----------------------- | ------------------ |
  | operation | [Operation](#operation) | 发行资产的操作对象 |

- **错误码**

  | 异常                        | **错误码** | 描述                                         |
  | --------------------------- | ---------- | -------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR | 11002      | Invalid sourceAddress                        |
  | INVALID_ASSET_CODE_ERROR    | 11023      | The length of key must be between 1 and 64   |
  | INVALID_ASSET_AMOUNT_ERROR  | 11024      | AssetAmount must be between 1 and max(int64) |
  | SYSTEM_ERROR                | 20000      | System error                                 |

### 转移资产

> **注意**：若目标账户未激活，必须先调用激活账户操作。

- **费用**

  feeLimit目前(2018.07.26)是0.01 BU。

- **调用方法**

  `sdk.operation.assetSendOperation(args);`

- **请求参数**

  args 为 Object 类型，其中包含如下参数：

  | 成员变量      | 类型   | 描述                                          |
  | ------------- | ------ | --------------------------------------------- |
  | sourceAddress | String | 选填，操作源账户地址                          |
  | destAddress   | String | 必填，目标账户地址                            |
  | code          | String | 必填，资产编码，长度限制[1, 64]               |
  | issuer        | String | 必填，资产发行账户地址                        |
  | assetAmount   | String | 必填，资产数量，大小限制[0, max(int64)] |
  | metadata      | String | 选填，备注                                    |

- **响应数据**

  | 参数      | 类型                    | 描述               |
  | --------- | ----------------------- | ------------------ |
  | operation | [Operation](#operation) | 转移资产的操作对象 |

- **错误码**

  | 异常                                  | **错误码** | 描述                                         |
  | ------------------------------------- | ---------- | -------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR           | 11002      | Invalid sourceAddress                        |
  | INVALID_DESTADDRESS_ERROR             | 11003      | Invalid destAddress                          |
  | SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR | 11005      | SourceAddress cannot be equal to destAddress |
  | INVALID_ASSET_CODE_ERROR              | 11023      | The length of key must be between 1 and 64   |
  | INVALID_ASSET_AMOUNT_ERROR            | 11024      | AssetAmount must be between 1 and max(int64) |
  | INVALID_ISSUER_ADDRESS_ERROR          | 11027      | Invalid issuer address                       |
  | SYSTEM_ERROR                          | 20000      | System error                                 |

### 创建合约

- **费用**

  feeLimit目前(2018.07.26)是10.01 BU。

- **调用方法**

  `sdk.operation.contractCreateOperation(args);`

- **请求参数**

  args 为 Object 类型，其中包含如下参数：

  | 成员变量      | 类型    | 描述                                                         |
  | ------------- | ------- | ------------------------------------------------------------ |
  | sourceAddress | String  | 选填，操作源账户地址                                         |
  | initBalance   | String  | 必填，给合约账户的初始化资产，单位MO，1 BU = 10^8 MO, 大小限制[1, max(int64)] |
  | type          | Integer | 选填，合约的语种，默认是0                                    |
  | payload       | String  | 必填，对应语种的合约代码                                     |
  | initInput     | String  | 选填，合约代码中init方法的入参                               |
  | metadata      | String  | 选填，备注                                                   |

- **响应数据**

  | 参数      | 类型                    | 描述               |
  | --------- | ----------------------- | ------------------ |
  | operation | [Operation](#operation) | 创建合约的操作对象 |

- **错误码**

  | 异常                                      | **错误码** | 描述                                      |
  | ----------------------------------------- | ---------- | ----------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR               | 11002      | Invalid sourceAddress                     |
  | INVALID_CONTRACTADDRESS_ERROR             | 11037      | Invalid contract address                  |
  | CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR | 11038      | ContractAddress is not a contract account |
  | SYSTEM_ERROR                              | 20000      | System error                              |

### 发送资产触发合约

> **注意**：若合约账户不存在，必须先创建合约账户。

- **费用**

  feeLimit要根据合约中执行交易来做添加手续费，首先发起交易手续费目前(2018.07.26)是0.01BU，然后合约中的交易也需要交易发起者添加相应交易的手续费。

- **调用方法**

  `sdk.operation.contractInvokeByAssetOperation(args);`

- **请求参数**

  args 为 Object 类型，其中包含如下参数：

  | 成员变量        | 类型   | 描述                                                         |
  | --------------- | ------ | ------------------------------------------------------------ |
  | sourceAddress   | String | 选填，操作源账户地址                                         |
  | contractAddress | String | 必填，合约账户地址                                           |
  | code            | String | 选填，资产编码，长度限制[0, 64];当为空时，仅触发合约;        |
  | issuer          | String | 选填，资产发行账户地址，当null时，仅触发合约                 |
  | assetAmount     | String | 选填，资产数量，大小限制[0, max(int64)]，当是0时，仅触发合约。不能以0开头。 |
  | input           | String | 选填，待触发的合约的main()入参                               |
  | metadata        | String | 选填，备注                                                   |

- **响应数据**

  | 参数      | 类型                    | 描述                       |
  | --------- | ----------------------- | -------------------------- |
  | operation | [Operation](#operation) | 发送资产触发合约的操作对象 |

- **错误码**

  | 异常                                      | **错误码** | 描述                                              |
  | ----------------------------------------- | ---------- | ------------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR               | 11002      | Invalid sourceAddress                             |
  | INVALID_INITBALANCE_ERROR                 | 11004      | InitBalance must be between 1 and max(int64)      |
  | PAYLOAD_EMPTY_ERROR                       | 11044      | Payload must be a non-empty string                |
  | SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR | 11040      | SourceAddress cannot be equal to contractAddress  |
  | INVALID_ASSET_CODE_ERROR                  | 11023      | The length of asset code must be between 0 and 64 |
  | INVALID_CONTRACT_ASSET_AMOUNT_ERROR       | 15031      | AssetAmount must be between 0 and max(int64)      |
  | INVALID_ISSUER_ADDRESS_ERROR              | 11027      | Invalid issuer address                            |
  | INVALID_INPUT_ERROR                       | 15029      | Invalid input                                     |
  | SYSTEM_ERROR                              | 20000      | System error                                      |

### 发送BU触发合约

**注意**：若目标账户非合约账户且未激活，该操作也可使目标账户激活。

- **费用**

  feeLimit要根据合约中执行交易来做添加手续费，首先发起交易手续费目前(2018.07.26)是0.01BU，然后合约中的交易也需要交易发起者添加相应交易的手续费。

- **调用方法**

  `sdk.operation.contractInvokeByBUOperation(args);`

- **请求参数**

  args 为 Object 类型，其中包含如下参数：

  | 成员变量        | 类型   | 描述                                                         |
  | --------------- | ------ | ------------------------------------------------------------ |
  | sourceAddress   | String | 选填，操作源账户地址                                         |
  | contractAddress | String | 必填，合约账户地址                                           |
  | buAmount        | String | 选填，资产发行数量，大小限制[0, max(int64)]，当0时仅触发合约 |
  | input           | String | 选填，待触发的合约的main()入参                               |
  | metadata        | String | 选填，备注                                                   |

- **响应数据**

  | 参数      | 类型                    | 描述                     |
  | --------- | ----------------------- | ------------------------ |
  | operation | [Operation](#operation) | 发送BU触发合约的操作对象 |

- **错误码**

  | 异常                                      | **错误码** | 描述                                             |
  | ----------------------------------------- | ---------- | ------------------------------------------------ |
  | INVALID_SOURCEADDRESS_ERROR               | 11002      | Invalid sourceAddress                            |
  | INVALID_CONTRACTADDRESS_ERROR             | 11037      | Invalid contract address                         |
  | CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR | 11038      | ContractAddress is not a contract account        |
  | SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR | 11040      | SourceAddress cannot be equal to contractAddress |
  | INVALID_CONTRACT_BU_AMOUNT_ERROR          | 15030      | BuAmount must be between 0 and max(int64)        |
  | INVALID_INPUT_ERROR                       | 15029      | Invalid input                                    |
  | SYSTEM_ERROR                              | 20000      | System error                                     |

### 日志

- **费用**

  feeLimit目前(2018.07.26)是0.01 BU。

- **调用方法**

  `sdk.operation.logCreateOperation(args);`

- **请求参数**

  args 为 Object 类型，其中包含如下参数：

  | 成员变量      | 类型         | 描述                                        |
  | ------------- | ------------ | ------------------------------------------- |
  | sourceAddress | String       | 选填，操作源账户地址                        |
  | topic         | String       | 必填，日志主题，长度限制[1, 128]            |
  | datas         | List<String> | 必填，日志内容，每个字符串长度限制[1, 1024] |
  | metadata      | String       | 选填，备注                                  |

- **响应数据**

  | 参数      | 类型                    | 描述           |
  | --------- | ----------------------- | -------------- |
  | operation | [Operation](#operation) | 日志的操作对象 |

- **错误码**

  | 异常                        | **错误码** | 描述                                           |
  | --------------------------- | ---------- | ---------------------------------------------- |
  | INVALID_SOURCEADDRESS_ERROR | 11002      | Invalid sourceAddress                          |
  | INVALID_LOG_TOPIC_ERROR     | 11045      | The length of key must be between 1 and 128    |
  | INVALID_LOG_DATA_ERROR      | 11046      | The length of value must be between 1 and 1024 |
  | SYSTEM_ERROR                | 20000      | System error                                   |


## 账户服务

账户服务提供账户相关的接口，包括6个接口：`create`、`checkValid`、 `getInfo`、 `getNonce`、 `getBalance`, `getAssets`、 `getMetadata`。

### create
- **接口说明**
  该接口用于生成私钥及地址。

- **调用方法**

  `sdk.account.create()`

- **响应数据**

   | 参数       | 类型   | 描述 |
   | ---------- | ------ | ---- |
   | privateKey | String | 私钥 |
   | publicKey  | String | 公钥 |
   | address    | String | 地址 |

- **示例**

   ```js
   sdk.account.create().then(result => {
   console.log(result);
   }).catch(err => {
   console.log(err.message);
   });
   ```

### checkValid
- **接口说明**

   该接口用于检查区块链账户地址的有效性

- **调用方法**

  `sdk.account.checkValid(address)`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   address     |   String     |  必填，待检查的区块链账户地址   

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   isValid     | Boolean |  是否有效   

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   SYSTEM_ERROR |   20000     |  System error 

- **示例**

   ```js
   const address = 'buQemmMwmRQY1JkcU7w3nhruoX5N3j6C29uo';

   sdk.account.checkValid(address).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getInfo

- **接口说明**

   该接口用于获取指定的账户信息

- **调用方法**

  `sdk.account.getInfo(address);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   address     |   String     |  必填，待查询的区块链账户地址   

- **响应数据**

   参数    |     类型      |        描述       
   --------- | ------------- | ---------------- 
   address	  |    String     |    账户地址       
   balance	  |    String     |    账户余额，单位MO，1 BU = 10^8 MO, 必须大于0
   nonce	  |    String     |    账户交易序列号，必须大于0
   priv	  | [Priv](#priv) |    账户权限

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR| 11006 | Invalid address
   CONNECTNETWORK_ERROR| 11007| Failed to connect to the network
   SYSTEM_ERROR |   20000     |  System error 

- **示例**

   ```js
   const address = 'buQemmMwmRQY1JkcU7w3nhruo%X5N3j6C29uo';

   sdk.account.getInfo(address).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getNonce

- **接口说明**

   该接口用于获取指定账户的nonce值

- **调用方法**

  `sdk.account.getNonce(address);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   address     |   String     |  必填，待查询的区块链账户地址   

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   nonce       |   String     |  账户交易序列号   

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR| 11006 | Invalid address
   CONNECTNETWORK_ERROR| 11007| Failed to connect to the network
   SYSTEM_ERROR |   20000     |  System error 

- **示例**

   ```js
   const address = 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf';

   sdk.account.getNonce(address).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getBalance

- **接口说明**

   该接口用于获取指定账户的BU的余额

- **调用方法**

  `sdk.account.getBalance(address);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   address     |   String     |  必填，待查询的区块链账户地址   

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   balance     |   String     | BU的余额，单位MO，1 BU = 10^8 MO, 

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR| 11006 | Invalid address
   CONNECTNETWORK_ERROR| 11007| Failed to connect to the network
   SYSTEM_ERROR |   20000     |  System error 

- **示例**

   ```js
   const address = 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf';

   const info = sdk.account.getBalance(address);
   ```

### getAssets

- **接口说明**

   该接口用于获取指定账户的所有资产信息

- **调用方法**

  `sdk.account.getAssets(address);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   address     |   String     |  必填，待查询的账户地址   

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   asset	    | Array<[AssetInfo](#assetinfo)> |账户资产

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR| 11006 | Invalid address
   CONNECTNETWORK_ERROR| 11007| Failed to connect to the network
   NO_ASSET_ERROR|11009|The account does not have the asset
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   const address = 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf';

   sdk.account.getAssets(address).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getMetadata

- **接口说明**

   该接口用于获取指定账户的metadata信息

- **调用方法**

  `sdk.account.getMetadata(args);`

- **请求参数**

   args 为 Object 类型，其中包含如下参数：

   参数   |   类型   |        描述       
   -------- | -------- | ---------------- 
   address  |  String  |  必填，待查询的账户地址  
   key      |  String  |  选填，metadata关键字，长度限制[1, 1024]

- **响应数据**

   参数      |     类型    |        描述       
   ----------- | ----------- | ---------------- 
   metadata    |[MetadataInfo](#metadatainfo)   |  账户

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR | 11006 | Invalid address
   CONNECTNETWORK_ERROR | 11007 | Failed to connect to the network
   NO_METADATA_ERROR|11010|The account does not have the metadata
   INVALID_DATAKEY_ERROR | 11011 | The length of key must be between 1 and 1024
   SYSTEM_ERROR | 20000| System error


- **示例**

   ```js

   const args = {
       address: 'buQswSaKDACkrFsnP1wcVsLAUzXQsemauEjf',
       key: 'test'
   };

   sdk.account.getMetadata(args).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

## 资产服务

遵循ATP1.0协议，账户服务提供资产相关的接口，目前有1个接口：`getInfo`

### getInfo

- **接口说明**

   该接口用于获取指定账户的指定资产信息

- **调用方法**

  `sdk.token.asset.getInfo(args);`

- **请求参数**

   args 为 Object 类型，其中包含如下参数：

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   address     |   String    |  必填，待查询的账户地址
   code        |   String    |  必填，资产编码，长度限制[1, 64]
   issuer      |   String    |  必填，资产发行账户地址

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   asset	    | [AssetInfo](#assetinfo) |账户资产   

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_ADDRESS_ERROR|11006|Invalid address
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   INVALID_ASSET_CODE_ERROR|11023|The length of asset code must be between 1 and 64
   INVALID_ISSUER_ADDRESS_ERROR|11027|Invalid issuer address
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   const args = {
       address: 'buQnnUEBREw2hB6pWHGPzwanX7d28xk6KVcp',
       code: 'TST',
       issuer: 'buQnnUEBREw2hB6pWHGPzwanX7d28xk6KVcp',
   };

   sdk.token.asset.getInfo(args).then(data => {
       console.log(data);
   });

   ```

## 合约服务

合约服务提供合约相关的接口，目前有4个接口：`checkValid`、 `getInfo`、 `getAddress` 和  `call`。

### checkValid

- **接口说明**

   该接口用于检测合约账户的有效性

- **调用方法**

  `sdk.contract.checkValid(contractAddress)`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   contractAddress     |   String     |  待检测的合约账户地址   

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   isValid     |   Boolean     |  是否有效   

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_CONTRACTADDRESS_ERROR|11037|Invalid contract address
   CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR | 11038      | ContractAddress is not a contract account 
   SYSTEM_ERROR |   20000     |  System error 

- **示例**

   ```js
   const contractAddress = 'buQhP94E8FjWDF3zfsxjqVQDeBypvzMrB3y3';

   sdk.contract.checkValid(contractAddress).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getInfo

- **接口说明**

   该接口用于查询合约代码

- **调用方法**

  `sdk.contract.getInfo(contractAddress);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   contractAddress     |   String     |  待查询的合约账户地址   

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   contract|[ContractInfo](#contractinfo)|合约信息

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_CONTRACTADDRESS_ERROR|11037|Invalid contract address
   CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR|11038|contractAddress is not a contract account
   NO_SUCH_TOKEN_ERROR|11030|No such token
   GET_TOKEN_INFO_ERROR|11066|Failed to get token info
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   const contractAddress = 'buQqbhTrfAqZtiX79zp4MWwUVfpcadvtz2TM';

   sdk.contract.getInfo(contractAddress).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getAddress

- **接口说明**

  该接口用于查询合约地址

- **调用方法**

  `sdk.contract.getAddress(hash);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   hash     |   String     |  创建合约交易的hash   

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   contractAddressList|List<[ContractAddressInfo](#contractaddressinfo)>|合约地址列表

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_HASH_ERROR|11055|Invalid transaction hash
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   const hash = 'f298d08ec3987adc3aeef73e81cbb49cbad2316145ba190700de2d78657880c0';
   sdk.contract.getAddress(hash).then(data => {
       console.log(data);
   })
   ```

### call 

- **接口说明**

   该接口用于调试合约代码

- **调用方法**

  `sdk.contract.call(args);`

- **请求参数**

   args 为 Object 类型，其中包含如下参数：

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   sourceAddress|String|选填，合约触发账户地址
   contractAddress|String|选填，合约账户地址，与code不能同时为空
   code|String|选填，合约代码，与contractAddress不能同时为空，长度限制[1, 64]
   input|String|选填，合约入参
   contractBalance|String|选填，赋予合约的初始 BU 余额, 单位MO，1 BU = 10^8 MO, 大小限制[1, max(int64)]
   optType|Integer|必填，0: 调用合约的读写接口 init, 1: 调用合约的读写接口 main, 2 :调用只读接口 query
   feeLimit|String|交易要求的最低手续费， 大小限制[1, max(int64)]，不能以0开头
   gasPrice|String|交易燃料单价，大小限制[1000, max(int64)，不能以0开头


- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   logs|JSONObject|日志信息
   queryRets|JSONArray|查询结果集
   stat|[ContractStat](#contractstat)|合约资源占用信息
   txs|Array<[TransactionEnvs](#transactionenvs)>|交易集

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_SOURCEADDRESS_ERROR|11002|Invalid sourceAddress
   INVALID_CONTRACTADDRESS_ERROR|11037|Invalid contract address
   CONTRACTADDRESS_CODE_BOTH_NULL_ERROR|11063|ContractAddress and code cannot be empty at the same time
   INVALID_OPTTYPE_ERROR|11064|OptType must be between 0 and 2
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   const args = {
       code: '"use strict";log(undefined);function query() { getBalance(thisAddress); }',
       feeLimit: '1000000000',
       optType: 2
   }

   sdk.contract.call(args).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```


## 区块服务

区块服务主要是区块相关的接口，目前有11个接口：`getNumber`、 `checkStatus`、 `getTransactions`、 `getInfo`、 `getLatestInfo`、 `getValidators`、 `getLatestValidators`、 `getReward`、 `getLatestReward`、 `getFees`、 `getLatestFees`。

### getNumber

- **接口说明**

   该接口用于查询最新的区块高度。

- **调用方法**

  `sdk.block.getNumber();`

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   blockNumber|String|最新的区块高度，对应底层字段seq

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   sdk.block.getNumber().then((result) => {
   console.log(result);
   }).catch((err) => {
   console.log(err.message);
   });
   ```

### checkStatus

- **接口说明**

   该接口用于检查本地节点区块是否同步完成。

- **调用方法**

  `sdk.block.checkStatus();`

- **响应数据**

   参数      |     类型     |        描述       |
   ----------- | ------------ | ---------------- |
   isSynchronous    |   Boolean     |  区块是否同步   |

- **错误码**

   异常       |     错误码   |   描述   |
   -----------  | ----------- | -------- |
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   sdk.block.checkStatus().then((result) => {
       console.log(result);
   }).catch((err) => {
       console.log(err.message);
   });
   ```

### getTransactions

- **接口说明**

   该接口用于查询指定区块高度下的所有交易。

- **调用方法**

   `sdk.block.getTransactions(blockNumber);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   blockNumber|String|必填，待查询的区块高度，必须大于0

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   totalCount|String|返回的总交易数
   transactions|Array<[TransactionHistory](#transactionhistory)>|交易内容

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must bigger than 0
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   QUERY_RESULT_NOT_EXIST|15014|Query result does not exist
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   sdk.block.getTransactions(100).then(result => {
       console.log(result);
       console.log(JSON.stringify(result));
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getInfo

- **接口说明**

   该接口用于获取区块信息。

- **调用方法**

  `sdk.block.getInfo(blockNumber);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   blockNumber|String|必填，待查询的区块高度

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   closeTime|String|区块关闭时间
   number|String|区块高度
   txCount|String|交易总量
   version|String|区块版本

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must bigger than 0
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   sdk.block.getInfo(100).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getLatestInfo

- **接口说明**

   该接口用于获取最新区块信息。

- **调用方法**

  `sdk.block. getLatestInfo();`

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   closeTime|String|区块关闭时间
   number|String|区块高度，对应底层字段seq
   txCount|String|交易总量
   version|String|区块版本


- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   sdk.block.getLatestInfo().then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getValidators

- **接口说明**

   该接口用于获取指定区块中所有验证节点数。

- **调用方法**

  `sdk.block.getValidators(blockNumber);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   blockNumber|String|必填，待查询的区块高度，必须大于0

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   validators|Array<[ValidatorInfo](#validatorinfo)>|验证节点列表

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must bigger than 0
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   sdk.block.getValidators(100).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getLatestValidators

- **接口说明**

   该接口用于获取最新区块中所有验证节点数。

- **调用方法**

  `sdk.block.getLatestValidators();`

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   validators|Array<[ValidatorInfo](#validatorinfo)>|验证节点列表

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   sdk.block.getLatestValidators().then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getReward

- **接口说明**

   该接口用于获取指定区块中的区块奖励和验证节点奖励。

- **调用方法**

  `sdk.block.getReward(blockNumber);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   blockNumber|String|必填，待查询的区块高度，必须大于0

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   blockReward|String|区块奖励数
   validatorsReward|Array<[ValidatorReward](#validatorreward)>|验证节点奖励情况


- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must bigger than 0
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   sdk.block.getReward(100).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getLatestReward

- **接口说明**

   获取最新区块中的区块奖励和验证节点奖励。

- **调用方法**

  `BlockGetLatestRewardResponse getLatestReward();`

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   blockReward|String|区块奖励数
   validatorsReward|[ValidatorReward](#validatorreward)[]|验证节点奖励情况

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   sdk.block.getLatestReward().then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getFees

- **接口说明**

   获取指定区块中的账户最低资产限制和燃料单价。

- **调用方法**

  `sdk.block.getFees(blockNumber);`

- **请求参数**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   blockNumber|String|必填，待查询的区块高度，必须大于0

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   fees|[Fees](#fees)|费用

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must bigger than 0
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   sdk.block.getFees(100).then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```

### getLatestFees

- **接口说明**

   该接口用于获取最新区块中的账户最低资产限制和燃料单价。

- **调用方法**

  `sdk.block.getLatestFees();`

- **响应数据**

   参数      |     类型     |        描述       
   ----------- | ------------ | ---------------- 
   fees|[Fees](#fees)|费用

- **错误码**

   异常       |     错误码   |   描述   
   -----------  | ----------- | -------- 
   CONNECTNETWORK_ERROR|11007|Failed to connect to the network
   SYSTEM_ERROR|20000|System error

- **示例**

   ```js
   sdk.block.getLatestFees().then(result => {
       console.log(result);
   }).catch(err => {
       console.log(err.message);
   });
   ```



## 数据对象
#### Priv

| 成员         | 类型                    | 描述                                                    |
| ------------ | ----------------------- | ------------------------------------------------------- |
| masterWeight | String                  | 账户自身权重，大小限制[0, (max(int32) * 2L + 1)] |
| signers      | [Signer](#signer)[]     | 签名者权重列表                                          |
| threshold    | [Threshold](#threshold) | 门限                                                    |

#### Signer

| 成员    | 类型   | 描述                                                  |
| ------- | ------ | ----------------------------------------------------- |
| address | String | 签名者区块链账户地址                                  |
| weight  | String | 签名者权重，大小限制[0, (max(int32) * 2L + 1)] |

#### Threshold

| 成员           | 类型                              | 描述                                        |
| -------------- | --------------------------------- | ------------------------------------------- |
| txThreshold    | String                            | 交易默认门限，大小限制[0, max(int64)] |
| typeThresholds | [TypeThreshold](#typethreshold)[] | 不同类型交易的门限                          |

#### TypeThreshold

| 成员      | 类型   | 描述                                  |
| --------- | ------ | ------------------------------------- |
| type      | String | 操作类型，必须大于0                   |
| threshold | String | 门限值，大小限制[0, max(int64)] |

#### AssetInfo

| 成员        | 类型        | 描述         |
| ----------- | ----------- | ------------ |
| key         | [Key](#key) | 资产惟一标识 |
| assetAmount | String      | 资产数量     |

#### Key

| 成员   | 类型   | 描述             |
| ------ | ------ | ---------------- |
| code   | String | 资产编码         |
| issuer | String | 资产发行账户地址 |

#### ContractInfo

成员      |     类型     |        描述       |
----------- | ------------ | ---------------- |
type|Integer|合约类型，默认0
payload|String|合约代码

#### MetadataInfo
成员      |     类型    |        描述       
----------- | ----------- | ---------------- 
key         |  String     |  metadata的关键词
value       |  String     |  metadata的内容
version     |  String    |  metadata的版本

#### ContractAddressInfo

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
contractAddress|String|合约地址
operationIndex|Integer|所在操作的下标

#### ContractStat

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
applyTime|String|接收时间
memoryUsage|String|内存占用量
stackUsage|String|堆栈占用量
step|String|几步完成

#### TransactionEnvs

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
transactionEnv|[TransactionEnv](#transactionenv)|交易

#### TransactionEnv

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
transaction|[TransactionInfo](#transactioninfo)|交易内容
trigger|[ContractTrigger](#contracttrigger)|合约触发者

#### TransactionInfo

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
sourceAddress|String|交易发起的源账户地址
feeLimit|String|交易要求的最低费用
gasPrice|String|交易燃料单价
nonce|String|交易序列号
operations|[Operation](#operation)[]|操作列表

#### ContractTrigger
成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
transaction|[TriggerTransaction](#triggertransaction)|触发交易

#### Operation

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
type|Integer|操作类型
sourceAddress|String|操作发起源账户地址
metadata|String|备注
createAccount|[OperationCreateAccount](#operationcreateaccount)|创建账户操作
issueAsset|[OperationIssueAsset](#operationissueasset)|发行资产操作
payAsset|[OperationPayAsset](#operationpayasset)|转移资产操作
payCoin|[OperationPayCoin](#operationpaycoin)|发送BU操作
setMetadata|[OperationSetMetadata](#operationsetmetadata)|设置metadata操作
setPrivilege|[OperationSetPrivilege](#operationsetprivilege)|设置账户权限操作
log|[OperationLog](#operationlog)|记录日志

#### TriggerTransaction

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
hash|String|交易hash

#### OperationCreateAccount

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
destAddress|String|目标账户地址
contract|[Contract](#contract)|合约信息
priv|[Priv](#priv)|账户权限
metadata|[MetadataInfo](#metadatainfo)[]|账户
initBalance|String|账户资产, 单位MO，1 BU = 10^8 MO, 
initInput|String|合约init函数的入参

#### Contract

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
type|Integer| 合约的语种，默认不赋值
payload|String|对应语种的合约代码

#### MetadataInfo

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
key|String|metadata的关键词
value|String|metadata的内容
version|String|metadata的版本

#### OperationIssueAsset

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
code|String|资产编码
assetAmount|String|资产数量

#### OperationPayAsset

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
destAddress|String|待转移的目标账户地址
asset|[AssetInfo](#assetinfo)|账户资产
input|String|合约main函数入参

#### OperationPayCoin

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
destAddress|String|待转移的目标账户地址
buAmount|String|待转移的BU数量
input|String|合约main函数入参

#### OperationSetMetadata

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
key|String|metadata的关键词
value|String|metadata的内容
version|String|metadata的版本
deleteFlag|boolean|是否删除metadata

#### OperationSetPrivilege

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
masterWeight|String|账户自身权重，大小限制[0, (max(int32) * 2L + 1)]
signers|[Signer](#signer)[]|签名者权重列表
txThreshold|String|交易门限，大小限制[0, max(int64)]
typeThreshold|[TypeThreshold](#typethreshold)|指定类型交易门限

#### OperationLog

成员      |     类型     |        描述       
----------- | ------------ | ---------------- 
topic|String|日志主题
data|String[]|日志内容

#### TestTx

| 成员       | 类型                                        | 描述         |
| -------------- | ------------------------------------------- | ------------ |
| transactionEnv | [TestTransactionFees](#testtransactionfees) | 评估交易费用 |

#### TestTransactionFees

| 成员        | 类型                                | 描述     |
| --------------- | ----------------------------------- | -------- |
| transactionFees | [TransactionFees](#transactionfees) | 交易费用 |

#### TransactionFees

| 成员 | 类型   | 描述               |
| -------- | ------ | ------------------ |
| feeLimit | String | 交易要求的最低费用 |
| gasPrice | String | 交易燃料单价       |

#### Signature

| 成员  | 类型   | 描述       |
| --------- | ------ | ---------- |
| signData  | String | 签名后数据 |
| publicKey | String | 公钥       |

#### TransactionHistory

| 成员    | 类型                                | 描述         |
| ----------- | ----------------------------------- | ------------ |
| actualFee   | String                              | 交易实际费用 |
| closeTime   | String                              | 交易关闭时间 |
| errorCode   | String                              | 交易错误码   |
| errorDesc   | String                              | 交易描述     |
| hash        | String                              | 交易hash     |
| ledgerSeq   | String                              | 区块序列号   |
| transaction | [TransactionInfo](#transactioninfo) | 交易内容列表 |
| signatures  | [Signature](#signature)[]           | 签名列表     |
| txSize      | String                              | 交易大小     |

#### ValidatorReward

| 成员  | 类型   | 描述         |
| --------- | ------ | ------------ |
| validator | String | 验证节点地址 |
| reward    | String | 验证节点奖励 |

#### ValidatorInfo

| 成员        | 类型   | 描述         |
| --------------- | ------ | ------------ |
| address         | String | 共识节点地址 |
| plegeCoinAmount | String | 验证节点押金 |

#### Fees

| 成员    | 类型   | 描述                                 |
| ----------- | ------ | ------------------------------------ |
| baseReserve | String | 账户最低资产限制                     |
| gasPrice    | String | 交易燃料单价，单位MO，1 BU = 10^8 MO |



## **错误码**

异常       |     错误码   |   描述   
-----------  | ----------- | -------- 
ACCOUNT_CREATE_ERROR|11001|Failed to create the account 
INVALID_SOURCEADDRESS_ERROR|11002|Invalid sourceAddress
INVALID_DESTADDRESS_ERROR|11003|Invalid destAddress
INVALID_INITBALANCE_ERROR|11004|InitBalance must be between 1 and max(int64) 
SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR|11005|SourceAddress cannot be equal to destAddress
INVALID_ADDRESS_ERROR|11006|Invalid address
CONNECTNETWORK_ERROR|11007|Failed to connect to the network
INVALID_ISSUE_AMOUNT_ERROR|11008|Amount of the token to be issued must be between 1 and max(int64)
NO_ASSET_ERROR|11009|The account does not have the asset
NO_METADATA_ERROR|11010|The account does not have the metadata
INVALID_DATAKEY_ERROR|11011|The length of key must be between 1 and 1024
INVALID_DATAVALUE_ERROR|11012|The length of value must be between 0 and 256000
INVALID_DATAVERSION_ERROR|11013|The version must be equal to or greater than 0 
INVALID_MASTERWEIGHT_ERROR|11015|MasterWeight must be between 0 and (max(int32) * 2L + 1)
INVALID_SIGNER_ADDRESS_ERROR|11016|Invalid signer address
INVALID_SIGNER_WEIGHT_ERROR|11017|Signer weight must be between 0 and (max(int32) * 2L + 1)
INVALID_TX_THRESHOLD_ERROR|11018|TxThreshold must be between 0 and max(int64)
INVALID_OPERATION_TYPE_ERROR|11019|Operation type must be between 1 and 100
INVALID_TYPE_THRESHOLD_ERROR|11020|TypeThreshold must be between 0 and max(int64)
INVALID_ASSET_CODE_ERROR|11023|The length of key must be between 1 and 64
INVALID_ASSET_AMOUNT_ERROR|11024|AssetAmount must be between 0 and max(int64)
INVALID_BU_AMOUNT_ERROR|11026|BuAmount must be between 0 and max(int64)
INVALID_ISSUER_ADDRESS_ERROR|11027|Invalid issuer address
NO_SUCH_TOKEN_ERROR|11030|No such token
INVALID_TOKEN_NAME_ERROR|11031|The length of token name must be between 1 and 1024
INVALID_TOKEN_SIMBOL_ERROR|11032|The length of symbol must be between 1 and 1024
INVALID_TOKEN_DECIMALS_ERROR|11033|Decimals must be between 0 and 8
INVALID_TOKEN_TOTALSUPPLY_ERROR|11034|TotalSupply must be between 1 and max(int64)
INVALID_TOKENOWNER_ERRPR|11035|Invalid token owner
INVALID_CONTRACTADDRESS_ERROR|11037|Invalid contract address
CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR|11038|contractAddress is not a contract account
INVALID_TOKEN_AMOUNT_ERROR|11039|TokenAmount must be between 1 and max(int64)
SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR|11040|SourceAddress cannot be equal to contractAddress
INVALID_FROMADDRESS_ERROR|11041|Invalid fromAddress
FROMADDRESS_EQUAL_DESTADDRESS_ERROR|11042|FromAddress cannot be equal to destAddress
INVALID_SPENDER_ERROR|11043|Invalid spender
PAYLOAD_EMPTY_ERROR|11044|Payload cannot be empty
INVALID_LOG_TOPIC_ERROR|11045|The length of a log topic must be between 1 and 128
INVALID_LOG_DATA_ERROR|11046|The length of one piece of log data must be between 1 and1024
INVALID_CONTRACT_TYPE_ERROR|11047|Invalid contract type
INVALID_NONCE_ERROR|11048|Nonce must be between 1 and max(int64)
INVALID_GASPRICE_ERROR|11049|GasPrice must be between 1000 and max(int64)
INVALID_FEELIMIT_ERROR|11050|FeeLimit must be between 1 and max(int64)
OPERATIONS_EMPTY_ERROR|11051|Operations cannot be empty
INVALID_CEILLEDGERSEQ_ERROR|11052|CeilLedgerSeq must be equal to or greater than 0
OPERATIONS_ONE_ERROR|11053|One of the operations cannot be resolved
INVALID_SIGNATURENUMBER_ERROR|11054|SignagureNumber must be between 1 and max(int32)
INVALID_HASH_ERROR|11055|Invalid transaction hash
INVALID_BLOB_ERROR|11056|Invalid blob
PRIVATEKEY_NULL_ERROR|11057|PrivateKeys cannot be empty
PRIVATEKEY_ONE_ERROR|11058|One of privateKeys is invalid
SIGNDATA_NULL_ERROR|11059|SignData cannot be empty
INVALID_BLOCKNUMBER_ERROR|11060|BlockNumber must be bigger than 0
PUBLICKEY_NULL_ERROR|11061|PublicKey cannot be empty
URL_EMPTY_ERROR|11062|Url cannot be empty
CONTRACTADDRESS_CODE_BOTH_NULL_ERROR|11063|ContractAddress and code cannot be empty at the same time
INVALID_OPTTYPE_ERROR|11064|OptType must be between 0 and 2
GET_ALLOWANCE_ERROR|11065|Failed to get allowance
GET_TOKEN_INFO_ERROR|11066|Failed to get token info
SIGNATURE_EMPTY_ERROR|11067|The signatures cannot be empty
REQUEST_NULL_ERROR|12001|Request parameter cannot be null
INVALID_ARGUMENTS|15016|Invalid arguments to the function
INVALID_FORMAT_OF_ARG|15019|Invalid argument format to the function
INVALID_SIGNATURE_ERROR|15027|Invalid signature
INVALID_METADATA_ERROR|15028|Invalid metadata
INVALID_INPUT_ERROR|15029|invalid input
INVALID_CONTRACT_BU_AMOUNT_ERROR|15030|BuAmount must be between 0 and max(int64)
INVALID_CONTRACT_ASSET_AMOUNT_ERROR|15031|AssetAmount must be between 0 and max(int64)
CONNECTN_BLOCKCHAIN_ERROR|19999|Failed to connect to the blockchain 
SYSTEM_ERROR|20000|System error
