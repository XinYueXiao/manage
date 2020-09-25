import React, { useState } from "react";
import ListTable from "./ListTable";
import SearchForm from "./SearchForm";
import { Radio, Modal } from "antd";
const dataSource = [
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  },
  {
    key: "3",
    name: "李志龙",
    age: 44,
    address: "大时代"
  }
];
const defultPage = { current: 1, pageSize: 1 };
export default function Page() {
  const [searchParam, setSearchParam] = useState({ page: defultPage });
  const [list, setList] = useState(dataSource);
  const [total, setTotal] = useState(dataSource.length);
  const [modalProps, setModalProps] = useState(dataSource.length);
  const [roleArr, setRoleArr] = useState([]);
  function getListBySearch(search) {
    const searchParamNow = { search: search, page: defultPage };
    setSearchParam(searchParamNow); //搜索时重置分页为默认
    searchList(searchParamNow);
  }
  function searchList(param) {
    //模拟查询接口
    const { search, page } = param;
    let nowList = dataSource.filter((one) =>
      search.nameKey ? one.name.includes(search.nameKey) : true
    );
    setTotal(nowList.length);
    const startIndex = (page.current - 1) * page.pageSize;
    setList(nowList.slice(startIndex, startIndex + page.pageSize));
  }
  function getListByPage(page) {
    const searchParamNow = { search: searchParam.search, page: page };
    setSearchParam(searchParamNow); //设置分页参数
    searchList(searchParamNow); //查询
  }
  function editItem(item) {
    const nowList = list.map((one) => {
      if (one.key === item.key) {
        return item;
      } else {
        return one;
      }
    });
    setList(nowList);
  }
  const commonProps = {
    editItem: editItem,
    setModalProps: setModalProps
  };
  const roleObj = {
    0: [],
    1: ["address", "operation"],
    2: ["name", "age"]
  };
  return (
    <div>
      <SearchForm getListBySearch={getListBySearch} />

      <ListTable
        list={list}
        total={total}
        pageConfig={searchParam.page}
        getListByPage={getListByPage}
        setModalProps={setModalProps}
        roleArr={roleArr}
      />
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
      <Modal
        footer={null}
        {...modalProps}
        maskClosable={false}
        onCancel={() => setModalProps({ visible: false })}
      >
        {modalProps.content && modalProps.content(commonProps)}
      </Modal>
    </div>
  );
}
