import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";

import axios from "../../libraries/axiosClient";

const apiName = "/suppliers";

function Suppliers() {
  const [suppliers, setSuppliers] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<number>(0);

  const navigate = useNavigate();
  const [createForm] = Form.useForm();

  React.useEffect(() => {
    // Call api
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setSuppliers(data.payload);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh, suppliers]);

  const onFinish = (values: any) => {
    axios
      .post(apiName, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        createForm.resetFields();
        message.success("Thêm mới nhà cung cấp thành công!", 1.5);
        navigate("/suppliers");
      })
      .catch((err) => {});
  };

  return (
    <div style={{ padding: 24 }}>
      <div>
        {/* CREATE FORM */}
        <Form
          form={createForm}
          name="Create-form"
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="Tên"
            name="name"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số Điện Thoại"
            name="phoneNumber"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa Chỉ"
            name="address"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default memo(Suppliers);
