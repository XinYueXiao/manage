import React from "react";
import { Button, Table } from "antd";
import EditContent from "./EditContent";
export default function TableList(props) {
  const {
    list = [],
    total,
    getListByPage,
    pageConfig,
    setModalProps,
    roleArr
  } = props;
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
                content: (commonProps) => (
                  <EditContent record={record} {...commonProps} />
                )
              })
            }
          >
            修改
          </Button>
        );
      }
    }
  ];

  function changPage(page, pageSize) {
    getListByPage({ current: page, pageSize });
  }
  return (
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
  );
}
