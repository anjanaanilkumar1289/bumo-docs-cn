---
id: version-1.0.0.10-integration_guide_for_exchanges
title: BUMO 交易所对接指南
sidebar_label: 交易所对接
original_id: integration_guide_for_exchanges
---


## 概述

本文档用于交易所对接BUMO节点、使用BUMO SDK。


## JAVA SDK 用法说明

JAVA SDK的使用包括了[生成用户充值地址](#生成用户充值地址)、[检测账户地址的合法性](#检测账户地址的合法性) 以及[资产交易](#资产交易)。

### 生成用户充值地址

交易所需要给每一个用户生成一个充值地址，交易所可通过 Bumo-sdk-java
中提供的Keypair.generator()创建用户的充值地址，具体示例如下所示：

```java
   /**

        * 生成账户私钥、公钥以及地址
        */
       @Test
       public void createAccount() {
           Keypair keypair = Keypair.generator();
           System.out.println(JSON.toJSONString(keypair, true));
       }
```

返回值如下所示：

```json
{
    "address": "buQa6wYkP9YPtE7xGJZKZ4TLHEJ79XFTFXRC",
    "privateKey": "privbytvfniP81UAD9FzyVhe43U2EKXcZqDXfkv2txhHuKN9AJszg4VC",
    "publicKey": "b00152f649c63d1b069a19f3a4647333cc9734f8f19452932ce25a4d6bd6b3697e1d88e69d61"
}
```

### 检测账户地址的合法性

通过如下所示代码检测账户地址的合法性。

```java
   /**

        * 检验账户地址是否合法
        */
       @Test
       public void checkAccountAddress() {
           String address = "buQemmMwmRQY1JkcU7w3nhruoX5N3j6C29uo";
           AccountCheckValidRequest accountCheckValidRequest = new AccountCheckValidRequest();
           accountCheckValidRequest.setAddress(address);
           AccountCheckValidResponse accountCheckValidResponse = sdk.getAccountService().checkValid(accountCheckValidRequest);
           if (0 == accountCheckValidResponse.getErrorCode()) {
               System.out.println(accountCheckValidResponse.getResult().isValid());
           } else {
               System.out.println(JSON.toJSONString(accountCheckValidResponse, true));
           }
       }
```
**注意**：
- 如果返回值为 `true` 则表示账户地址合法。 
- 如果返回值为 `false` 则表示账户地址非法。

### 资产交易

在BUMO网络里，每10秒产生一个区块，每个交易只需要一次确认即可得到交易终态。在本章节将介绍 [探测用户充值](#探测用户充值) 、[用户提现或转账](#用户提现或转账) 以及 [查询交易](#查询交易) 。

#### 探测用户充值

交易所需要开发监听区块生成，然后解析区块里的交易记录，从而确认用户充值行为。具体步骤如下:
1. 确保节点区块状态正常。
2. 解析区块里包含的交易（解析方法见解析区块交易）。
3. 记录解析后的结果。

**查看区块状态**

通过如下所示代码查看区块状态。

```java
   /**

        * 检测连接的节点是否区块同步正常
        */
       @Test
       public void checkBlockStatus() {
           BlockCheckStatusResponse response = sdk.getBlockService().checkStatus();
           System.out.println(response.getResult().getSynchronous());
       }
```
**注意**：
- 如果返回值为 `true` 则表示区块正常。 
- 如果返回值为 `false` 则表示区块异常。


**解析区块交易**

交易所可根据区块高度查询该区块里的交易信息，然后分析每条交易信息。

请求示例：

```java
   /**

        * 探测用户充值操作
        * 
        * 通过解析区块中的交易来探测用户的充值动作
        */
       @Test
       public void getTransactionOfBolck() {
           Long blockNumber = 617247L;// 第617247个区块
           BlockGetTransactionsRequest request = new BlockGetTransactionsRequest();
           request.setBlockNumber(blockNumber);
           BlockGetTransactionsResponse response = sdk.getBlockService().getTransactions(request);
           if (0 == response.getErrorCode()) {
               System.out.println(JSON.toJSONString(response, true));
           } else {
               System.out.println("Failure\n" + JSON.toJSONString(response, true));
           }
           // 探测某个账户是否充值BU
           // 解析transactions[n].transaction.operations[n].pay_coin.dest_address 
    
           // 注意：
           // Operations是数组，有可能有多笔转账操作
       }
```

响应报文如下：

```json
  {
	"total_count": 1,
	"transactions": [{
		"close_time": 1524467568753121,
		"error_code": 0,
		"error_desc": "",
		"hash": "89402813097402d1983c178c5ec271c6890db40c3beb9f06db71c8d52dab6c86",
		"ledger_seq": 33063,
		"signatures": [{
			"public_key": "b001dbf0942450f5601e39ac1f7223e332fe0324f1f91ec16c286258caba46dd29f6ef9bf93b",
			"sign_data": "668984fc7ded2dd30d87a1577f78eeb34d2198de3485be14ea66d9ca18f21aa21b2e0461ad8fedefc1abcb4221d346b404e8f9f9bd9c93a7df99baffeb616e0a"
		}],
		"transaction": {
			"fee_limit": 1000000,
			"gas_price": 1000,
			"metadata": "333133323333",
			"nonce": 25,
			"operations": [{
				"pay_coin": {
					"amount": 3000,
					"dest_address": "buQctxUa367fjw9jegzMVvdux5eCdEhX18ME"
				},
				"type": 7
			}],
			"source_address": "buQhP7pzmjoRsNG7AkhfNxiWd7HuYsYnLa4x"
		}
	}]
  }

  响应报文解释：

  total_count    交易总数（一般情况下都是1）
  transactions   查询区块中交易对象，数组大小是该区块的交易总数
  actual_fee     交易费用，单位是MO
  close_time     交易时间
  error_code     交易状态 0 是成功 非0 为失败
  error_desc     交易状态信息
  hash           交易哈希
  ledger_seq     区块高度
  signatures     签名信息
  public_key     签名者公钥
  sign_data      签名者签名数据
  transaction    签名对象
  fee_limit      费用最小值，单位 MO
  gas_price      Gas，单位 MO
  metadata       交易附加信息
  nonce          交易原账号交易数
  operations     操作对象(支持多个)
  pay_coin       操作类型：内置token
  amount         转移BU数量，单位 MO
  dest_address   接收方地址
  type           操作类型：7 为内置token转移
  source_address 转出方地址
```

**注意**：
- 关于Bumo-sdk-java 如何使用，请访问：[JAVA SDK](../sdk_java)

- 关于交易所对接示例，请访问以下链接：[ExchangeDemo.java](https://github.com/bumoproject/bumo-sdk-java/blob/master/examples/src/main/java/io/bumo/sdk/example/ExchangeDemo.java)

#### 用户提现或转账

用户提现操作可参考bumo-sdk-java 提供的转账示例，如下所示：

```java
   /**
        * 发送一笔BU交易
        *
        * @throws Exception
        */
       @Test
       public void sendBu() throws Exception {
           // 初始化变量
           // 发送方私钥
           String senderPrivateKey = "privbyQCRp7DLqKtRFCqKQJr81TurTqG6UKXMMtGAmPG3abcM9XHjWvq";
           // 接收方账户地址
           String destAddress = "buQswSaKDACkrFsnP1wcVsLAUzXQsemauE";
           // 发送BU数量
           Long amount = ToBaseUnit.BU2MO("0.01");
           // 固定写 1000L，单位是MO
           Long gasPrice = 1000L;
           // 设置最大费用 0.01BU
           Long feeLimit = ToBaseUnit.BU2MO("0.01");
           // 参考getAccountNonce()获取账户Nonce+ 1
           Long nonce = 1L;

           // 记录 txhash，以便后续再次确认交易真实结果
           // 推荐5个区块后通过txhash再次调用`根据交易Hash获取交易信息`（参考提示：getTxByHash()）来确认交易终态结果
           String txhash = sendBu(senderPrivateKey, destAddress, amount, nonce, gasPrice, feeLimit);
    
       }
```
**注意**：
- 记录提现操作的hash值，以便后续查看该笔提现操作的终态结果。
- `gasPrice` 目前（2018-04-23）最低值是1000MO。
- `feeLimit` 建议填写1000000MO，即0.01BU。

#### 查询交易

用户提现操作的终态结果可通过当时发起提现操作时返回的hash值进行查询。

调用示例如下所示：
```java
   /**
    * 基于交易hash查询交易信息
    */
       @Test
       public void getTxByHash() {
           String txHash = "fba9c3f73705ca3eb865c7ec2959c30bd27534509796fd5b208b0576ab155d95";
           TransactionGetInfoRequest request = new TransactionGetInfoRequest();
           request.setHash(txHash);
           TransactionGetInfoResponse response = sdk.getTransactionService().getInfo(request);
           if (0 == response.getErrorCode()) {
               System.out.println(JSON.toJSONString(response, true));
           } else {
               System.out.println("Failure\n" + JSON.toJSONString(response, true));
           }
       }
```
**注意**：

- `tx.totalCount` 数量大于等于1时说明交易历史存在。
- `tx.transactions.errorCode` 等于0表示交易成功，非0表示交易失败，具体原因查看 `errorDesc`。
- 用户提现操作，交易所请关注 `pay_coin` 操作。
- 完整用户提现响应示例：
``` json
  {
	"total_count": 1,
	"transactions": [{
		"close_time": 1524467568753121,
		"error_code": 0,
		"error_desc": "",
		"hash": "89402813097402d1983c178c5ec271c6890db40c3beb9f06db71c8d52dab6c86",
		"ledger_seq": 33063,
		"signatures": [{
			"public_key": "b001dbf0942450f5601e39ac1f7223e332fe0324f1f91ec16c286258caba46dd29f6ef9bf93b",
			"sign_data": "668984fc7ded2dd30d87a1577f78eeb34d2198de3485be14ea66d9ca18f21aa21b2e0461ad8fedefc1abcb4221d346b404e8f9f9bd9c93a7df99baffeb616e0a"
		}],
		"transaction": {
			"fee_limit": 1000000,
			"gas_price": 1000,
			"metadata": "333133323333",
			"nonce": 25,
			"operations": [{
				"pay_coin": {
					"amount": 3000,
					"dest_address": "buQctxUa367fjw9jegzMVvdux5eCdEhX18ME"
				},
				"type": 7
			}],
			"source_address": "buQhP7pzmjoRsNG7AkhfNxiWd7HuYsYnLa4x"
		}
	}]
  }
  total_count    交易总数（一般情况下都是1）
  transactions   查询区块中交易对象，数组大小是该区块的交易总数
  actual_fee     交易费用，单位是MO
  close_time     交易时间
  error_code     交易状态 0 是成功 非0 为失败
  error_desc     交易状态信息
  hash           交易哈希
  ledger_seq     区块高度
  signatures     签名信息
  public_key     签名者公钥
  sign_data      签名者签名数据
  transaction    签名对象
  fee_limit      费用最小值，单位 MO
  gas_price      Gas，单位 MO
  metadata       交易附加信息
  nonce          交易原账号交易数
  operations     操作对象(支持多个)
  pay_coin       操作类型：内置token
  amount         转移BU数量，单位 MO
  dest_address   接收方地址
  type           操作类型：7 为内置token转移
  source_address 转出方地址
```

## BU-Explorer

BUMO提供了区块链数据浏览工具，可供用户查询区块数据。

您访问以下链接查询区块链数据：

- 测试网：https://explorer.bumotest.io
- 主网：https://explorer.bumo.io

## BUMO钱包

BUMO提供了Windows和Mac版全节点钱包，可供用户管理用户私钥、查看BU余额转账以及离线签名交易等功能。

您可以通过以链接下载BUMO钱包：

https://github.com/bumoproject/bumo-wallet/releases

## 常见问题

**BUChain命令行的节点启动**

问：使用BUChain命令行时是否需要启动该节点？

答：不用。

**gas_price和fee_limit的值是否固定**

问：`gas_price` 是固定1000MO，`fee_limit` 是1000000MO 吗？

答：不是固定。但目前(2018-04-23) `gas_price` 是1000MO，`gas_price`
越大越优先打包。`fee_limit` 是交易时交易发起方最多给区块链的交易费用，在正常合法的交易情况下区块链收取的真实费用小于调用方填写的 `fee_limit` 。( `gas_price`
可通过 http://seed1.bumo.io:16002/getLedger?with_fee=true 查询的结果 `result.fees.gas_price` 字段得到）。

**账户余额转出** 

问：账户的余额能否全部转出？

答：不能。为了防止DDOS
攻击，防止创建大量垃圾账户，BUMO激活的账户必须保留一定数量的BU，目前是0.1BU（可通过 http://seed1.bumo.io:16002/getLedger?with_fee=true
查询的结果 `result.fees.base_reserve` 字段得到）。

