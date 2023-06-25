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

const apiName = "/employees/";

const initialState = {
  firstNameEmployee: "",
  lastNameEmployee: "",
};

function Employees() {
  const [employees, setEmployees] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [filter, setFilter] = React.useState<any>(initialState);

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [totalResults, setTotalResults] = React.useState<number | undefined>();

  const [deleteEmployeeId, setDeleteEmployeeId] = React.useState<number>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    React.useState<boolean>(false);

  const [updateForm] = Form.useForm();
  const navigate = useNavigate();

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const create = () => {
    navigate("/employee");
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
        setEmployees(data.payload);
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
  const showConfirmDelete = (employeeId: number) => {
    setDeleteEmployeeId(employeeId);
    setShowDeleteConfirm(true);
  };
  // Hàm xóa nhân viên
  const handleDeleteEmployee = () => {
    axios.delete(apiName + "/" + deleteEmployeeId).then((response) => {
      setRefresh((f) => f + 1);
      message.success("Xóa nhân viên thành công!", 1.5);
      setShowDeleteConfirm(false);
    });
  };

  // Modal xác nhận xóa nhân viên
  const deleteConfirmModal = (
    <Modal
      title="Xóa nhân viên"
      open={showDeleteConfirm}
      onOk={handleDeleteEmployee}
      onCancel={() => setShowDeleteConfirm(false)}
      okText="Xóa"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn xóa nhân viên?</p>
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
      title: "Họ",
      dataIndex: "firstName",
      key: "firstName",
      filterDropdown: (
        <>
          <Input
            placeholder="Tìm kiếm nhân viên"
            name="firstNameEmployee"
            value={filter.firstNameEmployee}
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
      title: "Tên",
      dataIndex: "lastName",
      key: "lastName",
      filterDropdown: (
        <>
          <Input
            placeholder="Tìm kiếm nhân viên"
            name="lastNameEmployee"
            value={filter.lastNameEmployee}
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ngày Sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (text, record, index) => {
        return <span key={text._id}>{formatDate(text)}</span>;
      },
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
        message.success("Cập nhật nhân viên thành công!", 1.5);
        setOpen(false);
      })
      .catch((err) => {});
  };
  return (
    <div style={{ padding: 24 }}>
      <Table
        rowKey="_id"
        dataSource={employees}
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

      <Modal
        open={open}
        title="Cập Nhật Khách Hàng"
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
            label="Họ"
            name="firstName"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên"
            name="lastName"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập tên" }]}
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
            label="Birthday"
            name="birthday"
            hasFeedback
            required={true}
            rules={[{ required: true, message: "Bạn chưa nhập ngày sinh" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default memo(Employees);
