---
id: version-1.3.1-legal_evidence_development_guide_for_java
title: BUMO 存证 JAVA 开发指南
sidebar_label: 存证 JAVA 开发
original_id: legal_evidence_development_guide_for_java
---

## BUMO开发概述

BUMO是新一代商用级基础公链。通过创新的共识算法（BU Firework）、主链-子链多链结构（BU Orbits）、主链-主链跨链结构（BU Canal）、开发者友好的智能合约（BU CodeMach）等核心技术，构建泛在价值流通的互联网基础设施。为全球开发者提供完善的技术文档及开发工具，用以提高开发者的开发效率，更易于生态应用的接入。通过文档阅读及工具使用，使开发者们对BUMO技术架构及生态系统有更充分的理解。欢迎全球优秀开发者、行业专家和有影响力的意见领袖，加入BUMO开发者生态，成为BUMO全球生态发展的基石力量。

BUMO是提供公共区块链基础设施服务，本文档帮助开发者如何接入BUMO，并且提供基础服务，如在BUMO网络中进行创建区块链账户，发行数字资产，自由流通资产等操作。



## 实例化SDK

> 使用SDK前配置SDK基础配置，如设置SDK接入的节点

示例如下：

```java
String url = "http://seed1.bumotest.io:26002";
SDK sdk = SDK.getInstance(url);

测试链URL：http://seed1.bumotest.io:26002
主网URL: 根据项目接入方自己搭建的主网节点信息而定
```

## 创建账户

> 在bumo上创建一个账户，可通过开发工具包提供的创建账户函数



代码示例：

```java
public static AccountCreateResult createAccount() {
   AccountCreateResponse response = sdk.getAccountService().create();
   if (response.getErrorCode() != 0) {
       return null;
   }
   return response.getResult();
}
```

返回示例：

```java
AccountCreateResult

// privateKey     账户私钥
// privbz8sQTNJfForacMJs1WX8M1YhSNq3YsztKNa4FWWwDyakwRv4Z3R

// publicKey   账户公钥b0018a6b1111e89cfaf6b5149d5c74d65c94c8e4f5ecfe67a3bfa4f02fad3b9f51492b7dce98

// address     账户地址
// buQk7a6MvSC2uYf42Tn5BcYSCh2c7oQ8e6wy

```

**注：**

- 该方式创建的账户处于未激活状态（未上链），在区块链上查不到。
- 账户指一个用户、物品、机构、房子、文件、资产发行方账户等任何实体基于密码学算法的随机生成的一个数字身份，通常叫区块链账户（公私玥对及区块链账户地址），它不受任何中心化机构控制，完全由账户拥有者掌控。

## 激活账户

> 未激活的账户需要链上账户（在bumo区块链网络中可以查询到的账户）对其激活。



**注：**

1. BU是bumo链上内置代币，链上交易都需要消耗BU
2. 若小布口袋账户没有BU，可以通过二级市场购买，然后提现至钱包账户上
3. 测试网络可以通过https://faucet.bumotest.io/领取BU



激活方法：

1. 通过小布口袋（bumo钱包）账户（钱包账户必须有可用余额的BU）向待激活的账户转账至少大于0.01BU，方可激活该未激活账户。
2. 代码激活

代码示例：

```java
/**
 * Activate a new account
 */
@Test
public void activateAccount() {
    // The account private key to activate a new account
    String activatePrivateKey = "privbyQCRp7DLqKtRFCqKQJr81TurTqG6UKXMMtGAmPG3abcM9XHjWvq";
    Long initBalance = ToBaseUnit.BU2MO("1000");
    // The fixed write 1000L, the unit is MO
    Long gasPrice = 1000L;
    // Set up the maximum cost 0.01BU
    Long feeLimit = ToBaseUnit.BU2MO("0.01");
    // Transaction initiation account's nonce + 1
    Long nonce = 8L;

    // Generate a new account to be activated
    Keypair keypair = Keypair.generator();
    System.out.println(JSON.toJSONString(keypair, true));
    String destAccount = keypair.getAddress();

    // 1. Get the account address to send this transaction
    String activateAddresss = getAddressByPrivateKey(activatePrivateKey);

    // 2. Build activateAccount
    AccountActivateOperation operation = new AccountActivateOperation();
    operation.setSourceAddress(activateAddresss);
    operation.setDestAddress(destAccount);
    operation.setInitBalance(initBalance);
    operation.setMetadata("activate account");

    String[] signerPrivateKeyArr = {activatePrivateKey};
    // Record txhash for subsequent confirmation of the real result of the transaction.
    // After recommending five blocks, call again through txhash `Get the transaction information
    // from the transaction Hash'(see example: getTxByHash ()) to confirm the final result of the transaction
    String txHash = submitTransaction(signerPrivateKeyArr, activateAddresss, operation, nonce, gasPrice, feeLimit);
    if (txHash != null) {
        System.out.println("hash: " + txHash);
    }
}

