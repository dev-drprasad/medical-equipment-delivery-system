import "./styles.scss";

import { Button, Table } from "antd";
import React, { useState } from "react";
import { NSHandler } from "shared/components";
import useBROAPI from "shared/hooks";

import UserAddModal from "./UserAddModal";

const { Column } = Table;

function UserList() {
  const [shouldShowUserAddModal, setShouldShowUserAddModal] = useState(false);
  const [usres = [], status, refresh] = useBROAPI("/api/v1/users");

  const showUserAddModal = () => setShouldShowUserAddModal(true);
  const closeUserAddModal = () => setShouldShowUserAddModal(false);
  return (
    <div className="users-container">
      <div className="actions">
        <Button type="primary" onClick={showUserAddModal}>
          Add User
        </Button>
      </div>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={usres} rowKey="id">
            <Column title="Userame" dataIndex="username" />
            <Column title="Name" dataIndex="name" />
            <Column title="Team" dataIndex={["team", "name"]} />
          </Table>
        )}
      </NSHandler>
      {shouldShowUserAddModal && <UserAddModal onClose={closeUserAddModal} onAdd={refresh} />}
    </div>
  );
}

export default UserList;
