import React, { useMemo, useState, useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import useBROAPI from "shared/hooks";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const ruleReuired = [{ required: true }];

function useAddInsurer() {
  const [insurer, setinsurer] = useState(undefined);
  const args = useMemo(
    () => (insurer ? ["/api/v1/insurers", { method: "POST", body: JSON.stringify(insurer) }] : [undefined, undefined]),
    [insurer]
  );
  const [, status] = useBROAPI(...args);

  return [setinsurer, status];
}

function InsurerAddModal({ onClose, onAdd }) {
  const [add, status] = useAddInsurer();

  const addInsurer = (p) => {
    if (p.currentTarget) return;
    console.log("p :>> ", p);
    add(p);
  };

  useEffect(() => {
    if (status.isSuccess) {
      message.success("New insurer added successfully!");
      onClose();
      onAdd();
    } else if (status.isError) {
      message.error("Oops! Failed to add new insurer");
    }
  }, [status]);

  return (
    <Modal
      title="Add Insurer"
      onOk={addInsurer}
      okButtonProps={{ htmlType: "submit", key: "submit", form: "insurer-add-form", loading: status.isLoading }}
      onCancel={onClose}
      okText="Add Insurer"
      width={680}
      visible
    >
      <Form {...layout} id="insurer-add-form" onFinish={addInsurer}>
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

export default InsurerAddModal;