完整代码见：https://github.com/bumoproject/bumo-sdk-java/blob/master/examples/src/main/java/io/bumo/sdk/example/DigitalAssetsDemo.java
```

## 

## 记录存证信息

> 将存证信息记录在区块链上会被永久存储

### 获取账户的序列号

> 每个账户都维护着自己的序列号，该序列号从1开始，依次递增，一个序列号标志着一个该账户的交易



代码示例：

```java
public long getAccountNonce() {
   long nonce = 0;
   // Init request
   String accountAddress = [资方账户地址];
   AccountGetNonceRequest request = new AccountGetNonceRequest();
   request.setAddress(accountAddress);

   // Call getNonce
   AccountGetNonceResponse response = sdk.getAccountService().getNonce(request);
   if (0 == response.getErrorCode()) {
       nonce = response.getResult().getNonce();
   } else {
       System.out.println("error: " + response.getErrorDesc());
   }
 return nonce;
}
```

返回示例：

```java
nonce: 28
```

### 

### 组装存储存证信息操作



示例代码：

```java
 /**
     * 组装存储存证信息交易操作
     * @param txOriginatorAddress 交易发起人账户地址
     * @param evidenceKey 存证KEY
     * @param evidenceInfo 存证内容
     * @param txFee 区块链交易费用 单位 BU，注意：存储内容越多，相应需要的费用越多
     * @return 
     */
    public AccountSetMetadataOperation buildStoreEvidence(String txOriginatorAddress,String evidenceKey,String evidenceInfo){
        //组装存证交易数据
        // 存证Key，方便检索存证信息
        String key = evidenceKey;
        // 存证内容
        String value = evidenceInfo;

        AccountSetMetadataOperation operation = new AccountSetMetadataOperation();
        operation.setSourceAddress(txOriginatorAddress);
        operation.setKey(key);
        operation.setValue(value);
        return operation;
    }
```

### 序列化交易

> 序列化交易以便网络传输



代码示例：

```java
public String seralizeTransaction(String txOriginatorAddress,  BaseOperation[] operations,String txFee) {
	String transactionBlob = null;

    // 交易费用的单价（交易按字节收费，单位是 MO，1 BU = 10^8 MO）
    Long gasPrice = 1000L;
    // 交易费用（单位是 MO， 1 BU = 10^8 MO）
    Long feeLimit = ToBaseUnit.BU2MO(txFee);


    //1. 获取证书存储器账户nonce
    Long txOriginatorNonce = getAccountNonce(txOriginatorAddress);

    // nonce 加 1 ，作为本次区块交易号
    txOriginatorNonce += 1;

    // Build transaction  Blob
    TransactionBuildBlobRequest transactionBuildBlobRequest = new TransactionBuildBlobRequest();
    transactionBuildBlobRequest.setSourceAddress(senderAddresss);
    transactionBuildBlobRequest.setNonce(nonce);
    transactionBuildBlobRequest.setFeeLimit(feeLimit);
    transactionBuildBlobRequest.setGasPrice(gasPrice);
    for (int i = 0; i < operations.length; i++) {
       transactionBuildBlobRequest.addOperation(operations[i]);
    }
     TransactionBuildBlobResponse transactionBuildBlobResponse = sdk.getTransactionService().buildBlob(transactionBuildBlobRequest);
     if (transactionBuildBlobResponse.getErrorCode() == 0) {
    transactionBlob = transactionBuildBlobResponse. getResult().getTransactionBlob();
    } else {
       System.out.println("error: " + transactionBuildBlobResponse.getErrorDesc());
    }
    return transactionBlob;
}

// 注：
// txFee: 本次交易的交易费用，存证内容越多，花费费用越多
```

返回示例：

```java
transactionBlob:

 0A2462755173757248314D34726A4C6B666A7A6B7852394B584A366A537532723978424E4577101C18C0F1CED
 11220E8073A350802122462755173757248314D34726A4C6B666A7A6B7852394B584A366A537532723978424E
 45772A0B0A03474C41108094EBDC033AB6010804122462755173757248314D34726A4C6B666A7A6B7852394B5
 84A366A537532723978424E45773A8B010A1261737365745F70726F70657274795F474C4112757B22636F6465
 223A22474C41222C22746F74616C537570706C79223A313030303030303030302C22646563696D616C73223A3
 02C226E616D65223A22474C41222C2269636F6E223A22222C226465736372697074696F6E223A22474C412054
 4F4B454E222C2276657273696F6E223A22312E30227D
 
```

### 签名交易

> 交易序列化后，交易发起人需要对交易数据进行身份确权（用私钥对数据进行签名），通常称为数据的签名。签名结果包括签名数据和公钥。

代码示例：

```java
public Signature signTransaction(String transactionBlob,String accountPrivateKey) {
   Signature[] signatures = null;
   String senderPrivateKey = accountPrivateKey;

    // Sign transaction BLob
    TransactionSignRequest transactionSignRequest = new TransactionSignRequest();
    transactionSignRequest.setBlob(transactionBlob);
    transactionSignRequest.addPrivateKey(senderPrivateKey);
    TransactionSignResponse transactionSignResponse = sdk.getTransactionService().sign(transactionSignRequest);
    if (transactionSignResponse.getErrorCode() == 0) {
       signatures = transactionSignResponse.getResult().getSignatures();
    } else {
       System.out.println("error: " + transactionSignResponse.getErrorDesc());
    }
    return signatures[0];
}
```

返回示例：

```java
// 签名(signatures)

