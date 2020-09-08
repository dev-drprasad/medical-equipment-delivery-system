import React, { useMemo, useState, useEffect } from "react";
import { Modal, Form, Input, message, Select } from "antd";
import useBROAPI, { useRoles } from "shared/hooks";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const ruleReuired = [{ required: true }];

function useAddTeam() {
  const [user, setUser] = useState(undefined);
  const args = useMemo(
    () => (user ? ["/api/v1/teams", { method: "POST", body: JSON.stringify(user) }] : [undefined, undefined]),
    [user]
  );
  const [, status] = useBROAPI(...args);

  return [setUser, status];
}

function UserAddModal({ onClose, onAdd }) {
  const [add, status] = useAddTeam();
  const [roles, rolesStatus] = useRoles();

  const addTeam = (t) => {
    if (t.currentTarget) return;
    add(t);
  };

  useEffect(() => {
    if (status.isSuccess) {
      message.success("New team added successfully!");
      onClose();
      onAdd();
    } else if (status.isError) {
      message.error("Oops! Failed to add new team");
    }
  }, [status]);
  const roleOptions = roles.map(({ id, name }) => ({ value: id, label: name }));
  return (
    <Modal
      title="Add Team"
      onOk={addTeam}
      okButtonProps={{
        htmlType: "submit",
        key: "submit",
        form: "team-add-form",
        loading: status.isLoading,
      }}
      onCancel={onClose}
      okText="Add Team"
      width={600}
      visible
    >
      <Form {...layout} id="team-add-form" onFinish={addTeam}>
        <Form.Item name="name" label="Name" rules={ruleReuired}>
          <Input />
        </Form.Item>
        <Form.Item name="roleId" label="BRM Role" rules={ruleReuired}>
          <Select options={roleOptions} loading={rolesStatus.isLoading} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserAddModal;
