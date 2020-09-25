# 背景
最近的你有没有接手的新项目，对这个有什么感觉？我最近接手了一个项目，先不论是否代码行数的多少，仅是思路就很混乱，像是一件衣服在打补丁，而衣服上还有混乱的线网，数据绕来绕去，和断掉的线头，举例说明下
## 关于补丁
- 没有对数据进行扩展处理，一个值一个变量。例如：获取数据详情返回的多个对象，便依次存储多个对象，这样在参数变更时，便要不停地补充参数，如果你使用的是react，就会发现大量的state还没有注释它是用来干什么的，不管对于维护者，还是初入者都是不友好的，其实我们可以存储在一个变量里，在使用时直接调用对象的参数
- 列表的列表项[1，2，3，4，5]的展示，可能会根据权限展示不同的列表，刚开始是1，2，3，根据==1，==2，==3，后来变成1，2，3，4，就。。。。
- 其实我们根据业务场景是否可以传入一个数组arr=[1,2,3,4],根据includes判断是否在数组内（此处会在列表展示区做详细解释）

## 关于线网
- 把父级组件的静态数据number=3，和回调方法传给子类，回调方法里使用的却是，子类传回来的父类的静态数据number

##  关于断掉的线头

- 例如使用antd的Tabs:如果只是单纯的点击切换模块，没有进行模块的特殊处理，则不需要onChange的方法，和状态存储 ，确定我们想要的，避免无效代码

关于以上的问题，我基于以往的项目，整理了一下管理系统的组件结构思路，希望可以在你的项目开发中提供一些帮助

#概述

## 公共结构
关于一个管理系统，使用最多的便是增删改查，主要的逻辑是对数据的操作，基于以往的项目可以提取以下部分的公共结构

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/580e0668323844dfb429e1268fd4f990~tplv-k3u1fbpfcp-zoom-1.image)

## 数据流向
- 搜索排序分页通过操作的参数获取，列表的展示数据
- 列表操作区会根据删除或者修改后，重新获取列表数据

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bb5abe9e1ba46d4b20b60dfc541babc~tplv-k3u1fbpfcp-zoom-1.image)

# 零 · 项目准备
- 此次针对	搜索	列表	分页	区域
- 使用react作范例，版本号如下

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b38f1b2e126145978ba3acb559948cec~tplv-k3u1fbpfcp-zoom-1.image)


# 壹 · 存储搜索参数数据+列表展示区

## 搜索和分页数据需要统一存储

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61fc5b16ba9c4f57b3e82c81d4961a80~tplv-k3u1fbpfcp-zoom-1.image)

## 顶端组件代码和效果展示

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bbc06875009452b81ac4969a4960779~tplv-k3u1fbpfcp-zoom-1.image)

## 搜索组件SearchForm.js
```javascript
import React from "react";
import { Form, Input, Button } from "antd";

const SearchDemo = (props) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
    props.getListBySearch(values);
  };
  return (
    <Form
      layout="inline"
      form={form}
      name="control-hooks"
      style={{ width: 400 }}
      onFinish={onFinish}
    >
      <Form.Item name="nameKey" label="姓名">
        <Input placeholder="请输入姓名关键字" />
      </Form.Item>
      <div>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};
export default SearchDemo;

```
## 列表及分页组件
```javascript
import React from "react";
import { Button, Table } from "antd";
import EditContent from "./EditContent";
export default function TableList(props) {
  const { list = [], total, getListByPage, pageConfig } = props;
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age"
    },
    {
      title: "住址",
      dataIndex: "address",
      key: "address"
    },
  ];

  function changPage(page, pageSize) {
    getListByPage({ current: page, pageSize });
  }
  return (
    <Table
      style={{ marginTop: 20 }}
      size="small"
      dataSource={list}
      columns={columns}
      pagination={{
        ...pageConfig,
        total: total,
        onChange: changPage
      }}
    />
  );
}

```
# 贰·列表操作区+列表展示区
> 列表操作可能同时存在多个弹窗，需对弹窗组件做统一参数处理，利用数据柯里化把父级参数运输到子组件内

