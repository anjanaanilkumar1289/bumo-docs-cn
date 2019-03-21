---
id: tool_application_scenario
title: BUMO 工具应用场景示例
sidebar_label: 工具应用场景示例
---

## 应用软件介绍

本文档中场景会使用到Faucet 应用软件、QuickWallet 应用软件和Keypair Generator 应用软件，下面简单介绍这三种软件。

### Faucet

Faucet 又称“水龙头”，是为用户获取测试BU 的网页版应用。用户只要输入自己的测试账户地址即可获取100 测试BU。用户可连续获取测试BU，但不能过于频繁。Faucet 测试版网址为https://faucet.bumotest.io/。具体使用步骤可参考*Faucet 用户手册*。

### QuickWallet

QuickWallet 是网页版轻量级钱包，用户可快速登录QuickWallet 进行发送BU 操作。目前，QuickWallet 有正式版和测试版，正式版网址为 https://quickwallet.bumo.io，测试版网址为 https://quickwallet.bumotest.io。具体使用步骤可参考*QuickWallet 用户手册*。

### Keypair Generator
Keypair Generator 是网页版地址和私钥生成器，通过该入口，可随机生成账户地址和私钥。Keypair Generator 目前有正式版和测试版，正式版网址为 https://keypair.bumo.io/, 测试版网址为 https://keypair.bumotest.io/ 。具体使用步骤可参考 *Keypair Generator 用户手册*。

## 场景示例介绍

本文档以一个简单的场景示例介绍Faucet、QuickWallet、Keypair Generator 三个应用软件的使用，场景中我们都以测试网为例进行介绍。场景为：生成两个账户地址A 和B，向账户A 发送200 测试BU，账户A 向账户B 转账50 测试BU。

## 场景示例实现

下面介绍实现场景示例的过程。

### 生成账户地址

用户可通过Keypair Generator 生成账户地址和相应的私钥，具体步骤如下：
1. 登录到Keypair Generator 入口。
2. 单击**Generator**生成账户A 的地址和私钥，如下图所示：

A的地址：*buQttWTBP6tVRo9jALUT3UqFzopuXKiogbed*

A的密钥：*privby33VzSZySr7TbjHLoRgz9r2kpMyLMtXnebWUNQTiTuTj8kdhn4Y*

<img src="/docs/assets/accountaddressgeneration_1.jpg"
     style= "margin-left: 20px">

3. 再次单击**Generator**生成账户B的地址和私钥，如下图所示：

B的地址：*buQtFLZgUH7Pu31X8SreKhxWsx4Y6HfaaY4F*

B的密钥：*privbzvYJo6XR6JfQNobxpJjd6F5erzzEZbpGzMZENjppovFVe5JDMdh*  

<img src="/docs/assets/accountaddressgeneration_2.jpg"
     style= "margin-left: 20px">

**说明**：单击**Go Quick Wallet* 可直接跳转到Quick Wallet页面，Quick Wallet 使用说明请参考*Quick Wallet用户手册*。

### 获取测试BU

用户可通过Faucet 软件获取测试BU，具体步骤如下：
1. 登录到Faucet入口，如图所示：

<img src="/docs/assets/acquiretestbu_1.jpg"
     style= "margin-left: 20px">

2. 在**Account Address**字段输入A的账户地址并单击**Confirm**，会显示发送测试BU 到A账户成功，如图所示，此时A账户拥有100 测试BU。过一段时间后再次重复为A账户获取BU，则A账户拥有200 测试BU。

<img src="/docs/assets/acquiretestbu_2.jpg"
     style= "margin-left: 20px">

### 转账BU

账户A向账户B转账50个测试BU 的具体步骤如下：
1. 登录Quick Wallet 入口。
2. 输入A 账户的私钥登录A账户，A账户页面显示余额200BU，页面下方显示交易详情，如下图所示。 

<img src="/docs/assets/transferbu_1.jpg"
     style= "margin-left: 20px">  

交易详细信息如下表所示：

|字段|描述|
|----|:-------:|
|Status|交易状态，交易状态包括交易成功或者交易失败|
|Transaction Time|交易时间，即交易发生的时间|
|From|交易的源账户地址|
|To|交易的目的账户地址|
|Value|交易的数量|

3. 在**To**文本框处输入B账户的地址。
4. 在**Amount**字段输入转账数量，这里我们输入50，即向B账户转账50BU。
5. 单击**Send**后转账成功。则A账户显示BU剩余数量为149.99754，页面下方显示交易详情，如下图所示。

<img src="/docs/assets/transferbu_2.jpg"
     style= "margin-left: 20px">  

### 查看转账结果

登录Quick Wallet入口，输入B账户的私钥登录后，显示B账户有50BU，页面下方显示交
易详情，如图所示。

<img src="/docs/assets/checktransfer
.jpg"
     style= "margin-left: 20px">  