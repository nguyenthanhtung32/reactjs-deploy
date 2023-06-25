import React, { memo } from "react";
import { useLocation } from "react-router-dom";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import numeral from "numeral";

import axios from "../../libraries/axiosClient";

const apiName = "/orders";

function OrderDetail() {
  const [products, setProducts] = React.useState<any[]>([]);

  const location = useLocation();
  const productDetail = location.state.productDetail;

  React.useEffect(() => {
    axios
      .get(`${apiName}/abc/${productDetail}`)
      .then((response) => {
        const { data } = response;
        setProducts(data.payload.results);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  const columns: ColumnsType<any> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (orderDetails) => (
        <Space direction="vertical">
          {orderDetails.map((detail: any) => (
            <div key={detail._id}>
              <span>{detail.product.name}</span>
              <br />
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (orderDetails) => (
        <Space direction="vertical">
          {orderDetails.map((detail: any) => (
            <div key={detail._id}>
              <span>{detail.quantity}</span>
              <br />
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: "Discount",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (orderDetails) => (
        <Space direction="vertical">
          {orderDetails.map((detail: any) => (
            <div key={detail._id}>
              <span>{detail.discount}%</span>
              <br />
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (orderDetails) => (
        <Space direction="vertical">
          {orderDetails.map((detail: any) => (
            <div key={detail._id}>
              <span>
                {numeral(detail.quantity * detail.price).format("0,0")} đ
              </span>
              <br />
            </div>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div>
        <Table rowKey="_id" dataSource={products} columns={columns} />
      </div>
    </>
  );
}

export default memo(OrderDetail);
