---
id: api_websocket
title: BUMO Websocket
sidebar_label: Websocket
---



## 概述

### 了解protocol buffer3

BUMO区块链是用protocol buffer 3序列化数据的，protocol buffer 3是google推出的数据序列化协议，您如果不了解protocol buffer 3，请点击[proto3](https://developers.google.com/protocol-buffers/docs/proto3)了解更多。 我们使用的所有数据格式都能在源码的`src\proto`目录中找到。其中chain.proto文件中定义的数据是和交易、区块、账号密切相关的。



### protocol buffer 3

BUMO提供了proto脚本，以及 `cpp`、`java`、`javascript`、`pyton`、`object-c` 和 `php` 生成的proto源码的示例。详细信息请查看[proto源码](https://github.com/bumoproject/bumo/tree/develop/src/proto)。

各语言的测试程序如下：

- cpp: [C++的源码](https://github.com/bumoproject/bumo/tree/master/src/proto/cpp)

- io: [ Java的测试程序](https://github.com/bumoproject/bumo/tree/master/src/proto/io)

- go: [Go的测试程序](https://github.com/bumoproject/bumo/tree/master/src/proto/go)

- js: [Javascript的测试程序](https://github.com/bumoproject/bumo/tree/master/src/proto/js)

- python: [Python的测试程序](https://github.com/bumoproject/bumo/tree/master/src/proto/python)

- ios: [Object-c的测试程序](https://github.com/bumoproject/bumo/tree/master/src/proto/ios)

- php: [PHP的测试程序](https://github.com/bumoproject/bumo/tree/master/src/proto/php)



### websocket

BUMO 区块链提供了websocket API 接口。您可以在 安装目录/config/bumo.json 文件种找到`"wsserver"`对象，它指定了websocket服务端口。

```protobuf
"wsserver":
{
    "listen_address": "0.0.0.0:36003"
}
```



### 端口配置

| 网络类型 | WebSocket |
| -------- | --------- |
| mainnet  | 16003     |
| testnet  | 26003     |
| 内测版本 | 36003     |



### 交易过程

- 根据意愿组装交易对象`Transaction`, 不同的交易有不同的数据结构（详见:[交易](#交易)）
- 交易对象序列化为字节流 `transaction_blob`，`Transaction`对象有序列化的方法，调用之后可得到字节流 `transaction_blob`。
- 用私钥`skey`对`transaction_blob`签名得到`sign_data`，`skey`的公钥为`pkey`。（详见:[Keypair 手册](../keypair_guide)）
- 提交交易，并可通过响应消息得到是否执行成功的消息。（详见:[提交交易](#提交交易)）



## 交易

- protobuf结构

```protobuf
message Transaction {
	enum Limit{
		UNKNOWN = 0;
		OPERATIONS = 1000;
	};
	string source_address = 1;
	int64 nonce = 2;
	int64  fee_limit = 3;
	int64  gas_price =4;
	int64 ceil_ledger_seq = 5;
	bytes metadata = 6;
	repeated Operation operations = 7;
	int64 chain_id = 8;
}
```

- 关键字

| 关键字          | 类型   | 描述                                                         |
| --------------- | ------ | ------------------------------------------------------------ |
| source_address  | string | 交易源账号，即交易发起方的账号。当这笔交易成功后，交易源账号的nonce字段会自动加1。账号中的nonce意义是本账号作为交易源执行过的交易数量。 |
| nonce           | int64  | 其值必须等于交易源账号的当前nonce+1，这是为了防止重放攻击而设计的。如何查询一个账号的nonce可参考HTTP中的[查询账号](../api_http#查询账号)接口。若查询账号没有显示nonce值，说明账号的当前nonce是0。 |
| fee_limit       | int64  | 本交易能接受的最大的手续费。交易首先会按照这个费用收取手续费，若交易执行成功，则会收取实际的花费，否则将收取这个字段的费用。单位是MO，1 BU ＝ 10^8 MO。 |
| gas_price       | int64  | 用于计算每个操作的手续费，还参与交易字节费的计算。单位是MO，1 BU ＝ 10^8 MO。 |
| ceil_ledger_seq | int64  | 可选，针对本交易的区块高度限制条件，高级功能。               |
| operations      | array  | 操作列表。本交易的有效负载，即本交易想要做什么事情。(详见:[操作](#操作)) |
| metadata        | string | 可选，用户自定义字段，可以不填写，备注用。                   |



## 操作

交易的protobuf结构里面对应的`operations`，可以包含一个或者多个操作。

- protobuf结构

```protobuf
message Operation {
	enum Type {
		UNKNOWN = 0;
		CREATE_ACCOUNT 			= 1;
		ISSUE_ASSET 			= 2;
		PAY_ASSET               = 3;
		SET_METADATA			= 4;
		SET_SIGNER_WEIGHT		= 5;
		SET_THRESHOLD			= 6;
		PAY_COIN                = 7;
		LOG						= 8;
		SET_PRIVILEGE			= 9;
	};
	Type type = 1;
	string source_address = 2;
	bytes metadata	= 3;

	OperationCreateAccount		create_account 	   = 4;
	OperationIssueAsset			issue_asset 	   = 5;
	OperationPayAsset			pay_asset 		   = 6;
	OperationSetMetadata		set_metadata	   = 7;
	OperationSetSignerWeight	set_signer_weight  = 8;
	OperationSetThreshold		set_threshold 	   = 9;
	OperationPayCoin			pay_coin           = 10;
	OperationLog				log				   = 11;
	OperationSetPrivilege		set_privilege	   = 12;
}
```

- 关键字

| 关键字         | 类型                   | 描述                                                         |
| -------------- | ---------------------- | ------------------------------------------------------------ |
| type           | Type                   | 操作码，不同的操作码执行不同的操作，详见[操作码](#操作码)。  |
| source_address | string                 | 可选，操作源账户，即操作的执行方。当不填写时，默认与交易的源账户相同。 |
| metadata       | bytes                  | 可选，用户自定义字段，可以不填写，备注用。                   |
| create_account | OperationCreateAccount | [创建账号](#创建账号)操作                                    |
| issue_asset    | OperationIssueAsset    | [发行资产](#发行资产)操作                                    |
| pay_asset      | OperationPayAsset      | [转移资产](#转移资产)操作                                    |
| set_metadata   | OperationSetMetadata   | [设置metadata](#设置metadata)操作                            |
| pay_coin       | OperationPayCoin       | [转移BU资产](#转移bu资产)操作                                |
| log            | OperationLog           | [记录日志](#记录日志)操作                                    |
| set_privilege  | OperationSetPrivilege  | [设置权限](#设置权限)操作                                    |



### 操作码

| 操作码 | 说明                          |
| :----- | ----------------------------- |
| 1      | [创建账号](#创建账号)         |
| 2      | [发行资产](#发行资产)         |
| 3      | [转移资产](#转移资产)         |
| 4      | [设置metadata](#设置metadata) |
| 7      | [转移BU资产](#转移bu资产)     |
| 8      | [记录日志](#记录日志)         |
| 9      | [设置权限](#设置权限)         |



### 创建账号

操作源账号在区块链上创建一个新的账号。创建账户操作分为[创建普通账号](#创建普通账号)和[创建合约账号](#创建合约账号)。

protobuf定义如下：

```protobuf
// key-value对
message KeyPair{
	string key = 1;
	string value = 2;
	int64 version = 3;
}

// 权限相关定义
message Signer {
	enum Limit{
		SIGNER_NONE = 0;
		SIGNER = 100;
	};
	string address = 1;
	int64 weight = 2;
}
message OperationTypeThreshold{
	Operation.Type type = 1;
	int64 threshold = 2;
}
message AccountThreshold{
	int64 tx_threshold = 1; //required, [-1,MAX(INT64)] -1: indicates no setting
	repeated OperationTypeThreshold type_thresholds = 2;
}
message AccountPrivilege {
	int64 master_weight = 1;
	repeated Signer signers = 2;
	AccountThreshold thresholds = 3;
}

// 合约相关定义
message Contract{
    enum ContractType{
		JAVASCRIPT = 0;
	}
	ContractType type = 1;
	string payload = 2;
}

//　创建账户操作对象
message OperationCreateAccount{
	string dest_address = 1;
	Contract contract = 2;
	AccountPrivilege priv = 3;
	repeated KeyPair metadatas = 4;	
	int64	init_balance = 5;
	string  init_input = 6;
}
```



#### 创建普通账号

> **注意**：在当前操作中，master_weight和tx_threshold都必须是1。且仅允许初始化下面的关键字。

- 关键字

| 关键字        | 类型   | 描述                                                         |
| ------------- | ------ | ------------------------------------------------------------ |
| dest_address  | string | 目标账号的地址。创建普通账号时，不能为空。                   |
| init_balance  | int64  | 目标账户的初始化 BU 值，单位是MO，1 BU = 10^8 MO。           |
| master_weight | int64  | 目标账号的 master 权重，数值范围［0, MAX(UINT32)]。          |
| tx_threshold  | int64  | 发起交易的门限，低于该值，无法发起交易，数值范围[0, MAX(INT64)]。 |

- 查询

  账户信息通过HTTP中的[查询账号](../api_http#查询账号)接口查询。



#### 创建合约账号

> **注意**：在当前操作中，`master_weight`必须是0，`tx_threshold`必须是1。且仅允许初始化下面的关键字。

- 关键字

| 关键字        | 类型   | 描述                                               |
| ------------- | ------ | -------------------------------------------------- |
| payload       | string | 合约代码内容。                                     |
| init_balance  | int64  | 目标账户的初始化 BU 值，单位是MO，1 BU = 10^8 MO。 |
| init_input    | string | 可选，合约代码中init函数的入参。                   |
| master_weight | int64  | 目标账号的 master 权重。                           |
| tx_threshold  | int64  | 发起交易的门限，低于该值，无法发起交易。           |

- 查询
  - 账户信息通过HTTP中的[查询账号](../api_http#查询账号)接口查询。
  - 通过通过HTTP中的[查询交易](../api_http#查询交易)接口查询，在`result`中`transactions`的`error_desc`字段中，结果如下：

```protobuf
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

- protobuf结构

```protobuf
message OperationIssueAsset{
	string code = 1;
	int64 amount = 2;
}
```

- 关键字

| 关键字 | 类型   | 描述                                     |
| ------ | ------ | ---------------------------------------- |
| code   | string | 待发行资产的代码，长度范围[1, 64]        |
| amount | int64  | 待发行资产的数量，数值范围(0,MAX(int64)) |



### 转移资产

> **注意**：如果目标账户是合约账户，则当前操作会触发目标账户的合约执行。

- 功能

  操作源账号将一笔资产转给目标账户。

- protobuf结构

```protobuf
message AssetKey{
	 string issuer = 1;
	 string code = 2;
	 int32 type = 3;
}
message Asset{
	 AssetKey	key = 1;
	 int64		amount = 2;
}

//　转移资产操作对象
message OperationPayAsset{
	string dest_address = 1;
	Asset asset = 2;
	string input = 3;
}
```

- 关键字

| 关键字       | 类型   | 描述                                                         |
| ------------ | ------ | ------------------------------------------------------------ |
| dest_address | string | 目标账户地址。                                               |
| issuer       | string | 资产发行方地址。                                             |
| code         | string | 资产代码，长度范围[1, 64]。                                  |
| type         | int32  | 仅允许填0。                                                  |
| amount       | int64  | 资产数量，数值范围(0,MAX(int64))。                           |
| input        | string | 可选，如果目标账户是合约账户，input会被传递给合约代码的main函数的参数。如果目标账户是普通账户，则该设置无效。 |



### 设置metadata

- 功能

  操作源账号修改或添加一个metadata到自己的metadata表中。

- protobuf结构

```protobuf
message OperationSetMetadata{
	string	key = 1;  
	string  value = 2;
	int64 	version = 3;
	bool    delete_flag = 4;
}
```

- 关键字

| 关键字      | 类型   | 描述                                                         |
| ----------- | ------ | ------------------------------------------------------------ |
| key         | string | metadata的关键字。长度范围(0, 1024]                          |
| value       | string | metadata的内容。长度范围[0, 256K]                            |
| version     | int64  | 可选，metadata版本号。默认值是0。0：不限制版本，>0 : 当前 value 的版本必须为该值， <0 : 非法 |
| delete_flag | bool   | 是否删除该metadata。                                         |



### 设置权限

- 功能

  设置签名者拥有的权重，设置各个操作所需要的门限。详情请见HTTP中的[控制权的分配](../api_http#控制权的分配)的介绍。

- protobuf结构

```protobuf
message Signer {
	enum Limit{
		SIGNER_NONE = 0;
		SIGNER = 100;
	};
	string address = 1;
	int64 weight = 2;
}
message OperationTypeThreshold{
	Operation.Type type = 1;
	int64 threshold = 2;
}

//　设置权限操作对象
message OperationSetPrivilege{
	string master_weight = 1;
	repeated Signer signers = 2;
	string tx_threshold = 3;
	repeated OperationTypeThreshold type_thresholds = 4;
}
```

- protobuf关键字

| 关键字          | 类型   | 描述                                                         |
| --------------- | ------ | ------------------------------------------------------------ |
| master_weight   | string | 可选，default ""，表示该账号的 master 权重。 "" ：不设置该值；"0": 设置 master 权重为 0；("0", "MAX(UINT32)"]：设置权重值为该值；其他：非法 |
| signers         | array  | 可选，需要操作的 signer 列表，default 为空对象。空对象不设置 |
| address         | string | 需要操作的 signer 地址，符合地址校验规则                     |
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

- protobuf结构

```protobuf
message OperationPayCoin{
	string dest_address = 1;
	int64 amount = 2;
	string input = 3;
}
```

- protobuf关键字

| 关键字       | 类型   | 描述                                                         |
| ------------ | ------ | ------------------------------------------------------------ |
| dest_address | string | 目标账户                                                     |
| amount       | array  | 可选，需要操作的 signer 列表，default 为空对象。空对象不设置 |
| input        | string | 可选，如果目标账户是合约账户，input会被传递给合约代码的main函数的参数。如果目标账户是普通账户，则该设置无效 |



### 记录日志

- 功能

  操作源账户写日志到区块链中。

- protobuf结构

```protobuf
message OperationLog{
	string topic = 1;
	repeated string datas = 2;
}
```

- protobuf关键字

| 关键字 | 类型   | 描述                           |
| ------ | ------ | ------------------------------ |
| topic  | string | 日志主题。参数长度(0,128]      |
| datas  | array  | 日志内容。每个元素长度(0,1024] |



## Websocket接口

BUMO的websocket接口针对各种已定义的消息类型进行处理的。

### 消息类型

```protobuf
enum ChainMessageType {
	CHAIN_TYPE_NONE = 0;
	CHAIN_HELLO = 10; // response with CHAIN_STATUS = 2;
	CHAIN_TX_STATUS = 11;
	CHAIN_PEER_ONLINE = 12;
	CHAIN_PEER_OFFLINE = 13;
	CHAIN_PEER_MESSAGE = 14;
	CHAIN_SUBMITTRANSACTION = 15;
	CHAIN_LEDGER_HEADER = 16; //bumo notifies the client ledger(protocol::LedgerHeader) when closed
	CHAIN_SUBSCRIBE_TX = 17; //response with CHAIN_RESPONSE
	CHAIN_TX_ENV_STORE = 18;
}
```



### 通知消息注册

- 功能

  客户端通过该接口向区块链进行消息注册，即申请需要接收的消息类型（当前该功能不可用）。只能通过该接口获取区块链的版本信息。

- 请求消息类型

  `CHAIN_HELLO`

- 请求消息对象

  ```protobuf
  message ChainHello {
  	repeated ChainMessageType api_list = 1;	//By default, enable all apis
  	int64	timestamp = 2;
  }
  ```

- 请求参数

  | 参数      | 类型                    | 描述                   |
  | --------- | ----------------------- | ---------------------- |
  | api_list  | array<ChainMessageType> | 申请注册的消息类型列表 |
  | timestamp | int64                   | 申请时间               |

- 响应消息类型

  `CHAIN_HELLO`

- 响应数据对象

  ```protobuf
  message ChainStatus {
  	string self_addr		= 1;
  	int64 ledger_version	= 2;
  	int64 monitor_version	= 3;
  	string bumo_version		= 4;
  	int64	timestamp		= 5;
  }
  ```

- 响应结果

  | 变量            | 类型   | 描述           |
  | --------------- | ------ | -------------- |
  | self_addr       | string | 连接的节点地址 |
  | ledger_version  | int64  | 区块版本号     |
  | monitor_version | int64  | 监控程序版本号 |
  | bumo_version    | string | BUMO程序版本号 |
  | timestamp       | int64  | 时间戳         |



### 提交交易

- 功能

  将需要执行的交易，通过该消息类型发送给区块链执行。交易结构详情请见[交易](#交易)。

- 请求消息类型

  `CHAIN_SUBMITTRANSACTION`

- 请求参数对象

  ```protobuf
  //　签名
  message Signature {
  	string public_key = 1;
  	bytes sign_data = 2;
  }
  
  //　请求对象
  message TransactionEnv {
  	Transaction transaction = 1;
  	repeated Signature signatures 	= 2;
  	Trigger trigger = 3;
  }
  ```

- 请求参数

  | 参数        | 类型        | 描述                                     |
  | ----------- | ----------- | ---------------------------------------- |
  | transaction | Transaction | 详情请见[交易](#交易)。                  |
  | public_key  | string      | 交易提交者的公钥。                       |
  | sign_data   | bytes       | 对`transaction_blob`签名得到的签名数据。 |

- 响应消息类型

  - `CHAIN_TX_STATUS`：提交交易结果（提交交易成功，并不表示交易执行成功）。
  - `CHAIN_TX_ENV_STORE`：返回交易执行结果。

- `CHAIN_TX_STATUS`对象

  ```protobuf 
  message ChainTxStatus {
  	enum TxStatus {
  		UNDEFINED	= 0;
  		CONFIRMED	= 1;	// web server will check tx parameters, signatures etc fist, noitfy CONFIRMED if pass
  		PENDING		= 2;	// master will check futher before put it into pending queue
  		COMPLETE	= 3;	// notify if Tx write ledger successfully
  		FAILURE		= 4;	// notify once failed and set error_code
  	};
  
  	TxStatus	status = 1;
  	string		tx_hash = 2;
  	string		source_address = 3;
  	int64		source_account_seq = 4;
  	int64		ledger_seq = 5;			//on which block this tx records
  	int64		new_account_seq = 6;		//new account sequence if COMPLETE
  	ERRORCODE	error_code = 7;			//use it if FAIL
  	string		error_desc = 8	;			//error desc
  	int64		timestamp = 9;			
  }
  ```

- `CHAIN_TX_STATUS`成员

  | 变量               | 类型      | 描述                       |
  | ------------------ | --------- | -------------------------- |
  | status             | TxStatus  | 交易状态。                 |
  | tx_hash            | string    | 交易hash值。               |
  | source_address     | string    | 交易发起源账户地址。       |
  | source_account_seq | int64     | 交易发起源账户的交易序号   |
  | ledger_seq         | int64     | 这个交易记录所在的区块高度 |
  | new_account_seq    | int64     | 当交易完成时的区块高度     |
  | error_code         | ERRORCODE | 错误码                     |
  | error_desc         | string    | 错误描述                   |
  | timestamp          | int64     | 时间戮                     |

- `CHAIN_TX_ENV_STORE`对象

  ```protobuf
  message TransactionEnvStore{
  	TransactionEnv transaction_env = 1;
  	int32 error_code = 2;
  	string error_desc = 3;
  	int64 ledger_seq = 4;
  	int64 close_time = 5;
  	//for notify
  	bytes hash = 6;
  	int64 actual_fee = 7;
  	repeated bytes contract_tx_hashes = 8;
  }
  ```

- `CHAIN_TX_ENV_STORE`成员

  | 变量               | 类型           | 描述                 |
  | ------------------ | -------------- | -------------------- |
  | transaction_env    | TransactionEnv | 提交的交易内容       |
  | error_code         | int32          | 错误码               |
  | error_desc         | string         | 错误描述             |
  | ledger_seq         | int64          | 交易所在区块高度     |
  | close_time         | int64          | 交易执行完成时间     |
  | hash               | bytes          | 交易hash             |
  | actual_fee         | int64          | 实际交易费用，单位MO |
  | contract_tx_hashes | bytes          | 合约交易hash         |




### 消息订阅

- 功能

  该接口可实现仅接口指定账户地址的交易通知。

- 请求消息类型

  `CHAIN_SUBSCRIBE_TX`

- 请求参数对象

  ```protobuf
  message ChainSubscribeTx{
  	repeated string address = 1;
  }
  ```

- 请求参数

  | 参数    | 类型        | 描述               |
  | ------- | ----------- | ------------------ |
  | address | Transaction | 要订阅的账户地址。 |

- 响应消息类型

  `ChainResponse`

- 响应数据对象

  ```protobuf 
  message ChainResponse{
  		int32 error_code = 1;
  		string error_desc = 2;
  }
  ```

- 响应结果

  | 变量       | 类型   | 描述     |
  | ---------- | ------ | -------- |
  | error_code | int32  | 错误码   |
  | error_desc | string | 错误描述 |



## 错误码

  错误由两部分构成:

- error_code : 错误码，大概的错误分类
- error_desc : 错误描述，一般能从错误描述准确发现错误具体信息

错误列表如下:

| error_code/错误码 | 枚举名                                 | 错误描述                                                     |
| ----------------- | -------------------------------------- | ------------------------------------------------------------ |
| 0                 | ERRCODE_SUCCESS                        | 操作成功                                                     |
| 1                 | ERRCODE_INTERNAL_ERROR                 | 服务内部错误                                                 |
| 2                 | ERRCODE_INVALID_PARAMETER              | 参数错误                                                     |
| 3                 | ERRCODE_ALREADY_EXIST                  | 对象已存在， 如重复提交交易                                  |
| 4                 | ERRCODE_NOT_EXIST                      | 对象不存在，如查询不到账号、TX、区块等                       |
| 5                 | ERRCODE_TX_TIMEOUT                     | TX 超时，指该 TX 已经被当前节点从 TX 缓存队列去掉，但并不代表这个一定不能被执行 |
| 7                 | ERRCODE_MATH_OVERFLOW                  | 数学计算溢出                                                 |
| 20                | ERRCODE_EXPR_CONDITION_RESULT_FALSE    | 指表达式执行结果为 false，意味着该 TX 当前没有执行成功，但这并不代表在以后的区块不能成功 |
| 21                | ERRCODE_EXPR_CONDITION_SYNTAX_ERROR    | 指表达式语法分析错误，代表该 TX 一定会失败                   |
| 90                | ERRCODE_INVALID_PUBKEY                 | 公钥非法                                                     |
| 91                | ERRCODE_INVALID_PRIKEY                 | 私钥非法                                                     |
| 92                | ERRCODE_ASSET_INVALID                  | 无效的资产                                                   |
| 93                | ERRCODE_INVALID_SIGNATURE              | 签名权重不够，达不到操作的门限值                             |
| 94                | ERRCODE_INVALID_ADDRESS                | 地址非法                                                     |
| 97                | ERRCODE_MISSING_OPERATIONS             | 交易缺失操作                                                 |
| 98                | ERRCODE_TOO_MANY_OPERATIONS            | 单笔交易内超过了100个操作                                    |
| 99                | ERRCODE_BAD_SEQUENCE                   | 交易序号错误，nonce错误                                      |
| 100               | ERRCODE_ACCOUNT_LOW_RESERVE            | 余额不足                                                     |
| 101               | ERRCODE_ACCOUNT_SOURCEDEST_EQUAL       | 源和目的账号相等                                             |
| 102               | ERRCODE_ACCOUNT_DEST_EXIST             | 创建账号操作，目标账号已存在                                 |
| 103               | ERRCODE_ACCOUNT_NOT_EXIST              | 账户不存在                                                   |
| 104               | ERRCODE_ACCOUNT_ASSET_LOW_RESERVE      | 支付操作，资产余额不足                                       |
| 105               | ERRCODE_ACCOUNT_ASSET_AMOUNT_TOO_LARGE | 资产数量过大，超出了int64的范围                              |
| 106               | ERRCODE_ACCOUNT_INIT_LOW_RESERVE       | 创建账号初始化资                                             |
| 111               | ERRCODE_FEE_NOT_ENOUGH                 | 费用不足                                                     |
| 114               | ERRCODE_OUT_OF_TXCACHE                 | TX 缓存队列已满                                              |
| 120               | ERRCODE_WEIGHT_NOT_VALID               | 权重值不在有效范围                                           |
| 121               | ERRCODE_THRESHOLD_NOT_VALID            | 门限值不在有效范围                                           |
| 144               | ERRCODE_INVALID_DATAVERSION            | metadata的version版本号不与已有的匹配（一个版本化的数据库）  |
| 146               | ERRCODE_TX_SIZE_TOO_BIG                | 交易数据超出上限                                             |
| 151               | ERRCODE_CONTRACT_EXECUTE_FAIL          | 合约执行失败                                                 |
| 152               | ERRCODE_CONTRACT_SYNTAX_ERROR          | 合约语法分析失败                                             |
| 153               | ERRCODE_CONTRACT_TOO_MANY_RECURSION    | 合约递归深度超出上限                                         |
| 154               | ERRCODE_CONTRACT_TOO_MANY_TRANSACTIONS | 合约产生的交易超出上限                                       |
| 155               | ERRCODE_CONTRACT_EXECUTE_EXPIRED       | 合约执行超时                                                 |
| 160               | ERRCODE_TX_INSERT_QUEUE_FAIL           | 插入交易缓存队列失败                                         |

