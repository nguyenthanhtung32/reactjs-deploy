import React, { useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import numeral from "numeral";

import axios from "../../libraries/axiosClient";
import Styles from "./index.module.css";

const apiName = "/products";

const initialState = {
  category: "",
  supplier: "",
  productName: "",
  stockStart: "",
  stockEnd: "",
  priceStart: "",
  priceEnd: "",
  discountStart: "",
  discountEnd: "",
};
const allOption = [{ _id: "", name: "Tất cả" }];

function Products() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [suppliers, setSuppliers] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [filter, setFilter] = React.useState<any>(initialState);

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [totalResults, setTotalResults] = React.useState<number | undefined>();

  const [deleteProductId, setDeleteProductId] = React.useState<number>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    React.useState<boolean>(false);

  const [updateForm] = Form.useForm();
  const navigate = useNavigate();

  const create = () => {
    navigate("/product");
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
        setProducts(data.payload);
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
    const checkInputData = (input: any, name: any) => {
      if ((input && isNaN(input)) || (input && input < 0)) {
        message.error(`Dữ liệu nhập vào ô ${name} không hợp lệ!`);

        return true;
      }

      return false;
    };
    // Kiểm tra dữ liệu nhập vào từng ô tìm kiếm
    const isInvalidData =
      checkInputData(filter.stockStart, "Tồn kho") ||
      checkInputData(filter.stockEnd, "Tồn kho") ||
      checkInputData(filter.priceStart, "Giá bán") ||
      checkInputData(filter.priceEnd, "Giá bán") ||
      checkInputData(filter.discountStart, "Giảm giá") ||
      checkInputData(filter.discountEnd, "Giảm giá");

    if (isInvalidData) return;
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
  const showConfirmDelete = (productId: number) => {
    setDeleteProductId(productId);
    setShowDeleteConfirm(true);
  };
  // Hàm xóa sản phẩm
  const handleDeleteProduct = () => {
    axios.delete(apiName + "/" + deleteProductId).then((response) => {
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
      onOk={handleDeleteProduct}
      onCancel={() => setShowDeleteConfirm(false)}
      okText="Xóa"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn xóa sản phẩm?</p>
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
      dataIndex: "category.name",
      key: "category.name",
      render: (text, record, index) => {
        return <span>{record.category.name}</span>;
      },
      filterDropdown: (
        <>
          <select
            className={Styles.select}
            id="cars"
            name="category"
            value={filter.category}
            onChange={onChangeFilter}
          >
            {categories.map((item: { _id: string; name: string }) => {
              return (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              );
            })}
          </select>
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
      title: "Nhà cung cấp",
      dataIndex: "supplier.name",
      key: "supplier.name",
      render: (text, record, index) => {
        return <span>{record.supplier.name}</span>;
      },
      filterDropdown: (
        <>
          <select
            className={Styles.select}
            id="cars"
            name="supplier"
            value={filter.supplier}
            onChange={onChangeFilter}
          >
            {suppliers.map((item: { _id: string; name: string }) => {
              return (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              );
            })}
          </select>
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
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => {
        return <strong>{text}</strong>;
      },
      filterDropdown: (
        <>
          <Input
            placeholder="Tìm kiếm sản phẩm"
            name="productName"
            value={filter.productName}
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
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}đ</span>;
      },
      filterDropdown: (
        <>
          <Input
            placeholder="Thấp nhất"
            name="priceStart"
            value={filter.priceStart}
            onChange={onChangeFilter}
            className={Styles.input}
            allowClear
          />
          <Input
            placeholder="Cao nhất"
            name="priceEnd"
            value={filter.priceEnd}
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
      title: () => {
        return <div style={{ whiteSpace: "nowrap" }}>Giảm giá</div>;
      },
      dataIndex: "discount",
      key: "discount",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}%</span>;
      },
      filterDropdown: (
        <>
          <Input
            placeholder="Thấp nhất"
            name="discountStart"
            value={filter.discountStart}
            onChange={onChangeFilter}
            className={Styles.input}
            allowClear
          />
          <Input
            placeholder="Cao nhất"
            name="discountEnd"
            value={filter.discountEnd}
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
      title: () => {
        return <div style={{ whiteSpace: "nowrap" }}>Tồn kho</div>;
      },
      dataIndex: "stock",
      key: "stock",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
      filterDropdown: (
        <>
          <Input
            placeholder="Thấp nhất"
            name="stockStart"
            value={filter.stockStart}
            onChange={onChangeFilter}
            className={Styles.input}
            allowClear
          />
          <Input
            placeholder="Cao nhất"
            name="stockEnd"
            value={filter.stockEnd}
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
                setUpdateId(record.id);
                updateForm.setFieldsValue(record);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                showConfirmDelete(record.id);
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
  }, [refresh]);

  // Get categories
  React.useEffect(() => {
    axios
      .get("/categories")
      .then((response) => {
        const { data } = response;
        setCategories([...allOption, ...data.payload]);
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
        setSuppliers([...allOption, ...data.payload]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onUpdateFinish = (values: any) => {
    axios
      .patch(apiName + "/" + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        updateForm.resetFields();
        message.success("Cập nhật thành công!", 1.5);
        setOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div style={{ padding: 24 }}>
      {/* TABLE */}
      <Table
        className={Styles.table}
        rowKey="_id"
        dataSource={products}
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
          <Form.Item
            label="Mô tả/ Ghi chú"
            name="description"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Mô tả/ Ghi chú bắt buộc phải nhập",
              },
            ]}
          >
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
            <InputNumber style={{ width: 200 }} min={0} max={75} />
          </Form.Item>

          <Form.Item label="Tồn kho" name="stock" hasFeedback>
            <InputNumber style={{ width: 200 }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default memo(Products);
