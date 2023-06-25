import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, InputNumber, message, Select } from "antd";

import axios from "../../libraries/axiosClient";

const apiName = "/products";

function Products() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [suppliers, setSuppliers] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const navigate = useNavigate();

  const [createForm] = Form.useForm();

  // Get products
  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setProducts(data.payload);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh, products]);

  // Get categories
  React.useEffect(() => {
    axios
      .get("/categories")
      .then((response) => {
        const { data } = response;
        setCategories(data.payload);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Get suppliers
  React.useEffect(() => {
    axios
      .get("/suppliers")
      .then((response) => {
        const { data } = response;
        setSuppliers(data.payload);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onFinish = (values: any) => {
    console.log(values);

    axios
      .post(apiName, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        createForm.resetFields();
        message.success("Thêm mới sản phẩm thành công!", 1.5);
        navigate("/products");
      })
      .catch((err) => {});
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{}}>
        {/* CREAT FORM */}
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
            label="Danh mục sản phẩm"
            name="categoryId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Danh mục sản phẩm bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={categories.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Nhà cung cấp"
            name="supplierId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Nhà cung cấp bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={suppliers.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Tên sản phẩm bắt buộc phải nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description" hasFeedback>
            <Input />
          </Form.Item>
          <Form.Item label="Hình ảnh" name="img" hasFeedback>
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá bán"
            name="price"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Giá bán bắt buộc phải nhập",
              },
            ]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Giảm giá" name="discount" hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Tồn kho" name="stock" hasFeedback>
            <InputNumber style={{ width: 200 }} />
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

export default memo(Products);