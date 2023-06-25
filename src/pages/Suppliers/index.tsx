import React, { useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Table, message, Space, Modal } from "antd";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import axios from "../../libraries/axiosClient";
import Styles from "./index.module.css";

const apiName = "/suppliers";

const initialState = {
  supplierName: "",
};

function Suppliers() {
  const [suppliers, setSuppliers] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [filter, setFilter] = React.useState<any>(initialState);

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [totalResults, setTotalResults] = React.useState<number | undefined>();

  const [deleteSupplierId, setDeleteSupplierId] = React.useState<number>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    React.useState<boolean>(false);

  const [updateForm] = Form.useForm();
  const navigate = useNavigate();

  const create = () => {
    navigate("/supplier");
  };

  const onChangeFilter = useCallback((e: any) => {
    setFilter((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const callApi = useCallback((searchParams: any) => {
    axios
      .get(`${apiName}?${searchParams}`)
      .then((response) => {
        const { data } = response;
        setSuppliers(data.payload);
        setTotalResults(data.total);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  React.useEffect(() => {
    let filters: {
      skip: any;
      limit: any;
    } = {
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
    };
    callApi(filters);
  }, [callApi, currentPage, pageSize]);

  const onSearch = useCallback(() => {
    // Lọc các trường có giá trị để tạo query params
    const filterFields = Object.keys(filter).filter(
      (key) => filter[key] !== undefined && filter[key] !== ""
    );

    // Tạo query params từ các trường đã lọc
    const searchParams = new URLSearchParams(
      filterFields.map((key) => {
        return [key, filter[key]];
      })
    );

    // Gọi API với các query params đã tạo
    callApi(searchParams);
  }, [callApi, filter]);

  // Hàm hiển thị xác nhận xóa
  const showConfirmDelete = (supplierId: number) => {
    setDeleteSupplierId(supplierId);
    setShowDeleteConfirm(true);
  };
  // Hàm xóa nhà cung cấp
  const handleDeleteSupplier = () => {
    axios.delete(apiName + "/" + deleteSupplierId).then((response) => {
      setRefresh((f) => f + 1);
      message.success("Xóa nhà cung cấp thành công!", 1.5);
      setShowDeleteConfirm(false);
    });
  };

  // Modal xác nhận xóa nhà cung cấp
  const deleteConfirmModal = (
    <Modal
      title="Xóa nhà cung cấp"
      open={showDeleteConfirm}
      onOk={handleDeleteSupplier}
      onCancel={() => setShowDeleteConfirm(false)}
      okText="Xóa"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn xóa nhà cung cấp?</p>
    </Modal>
  );

  const resetFilter = useCallback(() => {
    setFilter(initialState);
    callApi(initialState);
  }, [callApi]);

  const columns: ColumnsType<any> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "name",
      key: "name",
      filterDropdown: (
        <>
          <Input
            placeholder="Tìm kiếm nhà cung cấp"
            name="supplierName"
            value={filter.supplierName}
            onChange={onChangeFilter}
            className={Styles.input}
            allowClear
          />
          <Button
            className={Styles.but}
            type="primary"
            onClick={onSearch}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            className={Styles.ton}
            size="small"
            style={{ width: 90 }}
            onClick={resetFilter}
          >
            Refresh
          </Button>
        </>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
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
      title: (
        <Button
          icon={<AppstoreAddOutlined />}
          style={{
            marginBottom: "10px",
            float: "right",
            border: "1px solid #4096ff",
            color: "#4096ff",
          }}
          onClick={create}
        ></Button>
      ),
    },
  ];
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
  }, [refresh]);

  const onUpdateFinish = (values: any) => {
    axios
      .patch(apiName + "/" + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        updateForm.resetFields();
        message.success("Cập nhật danh mục thành công!", 1.5);
        setOpen(false);
      })
      .catch((err) => {});
  };
  return (
    <div style={{ padding: 24 }}>
      {/* TABLE */}
      <Table
        rowKey="_id"
        dataSource={suppliers}
        columns={columns}
        pagination={{
          total: totalResults,
          current: currentPage,
          pageSize: pageSize,
          onChange: (page) => setCurrentPage(page),
          onShowSizeChange: (_, size) => setPageSize(size),
        }}
      />
      {deleteConfirmModal}

      {/* EDIT FORM */}
      <Modal
        open={open}
        title="Cập Nhật Nhà Cung Cấp"
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
          name="Update-form"
          onFinish={onUpdateFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="Name"
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
            label="PhoneNumber"
            name="phoneNumber"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default memo(Suppliers);
