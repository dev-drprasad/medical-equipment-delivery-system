import React, { useMemo, useState, useEffect } from "react";
import { Modal, Form, Input, message, Select } from "antd";
import useBROAPI, { useTeams } from "shared/hooks";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const ruleConfirmPassword = ({ getFieldValue }) => ({
  validator(_, value) {
    if (!value || getFieldValue("password") === value) {
      return Promise.resolve();
    }
    return Promise.reject("The two passwords you entered do not match!");
  },
});

const ruleRequired = { required: true };
const ruleJustRequired = [ruleRequired];

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
      width={600}
      visible
    >
      <Form {...layout} id="user-add-form" onFinish={addInsurer}>
        <Form.Item name="name" label="Name" rules={ruleJustRequired}>
          <Input />
        </Form.Item>
        <Form.Item name="username" label="Username" rules={ruleJustRequired}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={ruleJustRequired}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="confirmPassword" label="Re-type password" rules={[...ruleJustRequired, ruleConfirmPassword]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="teamId" label="Team" rules={ruleJustRequired}>
          <Select options={teamOptions} loading={teamsStatus.isLoading} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserAddModal;
