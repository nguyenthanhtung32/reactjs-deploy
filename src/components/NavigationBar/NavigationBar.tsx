import React, { memo } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Route, Routes, useNavigate } from "react-router-dom";

import Categories from "../../pages/Categories";
import Suppliers from "../../pages/Suppliers";
import Products from "../../pages/Products";
import Customers from "../../pages/Customers";
import Employees from "../../pages/Employees";
import Orders from "../../pages/Orders";
import OrdersDetail from "../../pages/Orders/orderDetails";
import CreateProduct from "../../pages/Products/create";
import CreateCategory from "../../pages/Categories/create";
import CreateSupplier from "../../pages/Suppliers/create";
import CreateEmployee from "../../pages/Employees/create";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const menuItems = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "Trang chủ",
  },
  {
    key: "list",
    icon: <UnorderedListOutlined />,
    label: "Quản lý",
    children: [
      { key: "categories", label: "Danh mục" },
      { key: "suppliers", label: "Nhà cung cấp" },
      { key: "products", label: "Sản phẩm" },
      { key: "customers", label: "Khách hàng" },
      { key: "employees", label: "Nhân viên" },
    ],
  },
  {
    key: "orders",
    icon: <SettingOutlined />,
    label: "Quản lý đơn hàng",
  },
];

function NavigationBar() {
  const navigate = useNavigate();
  const [current, setCurrent] = React.useState<string>("home");

  const handleMenuClick = (e: { key: string }) => {
    setCurrent(e.key);
    navigate(`/${e.key}`);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ backgroundColor: "white" }}>
        <Menu
          style={{ marginTop: "20px" }}
          onClick={handleMenuClick}
          //   theme="dark"
          mode="inline"
          defaultSelectedKeys={["home"]}
          selectedKeys={[current]}
        >
          {menuItems.map((item) => {
            if (item.children) {
              return (
                <SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.children.map((child) => (
                    <Menu.Item key={child.key}>{child.label}</Menu.Item>
                  ))}
                </SubMenu>
              );
            }
            return (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Content style={{ margin: "10px" }}>
          <div className="site-layout-background" style={{ minHeight: 360 }}>
            <Routes>
              <Route path="/categories" element={<Categories />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orderDetails" element={<OrdersDetail />} />
            </Routes>
            <Routes>
              <Route path="/category" element={<CreateCategory />} />
              <Route path="/product" element={<CreateProduct />} />
              <Route path="/supplier" element={<CreateSupplier />} />
              <Route path="/employee" element={<CreateEmployee />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default memo(NavigationBar);
