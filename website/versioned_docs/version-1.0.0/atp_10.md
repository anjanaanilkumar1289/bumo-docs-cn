---
id: version-1.0.0-atp_10
title: BUMO ATP 10 协议
sidebar_label: ATP 10
original_id: atp_10
---

## 简介

ATP 10(Account based Tokenization Protocol) 指基于 BuChain的账号结构对资产进行发行、转移和增发Token的标准协议，Token在此文代表账号资产。   

## 目标

标准协议可以让其它应用程序方便地调用接口在 BUMO 上进行Token的发行、转移和增发操作。

## Token 属性
发行的Token需要通过设置Token源账户的metadata来记录Token的相关属性。用于应用程序方便去管理和查询Token数据信息。  

| 变量        | 描述                    |
| :----------- | --------------------------- |
|name          | Token 名称                 |
|code          | Token 代码                  |
|description   | Token 描述                  |
|decimals      | Token 小数位数              |
|totalSupply   | Token 总量(**其值等于10 ^ decimals * 发行量**) |
|icon          | Token 图标(optional)                  |
|version       | ATP 版本            |

**注意**：

- name：推荐使用单词全拼，每个首字母大写。如 Demo Token

- code: 推荐使用大写首字母缩写。如 DT
- decimals: 小数位在0~8的范围，0表示无小数位
- totalSupply: 范围是0 ~ (2 ^ 63 - 1)。0表示不固定Token的上限。假如,发行一笔数量是10000, 精度为8的ATP 10 Token，此时totalSupply = 10 ^ 8 * 10000, 结果是1000000000000。
- icon: base64位编码，图标文件大小是32k以内,推荐200*200像素。



## 操作过程

BUMO ATP 10协议中的操作包括 [登记Token](#登记token)、[发行Token](#登记token)、[转移Token](#转移token)、[增发Token](#增发token)、[查询Token](#查询token)、[查询指定Metadata](#查询指定metadata)。



### 登记Token
登记 token 即设置 token 的 metadata 参数。发送`Setting Metadata`的交易，设置Token metadata参数key、value和version。下面是登记 token 的示例:
- json格式

    ```JSON
    {
      "type": 4,
      "set_metadata": {
        "key": "asset_property_DT",
        "value": "{\"name\":\"Demon Token\",\"code\":\"DT\",\"totalSupply\":\"10000000000000\",\"decimals\":8,
        \"description\":\"This is hello Token\",\"icon\":\"iVBORw0KGgoAAAANSUhEUgAAAAE....\",\"version\":\"1.0\"}",
        "version": 0
      }
    }
    ```
**注意**：
- key值必须是**asset_property_**前缀和Token code的组合(参考[发行Token](#发行token)的 `code` 参数)。  
设置成功后通过[查询指定Metadata](#查询指定metadata)可以看到metadata设置的数据。

### 发行Token  
发行 token 即账户发行一笔数字 token，执行成功后账户的 token 余额中会出现这一笔 token。客户端通过发起一笔操作类型是`Issuing Assets`的交易。设置参数amount(发行的数量)、code(Token代码)。  

例如：发行一笔数量是10000,精度为8的DT Token, 此时参数amount是10 ^ 8 * 10000。

- json格式

    ```json
    {
      "type": 2,
      "issue_asset": {
        "amount": 1000000000000,
        "code": "DT"
      }
    }
    ```

### 转移Token  
转移 token 即账户将一笔 token 转给目标账户。转移 token 通过发送 `Transferring Assets` 的交易设置相关参数。以下是相应参数：

| 参数                       | 描述                                               |
| -------------------------- | -------------------------------------------------- |
| pay_asset.dest_address     | 目标账户地址                                       |
| pay_asset.asset.key.issuer | Token发行方地址                                    |
| pay_asset.asset.key.code   | Token代码                                          |
| pay_asset.asset.amount     | 10 ^ 精度 * 要转移的数量                           |
| pay_asset.input            | 触发合约调用的入参，如果用户未输入，默认为空字符串 |



例如：给已激活的目标账户 buQaHVCwXj9ERtFznDnAuaQgXrwj2J7iViVK 转移数量为 500000000000 的 DT 的例子。

- json格式：

```JSON
    {
      "type": 3,
      "pay_asset": {
        "dest_address": "buQaHVCwXj9ERtFznDnAuaQgXrwj2J7iViVK",
        "asset": {
          "key": {
            "issuer": "buQhzVyca8tQhnqKoW5XY1hix2mCt5KTYzcD",
            "code": "DT"
          },
          "amount": 500000000000
        }
      }
    }
```
  转移成功后通过[查询Token](#查询token)可以看到目标账户拥有amount数量的DT。  

  注意：给未激活的目标账户转移Token，交易的执行结果是失败的
### 增发Token  
增发 token 即账户继续在原 token 代码上发行一定数量的 token。通过设置和之前`发行Token`相同的交易类型代码，继续发送[发行Token](#发行token)的交易，进行Token增发。应用程序根据具体业务去控制增发Token数量是否超过totalSupply，增发成功后可以看到Token数量会有所增加。  


### 查询Token

查询 token 即查询源账户的 token 信息，以下是查询 token 需要指定的 token 信息:

| 参数         | 描述                                                                                                                                                    |
| :----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| address      | 账号地址， 必填  |
| code & issuer | issuer表示Token发行账户地址，code表示Token代码。只有同时填写正确code&issuer才能正确显示指定Token否则默认显示所有Token。选填 |
| type      | 目前type只能是0，可以不用填写  |

以下是查询 token 的代码示例：

```http
HTTP GET /getAccountAssets?address=buQhzVyca8tQhnqKoW5XY1hix2mCt5KTYzcD
```

- 返回内容

```json
{
    "error_code": 0,
    "result": [
        {
            "amount": 469999999997,
            "key": {
                "code": "DT",
                "issuer": "buQhzVyca8tQhnqKoW5XY1hix2mCt5KTYzcD"
            }
        },
        {
            "amount": 1000000000000,
            "key": {
                "code": "ABC",
                "issuer": "buQhzVyca8tQhnqKoW5XY1hix2mCt5KTYzcD"
            }
        }
    ]
}
```

- 如果该账号不存在Token,则返回内容

```json
{
   "error_code" : 0,
   "result" : null
}
```
### 查询指定metadata

查询指定 metadata 即查询 metadata 的相关信息，包括 key、value、version。查询 metadata 需指定的 metadata 信息:

| 参数         | 描述                                                                                                                                                    |
| :----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| address      | 账号地址， 必填  |
| key      | 指定metadata中的key值   |

以下是查询指定 metadata 的代码示例：

```http
HTTP GET /getAccountMetaData?address=buQhzVyca8tQhnqKoW5XY1hix2mCt5KTYzcD&key=asset_property_DT
```

- 如果该账号指定的 key 存在 metadata，则返回内容:

```json
{
    "error_code": 0,
    "result": {
        "asset_property_DT": {
            "key": "asset_property_DT",
            "value": "{\"name\":\"DemonToken\",\"code\":\"DT\",\"totalSupply\":\"1000000000000\",\"decimals\":8,\"description\":\"This is hello Token\",\"icon\":\"iVBORw0KGgoAAAANSUhEUgAAAAE\",\"version\":\"1.0\"}",
            "version": 4
        }
    }
}

```

- 如果该账号指定的key不存在metadata,则返回内容:

```json
{
   "error_code" : 0,
   "result" : null
}
```




