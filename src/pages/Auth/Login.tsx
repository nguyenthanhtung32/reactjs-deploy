import React, { useState, memo } from "react";
import { message } from "antd";
import {
  SlSocialFacebook,
  SlSocialGoogle,
  SlSocialTwitter,
} from "react-icons/sl";

import axios from "../../libraries/axiosClient";
import Styles from "./Login.module.css";
interface IProps {
  setIsLogin: (value: boolean) => void;
}

const Login: React.FC<IProps> = (props) => {
  const { setIsLogin } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = {
      email,
      password,
    };

    try {
      const response = await axios.post("/employees/login", token);

      localStorage.setItem("token", response.data.token);
      message.success("Đăng nhập thành công!", 1.5);
      setIsLogin(true);
    } catch (error) {
      console.error(error);
      message.warning("Đăng nhập thất bại!", 1.5);
    }
  };

  return (
    <div className={Styles.container}>
      <form className={Styles.form_1}>
        <h1 className={Styles.login}>Login</h1>
        <label htmlFor="email" className={Styles.label}>
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className={Styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className={Styles.label}>
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          required
          className={Styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className={Styles.span}>Forgot Password</span>
        <button className={Styles.button} onClick={(e) => handleSubmit(e)}>
          Login
        </button>

        <p className={Styles.text}>----Hoặc----</p>
        <div className={Styles.icons}>
          <a href="https://www.facebook.com/">
            <i className={Styles.fa_facebook_f}>
              <SlSocialFacebook />
            </i>
          </a>
          <a href="https://twitter.com/">
            <i className={Styles.fa_twitter}>
              <SlSocialTwitter />
            </i>
          </a>
          <a href="https://mail.google.com/">
            <i className={Styles.fa_google}>
              <SlSocialGoogle />
            </i>
          </a>
        </div>
      </form>
    </div>
  );
};

export default memo(Login);
