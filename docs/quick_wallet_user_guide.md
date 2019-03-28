---
id: quick_wallet_user_guide
title: BOMO 轻钱包用户手册
sidebar_label: 轻钱包
---

## 简介
Quick Wallet是网页版轻量级钱包，用户可快速登录Quick Wallet 进行发送BU的操作。目前，Quick Wallet有正式版和测试版，正式版网址为 https://quickwallet.bumo.io，测试版网址为 https://quickwallet.bumotest.io。

## 登录

登录Quick Wallet只需要输入私钥即可，具体步骤如下：
1. 输入Quick Wallet网址进入登录界面。
2. 在**Private Key**字段输入要登录的钱包私钥。

<img src="/docs/assets/quickwallet_1.jpg"
     style= "margin-left: 20px">

3. 单击**Sign in**则登录到钱包页面。

**说明**：
* 单击右下方**Go Keypair Generator**可跳转到Keypair Generator页面，Keypair Generator的具体使用可参考*Keypair Generator用户手册*。
* 登录后的钱包页面显示账户余额和账户地址，下方显示账户近期交易记录。
* 交易记录信息包含交易状态、交易时间、交易源地址和目标地址、交易数量。

<img src="/docs/assets/quickwallet_2.jpg"
     style= "margin-left: 20px">

## 切换语言

单击页面右上角的**简体中文/English**可进行中英文语言切换。

<img src="/docs/assets/quickwallet_3.jpg"
     style= "margin-left: 20px">

## 转账
下面介绍使用Quick Wallet进行发送BU的具体步骤：
1. 登录到钱包页面。
2. 在**To**文本框中输入目的账户地址，例如*buQtFLZgUH7Pu31X8SreKhxWsx4Y6HfaaY4F*。
3. 在**Amount**文本框中输入转账数量，例如*50*。

<img src="/docs/assets/quickwallet_4.jpg"
     style= "margin-left: 20px">

4. 单击**Send**按钮发送BU，发送成功后账户余额减少，对方账户增加相应数量的BU，钱包下方的交易记录增加一行交易详情。    

<img src="/docs/assets/quickwallet_5.jpg"
     style= "margin-left: 20px">

**注意**：如果发送BU数量超出账户余额数量-0.1，系统提示*The Account Should Hold 0.1 BU*，如图所示。

<img src="/docs/assets/quickwallet_6.jpg"
     style= "margin-left: 20px">