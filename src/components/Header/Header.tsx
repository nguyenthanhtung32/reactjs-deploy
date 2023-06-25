import React, { memo } from "react";
import styles from "./Header.module.css";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

interface IProps {
  setIsLogin: (value: boolean) => void;
}

function Header(props: IProps) {
  const navigate = useNavigate();
  const { setIsLogin } = props;

  const handleUpdate = () => {
    setIsLogin(false);
    navigate(`/`);
  };
  return (
    <div className={styles.container}>
      <div className={styles.img}>
        <img
          className={styles.logo}
          src="https://www.milanoplatinum.com/wp-content/uploads/2015/11/THE-MALL_logo_MilanoPlatinum.png"
          alt="Logo"
        />
      </div>
      <div className={styles.button}>
        <Button onClick={handleUpdate}>Đăng xuất</Button>
      </div>
    </div>
  );
}

export default memo(Header);
