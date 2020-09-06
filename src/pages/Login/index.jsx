import React, { useState, useMemo, useEffect, useContext } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import useBROAPI from "shared/hooks";
import { AuthContext } from "shared/context";
import { navigate } from "@reach/router";
import "./styles.scss";

function useLogin() {
  const [body, setBody] = useState(undefined);
  const args = useMemo(
    () => (body ? ["/api/v1/login", { method: "POST", body: JSON.stringify(body) }] : [undefined, undefined]),
    [body]
  );
  const [user, status] = useBROAPI(...args);

  return [user, setBody, status];
}

function Login() {
  const [u, setUser] = useContext(AuthContext);
  const [user, login, status] = useLogin();

  const handleFormSubmit = (b) => {
    if (b.currentTarget) return;
    login(b);
  };

  useEffect(() => {
    if (status.isSuccess) {
      setUser({ ...user, token: status.token });
    }
  }, [status, setUser, user]);

  useEffect(() => {
    if (u?.token) navigate("/");
  }, [u]);

  return (
    <Form className="login-form" initialValues={{ remember: true }} onFinish={handleFormSubmit}>
      <div className="logo-wrapper">
        <img src="/bro-logo.png" alt="bro logo" />
      </div>
      <Form.Item name="username" rules={[{ required: true, message: "Please input your Username!" }]}>
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
          size="large"
          autoFocus
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          size="large"
        />
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit" loading={status.isLoading} size="large">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Login;
