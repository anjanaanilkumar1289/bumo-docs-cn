---
id: codemach_editor_user_guide
title: BUMO 合约编辑器用户手册
sidebar_label: 合约编辑器
---

## CodeMach Editor 简介

BUMO为用户提供了开发者友好的智能合约编辑器CodeMach Editor，方便开发者进行可视化合约调试。CodeMach Editor 具有丰富可扩展的底层接口，支持JavaScript、C、C++、Python、Golang 等多种语言。CodeMach Editor 满足跨平台运行场景，并且具有可认证的合约外数据反馈和独立的沙箱环境，因此智能合约可在隔离环境中执行。同时，CodeMach Editor也提供了合约互操作及异常处理机制。智能合约编辑器网址：https://cme.bumo.io/。

下面是合约编辑器CodeMach Editor 的默认页面，页面主要分为五个区域，下面参照此界面来说明CodeMach Editor 的功能。

<img src="/docs/assets/codemacheditoroverview.jpg"
     style= "margin-left: 20px">

- **区域1** 为浏览区，显示文件目录，其中**Example**是默认生成的例子，可以复制里面的代码直接使用。**Customize** 是自定义文件夹，用户可通过旁边的+创建文件，也可单击上方的**+Folder**来创建自己的文件夹。

- **区域2** 为代码编辑区，在代码编辑区中可以编辑合约代码。

- **区域3** 为信息区，Account 处显示当前用户的账户地址和可用BU数量。当提示BU不足时，单击旁边的刷新按钮会再次获得100BU。Deploy the contract 处可设置智能合约参数，即为指定的方法传入参数。设置完合约参数后，单击下面的**Deploy**按钮来生成合约。Contractinformation 处显示执行智能合约后显示的返回信息。

- **区域4** 为控制台区域，智能合约执行后，会在这里显示相关信息，如：合约地址、交易hash。如果执行的过程中出现了错误，也会在控制台返回错误信息进行提示。

- **区域5** 为调用智能合约区域，选择main后可在Deploy the contract 处配置方法和参数执行main函数。选择query后可在Deploy the contract 处配置方法和参数执行query函数。    

下面内容介绍用户如何使用CodeMach Editor进行自定义文件和文件夹、生成智能合约、调用智能合约等操作。

## 自定义文件夹和文件

### 自定义文件夹

用户可在CodeMach Editor 中自定义文件，具体步骤如下：
1. 单击浏览区右上角的**+Folder**，或者**Customize**文件夹右侧的 **+**。

<img src="/docs/assets/customfolder.jpg"
     style= "margin-left: 20px">

2. 在弹出的对话框中输入新文件夹的名字，如*bumotest*。

<img src="/docs/assets/newfolder.jpg"
     style= "margin-left: 20px">  

3. 单击Enter则新建文件夹完成，新文件夹显示在左侧列表中。

<img src="/docs/assets/foldercreated.jpg"
     style= "margin-left: 20px">  


### 自定义文件 

用户可在CodeMach Editor默认文件夹或者自定义文件夹中新建文件，具体步骤如下：
1. 单击要新建文件的文件夹右侧的 **+**，例如选择新建的文件夹*bumotest*。
2. 在弹出的对话框中输入新建文件的名字,如*newfile*。

<img src="/docs/assets/newfile.jpg"
     style= "margin-left: 20px">  

3. 单击**Enter**则新建文件完成，新文件显示在bumotest文件夹下面。

<img src="/docs/assets/newfilecreated.jpg"
     style= "margin-left: 20px">  

## 生成智能合约

用户为编写的智能合约设置参数后可生成智能合约，以CodeMach Editor默认代码为例，具体实现步骤如下：
1. 在Deploy the contract 处输入init函数的参数，如输入*5*。
2. 单击**Deploy**则生成智能合约。

<img src="/docs/assets/smartcontractgenerated.jpg"
     style= "margin-left: 20px">

**说明**：
* 智能合约生成成功后，**Deploy**按钮下显示生成成功提示信息*Deploy success*。
* Contract information 处显示执行智能合约后的返回信息，包括合约地址和交易哈希。
* 智能合约执行后，控制台区域显示相关信息，如合约地址、交易hash。如果执行的过程中出现了错误，
也会在控制台返回错误信息。
* 单击**show source data**可显示源数据代码。     

## 调用智能合约

调用智能合约包括调用main函数和调用query函数。

### 调用main函数

调用main 函数的具体步骤如下：
1. 单击**Invoke the contract**下面的main。
2. 在参数输入框中输入参数值，如*5*。
3. 在**Amount of BU to be sent to the contract address**字段输入要发送的BU 数量。
4. 单击**Invoke**则调用完成。

<img src="/docs/assets/callmain.jpg"
     style= "margin-left: 20px">

**说明**：main函数调用完成后控制台显示交易哈希值和交易结果。 

### 调用query函数

调用query函数的具体步骤如下：
1. 单击**Invoke the contract**下面的**query**。
2. 在参数输入框中输入参数值，如*3*。
3. 单击**Invoke**则调用完成。

<img src="/docs/assets/callquery.jpg"
     style= "margin-left: 20px">

**说明**：query函数调用完成后控制台显示查询结果。   