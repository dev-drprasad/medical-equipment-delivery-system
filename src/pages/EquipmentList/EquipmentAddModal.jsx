import React, { useMemo, useState, useEffect } from "react";
import { Modal, Form, Input, message, InputNumber } from "antd";

import useBROAPI from "shared/hooks";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const ruleReuired = [{ required: true }];

function useAddEquipment() {
  const [payload, setPayload] = useState(undefined);
  const args = useMemo(
    () => (payload ? ["/api/v1/equipments", { method: "POST", body: JSON.stringify(payload) }] : [undefined, undefined]),
    [payload]
  );
  const [, status] = useBROAPI(...args);

  return [setPayload, status];
}

function EquipmentAddModal({ onClose, onAdd }) {
  const [add, status] = useAddEquipment();

  const addEquipment = (p) => {
    if (p.currentTarget) return;
    add(p);
  };

  useEffect(() => {
    if (status.isSuccess) {
      message.success("New equipment added successfully!");
      onClose();
      onAdd();
    } else if (status.isError) {
      message.error("Oops! Failed to add new equipment");
    }
  }, [status]);

  return (
    <Modal
      title="Add Equipment"
      onOk={addEquipment}
      okButtonProps={{ htmlType: "submit", key: "submit", form: "equipment-add-form", loading: status.isLoading }}
      onCancel={onClose}
      okText="Add Equipment"
      visible
    >
      <Form {...layout} id="equipment-add-form" onFinish={addEquipment}>
        <Form.Item name="code" label="HCPCS Code" rules={ruleReuired}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="HCPCS Name" rules={ruleReuired}>
          <Input />
        </Form.Item>
        <Form.Item name="setPrice" label="HCPCS Set Price" rules={ruleReuired}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EquipmentAddModal;
