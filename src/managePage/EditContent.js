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
        }}
      >
        修改
      </Button>
    </div>
  );
}
