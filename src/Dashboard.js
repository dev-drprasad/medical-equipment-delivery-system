import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { DesktopOutlined, PieChartOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "@reach/router";
import "./Dashboard.scss";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

function Dashboard({ children, logout }) {
  return (
    <Layout style={{ height: "100%" }}>
      <Sider>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["patients"]} mode="inline">
          <Menu.Item key="patients" icon={<PieChartOutlined />}>
            <Link to="patients">Patients</Link>
          </Menu.Item>
          <Menu.Item key="orders" icon={<DesktopOutlined />}>
            <Link to="orders">Orders</Link>
          </Menu.Item>
          <Menu.Item key="delivery-tech" icon={<DesktopOutlined />}>
            <Link to="orders">Delivery Tech</Link>
          </Menu.Item>
          <SubMenu key="administration" icon={<UserOutlined />} title="Administration">
            <Menu.Item key="physicians">
              <Link to="physicians">Physicians</Link>
            </Menu.Item>
            <Menu.Item key="insurers">
              <Link to="insurers">Insurers</Link>
            </Menu.Item>
            <Menu.Item key="equipments">
              <Link to="equipments">HCPCS / Equipment</Link>
            </Menu.Item>
            <Menu.Item key="users">
              <Link to="users">Users</Link>
            </Menu.Item>
            <Menu.Item key="teams">
              <Link to="teams">Teams</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <main id="main">{children}</main>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
