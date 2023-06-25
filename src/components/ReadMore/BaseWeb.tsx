import React, { memo } from "react";
import { Layout } from "antd";
import "antd/dist/reset.css";
import { BrowserRouter } from "react-router-dom";

import Header from "../Header/Header";
import NavigationBar from "../NavigationBar/NavigationBar";
interface IProps {
  setIsLogin: (value: boolean) => void;
}

function BaseWeb(props: IProps) {
  const { setIsLogin } = props;
  return (
    <BrowserRouter>
      <Layout>
        <Header setIsLogin={setIsLogin} />
        <NavigationBar />
      </Layout>
    </BrowserRouter>
  );
}

export default memo(BaseWeb);
