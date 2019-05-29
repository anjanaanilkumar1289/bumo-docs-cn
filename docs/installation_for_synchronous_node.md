---
id: installation_for_synchronous_node
title: BUMO 主网同步节点安装指南
sidebar_label: 主网同步节点安装指南
---



## 概要

本文将指导您如何在Linux环境下用安装包安装并配置 BUMO 同步节点。

详情请见：[BUMO 节点安装运维指南](../installation_maintenance_guide)



## 系统要求

在安装BUMO节点之前需要确保您的系统满足以下条件。

### 硬件要求

硬件要求至少满足以下配置：

- **推荐配置**：CPU 8 核，内存 32G，带宽 20M， SSD 磁盘500G
- **最低配置**：CPU 4 核，内存 16G，带宽 10M， SSD 磁盘500G

### 软件要求

系统软件可选择Ubuntu、Centos或者MacOS。

- Ubuntu 14.04
- Centos 7



## 安装包安装

安装包安装是指以安装包的方式来安装BUMO节点。通过安装包安装BUMO节点由五部分构成：[获取安装包并解压](#获取安装包并解压) 、[注册服务](#注册服务) 、[修改服务启动路径](#修改服务启动路径) 、[设置开机启动](#设置开机启动) 、[选择主网的配置文件](#选择主网的配置文件)。

下面以 bumo 1.3.1 版本为例。



### 获取安装包并解压

获取BUMO的安装包并解压安装文件需要完成以下步骤。

1. 输入以下命令下载BUMO的安装包。

    ```bash
    wget https://github.com/bumoproject/bumo/releases/download/1.3.1/buchain-1.3.1-linux-x64.tar.gz
    ```
  > **注意**： 
  >
  >    - 如果您没有安装wget，可以用 ``apt-get install wget`` 命令来装 ``wget``。
  >    - 您可以在 https://github.com/bumoproject/bumo/releases 链接上找到需要的版本，然后右键单击该版本复制下载链接。
  >    - 在本示例中文件下载到根目录下。


2. 输入以下命令把安装包拷贝到/usr/local/目录下。

    ```shell
    cp buchain-1.3.1-linux-x64.tar.gz /usr/local/
    ```
    
  > **注意**：以上拷贝操作是在文件下载目录下完成的。您需根据具体的下载目录来拷贝文件。

3. 输入以下命令进入到 /usr/local/目录下。

    ```shell
    cd /usr/local/
    ```

4. 输入以下命令解压文件。

    ```shell
    tar -zxvf buchain-1.3.1-linux-x64.tar.gz
    ```
    
  > **注意**：解压完成后得到buchain/目录。



### 注册服务

文件解压后需要注册bumo和bumod的服务。注册服务需要完成以下步骤：

1. 输入以下命令注册bumo的服务。

    ```shell
    ln -s /usr/local/buchain/scripts/bumo /etc/init.d/bumo
    ```

2. 输入以下命令注册bumod的服务。

    ```shell 
    ln -s /usr/local/buchain/scripts/bumod /etc/init.d/bumod
    ```



### 修改服务启动路径

修改bumo和bumod的启动路径需要完成以下步骤：

1. 在local/目录下输入以下命令打开bumo文件。

    ```shell
    vim buchain/scripts/bumo
    ```

2. 找到install_dir并更改bumo的安装目录。

    ```shell
    install_dir=/usr/local/buchain
    ```
    

  <img src="/docs/assets/start_path.png" style= "margin-left: 20px">

  > **注意**： 默认情况下install_dir的目录在/usr/local/buchain下；您可以根据bumo的具体安装目录来修改。

3. 单击 `Esc` 键退出编辑。

4. 输入 `:wq` 保存文件。

5. 在local/目录下输入以下命令打开bumod文件。

    ```shell
    vim /buchain/scripts/bumod
    ```

6. 找到install_dir并更改bumod的安装目录。

    ```shell
    install_dir=/usr/local/buchain
    ```

  > **注意**：默认情况下install_dir的目录在/usr/local/buchain下；您可以根据bumod的具体安装目录来修改。

7. 单击 `Esc` 键退出编辑。

8. 输入 `:wq` 保存文件。



### 设置开机启动

设置开机启动包括设置启动级别，添加启动命令和修改文件权限。设置开机启动需要完成以下步骤：

1. 输入以下命令设置1级。

    ```shell
    ln -s -f /etc/init.d/bumod /etc/rc1.d/S99bumod
    ```
2. 输入以下命令设置2级。

    ```shell
    ln -s -f /etc/init.d/bumod /etc/rc2.d/S99bumod
    ```
3. 输入以下命令设置3级。

    ```shell
    ln -s -f /etc/init.d/bumod /etc/rc3.d/S99bumod
    ```
4. 输入以下命令设置4级。

    ```shell
    ln -s -f /etc/init.d/bumod /etc/rc4.d/S99bumod
    ```
5. 输入以下命令设置5级。

    ```shell
    ln -s -f /etc/init.d/bumod /etc/rc5.d/S99bumod
    ```
6. 输入以下命令打开rc.local文件。

    ```shell
    vim /etc/rc.local
    ```

7. 在rc.local文件末尾追加以下命令。

    ```shell
    /etc/init.d/bumod start
    ```
    <img src="/docs/assets/add_start_command.png" style= "margin-left: 20px">

8. 单击 `Esc` 键退出编辑。

9. 输入 `:wq` 命令保存文件。

10. 执行以下命令设置rc.local文件的权限。

    ```shell
    chmod +x /etc/rc.local
    ```

**注意**：至此就完成了BUMO节点的安装。在启动bumo服务之前还需要选择运行环境的配置文件。



### 选择主网的配置文件

在安装完BUMO节点后需要选择主网运行环境的配置文件才能启动bumo服务。步骤如下：

1. 输入以下命令进入到配置文件目录。

    ```shell
    cd /usr/local/buchain/config/
    ```
    
2. 输入以下命令重命名运行环境的配置文件。

    ```shell
    mv bumo-mainnet.json bumo.json
    ```
  > 注意：
  >    - 本示例中选取了主网环境作为运行环境。您也可以根据自己的需要选取其他文件作为运行环境。
  >    - 重命名文件完成后可以通过 `service start bumo` 来启动bumo服务。
  >    - 安装完BUMO节点后可以在buchain/目录下查看安装文件的目录结构。



## 配置

通过修改*buchain*的*config*目录下的**bumo.json**文件进行配置。这里主要配置 *ledger* 下的 **validation_address** 和 **validation_private_key** 。这两项是记录节点的*账户地址*和*加密后的私钥*，如果是同步节点，这两项没有作用，但是如果同步节点申请成为记录节点后，可用于参与共识。



### 结构

```json 
"ledger":{
    "validation_address":"buQmtDED9nFcCfRkwAF4TVhg6SL1FupDNhZY",//记账节点地址，同步节点或者钱包不需要配置
    "validation_private_key": "e174929ecec818c0861aeb168ebb800f6317dae1d439ec85ac0ce4ccdb88487487c3b74a316ee777a3a7a77e5b12efd724cd789b3b57b063b5db0215fc8f3e89", //记账节点私钥，同步节点或者钱包不需要配置
    "max_trans_per_ledger":1000, //单个区块最大交易个数
    "tx_pool":{ //交易池配置
        "queue_limit":10240, //交易池总量限制
        "queue_per_account_txs_limit":64 //单个账号的交易缓冲最大值
    }
}
```

> **注意**：validation_address 和 validation_private_key 可以通过 bumo 程序命令行工具获得，请妥善保存该账号信息，一旦丢失将无法找回。



### 生成命令

1.　生成一个新的公私钥对，可执行的命如下（其中，address 和 private_key_aes 分别对应 validation_address和validation_private_key）：

```shell
[root@bumo ~]# cd /usr/local/buchain/bin
[root@bumo bin]#./bumo --create-account

{
    "address" : "buQmtDED9nFcCfRkwAF4TVhg6SL1FupDNhZY", //地址
    "private_key" : "privbsZozNs3q9aixZWEUzL9ft8AYph5DixN1sQccYvLs2zPsPhPK1Pt", //私钥
    "private_key_aes" : "e174929ecec818c0861aeb168ebb800f6317dae1d439ec85ac0ce4ccdb88487487c3b74a316ee777a3a7a77e5b12efd724cd789b3b57b063b5db0215fc8f3e89", //AES 加密的私钥
    "public_key" : "b00108d329d5ff69a70177a60bf1b68972576b35a22d99d0b9a61541ab568521db5ee817fea6", //公钥
    "public_key_raw" : "08d329d5ff69a70177a60bf1b68972576b35a22d99d0b9a61541ab568521db5e", //原始公钥
    "sign_type" : "ed25519" //ed25519 加密方式
}
```



2. 若已有一个公私钥对，可通过以下命令对私钥加密（假如地址是*buQmtDED9nFcCfRkwAF4TVhg6SL1FupDNhZY*，私钥是*privbsZozNs3q9aixZWEUzL9ft8AYph5DixN1sQccYvLs2zPsPhPK1Pt*）：

```shell
[root@bumo ~]# cd /usr/local/buchain/bin
[root@bumo bin]#./bumo --aes-crypto privbsZozNs3q9aixZWEUzL9ft8AYph5DixN1sQccYvLs2zPsPhPK1Pt

e174929ecec818c0861aeb168ebb800f6317dae1d439ec85ac0ce4ccdb88487487c3b74a316ee777a3a7a77e5b12efd724cd789b3b57b063b5db0215fc8f3e89

```

### 记账节点地址

在申请成为记账节点时需要输入记账节点地址（即 validation_address）。如下图：

![account_node_apply](/Users/fengruiming/Desktop/account_node_apply.png)



## 同步系统时间

要保证节点能够正常运行，需要保证该节点与公网的其他节点的时间戮一致，因此，需要定时同步更新系统时间。

### 定时同步时间

输入以下命令，每10秒同步更新一次系统时间。

```shell
echo "*/10 * * * * /usr/sbin/ntpdate  ntpdate  time.windows.com"  >> /var/spool/cron/root
```

### 保证修改生效

为了保证修改生效，输入以下命令重启crond服务：

```shell 
systemctl restart crond
```



## 服务命令

这里主要介绍的命令，包括：[启动BUMO服务](#启动bumo服务)、[关闭BUMO服务](#关闭bumo服务)、[查询BUMO服务状态](#查询bumo服务状态)、[清空数据库](#清空数据库)。



### 启动BUMO服务

输入以下命令启动bumo服务。

```shell
service bumo start
```



### 关闭BUMO服务

输入以下命令关闭bumo服务。

```shell 
service bumo stop
```



### 查询BUMO服务状态

输入以下命令查询bumo服务。

```shell 
service bumo status
```



### 清空数据库

在清空数据之前需要停止BUMO服务。清空数据库需要完成以下步骤：

1. 停止BUMO服务

   ```shell 
   service bumo stop
   ```

2. 输入以下命令进入bumo的服务目录。

1. ```shell 
   cd /usr/local/buchain/bin
   ```

3. 输入以下命令清空数据库。

   ```shell 
   ./bumo --dropdb
   ```

4. 清除成功，显示如下信息。

   ```json
   [root@bumo bin]# ./bumo --dropdb
   [2019-05-23 15:13:51.507 - INF] <7FFFA81B4380> main.cpp(137):Initialized daemon successfully
   [2019-05-23 15:13:51.508 - INF] <7FFFA81B4380> main.cpp(138):Loaded configure successfully
   [2019-05-23 15:13:51.508 - INF] <7FFFA81B4380> main.cpp(139):Initialized logger successfully
   [2019-05-23 15:13:51.508 - INF] <7FFFA81B4380> main.cpp(146):The path of the database is as follows: keyvalue(/Users/fengruiming/single/buchain/data/keyvalue.db),account(/Users/fengruiming/single/buchain/data/account.db),ledger(/Users/fengruiming/single/buchain/data/ledger.db)
   [2019-05-23 15:13:51.524 - INF] <7FFFA81B4380> storage.cpp(296):Drop db successful
   [2019-05-23 15:13:51.524 - INF] <7FFFA81B4380> main.cpp(153):Initialized database successfully
   [2019-05-23 15:13:51.524 - INF] <7FFFA81B4380> main.cpp(156):Droped database successfully
   ```

   

## 疑难解答

### 部署完成后，节点是否正常运行

部署完成后，查看区块高度是否正常增加。一般区块高度只要是大于1，就表示节点运行正常。

- 命令

  调用如下命令（例如，IP是127.0.0.1，端口是36002）：

  ```shell
  [root@bumo ~]# curl 127.0.0.1:16002/getLedger
  ```

  > **注意：**这里的IP和端口需要换成你配置的监控的IP和端口。

- 结果

  显示结果如下：

  ```json 
  {
    "error_code" : 0,
    "result" : {
      "header" : {
        "account_tree_hash" : "bf337b72bb5ab150f25a4e665259049cd94fa70966a1c0f56f79a44969980ccb",
        "close_time" : 1558595960522453,
        "consensus_value_hash" : "04c172793d72b14ce2da8c5a9f9b7366edf75bc3c81aaf9f3069e6af3af1c857",
        "fees_hash" : "916daa78d264b3e2d9cff8aac84c943a834f49a62b7354d4fa228dab65515313",
        "hash" : "7349292089a68b134c03aefceed8a3ce0bf69960a21a6ca41467a672d3e2c3ce",
        "previous_hash" : "5d86cc2bb4a97831c4f8bbb1bbb8a09289337c42c33fa64bc7c1aa352b17b2ba",
        "seq" : 3,
        "validators_hash" : "9ff25c4231deb81c44eec379fd2467156d2389c5d69edf308d38f7b5ac53705b",
        "version" : 1002
      }
    }
  }
  ```

  > **注意：**这里的seq就是区块高度，这里是3，表示节点运行正常。



### 节点正常运行，但是交易提交总是失败

查看节点是否同步完成。未同步完成的节点，发送的交易不能正常执行。

- 命令

  查看当前的节点状态，命令如下：

  ```shell
  [root@bumo ~]# curl 127.0.0.1:16002/getModulesStatus
  ```

  

- 结果

  显示部分结果如下：

  ```shell
  ...
  "ledger_manager" : {
        "account_count" : 117,
        "chain_max_ledger_seq" : 3185646,
        "hash_type" : "sha256",
        "ledger_context" : {
           "completed_size" : 0,
           "running_size" : 0
        },
        "ledger_sequence" : 65017,
  },
  ...
  ```

  > **注意：**chain_max_ledger_seq表示当前区块链的最新区块高度，ledger_sequence表示当前节点的区块高度，由于ledger_sequence比chain_max_ledger_seq小，因此，表示当前区块还没有同步完成，通过该节点发送的交易，无法正常执行。