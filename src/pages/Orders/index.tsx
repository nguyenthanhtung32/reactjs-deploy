import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import {
  Button,
  Form,
  message,
  Space,
  Modal,
  Table,
  Select,
  Input,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import axios from "../../libraries/axiosClient";

const apiName = "/orders";

function Orders() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [employees, setEmployees] = React.useState([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [deleteOrderId, setOrderId] = React.useState<number>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    React.useState<boolean>(false);

  const [updateForm] = Form.useForm();
  const navigate = useNavigate();

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const onClickFilter = (_id: string | undefined) => {
    console.log("_id", _id);
    navigate("/orderDetails", {
      state: {
        productDetail: _id,
      },
    });
  };

  // Hàm hiển thị xác nhận xóa
  const showConfirmDelete = (orderId: number) => {
    setOrderId(orderId);
    setShowDeleteConfirm(true);
  };

  // Hàm xóa sản phẩm
  const handleDeleteOrders = () => {
    axios.delete(apiName + "/" + deleteOrderId).then((response) => {
      setRefresh((f) => f + 1);
      message.success("Xóa sản phẩm thành công!", 1.5);
      setShowDeleteConfirm(false);
    });
  };

  // Modal xác nhận xóa sản phẩm
  const deleteConfirmModal = (
    <Modal
      title="Xóa sản phẩm"
      open={showDeleteConfirm}
      onOk={handleDeleteOrders}
      onCancel={() => setShowDeleteConfirm(false)}
      okText="Xóa"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn xóa sản phẩm?</p>
    </Modal>
  );

  const columns: ColumnsType<any> = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customer.name",
      key: "customer.name",
      render: (text, record, index) => {
        const fullNameCustomer = `${record.customer.firstName} ${record.customer.lastName}`;
        return <span>{fullNameCustomer}</span>;
      },
    },
    {
      title: "Tên nhân viên",
      dataIndex: "employee.name",
      key: "employee.name",
      render: (text, record, index) => {
        const fullNameEmployee = `${record?.employee?.firstName} ${record?.employee?.lastName}`;
        return <span>{fullNameEmployee}</span>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record, index) => {
        return <strong style={{ color: "red" }}>{text}</strong>;
      },
    },
    {
      title: "Mô tả / Ghi chú",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Ngày giao hàng",
      dataIndex: "shippedDate",
      key: "shippedDate",
      render: (text, record, index) => {
        return <span key={text._id}>{formatDate(text)}</span>;
      },
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Hành động",
      width: "1%",
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setOpen(true);
                setUpdateId(record._id);
                updateForm.setFieldsValue(record);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                showConfirmDelete(record._id);
              }}
            />
          </Space>
        );
      },
    },
    {
      title: "Xem chi tiết",
      width: "1%",
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              onClick={() => {
                onClickFilter(record._id);
              }}
            >
              View
            </Button>
          </Space>
        );
      },
    },
  ];

  // Call api to get data
  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setOrders(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  React.useEffect(() => {
    axios
      .get("/employees")
      .then((response) => {
        const { data } = response;
        setEmployees(data.payload);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  const onUpdateFinish = (values: any) => {
    axios
      .patch(apiName + "/" + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        updateForm.resetFields();
        message.success("Cập nhật đơn hàng thành công!", 1.5);
        setOpen(false);
      })
      .catch((err) => {});
  };

  return (
    <div style={{ padding: 24 }}>
      <div>
        <Table rowKey="_id" dataSource={orders} columns={columns} />
        {deleteConfirmModal}
      </div>

      <Modal
        open={open}
        title="Cập nhật đơn hàng"
        onCancel={() => {
          setOpen(false);
        }}
        cancelText="Đóng"
        okText="Lưu thông tin"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name="update-form"
          onFinish={onUpdateFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item label="Status" name="status">
            <Select style={{ width: "80%" }}>
              <Select.Option value="WAITING">WAITING</Select.Option>
              <Select.Option value="COMPLETED">COMPLETED</Select.Option>
              <Select.Option value="CANCELED">CANCELED</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Nhân viên"
            name="employeeId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Nhân viên bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={employees.map((c: any) => {
                return { value: c._id, label: c.firstName + " " + c.lastName };
              })}
            />
          </Form.Item>
          <Form.Item label="Ngày giao" name="shippedDate">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default memo(Orders);
