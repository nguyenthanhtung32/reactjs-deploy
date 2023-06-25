import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";

import axios from "../../libraries/axiosClient";

const apiName = "/categories";

function Categories() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<number>(0);

  const [createForm] = Form.useForm();
  const navigate = useNavigate();

  // Call api to get data
  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setCategories(data.payload);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh, categories]);

  const onFinish = (values: any) => {
    axios
      .post(apiName, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        createForm.resetFields();
        message.success("Thêm mới danh mục thành công!", 1.5);
        navigate("/categories");
      })
      .catch((err) => {});
  };

  return (
    <div style={{ padding: 24 }}>
      <div>
        <Form
          form={createForm}
          name="create-form"
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Tên danh mục bắt buộc phải nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả / Ghi chú" name="description">
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default memo(Categories);
