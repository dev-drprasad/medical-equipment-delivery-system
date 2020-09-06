import React, { useMemo, useState, useEffect } from "react";
import { Modal, Form, Input, message, Select } from "antd";
import useBROAPI, { useTeams } from "shared/hooks";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const ruleReuired = [{ required: true }];

function useAddUser() {
  const [user, setUser] = useState(undefined);
  const args = useMemo(
    () => (user ? ["/api/v1/users", { method: "POST", body: JSON.stringify(user) }] : [undefined, undefined]),
    [user]
  );
  const [, status] = useBROAPI(...args);

  return [setUser, status];
}

function UserAddModal({ onClose, onAdd }) {
  const [add, status] = useAddUser();
  const [teams, teamsStatus] = useTeams();

  const addInsurer = (u) => {
    if (u.currentTarget) return;
    console.log("u :>> ", u);
    add(u);
  };

  useEffect(() => {
    if (status.isSuccess) {
      message.success("New user added successfully!");
      onClose();
      onAdd();
    } else if (status.isError) {
      message.error("Oops! Failed to add new user");
    }
  }, [status]);

  const teamOptions = teams.map(({ id, name }) => ({ value: id, label: name }));

  return (
    <Modal
      title="Add User"
      onOk={addInsurer}
      okButtonProps={{ htmlType: "submit", key: "submit", form: "user-add-form", loading: status.isLoading }}
      onCancel={onClose}
      okText="Add User"
      width={680}
      visible
    >
      <Form {...layout} id="user-add-form" onFinish={addInsurer}>
        <Form.Item name="name" label="Name" rules={ruleReuired}>
          <Input />
        </Form.Item>
        <Form.Item name="username" label="Username" rules={ruleReuired}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={ruleReuired}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="confirmPassword" label="Re-type Password" rules={ruleReuired}>
          <Input />
        </Form.Item>
        <Form.Item name="teamId" label="Team">
          <Select options={teamOptions} loading={teamsStatus.isLoading} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserAddModal;