## 数据统一管理
业务逻辑层指index.js组件：负责整个页面的结构和逻辑处理

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bbbbe957aa146b9a46bf7166a2ab095~tplv-k3u1fbpfcp-zoom-1.image)

## 效果展示

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0256f62b41214bd2ae6b629649f4c796~tplv-k3u1fbpfcp-zoom-1.image)

## 数据存储统一管理

- 弹窗数据统一管理

```javascript
 const [modalProps, setModalProps] = useState(dataSource.length);
```
- 使用柯里化父级传递参数统一管理
```javascript
<Modal
				footer={null}
				{...modalProps}
				maskClosable={false}
				onCancel={() => setModalProps({ visible: false })} >
				{modalProps.content && modalProps.content(commonProps)} {/* 使用柯里化对数据传递进行处理*/}
</Modal>
```
## 列表组件新增操作项
```javascript
 {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (text, record) => {
        return (
          <Button
            onClick={() =>
              setModalProps({
                visible: true,
                content: (commonProps) => (/*跨级传递父级参数*/
                  <EditContent record={record} {...commonProps} />
                )
              })
            } >
            修改
          </Button>
        );
      }
    }
```
## 修改组件
```javascript
import React from "react";
import { Button } from "antd";
export default function EditContent(props) {
  const { record, editItem, setModalProps } = props;
  const item = { name: "修改后的名字" };
  return (
    <div>
      {item.name}
      <Button
        onClick={() => {
          editItem({ ...record, ...item });
          setModalProps({ visible: false });
        }}  >
        修改
      </Button>
    </div>
  );
}
```
# 叁 · 列表权限控制
根据不同的权限配置，展示不同的列表项
## 效果展示
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1198c484214b433da044236a4b95f671~tplv-k3u1fbpfcp-zoom-1.image)
## 权限配置
使用对象roleObj的权限配置方案，比if(){}else{}更简介直观
```javascript
const [roleArr, setRoleArr] = useState([]);
 const roleObj = {
    0: [],
    1: ["address", "operation"],
    2: ["name", "age"]
  };
。。。
  <div>
        <Radio.Group
          onChange={(e) => setRoleArr(roleObj[e.target.value])}
          defaultValue={0}
        >
          <Radio value={0}>展示全部</Radio>
          <Radio value={1}>不展示操作和地址</Radio>
          <Radio value={2}>不展示姓名和年龄</Radio>
        </Radio.Group>
</div>
```
## 列表控制
根据传过来的数组，进行列表项的过滤
```javascript
<Table
      style={{ marginTop: 20 }}
      size="small"
      dataSource={list}
      columns={columns.filter((item) => !roleArr.includes(item.key))}
      pagination={{
        ...pageConfig,
        total: total,
        onChange: changPage
      }}
    />
```
# 肆 · 总结
针对前期的痛点，我们一一进行总结
## 关于补丁
- 在处理查询参数时，我们对查询数据进行了搜索和分页的分类存储，但是都保存在一个变量里，如果后期加排序或者其他参数，不会影响之前的逻辑，可以在原有基础上进行扩展，有效减少补丁的数量
- 对弹窗参数数据的统一存储，可以拓展弹窗的title或者其他属性，不需要在添加state来打补丁，直接增加`modalProps`属性即可
## 关于线网
- 把数据的加工都统一放在了业务逻辑层指index.js进行数据处理，提供给其他组件相应的处理函数
- 对弹窗组件进行柯里化处理，不仅可以避免给列表传递非必要的参数，减少组件的刷新，还可以方便的跨级传递父级参数
##关于断线
- 在进行权限的处理时，我们并不需要存储单选框的值，直接对数据进行处理即可（有的猿可能会存个state，通过state去更新选中的value）

> 写代码之前一定要让自己的思路清晰，进行思维碰撞后的你开发起来会更小的得心应手
## 期许
期许每个项目组猿们写代码都有一个统一清晰规范的思路，那无论你的换项目，还是交接给其他人都是可以无缝衔接
