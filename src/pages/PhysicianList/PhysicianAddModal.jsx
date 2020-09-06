import React, { useMemo, useState, useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import useBROAPI from "shared/hooks";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const ruleReuired = [{ required: true }];

function useAddPhysician() {
  const [physician, setPhysician] = useState(undefined);
  const args = useMemo(
    () =>
      physician ? ["/api/v1/physicians", { method: "POST", body: JSON.stringify(physician) }] : [undefined, undefined],
    [physician]
  );
  const [, status] = useBROAPI(...args);

  return [setPhysician, status];
}

function PhysicianAddModal({ onClose, onAdd }) {
  const [add, status] = useAddPhysician();

  const addPhysician = (p) => {
    if (p.currentTarget) return;
    console.log("p :>> ", p);
    add(p);
  };

  useEffect(() => {
    if (status.isSuccess) {
      message.success("New physician added successfully!");
      onClose();
      onAdd();
    } else if (status.isError) {
      message.error("Oops! Failed to add new physician");
    }
  }, [status]);

  return (
    <Modal
      title="Add Physician"
      onOk={addPhysician}
      okButtonProps={{ htmlType: "submit", key: "submit", form: "physician-add-form", loading: status.isLoading }}
      onCancel={onClose}
      okText="Add Physician"
      width={680}
      visible
    >
      <Form {...layout} id="physician-add-form" onFinish={addPhysician}>
        <Form.Item name="name" label="Name" rules={ruleReuired}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address" rules={ruleReuired}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="city" label="City" rules={ruleReuired}>
          <Input />
        </Form.Item>
        <Form.Item name="zipcode" label="Zip Code" rules={ruleReuired}>
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Phone" rules={ruleReuired}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PhysicianAddModal;
