---
id: version-1.0.0.10-api_http
title: BUMO HTTP
sidebar_label: HTTP
original_id: api_http
---

## 概要

在使用BUMO的http接口前需要对http接口中的数据格式、http的web服务器、端口配置、交易过程、交易的操作等基本信息进行了解。

### json

http接口中的数据都是json格式的。

### http

BUMO 区块链提供了http API接口。您可以在 安装目录/config/bumo.json 文件种找到`"webserver"`对象,它们指定了http服务端口。

```json
    "webserver":
    {
      "listen_addresses": "0.0.0.0:36002"
    }
```

### 端口配置

| 网络类型        | WebServer |
| ------------- | --------- |
| mainnet    | 16002 |
| testnet   | 26002 |
| 内测版本  |  36002 |



### 交易过程

- 根据意愿组装交易对象`Transaction`, 不同的交易有不同的数据结构(详见:[交易](#交易))
- 交易对象序列化为字节流 `transaction_blob`(详见:[序列化交易](#序列化交易))
- 用私钥`skey`对`transaction_blob`签名得到`sign_data`，`skey`的公钥为`pkey`(详见:[Keypair手册](../keypair_guide))
- 提交交易(详见:[提交交易](#提交交易))
- 根据交易的hash查询以确定交易是否成功(详见:[查询交易](#查询交易))

完整的交易过程参考[示例](#示例)。



### 试一试

如果您的区块链刚刚部署完成，那么目前区块链系统中只有创世账号。您可以通过http接口查询创世账号
`HTTP GET host:36002/getGenesisAccount`
您会得到类似这样的返回内容：

```json
{
   "error_code" : 0,
   "result" : {
      "address" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3",
      "assets" : null,
      "balance" : 100000000000000000,
      "metadatas" : null,
      "priv" : {
         "master_weight" : 1,
         "thresholds" : {
            "tx_threshold" : 1
         }
      }
   }
}
```

返回结果中的`address`的值就是创世账号。
您还可以通过[查询账号](#查询账号)接口查询任意账号。

```http
HTTP GET host:36002/getAccount?address=buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3
```



## 交易

- json结构

    ```json
      {
          "source_address":"buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3",//交易源账号，即交易的发起方
          "nonce":2, //交易源账户的nonce值
          "fee_limit" : 1000000, //愿为交易花费的手续费
          "gas_price": 1000,//gas价格(不小于配置的最低值)
          "ceil_ledger_seq": 100, //可选，区块高度限制, 如果大于0，则交易只有在该区块高度之前（包括该高度）才有效
          "metadata":"0123456789abcdef", //可选，用户自定义给交易的备注，16进制格式
          "operations":[
          {
          //根据不同的操作填写
          },
          {
          //根据不同的操作填写
          }
          ......
          ]
      }
    ```

- json的关键字

    | 关键字          | 类型   | 描述                                                         |
    | --------------- | ------ | ------------------------------------------------------------ |
    | source_address  | string | 交易源账号，即交易发起方的账号。当这笔交易成功后，交易源账号的nonce字段会自动加1。账号中的nonce意义是本账号作为交易源执行过的交易数量 |
    | nonce           | int64  | 其值必须等于交易源账号的当前nonce+1，这是为了防止重放攻击而设计的。如何查询一个账号的nonce可参考[查询账号](#查询账号)。若查询账号没有显示nonce值，说明账号的当前nonce是0 |
    | fee_limit       | int64  | 本交易能接受的最大的手续费。交易首先会按照这个费用收取手续费，若交易执行成功，则会收取实际的花费，否则将收取这个字段的费用。单位是MO，1 BU ＝ 10^8 MO |
    | gas_price       | int64  | 用于计算每个操作的手续费，还参与交易字节费的计算。单位是MO，1 BU ＝ 10^8 MO |
    | ceil_ledger_seq | int64  | 可选，针对本交易的区块高度限制条件，高级功能               |
    | operations      | array  | 操作列表。本交易的有效负载，即本交易想要做什么事情。(详见:[操作](#操作)) |
    | metadata        | string | 可选，用户自定义字段，可以不填写，备注用                   |



## 操作

交易的json结构里面对应的`operations`，可以包含一个或者多个操作。

- json结构
    ```json
    {
        "type": 1,//操作类型
        "source_address": "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3",//可选，操作源账户，即操作的执行方
        "metadata": "0123456789abcdef",//可选，用户自定义给交易的备注，16进制格式
        "create_account": {
            //创建账户的相关参数
        },
        "issue_asset": {
            //发行资产的相关参数
        },
        "pay_asset": {
            //转移资产的相关参数
        },
        "set_metadata": {
            //设置账户metadata的相关参数
        },
        "pay_coin": {
            //转移原生币(这里指BU)的相关参数
        },
        "set_privilege": {
            //设置账户权限的相关参数 
        },
        "log": {
            //记录日志的相关参数
        }
    }
    ```

- json的关键字

    | 关键字         | 类型   | 描述                                                         |
    | -------------- | ------ | ------------------------------------------------------------ |
    | type           | int    | 操作码，不同的操作码执行不同的操作，详见[操作码](#操作码) |
    | source_address | string | 可选，操作源账户，即操作的执行方。当不填写时，默认与交易的源账户相同 |
    | metadata       | string | 可选，用户自定义字段，可以不填写，备注用                  |
    | create_account | json   | [创建账号](#创建账号)操作                                    |
    | issue_asset    | json   | [发行资产](#发行资产)操作                                    |
    | pay_asset      | json   | [转移资产](#转移资产)操作                                    |
    | set_metadata   | json   | [设置metadata](#设置metadata)操作                            |
    | pay_coin       | json   | [转移BU资产](#转移bu资产)操作                              |
    | log            | json   | [记录日志](#记录日志)操作                                    |
    | set_privilege  | json   | [设置权限](#设置权限)操作                                    |



### 操作码

| 操作码  | 操作            | 说明         |
| :----- | ----------------- | ------------ |
| 1      | create_account    | [创建账号](#创建账号)     |
| 2      | issue_asset       | [发行资产](#发行资产)     |
| 3      | pay_asset         | [转移资产](#转移资产)     |
| 4      | set_metadata      | [设置metadata](#设置metadata) |
| 7      | pay_coin          | [转移BU资产](#转移bu资产) |
| 8      | log               | [记录日志](#记录日志)     |
| 9      | set_privilege     | [设置权限](#设置权限)     |

### 创建账号
操作源账号在区块链上创建一个新的账号。创建账户操作分为[创建普通账号](#创建普通账号)和[创建合约账号](#创建合约账号)。


#### 创建普通账号

> **注意**：在当前操作中，master_weight和tx_threshold都必须是1。

- json结构
    ```json
    {
          "dest_address": "buQcSAePGfDiaW9t9xsWFVRA3ZwGVcRpR9CZ",//待创建的目标账户地址
          "init_balance": 100000,//目标账户的初始化余额
          "priv":  {
                "master_weight": 1,//目标账户拥有的权力值
                "thresholds": {
                      "tx_threshold": 1//发起交易需要的权力值
                }
          }
    }
    ```

- json的关键字

    | 关键字        | 类型   | 描述                                                         |
    | ------------- | ------ | ------------------------------------------------------------ |
    | dest_address  | string | 目标账号的地址。创建普通账号时，不能为空                  |
    | init_balance  | int64  | 目标账户的初始化 BU 值，单位是MO，1 BU = 10^8 MO          |
    | master_weight | int64  | 目标账号的 master 权重，数值范围［0, MAX(UINT32)]          |
    | tx_threshold  | int64  | 发起交易的门限，低于该值，无法发起交易，数值范围[0, MAX(INT64)] |

- 查询

  账户信息通过[查询账号](#查询账号)接口查询。


#### 创建合约账号

> **注意**：在当前操作中，`master_weight`必须是0，`tx_threshold`必须是1。

- json结构
    ```json
    {
        "contract": { //合约
            "payload": "
                'use strict';
                function init(bar)
                {
                  return;
                }

                function main(input)
                {
                  return;
                }

                function query()
                {
                  return;
                }
              "//合约代码
            },
            "init_balance": 100000,  //合约账户初始化资产
            "init_input" : "{\"method\":\"toWen\",\"params\":{\"feeType\":0}}",//可选，合约代码init函数的入参
            "priv": {
                "master_weight": 0,//待创建的合约账户拥有的权力值
                "thresholds": {
                "tx_threshold": 1　//发起交易需要的权力值
            }
        }
    }
    ```

- json的关键字

    | 关键字        | 类型   | 描述                                             |
    | ------------- | ------ | ------------------------------------------------ |
    | payload       | string | 合约代码内容                                     |
    | init_balance  | int64  | 目标账户的初始化 BU 值，单位是MO，1 BU = 10^8 MO |
    | init_input    | string | 可选，合约代码中init函数的入参                   |
    | master_weight | int64  | 目标账号的 master 权重                           |
    | tx_threshold  | int64  | 发起交易的门限，低于该值，无法发起交易           |

- 查询

  - 账户信息通过[查询账号](#查询账号)接口查询。

  - 通过[查询交易](#查询交易)接口查询，在`result`中`transactions`的`error_desc`字段中，结果如下：

    ```json
    [
        {
            "contract_address": "buQm5RazrT9QYjbTPDwMkbVqjkVqa7WinbjM", //合约账号
            "operation_index": 0                                        //交易数组中的操作索引值，0 表示第一笔交易
        }
    ]
    ```



### 发行资产

- 功能

  操作源账号发行一笔数字资产，执行成功后操作源账号的资产余额中会出现这一笔资产。

- json结构

    ```json
    {
        "code": "HYL", //待发行资产的代码
        "amount": 1000 //待发行资产的数量
    }
    ```

- json的关键字

    | 关键字 | 类型   | 描述                                       |
    | ------ | ------ | ------------------------------------------ |
    | code   | string | 待发行资产的代码，长度范围[1, 64]        |
    | amount | int64  | 待发行资产的数量，数值范围(0,MAX(int64)) |



### 转移资产

> **注意**：如果目标账户是合约账户，则当前操作会触发目标账户的合约执行。

- 功能

  操作源账号将一笔资产转给目标账户。

- json结构

    ```json
    {
        "dest_address": "buQcSAePGfDiaW9t9xsWFVRA3ZwGVcRpR9CZ",//待接收资产的目标账户
        "asset": {
            "key": {
                "issuer": "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3",//资产的发行账户
                "code": "HYL" // 待转移的资产代码
            },
            "amount": 100 //待转移的资产数量
        },
        "input": "{\"bar\":\"foo\"}"　// 可选，目标账户中合约代码main函数的入参
    }
    ```

- json的关键字

    | 关键字       | 类型   | 描述                                                         |
    | ------------ | ------ | ------------------------------------------------------------ |
    | dest_address | string | 目标账户地址                                            |
    | issuer       | string | 资产发行方地址                                             |
    | code         | string | 资产代码，长度范围[1, 64]                                  |
    | amount       | int64  | 资产数量，数值范围(0,MAX(int64))                             |
    | input        | string | 可选，如果目标账户是合约账户，input会被传递给合约代码的main函数的参数。如果目标账户是普通账户，则该设置无效 |



### 设置metadata

- 功能

  操作源账号修改或添加一个metadata到自己的metadata表中。

- json结构

    ```json
    {
        "key": "abc",//metadata关键字
        "value": "hello abc!",//metadata内容
        "version": 0 //可选，metadata版本号
    }
    ```

- json的关键字

    | 关键字  | 类型   | 描述                                                         |
    | ------- | ------ | ------------------------------------------------------------ |
    | key     | string | metadata的关键字。长度范围(0, 1024]                        |
    | value   | string | metadata的内容。长度范围[0, 256K]                          |
    | version | int64  | 可选，metadata版本号。默认值是0。0：不限制版本，>0 : 当前 value 的版本必须为该值， <0 : 非法|



### 设置权限

- 功能

  设置签名者拥有的权重，设置各个操作所需要的门限。详情请见[控制权的分配](#控制权的分配)。

- json结构

    ```json
    {
        "master_weight": "10",//可选，当前账户的自身权力值
        "signers"://可选，需要操作的签名者列表
        [
            {
                "address": "buQqfssWJjyKfFHZYx8WcSgLVUdXPT3VNwJG",//需要操作的签名者地址
                "weight": 8　//可选，签名者的权力值
            }
        ],
        "tx_threshold": "2",//可选，发起交易需要权力值
        "type_thresholds"://可选，不同操作需要的权力值
        [
            {
                "type": 1,//创建账户操作类型
                "threshold": 8　//可选，该操作需要的权力值
            },
            {
                "type": 2,//发行资产操作类型
                "threshold": 9 //可选该操作需要的权力值
            }
        ]
    }
    ```



- json关键字

    | 关键字          | 类型   | 描述                                                         |
    | --------------- | ------ | ------------------------------------------------------------ |
    | master_weight   | string | 可选，default ""，表示该账号的 master 权重。 "" ：不设置该值；"0": 设置 master 权重为 0；("0", "MAX(UINT32)"]：设置权重值为该值；其他：非法 |
    | signers         | array  | 可选，需要操作的 signer 列表，default 为空对象。空对象不设置 |
    | address         | string | 需要操作的 signer 地址，符合地址校验规则                   |
    | weight          | int64  | 可选，default 0。0 ：删除该 signer; (0, MAX(UINT32)]：设置权重值为该值，其他：非法 |
    | tx_threshold    | string | 可选，default ""，表示该账号的最低权限。""，不设置该值；"0": 设置 tx_threshold 权重为 0；("0", "MAX(INT64)"]：设置权重值为该值；其他：非法 |
    | type_thresholds | array  | 可选，不同操作需要的权力值列表，default 为空对象。空对象不设置 |
    | type            | int    | 表示某种类型的操作  (0, 100]                                 |
    | threshold       | int64  | 可选，default 0。 0 ：删除该类型操作；(0, MAX(INT64)]：设置权重值为该值；其他：非法 |



### 转移BU资产

> **注意**：如果目标账户是合约账户，则当前操作会触发目标账户的合约执行。

- 功能

  有两个功能：

  1. 操作源账号将一笔BU 资产转给目标账户。
  2. 操作源账号在区块链上创建一个新的账号。

- json结构

    ```json
    {
        "dest_address": "buQgmhhxLwhdUvcWijzxumUHaNqZtJpWvNsf",//待接收BU资产的目标账户
        "amount": 100,//待转移的BU资产数量
        "input": "{\"bar\":\"foo\"}" // 可选，目标账户中合约代码main函数的入参
    }
    ```

- json关键字

    | 关键字       | 类型   | 描述                                                         |
    | ------------ | ------ | ------------------------------------------------------------ |
    | dest_address | string | 目标账户                                                   |
    | amount       | array  | 可选，需要操作的 signer 列表，default 为空对象。空对象不设置 |
    | input        | string | 可选，如果目标账户是合约账户，input会被传递给合约代码的main函数的参数。如果目标账户是普通账户，则该设置无效 |



### 记录日志

- 功能

  操作源账户写日志到区块链中。

- json结构

    ```json
    {
        "topic": "hello",// 日志主题
        "datas"://日志内容
        [
            "hello, log 1",
            "hello, log 2"
        ]
    }
    ```

- json关键字

    | 关键字 | 类型   | 描述                             |
    | ------ | ------ | -------------------------------- |
    | topic  | string | 日志主题。参数长度(0,128]      |
    | datas  | array  | 日志内容。每个元素长度(0,1024] |



## 控制权的分配

您在创建一个账号时，可以指定这个账号的控制权分配。您可以通过设置`priv`的值设置。下面是一个简单的例子。

```json
{
    "master_weight": "70",//本地址私钥拥有的权力值 70
    "signers": [//分配出去的权力
        {
            "address": "buQc39cgJDBaFGiiAsRtYKuaiSFdbVGheWWk",
            "weight": 55    //上面这个地址拥有权力值55
        },
        {
            "address": "buQts6DfT5KavtV94JgZy75H9piwmb7KoUWg",
            "weight": 100    //上面这个地址拥有权力值100
        }
    ],
    "tx_threshold": "8",//发起交易需要权力值 8
    "type_thresholds": [
        {
            "type": 1,//创建账号需要权利值 11
            "threshold": 11
        },
        {//发行资产需要权利值 21
            "type": 2,
            "threshold": 21
        },
        {//转移资产需要权力值 31
            "type": 3,
            "threshold": 31
        },
        {//设置metadata需要权利值 41
            "type": 4,
            "threshold": 41
        },
        {//变更控制人的权力值需要权利值 51
            "type": 5,
            "threshold": 51
        },
        {//变更各种操作的阈值需要权利值 61
            "type": 6,
            "threshold": 61
        }
    ]
}
```



## HTTP接口

### 生成公私钥对-测试用

```http
HTTP GET /createKeyPair
```

- 功能

  > **注意**：该接口只为方便测试使用，请勿在生产环境使用该接口（生产环境下请用SDK或者命令行生成），因为调用该接口后，如果节点服务器作恶会导致账户私钥泄露。该接口仅产生一个公私钥对，不会写入全网区块链。

- 返回值

    ```json
    {
       "error_code" : 0,
       "result" : {
          "address" : "buQqRgkmtckz3U4kX91F2NmZzJ9rkadjYaa2",  //账户地址
          "private_key" : "privbtnSGRQ46FF3MaqiGiDNytz2soFw4iNHKahTqszR6mRrmq7qhVYh",  //账户私钥
          "private_key_aes" : "7594a97bc5e6432704cc5f58ff60727ee9bda10a6117915d025553afec7f81527cb857b882b7c775391fe1fe3f7f3ec198ea69ada138b19cbe169a1a3fa2dec8",  //AES加密账户私钥之后的数据
          "public_key" : "b00101da11713eaad86ad8ededfc28e86b8cd619ca2d593a21d8b82da34320a7e63b09c279bc", //账户公钥
          "public_key_raw" : "01da11713eaad86ad8ededfc28e86b8cd619ca2d593a21d8b82da34320a7e63b",  //公钥排除前缀和后缀后的数据
          "sign_type" : "ed25519"  //账户加密类型
       }
    }
    ```



### 查询账号

```http 
HTTP GET /getAccount?address=buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3&key=hello&code=xxx&issuer=xxx
```

- 功能

  返回指定账号的信息及其所有资产和metadata。

- 参数

  | 参数         | 描述                                                         |
  | ------------ | ------------------------------------------------------------ |
  | address      | 账号地址， 必填                                            |
  | key          | 账号的 metadata 中指定的key的值，如果不填写，那么返回结果中含有所有的metadata |
  | code, issuer | 资产代码，资产发行商。这两个变量要么同时填写，要么同时不填写。若不填写，返回的结果中包含所有的资产。若填写，返回的结果中只显示由code和issuer |

- 返回值

  正常返回内容如下：

    ```json
    {
      "error_code" : 0,//错误码，0表示成功
      "result" : {
        "address" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3", //该账号的地址
        "balance" : 300000000000,//BU 余额，单位MO
        "nonce" : 1, //账号当前作为交易源执行过的交易数量。若nonce为0，该字段不显示
        "assets" : [//资产列表
          {
            "amount" : 1400,//资产数量
            "key"　://资产关键字
            {
              "code" : "CNY",//资产编码
              "issuer" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3"　//资产发行方账户地址
            }
          }, {
            "amount" : 1000,
            "key" :
            {
              "code" : "USD",
              "issuer" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3"
            }
          }
        ],
        "assets_hash" : "9696b03e4c3169380882e0217a986717adfc5877b495068152e6aa25370ecf4a",//资产列表生成的hash值
        "contract" : null,//合约，空表示当前不是合约账户
        "metadatas" : [//metadata列表
          {
            "key" : "123",//metadata的关键字
            "value" : "123_value",//metadata的内容
            "version" : 1 // metadata的版本号
          }, {
            "key" : "456",
            "value" : "456_value",
            "version" : 1
          }, {
            "key" : "abcd",
            "value" : "abcd_value",
            "version" : 1
          }
        ],
        "metadatas_hash" : "82c8407cc7cd77897be3100c47ed9d43ec4097ee1c00e2c13447187e5b1ac66c",//matadata列表生成的hash值
        "priv" : {//账户权限
          "master_weight" : 1,//账户自身权力值
          "thresholds" : {
            "tx_threshold" : 1//发起交易需要的权力值
          }
        }
      }
    }
    ```

  如果该账号不存在,则返回内容如下：

    ```json
    {
       "error_code" : 4,//错误码，4表示账户不存在
       "result" : null
    }
    ```



### 查询账号基本信息

```http
HTTP GET /getAccountBase?address=buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3
```

- 功能

  返回指定账号的基本信息，不包括资产和metadata。

- 参数

    | 参数         | 描述|
    | :----------- | ---------- |
    | address      | 账号地址， 必填    |

- 返回值

  正常返回内容如下：

    ```json
    {
      "error_code" : 0,//错误码，0表示成功
      "result" : {
        "address" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3", //该账号的地址
        "assets_hash" : "9696b03e4c3169380882e0217a986717adfc5877b495068152e6aa25370ecf4a",//资产列表生成的hash值
        "balance" : 899671600,//BU 余额，单位MO
        "contract" : null,//合约，空表示当前不是合约账户
        "nonce" : 1, //账号当前作为交易源执行过的交易数量。若nonce为0，该字段不显示
        "priv" : {//账户权限
          "master_weight" : 1,//账户自身权力值
          "thresholds" : {
            "tx_threshold" : 1 //发起交易需要的权力值
          }
        },
        "metadatas_hash" : "82c8407cc7cd77897be3100c47ed9d43ec4097ee1c00e2c13447187e5b1ac66c"　// matadata列表生成的hash值
      }
    }
    ```

  如果该账号不存在,则返回内容如下：

    ```json
    {
       "error_code" : 4,//错误码，4表示账户不存在
       "result" : null
    }
    ```



### 查询资产

```http
HTTP GET /getAccountAssets?address=buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3
```

- 功能

  返回指定账号的资产信息。

- 参数

    | 参数         | 描述     |
    | :----------- | ----------- |
    | address      | 账号地址， 必填。 |
    | code, issuer | issuer表示资产发行账户地址，code表示资产代码。只有同时填写正确code&issuer才能正确显示指定资产否则默认显示所有资产 |

- 返回值

  正常返回内容如下：

    ```json
    {
      "error_code" : 0,//错误码，0表示账户存在
        "result": [//result不为null，表示资产存在
          {
            "amount" : 1400,//拥有的资产数量
            "key" ://资产标识，包括资产code和issuer
            {
              "code" : "EES",//资产代码
              "issuer" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3" //资产发行人账户地址
            }
          },
          {
            "amount" : 1000,
            "key" :
            {
              "code" : "OES",
              "issuer" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3"
            }
          }
        ]
    }
    ```
  
  如果该账号不存在资产,则返回内容如下：

    ```json
    {
       "error_code" : 0,//错误码，0表示账户存在
       "result" : null　//result为null，表示资产不存在
    }
    ```



### 查询metadata

```http
HTTP GET /getAccountMetaData?address=buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3
```

- 功能

  返回指定账号的MetaData信息。

- 参数

    | 参数         | 描述     |
    | :----------- | ----------- |
    | address      | 账号地址， 必填 |
    | key      | 指定metadata中的key值， 选填 |

- 返回值

  正常返回内容如下：

    ```json
    {
      "error_code" : 0,//错误码，0表示账户存在
        "result": {//result不为null，表示metadata存在
            "123": {
                "key" : "123",
                "value" : "123_value",
                "version" : 1
            },
            "456": {
                "key" : "456",
                "value" : "456_value",
                "version" : 1
            },
            "abcd": {
                "key" : "abcd",
                "value" : "abcd_value",
                "version" : 1
            }
        }
    }
    ```

  如果该账号不存在metadata，则返回内容：

    ```json
    {
       "error_code" : 0,//错误码，0表示账户存在
       "result" : null //result为null，表示metadata不存在
    }
    ```



### 查询交易

```http 
GET /getTransactionHistory?ledger_seq=6
```

- 功能

  返回已完成的交易记录。

- 参数

    | 参数       | 描述                       |
    | :--------- | -------------------------- |
    | hash       | 用交易的唯一标识hash查询 |
    | ledger_seq | 查询指定区块中的所有交易|
    **注意**：上述两个参数产生的约束条件是逻辑与的关系，如果您同时指定两个参数，系统将在指定的区块中查询指定的交易

- 返回值

  正常返回内容如下：

  > **注意**：下面包含2个交易，且第2个交易是创建合约账户的交易**error_des**字段内容尤需注意。

    ```json
    {
        "error_code": 0,//查询错误码，0表示交易存在
        "result": {
            "total_count": 2,//查询到的交易数量
            "transactions": [{//交易列表
                "actual_fee": 313000,//交易实际花费的费用
                "close_time": 1524031260097214,//交易执行完成的时间
                "error_code": 0,//交易的错误码，0表示交易执行成功，非0表示交易执行失败
                "error_desc": "",//交易的错误描述
                "hash": "89a9d6e5d2c0e2b5c4fe58045ab2236d12e9449ef232342a48a2e2628e12014d",//交易的hash值
                "ledger_seq": 6,//交易所在的区块高度
                "signatures": [{//签名列表
                    "public_key": "b00180c2007082d1e2519a0f2d08fd65ba607fe3b8be646192a2f18a5fa0bee8f7a810d011ed",//公钥
                    "sign_data": "27866d70a58fc527b1ff1b4a693b8034b0078fc7ac7591fb05679abe5ca660db5c372922bfa8f26e76511e2c33386306ded7593874a6aec5baeeaddbd2012f06"//签名数据
                }],
                "transaction": {//交易内容
                    "fee_limit": 10000000000,//本交易提交的最大的手续费，单位MO
                    "gas_price": 1000,//gas的价格，单位MO
                    "nonce": 1,//交易所在账户的序号
                    "operations": [{//操作列表
                        "create_account": {//创建账户操作
                            "dest_address": "buQBAfoMfXZVPpg9DaabMmM2EwUnfoVsTSVV",//目标账户地址
                            "init_balance": 10000000,//目标账户初始化 BU 数量，单位MO
                            "priv": {//目标账户的权限
                                "master_weight": 1,//目标账户的自身权力值
                                "thresholds": {
                                    "tx_threshold": 1 //发起目标账户的交易需要的权力值
                                }
                            }
                        },
                        "type": 1 //执行的操作类型，1表示创建账户操作
                    },
                    {
                        "create_account": {
                            "dest_address": "buQj8UyKbN3myVSerLDVXVXH47vWXfqtxKLm",
                            "init_balance": 10000000,
                            "priv": {
                                "master_weight": 1,
                                "thresholds": {
                                    "tx_threshold": 1
                                }
                            }
                        },
                        "type": 1
                    }],
                    "source_address": "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3" //交易发起账户地址
                },
                "tx_size": 313 //交易字节数
            },
            {
                "actual_fee": 1000402000,//交易实际花费的费用
                "close_time": 1524031260097214,//交易执行完成的时间
                "error_code": 0,//交易的错误码，0表示交易执行成功，非0表示交易执行失败
                "error_desc": "[{\"contract_address\":\"buQfFcsf1NUGY1o25sp8mQuaP6W8jahwZPmX\",\"operation_index\":0}]", //创建合约结果，包括合约地址和操作索引值
                "hash": "4cbf50e03645f1075d7e5c450ced93e26e3153cf7b88ea8003b2fda39e618e64",//交易的hash值
                "ledger_seq": 6,//交易所在的区块高度
                "signatures": [{//签名列表
                    "public_key": "b00180c2007082d1e2519a0f2d08fd65ba607fe3b8be646192a2f18a5fa0bee8f7a810d011ed",//公钥
                    "sign_data": "87fdcad0d706479e1a3f75fac2238763cd15fd93f81f1b8889fb798cefbe1752c192bbd3b5da6ebdb31ae47d8b62bb1166dcceca8d96020708f3ac5434838604" //签名数据
                }],
                "transaction": {//交易内容
                    "fee_limit": 20004420000,//本交易提交的最大的手续费
                    "gas_price": 1000,//gas的价格
                    "nonce": 30,//交易所在账户的序号
                    "operations": [{//操作列表
                        "create_account": {//创建账户操作
                            "contract": {//合约
                                "payload": "'use strict';\n\t\t\t\t\tfunction init(bar)\n\t\t\t\t\t{\n\t\t\t\t\t  return;\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\tfunction main(input)\n\t\t\t\t\t{\n\t\t\t\t\t  return;\n\t\t\t\t\t}\n\t\t     function query()\n\t\t\t\t\t{\n\t\t\t\t\t  return;\n\t\t\t\t\t}\n\t\t      \n\t\t          "　//合约代码
                            },
                            "init_balance": 10000000,//合约账户的初始化 BU 数量，单位MO
                            "priv": {//合约账户的权限
                                "thresholds": {
                                    "tx_threshold": 1 //发起合约账户的交易需要的权力值
                                }
                            }
                        },
                        "type": 1 //执行的操作类型，1表示创建账户操作
                    }],
                    "source_address": "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3" //交易发起账户地址
                },
                "tx_size": 402 //交易字节数
            }]
        }
    }
    ```

  如果没有查到交易则返回内容如下：

    ```json
    {
      "error_code": 4,//查询错误码，4表示无交易
      "result":
      {
        "total_count": 0,//查询到的交易数量
        "transactions": []
      }
    }
    ```



### 查询缓存队列交易

```http
GET /getTransactionCache?hash=ad545bfc26c440e324076fbbe1d8affbd8a2277858dc35927d425d0fe644e698&limit=100
```

- 功能

  返回提交成功的，但还未执行的交易。

- 参数

    | 参数       | 描述                     |
    | :--------- | ------------------------ |
    | hash       | 用交易的唯一标识hash查询 |
    | limit      | 查询交易队列前N个正在处理的交易|
  > **注意**：上述两个参数产生的约束条件是逻辑或的关系，如果您同时指定两个参数，系统将hash查询

- 返回值

  正常返回内容如下：

    ```json
    {
        "error_code": 0,//查询错误码，0表示查询成功
        "result": {
            "total_count": 1,//交易总数量
            "transactions": [//交易列表
                {
                    "hash": "a336c8f4b49c8b2c5a6c68543368ed3b450b6138a9f878892cf982ffb6fe234e",//交易hash值
                    "incoming_time": 1521013029435154,//交易进入缓存队列的时间
                    "signatures": [//签名列表
                        {
                            "public_key": "b001882b9d1b5e7019f163d001c85194cface61e294483710f5e66ef40a4d387f5fcb0166f4f",//公钥
                            "sign_data": "c5885144ffccb0b434b494271258e846c30a4551036e483822ee2b57400576e9e700e8960eb424764d033a2e73af6e6a2bfa5da390f71161732e13beee206107" //签名数据
                        }
                    ],
                    "status": "processing",//交易状态
                    "transaction": {//交易内容
                        "fee_limit": 100000,//本交易提交的最大的手续费，单位MO
                        "gas_price": 1000,//gas的价格，单位MO
                        "nonce": 2,//交易所在账户的序号
                        "operations": [//操作列表
                            {
                                "create_account": {//创建账户操作
                                    "dest_address": "buQWufKdVicxRAqmQs6m1Z9QuFZG2W7LMsi2",//目标账户地址
                                    "init_balance": 300000,//目标账户初始化 BU 数量，单位MO
                                    "priv": {//目标账户权限
                                        "master_weight": 1,//目标账户自身的权力值
                                        "thresholds": {
                                            "tx_threshold": 2 //发起目标账户交易所需要的权力值
                                        }
                                    }
                                },
                                "type": 1　//执行的操作类型，1表示创建账户操作
                            }
                        ],
                        "source_address": "buQBDf23WtBBC8GySAZHsoBMVGeENWzSRYqB"// 交易发起账户地址
                    }
                }
            ]
        }
    }
    ```

  如果没有查到交易则返回内容如下：

    ```json
    {
      "error_code": 4,//查询错误码，4表示未查询到交易
      "result":
      {
        "total_count": 0,//查询到的交易数量
        "transactions": []
      }
    }
    ```



### 查询区块头

```http
GET /getLedger?seq=xxxx&with_validator=true&with_consvalue=true&with_fee=true&with_block_reward=true
```

- 功能

  返回区块头信息。

- 参数

    | 参数           | 描述                                      |
    | :------------- | ----------- |
    | seq            | ledger的序号， 如果不填写，返回当前ledger |
    | with_validator | 默认false，不显示验证节点列表      |
    | with_consvalue | 默认false，不显示共识值            |
    | with_fee       | 默认false，不显示费用配置            |
    | with_block_reward | 默认false，不显示区块奖励和验证节点奖励            |

- 返回值

  正常返回内容如下：

    ```json
    {
       "error_code" : 0,//错误码，0表示成功
       "result" : {
          "block_reward" : 800000000,//区块奖励，单位MO
          "consensus_value" : {//共识内容
             "close_time" : 1524031260097214,//共识结束时间
             "ledger_seq" : 6,//区块高度
             "previous_ledger_hash" : "ef329c7ed761e3065ab08f9e7672fd5f4e3ddd77b0be35598979aff8c21ada9b",//前一个区块hash
             "previous_proof" : "0ac1010a2c080110022a26080310052220432dde2fd32a2a66da77647231821c87958f56c303bd08003633952d384eb0b61290010a4c623030316435363833363735303137666662633332366538666232303738653532316566383435373234363236353339356536383934633835323434656566643262666130386635393862661240deeb9b782410f0f86d897006cac8ad152e56e4f914e5d718706de84044ef98baef25512a337865772641d57090b5c77e9e2149dbd41910e8d6cd85c3387ea708",//前一个区块凭证
             "previous_proof_plain" : {//前区块凭证的内容
                "commits" : [
                   {
                      "pbft" : {
                         "commit" : {
                            "sequence" : 5,//区块序号
                            "value_digest" : "432dde2fd32a2a66da77647231821c87958f56c303bd08003633952d384eb0b6",//内容摘要
                            "view_number" : 3 //视图编号
                         },
                         "round_number" : 1,
                         "type" : 2 //类型
                      },
                      "signature" : {//节点签名信息
                         "public_key" : "b001d5683675017ffbc326e8fb2078e521ef8457246265395e6894c85244eefd2bfa08f598bf",//公钥
                         "sign_data" : "deeb9b782410f0f86d897006cac8ad152e56e4f914e5d718706de84044ef98baef25512a337865772641d57090b5c77e9e2149dbd41910e8d6cd85c3387ea708"　//签名数据
                      }
                   }
                ]
             },
             "txset" : {//交易集
                "txs" : [//交易列表
                   {
                      "signatures" : [//签名列表
                         {
                            "public_key" : "b00180c2007082d1e2519a0f2d08fd65ba607fe3b8be646192a2f18a5fa0bee8f7a810d011ed",//公钥
                            "sign_data" : "27866d70a58fc527b1ff1b4a693b8034b0078fc7ac7591fb05679abe5ca660db5c372922bfa8f26e76511e2c33386306ded7593874a6aec5baeeaddbd2012f06" //签名数据
                         }
                      ],
                      "transaction" : {//交易内容
                         "fee_limit" : 10000000000,//本交易提交的最大的手续费，单位MO
                         "gas_price" : 1000,//gas的价格，单位MO
                         "nonce" : 1,//交易所在账户的序号
                         "operations" : [//操作列表
                            {
                               "create_account" : {//创建账户操作
                                  "dest_address" : "buQBAfoMfXZVPpg9DaabMmM2EwUnfoVsTSVV",//目标账户
                                  "init_balance" : 10000000,//目标账户初始化 BU 数量，单位MO
                                  "priv" : {//目标账户权限
                                     "master_weight" : 1,//目标账户自身拥有的权力值
                                     "thresholds" : {
                                        "tx_threshold" : 1 //发起目标账户交易所需要的权力值
                                     }
                                  }
                               },
                               "type" : 1 //执行的操作类型，1是指创建账户操作
                            },
                            {
                               "create_account" : {
                                  "dest_address" : "buQj8UyKbN3myVSerLDVXVXH47vWXfqtxKLm",
                                  "init_balance" : 10000000,
                                  "priv" : {
                                     "master_weight" : 1,
                                     "thresholds" : {
                                        "tx_threshold" : 1
                                     }
                                  }
                               },
                               "type" : 1
                            }
                         ],
                         "source_address" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3"
                      }
                   },
                   {
                      "signatures" : [
                         {
                            "public_key" : "b00180c2007082d1e2519a0f2d08fd65ba607fe3b8be646192a2f18a5fa0bee8f7a810d011ed",
                            "sign_data" : "fb7d9d87f4c9140b6e19a199091c6871e2380ad8e8a8fcada9b42a2911057111dc796d731f3f887e600aa89cc8692300f980723298a93b91db711155670d3e0d"
                         }
                      ],
                      "transaction" : {
                         "fee_limit" : 10000000000,
                         "gas_price" : 1000,
                         "nonce" : 2,
                         "operations" : [
                            {
                               "create_account" : {
                                  "dest_address" : "buQntAvayDWkAhPh6CSrTWbiEniAL2ys5m2p",
                                  "init_balance" : 10000000,
                                  "priv" : {
                                     "master_weight" : 1,
                                     "thresholds" : {
                                        "tx_threshold" : 1
                                     }
                                  }
                               },
                               "type" : 1
                            },
                            {
                               "create_account" : {
                                  "dest_address" : "buQX5X9y59zbmqyFgFPQPcyUPcPnvwsLatsq",
                                  "init_balance" : 10000000,
                                  "priv" : {
                                     "master_weight" : 1,
                                     "thresholds" : {
                                        "tx_threshold" : 1
                                     }
                                  }
                               },
                               "type" : 1
                            }
                         ],
                         "source_address" : "buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3"
                      }
                   }
                ]
             }
          },
          "fees" : {//区块费用标准
             "base_reserve" : 10000000,//账户最低账户 BU 数量，单位MO
             "gas_price" : 1000 //gas的价格，单位MO
          },
          "header" : {//区块头
             "account_tree_hash" : "6aca37dfe83f213942b21d02618b989619cfd7c0e67a8a14b0f7599dd4010aad",//账户树hash值
             "close_time" : 1524031260097214,//区块关闭时间
             "consensus_value_hash" : "14a65d69f619395135da2ff98281d5707494801f12184a4318b9a76383e651a8",//共识内容hash值
             "fees_hash" : "916daa78d264b3e2d9cff8aac84c943a834f49a62b7354d4fa228dab65515313",//费用标准hash值
             "hash" : "2cf378b326ab0026625c8d036813aef89a0b383e75055b80cb7cc25a657a9c5d",//区块hash值
             "previous_hash" : "ef329c7ed761e3065ab08f9e7672fd5f4e3ddd77b0be35598979aff8c21ada9b",//前一个区块hash值
             "seq" : 6,//区块高度
             "tx_count" : 2,//交易总数量
             "validators_hash" : "d857aa40ecdb123415f893159321eb223e4dbc11863daef86f35565dd1633316",//验证节点列表hash值
             "version" : 1000 //区块版本号
          },
          "validators" : [//验证节点列表
             {
                "address" : "buQhmPKU1xTyC3n7zJ8zLQXtuDJmM2zTrJey" //验证节点地址
             }
          ],
          "validators_reward" : {//验证节点奖励
             "buQhmPKU1xTyC3n7zJ8zLQXtuDJmM2zTrJey" : 800000000 //验证节点奖励
          }
       }
    }
    ```

  如果没有查询到ledger返回的内容：

    ``` json
    {
       "error_code" : 4,
       "result" : null
    }
    ```



### 序列化交易

```http
POST /getTransactionBlob
```

- 功能

  返回交易hash和交易序列化之后的16进制字符串。

- body的json结构

  这里body传递就是交易数据，具体json结构及参数请看[交易](#交易)。

- 返回值

    ```json
    {
        "error_code": 0,//序列化交易错误码
        "error_desc": "",//错误描述
        "result": {
            "hash": "8e97ab885685d68b8fa8c7682f77ce17a85f1b4f6c8438eda8ec955890919405",//交易的hash
            "transaction_blob": "0a2e61303032643833343562383964633334613537353734656234393736333566663132356133373939666537376236100122b90108012ab4010a2e61303032663836366337663431356537313934613932363131386363353565346365393939656232396231363461123a123866756e6374696f6e206d61696e28696e707574537472297b0a202f2ae8bf99e698afe59088e7baa6e585a5e58fa3e587bde695b02a2f207d1a06080a1a020807223e0a0568656c6c6f1235e8bf99e698afe5889be5bbbae8b4a6e58fb7e79a84e8bf87e7a88be4b8ade8aebee7bdaee79a84e4b880e4b8aa6d65746164617461" //交易序列化之后的16进制表示
        }
    }
    ```



### 提交交易

```http 
POST /submitTransaction
```

- 功能

  将序列化的交易和签名列表发送到区块链。

- body的json结构

    ```json
    {
      "items" : [{//交易包列表
          "transaction_blob" : "0a2e61303032643833343562383964633334613537353734656234393736333566663132356133373939666537376236100122b90108012ab4010a2e61303032663836366337663431356537313934613932363131386363353565346365393939656232396231363461123a123866756e6374696f6e206d61696e28696e707574537472297b0a202f2ae8bf99e698afe59088e7baa6e585a5e58fa3e587bde695b02a2f207d1a06080a1a020807223e0a0568656c6c6f1235e8bf99e698afe5889be5bbbae8b4a6e58fb7e79a84e8bf87e7a88be4b8ade8aebee7bdaee79a84e4b880e4b8aa6d65746164617461",//一个交易序列化之后的16进制表示
          "signatures" : [{//第一个签名
              "sign_data" : "2f6612eaefbdadbe792201bb5d1e178aff118dfa0a640edb2a8ee91933efb97c4fb7f97be75195e529609a4de9b890b743124970d6bd7072b7029cfe7683ba2d",//签名数据
              "public_key" : "b00204e1c7dddc36d3153adcaa451b0ab525d3def48a0a10fdb492dc3a7263cfb88e80ee974ca4da0e1f322aa84ff9d11340c764ea756ad148e979c121619e9fe52e9054"//公钥
            }, {//第二个签名
              "sign_data" : "90C1CD2CD371F581EB8EACDA295C390D62C19FE7F080FB981584FB5F0BAB3E293B613C827CB1B2E063E5783FFD7425E1DEC0E70F17C1227FBA5997A72865A30A",//签名数据
              "public_key" : "b00168eceea7900ddcb8f694161755f98590ba7944de3bfe339610fe0cacc10a18372dcbf71b"//公钥
            }
          ]
        }
      ]
    }
    ```

- json的关键字

    | 参数             | 类型   | 描述                                                         |
    | :--------------- | ------ | ------------------------------------------------------------ |
    | transaction_blob | string | 交易序列化之后的16进制格式                                 |
    | sign_data        | string | 签名数据， 16进制格式。其值为对transaction_blob进行签名(动词)得到的签名数据。**注意**：签名时要先将transaction_blob转成字节流再签名，不要对16进制字符串直接签 |
    | public_key       | string | 公钥， 16进制格式                                        |

- 返回值

  > **注意**：提交交易成功，并不表示交易执行成功。

    ```json
    {
        "error_code": 0,//提交结果
        "error_desc": "",//错误描述
        "result": {
            "hash": "8e97ab885685d68b8fa8c7682f77ce17a85f1b4f6c8438eda8ec955890919405",//交易的hash
        }
    }
    ```



### 调用合约

```http 
POST /callContract
```

- 功能

  在智能合约模块的设计中，我们提供了沙箱环境来进行调试合约，且调试过程中不会更改区块链和合约的状态。在 BUMO 链上，我们为用户提供了 `callContract` 接口来帮助用户来调试智能合约，智能合约可以是公链上已存的，也可以是通过参数上传本地的合约代码进行测试，使用 `callContract` 接口不会发送交易，也就无需支付上链手续费。

- body的json结构

    ```json
    {
      "contract_address" : "",//可选，智能合约地址
      "code" : "\"use strict\";log(undefined);function query() { return 1; }",//可选，智能合约代码
      "input" : "{}",//可选，给被调用的合约传参
      "contract_balance" : "100009000000",//赋予合约的初始 BU 余额
      "fee_limit" : 100000000000000000,//手续费
      "gas_price": 1000,//可选，gas的价格
      "opt_type" : 2,//可选，操作类型
      "source_address" : "" //可选，模拟调用合约的原地址
    }
    ```

- json关键字

    | 关键字           | 类型   | 描述                                                         |
    | ---------------- | ------ | ------------------------------------------------------------ |
    | contract_address | string | 调用的智能合约地址，如果从数据库查询不到则返回错误。如果填空，则默认读取 **code** 字段的内容 |
    | code             | string | 需要调试的合约代码，如果 `contract_address` 为空，则使用 **code** 字段，如果**code**字段你也为空，则返回错误 |
    | input            | string | 给被调用的合约传参                                         |
    | contract_balance | string | 赋予合约的初始 BU 余额                                   |
    | fee_limit        | int64  | 手续费                                                    |
    | gas_price        | int64  | gas价格                                                    |
    | opt_type         | int    | 0: 调用合约的读写接口 `init`, 1: 调用合约的读写接口 `main`, 2 :调用只读接口 `query` |
    | source_address   | string | 模拟调用合约的原地址                                       |

- 返回值

    ```json
      {
       "error_code" : 0,//调用结果，0表示成功
       "error_desc" : "",//错误码描述
       "result" : {
          "logs" : {
             "0-buQVkReBYUPUYHBinVDrrb9FQRpo49b9YRXq" : null　//已无用
          },
          "query_rets" : [
             {
                "result" : {
                   "type" : "bool", //　返回变量的名称
                   "value" : false  // 变量值是false
                }
             }
          ],
          "stat" : {
             "apply_time" : 6315,//执行花费的时间
             "memory_usage" : 886176,//内存占用
             "stack_usage": 2564,//堆栈战胜
             "step" : 3 //执行的频数
          },
          "txs" : null　//交易集
       }
    }
    ```



### 评估费用

```http
   POST /testTransaction
```

- 功能

  评估费用不改变账号余额基础上进行的评估，交易中涉及的原账号和目标账号都必须在系统中存在，创建账号的目标地址除外。

- body的json结构

    ```json
    {
      "items": [
        {
          "transaction_json": {
            "source_address": "buQBDf23WtBBC8GySAZHsoBMVGeENWzSRYqB", //模拟交易的原地址
            "metadata":"0123456789abcdef", //可选，附加信息
            "nonce": 6,//交易所在账户的序列号
            "operations":[//操作列表
            {
            //根据不同的操作填写
            },
            {
            //根据不同的操作填写
            }
            ......
          },
          "signature_number":1 //可选，签名个数
        }
      ]
    }
    ```

- json关键字

    | 关键字           | 类型   | 描述                                                         |
    | ---------------- | ------ | ------------------------------------------------------------ |
    | source_address   | string | 模拟交易的原地址                                         |
    | nonce            | int64  | 在原账号基础上加1                                         |
    | signature_number | int64  | 签名个数，默认为1；不填写系统会设置为1                    |
    | metadata         | string | 可选，签名个数                                             |
    | operations       | array  | 操作列表。本交易的有效负载，即本交易想要做什么事情 (详见:[操作](#操作)) |

- 返回值

    ```json
    {
        "error_code": 0,
        "error_desc": "",
        "result": {
            "hash": "7f0d9de23d6d8f2964a1efe4a458e02e43e47f60f3c22bb132b676c54a44ba04",
            "logs": null,
            "query_rets": null,
            "stat": null,
            "txs": [
                {
                    "actual_fee": 264,
                    "gas": 264,
                    "transaction_env": {
                        "transaction": {
                            "fee_limit": 99999999700110000,
                            "gas_price": 1,
                            "nonce": 1,
                            "operations": [
                                {
                                    "pay_coin": {
                                        "amount": 299890000,
                                        "dest_address": "buQkBDTfe4tx2Knw9NDKyntVmsYvYtHmAiE7"
                                    },
                                    "type": 7
                                }
                            ],
                            "source_address": "buQBDf23WtBBC8GySAZHsoBMVGeENWzSRYqB"
                        }
                    }
                }
            ]
        }
    }
    ```



## 示例

下面我们用`buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV`发起一笔交易，这笔交易只有1个操作，即创建一个新账号`buQts6DfT5KavtV94JgZy75H9piwmb7KoUWg`，通过向该新账户转移BU，完成账户创建的过程。

### 组装交易

参考[交易](#交易)的结构，需要以下三步来完成：

[获取账户nonce值](#获取账户nonce值)

[组装操作](#组装操作)

[生成交易对象](#生成交易对象)



#### 获取账户nonce值

在交易的结构中，需要确认交易在交易发起账户的序号，因此，需要通过[查询账号基本信息](#查询账号基本信息)接口获取交易发起账户的nonce值，并在其nonce值基础上增加1。

接口调用如下：

```http 
HTTP GET /getAccountBase?address=buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV
```

返回内容如下：

```json
{
   "error_code" : 0,
   "result" : {
      "address" : "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
      "assets_hash" : "ad67d57ae19de8068dbcd47282146bd553fe9f684c57c8c114453863ee41abc3",
      "balance" : 96545066100,
      "metadatas_hash" : "ad67d57ae19de8068dbcd47282146bd553fe9f684c57c8c114453863ee41abc3",
      "nonce" : 20,
      "priv" : {
         "master_weight" : 1,
         "thresholds" : {
            "tx_threshold" : 1
         }
      }
   }
}
```



#### 组装操作

根据[操作](#操作)的结构、[操作码](#操作码)和[转移BU资产](#转移bu资产)的结构，生成操作的json结构如下：

```json
{
    "type": 7,
    "pay_coin": {
        "dest_address": "buQts6DfT5KavtV94JgZy75H9piwmb7KoUWg",
        "amount": 10000000,
        "input": ""
    }
}
```



#### 生成交易对象

在[获取账户nonce值](#获取账户nonce值)得到`nonce`值是*20*，那么新交易的序号是*21*。再根据[组装操作](#组装操作)中得到的操作结构，从而生成交易的json结构如下：

```json
{
    "source_address": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV",
    "nonce": 21,
    "fee_limit":1000000,
    "gas_price":1000,
    "operations": [{
        "type": 7,
        "pay_coin": {
            "dest_address": "buQts6DfT5KavtV94JgZy75H9piwmb7KoUWg",
            "amount": 10000000,
            "input": ""
        }
    }]
}
```



### 序列化交易数据

通过[序列化交易](#序列化交易)接口来实现该功能。

接口调用如下：

```http
  POST getTransactionBlob
```

返回内容如下：

```json
{
    "error_code": 0,
    "error_desc": "",
    "result": {
        "hash": "3f90865062d7737904ea929cbde7c45e831e4972cf582b69a0198781c452e9e1",
        "transaction_blob": "0a246275516f50326552796d4163556d33757657675138526e6a7472536e58425866417a7356101518c0843d20e8073a2f0807522b0a24627551747336446654354b6176745639344a675a79373548397069776d62374b6f5557671080ade204"
    }
}
```



### 签名

签名就是用`buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV`的私钥对[序列化交易数据](#序列化交易数据)中的`transaction_blob`的值进行签名，并生成公钥。具体操作参考：[keypair](../keypair_guide)。从而得到签名数据如下：

```json
［{
    "sign_data": "ACF64A7D41244AFC4465DBC225D616E0499776140D46BA7A84B1B6B263DAF1422904137E0181301F480F7114EC7CC5BBE4763EDA981E565EF81EF7705596CB0B",
    "public_key": "b00168eceea7900ddcb8f694161755f98590ba7944de3bfe339610fe0cacc10a18372dcbf71b"
}］
```



### 提交交易数据

 根据[序列化交易数据](#序列化交易数据)得到的`transaction_blob`和[签名](#签名)得到的签名数据，生成[提交交易](#提交交易)接口中body的json结构如下：

```json
{
    "items" : [{
        "transaction_blob" : "0a246275516f50326552796d4163556d33757657675138526e6a7472536e58425866417a7356101518c0843d20e8073a2f0807522b0a24627551747336446654354b6176745639344a675a79373548397069776d62374b6f5557671080ade204",
        "signatures" : [{
            "sign_data" : "ACF64A7D41244AFC4465DBC225D616E0499776140D46BA7A84B1B6B263DAF1422904137E0181301F480F7114EC7CC5BBE4763EDA981E565EF81EF7705596CB0B",
            "public_key" : "b00168eceea7900ddcb8f694161755f98590ba7944de3bfe339610fe0cacc10a18372dcbf71b"
        }]
    }]
}
```

调用接口如下：

```http 
POST /submitTransaction
```

返回内容如下：

```json
{
    "results": [
        {
            "error_code": 0,
            "error_desc": "",
            "hash": "3f90865062d7737904ea929cbde7c45e831e4972cf582b69a0198781c452e9e1"
        }
    ],
    "success_count": 1
}
```



### 查询交易结果

根据[提交交易数据](#提交交易数据)接口得到的hash，通过[查询交易](#查询交易)接口确认交易是否执行成功（查看`transactions`下的`error_code`是否等于0）。

接口调用如下：

```http 
GET /getTransactionHistory?hash=3f90865062d7737904ea929cbde7c45e831e4972cf582b69a0198781c452e9e1
```

得到结果：

```json
{
    "error_code": 0,//交易查询成功
    "result": {
        "total_count": 1,
        "transactions": [
            {
                "actual_fee": 245000,
                "close_time": 1552125554325904,
                "error_code": 0,//交易执行成功
                "error_desc": "",
                "hash": "3f90865062d7737904ea929cbde7c45e831e4972cf582b69a0198781c452e9e1",
                "ledger_seq": 2688046,
                "signatures": [
                    {
                        "public_key": "b00168eceea7900ddcb8f694161755f98590ba7944de3bfe339610fe0cacc10a18372dcbf71b",
                        "sign_data": "acf64a7d41244afc4465dbc225d616e0499776140d46ba7a84b1b6b263daf1422904137e0181301f480f7114ec7cc5bbe4763eda981e565ef81ef7705596cb0b"
                    }
                ],
                "transaction": {
                    "fee_limit": 1000000,
                    "gas_price": 1000,
                    "nonce": 21,
                    "operations": [
                        {
                            "pay_coin": {
                                "amount": 10000000,
                                "dest_address": "buQts6DfT5KavtV94JgZy75H9piwmb7KoUWg"
                            },
                            "type": 7
                        }
                    ],
                    "source_address": "buQoP2eRymAcUm3uvWgQ8RnjtrSnXBXfAzsV"
                },
                "tx_size": 245
            }
        ]
    }
}
```



## 错误码

  错误由两部分构成:

- error_code : 错误码，大概的错误分类
- error_desc : 错误描述，一般能从错误描述准确发现错误具体信息

错误列表如下:

| error_code/错误码 | 枚举名       | 错误描述        |
| ---------------- | -------- | ------- |
| 0                 | ERRCODE_SUCCESS                        | 操作成功                                                                                     |
| 1                 | ERRCODE_INTERNAL_ERROR                 | 服务内部错误                                                                                 |
| 2                 | ERRCODE_INVALID_PARAMETER              | 参数错误                                                                                     |
| 3                 | ERRCODE_ALREADY_EXIST                  | 对象已存在， 如重复提交交易                                                                  |
| 4                 | ERRCODE_NOT_EXIST                      | 对象不存在，如查询不到账号、TX、区块等                                                       |
| 5                 | ERRCODE_TX_TIMEOUT                     | TX 超时，指该 TX 已经被当前节点从 TX 缓存队列去掉，但并不代表这个一定不能被执行         |
| 7 | ERRCODE_MATH_OVERFLOW | 数学计算溢出 |
| 20 | ERRCODE_EXPR_CONDITION_RESULT_FALSE | 指表达式执行结果为 false，意味着该 TX 当前没有执行成功，但这并不代表在以后的区块不能成功 |
| 21 | ERRCODE_EXPR_CONDITION_SYNTAX_ERROR | 指表达式语法分析错误，代表该 TX 一定会失败 |
| 90 | ERRCODE_INVALID_PUBKEY | 公钥非法 |
| 91 | ERRCODE_INVALID_PRIKEY | 私钥非法 |
| 92 | ERRCODE_ASSET_INVALID | 无效的资产 |
| 93 | ERRCODE_INVALID_SIGNATURE | 签名权重不够，达不到操作的门限值 |
| 94 | ERRCODE_INVALID_ADDRESS | 地址非法 |
| 97 | ERRCODE_MISSING_OPERATIONS | 交易缺失操作 |
| 98 | ERRCODE_TOO_MANY_OPERATIONS | 单笔交易内超过了100个操作 |
| 99 | ERRCODE_BAD_SEQUENCE | 交易序号错误，nonce错误 |
| 100 | ERRCODE_ACCOUNT_LOW_RESERVE | 余额不足 |
| 101 | ERRCODE_ACCOUNT_SOURCEDEST_EQUAL | 源和目的账号相等 |
| 102 | ERRCODE_ACCOUNT_DEST_EXIST | 创建账号操作，目标账号已存在 |
| 103 | ERRCODE_ACCOUNT_NOT_EXIST | 账户不存在 |
| 104 | ERRCODE_ACCOUNT_ASSET_LOW_RESERVE | 支付操作，资产余额不足 |
| 105 | ERRCODE_ACCOUNT_ASSET_AMOUNT_TOO_LARGE | 资产数量过大，超出了int64的范围 |
| 106 | ERRCODE_ACCOUNT_INIT_LOW_RESERVE | 创建账号初始化资 |
| 111 | ERRCODE_FEE_NOT_ENOUGH | 费用不足 |
| 114 | ERRCODE_OUT_OF_TXCACHE | TX 缓存队列已满 |
| 120 | ERRCODE_WEIGHT_NOT_VALID | 权重值不在有效范围 |
| 121 | ERRCODE_THRESHOLD_NOT_VALID | 门限值不在有效范围 |
| 144 | ERRCODE_INVALID_DATAVERSION | metadata的version版本号不与已有的匹配（一个版本化的数据库） |
| 146 | ERRCODE_TX_SIZE_TOO_BIG | 交易数据超出上限 |
| 151 | ERRCODE_CONTRACT_EXECUTE_FAIL | 合约执行失败 |
| 152 | ERRCODE_CONTRACT_SYNTAX_ERROR | 合约语法分析失败 |
| 153 | ERRCODE_CONTRACT_TOO_MANY_RECURSION | 合约递归深度超出上限 |
| 154 | ERRCODE_CONTRACT_TOO_MANY_TRANSACTIONS | 合约产生的交易超出上限 |
| 155 | ERRCODE_CONTRACT_EXECUTE_EXPIRED | 合约执行超时 |
| 160 | ERRCODE_TX_INSERT_QUEUE_FAIL | 插入交易缓存队列失败 |

