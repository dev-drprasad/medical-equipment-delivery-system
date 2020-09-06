import React, { useState, useMemo, useEffect, useContext } from "react";
import { Form, Input, Button, Alert } from "antd";
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
      <Form.Item name="username" rules={[{ required: true, message: "Input your username" }]}>
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
          size="large"
          autoFocus
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: "Input your password" }]}>
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          size="large"
        />
      </Form.Item>
      <Alert
        style={{ visibility: status.isError && status.statusCode === 401 ? "visible" : "hidden", marginBottom: 16 }}
        message="Invalid username or password"
        type="error"
      />

      <Form.Item style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit" loading={status.isLoading} size="large">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Login;
