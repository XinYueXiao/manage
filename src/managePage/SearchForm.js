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
