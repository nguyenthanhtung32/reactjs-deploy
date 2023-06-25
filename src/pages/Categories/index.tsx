import React, { useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, message, Space, Modal, Input, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import axios from "../../libraries/axiosClient";
import Styles from "./index.module.css";

const apiName = "/categories";

const initialState = {
  categoryName: "",
};

function Categories() {
  const [categories, setCategories] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [filter, setFilter] = React.useState<any>(initialState);

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [totalResults, setTotalResults] = React.useState<number | undefined>();

  const [deleteCategoryId, setDeleteCategoryId] = React.useState<number>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    React.useState<boolean>(false);

  const [updateForm] = Form.useForm();
  const navigate = useNavigate();

  const create = () => {
    navigate("/category");
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
        setCategories(data.payload);
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
  const showConfirmDelete = (CategoryId: number) => {
    setDeleteCategoryId(CategoryId);
    setShowDeleteConfirm(true);
  };
  // Hàm xóa danh mục
  const handleDeleteCategory = () => {
    axios.delete(apiName + "/" + deleteCategoryId).then((response) => {
      setRefresh((f) => f + 1);
      message.success("Xóa danh mục thành công!", 1.5);
      setShowDeleteConfirm(false);
    });
  };

  // Modal xác nhận xóa danh mục
  const deleteConfirmModal = (
    <Modal
      title="Xóa danh mục"
      open={showDeleteConfirm}
      onOk={handleDeleteCategory}
      onCancel={() => setShowDeleteConfirm(false)}
      okText="Xóa"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn xóa danh mục?</p>
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
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
      filterDropdown: (
        <>
          <Input
            placeholder="Tìm kiếm danh mục"
            name="categoryName"
            value={filter.categoryName}
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
      title: "Mô tả / Ghi chú",
      dataIndex: "description",
      key: "description",
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

  // Call api to get data
  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setCategories(data.payload);
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
      <Table
        rowKey="_id"
        dataSource={categories}
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
        title="Cập nhật danh mục"
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
        </Form>
      </Modal>
    </div>
  );
}

export default memo(Categories);