// signData:  签名串
// 6CEA42B11253BD49E7F1A0A90EB16448C6BC35E8684588DAB8C5D77B5E771BD5C7E1718942B32F9BDE14551866C00FEBA832D92F88755226434413F98E5A990C;

// publicKey: 账户公钥(交易发起人的账户公钥)
// b00179b4adb1d3188aa1b98d6977a837bd4afdbb4813ac65472074fe3a491979bf256ba63895
```

### 提交交易

> 交易数据签名后，需要将交易元数据（transactionBlob）及签名（signatures）提交（交易广播）给区块链网络

**注：交易涉及多方（多个签名账户）时，提交交易时需要将多个签名一并提交给BUChain网络**

代码示例：

```java
public String submitTransaction(String transactionBlob, Signature[] signatures) {
    String  hash = null;

    // Submit transaction
    TransactionSubmitRequest transactionSubmitRequest = new TransactionSubmitRequest();
    transactionSubmitRequest.setTransactionBlob(transactionBlob);
    transactionSubmitRequest.setSignatures(signatures);
    TransactionSubmitResponse transactionSubmitResponse = sdk.getTransactionService().submit(transactionSubmitRequest);
    if (0 == transactionSubmitResponse.getErrorCode()) {
        hash = transactionSubmitResponse.getResult().getHash();
    } else {
        System.out.println("error: " + transactionSubmitResponse.getErrorDesc());
    }
    return  hash ;
}
```

返回示例：

```java
// hash:  交易哈希
// 031fa9a7da6cf8777cdd55df782713d4d05e2465146a697832011b058c0a0cd8
```

**注：**

1. 交易涉及多方（多个签名账户）时，提交交易时需要将多个签名一并提交给BUChain网络
2. 提交交易（广播交易）后一般10秒左右可以得到交易终态结果，开发者可以通过查询交易状态接口查询最终状态

## 查询交易状态

> 查询交易的最终状态可以通过本接口查询，通常交易提交后10秒后可以得到交易的终态结果



代码示例：

```java
 public int checkTransactionStatus(String txHash) {
    // Init request
    TransactionGetInfoRequest request = new TransactionGetInfoRequest();
    request.setHash(txHash);

    // Call getInfo
    TransactionGetInfoResponse response = sdk.getTransactionService().getInfo(request);
    int errorCode = response.getErrorCode();
    if (errorCode == 0){
        TransactionHistory transactionHistory = response.getResult().getTransactions()[0];
        errorCode = transactionHistory.getErrorCode();
    }

    return errorCode;
 }
```

返回值为：

| 错误码 | 描述                                                         |
| ------ | ------------------------------------------------------------ |
| 0      | Successful operation                                         |
| 1      | Inner service defect                                         |
| 2      | Parameters error                                             |
| 3      | Objects already exist, such as repeated transactions         |
| 4      | Objects do not exist, such as null account, transactions and blocks etc. |
| 5      | Transactions expired. It means the transaction has been removed from the buffer, but it still has probability to be executed. |
| 7      | Math calculation is overflown                                |
| 20     | The expression returns false. It means the TX failed to be executed currently, but it still has probability to be executed in the following blocks . |
| 21     | The syntax of the expression returns are false. It means that the TX must fail. |
| 90     | Invalid public key                                           |
| 91     | Invalid private key                                          |
| 92     | Invalid assets                                               |
| 93     | The weight of the signature does not match the threshold of the operation. |
| 94     | Invalid address                                              |
| 97     | Absent operation of TX                                       |
| 98     | Over 100 operations in a single transaction                  |
| 99     | Invalid sequence or nonce of TX                              |
| 100    | Low reserve in the account                                   |
| 101    | Sender and receiver accounts are the same                    |
| 102    | The target account already exists                            |
| 103    | Accounts do not exist                                        |
| 104    | Low reserve in the account                                   |
| 105    | Amount of assets exceeds the limitation ( int64 )            |
| 106    | Insufficient initial reserve for account creation            |
| 111    | Low transaction fee                                          |
| 114    | TX buffer is full                                            |
| 120    | Invalid weight                                               |
| 121    | Invalid threshold                                            |
| 144    | Invalid data version of metadata                             |
| 146    | exceeds upper limitation                                     |
| 151    | Failure in contract execution                                |
| 152    | Failure in syntax analysis                                   |
| 153    | The depth of contract recursion exceeds upper limitation     |
| 154    | the TX submitted from the  contract exceeds upper limitation |
| 155    | Contract expired                                             |
| 160    | Fail to insert the TX into buffer                            |
| 11060  | BlockNumber must bigger than 0                               |
| 11007  | Failed to connect to the network                             |
| 12001  | Request parameter cannot be null                             |
| 20000  | System error                                                 |