import React, { useMemo, useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, message, Select } from "antd";
import useBROAPI, { useInsurerIdAndNames } from "shared/hooks";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const ruleRequired = [{ required: true }];
const formItemInlineStyle = { display: "inline-block", width: "calc(50% - 8px)" };

function useAddPatient() {
  const [patient, setPatient] = useState(undefined);
  const args = useMemo(
    () => (patient ? ["/api/v1/patients", { method: "POST", body: JSON.stringify(patient) }] : [undefined, undefined]),
    [patient]
  );
  const [, status] = useBROAPI(...args);

  return [setPatient, status];
}

function PatientAddModal({ onClose, onAdd }) {
  const [insurers, insurersStatus] = useInsurerIdAndNames();
  const [add, status] = useAddPatient();
  const addPatient = (p) => {
    if (p.currentTarget) return;
    add({ ...p, birthDate: p.birthDate.format("YYYY-MM-DD") });
  };

  useEffect(() => {
    if (status.isSuccess) {
      message.success("New patient added successfully!");
      onClose();
      onAdd();
    } else if (status.isError) {
      message.error("Oops! Failed to add new patient");
    }
  }, [status]);

  const insurerOptions = insurers.map(({ id, name }) => ({ label: name, value: id }));

  return (
    <Modal
      title="Add Patient"
      visible
      onOk={addPatient}
      okButtonProps={{ htmlType: "submit", key: "submit", form: "patient-add-form", loading: status.isLoading }}
      onCancel={onClose}
      okText="Add Patient"
      width={680}
    >
      <Form {...layout} id="patient-add-form" onFinish={addPatient}>
        <Form.Item label="Name">
          <Form.Item name="firstName" style={formItemInlineStyle} rules={ruleRequired}>
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item name="lastName" style={formItemInlineStyle} rules={ruleRequired}>
            <Input placeholder="Last Name" />
          </Form.Item>
        </Form.Item>
        <Form.Item name="birthDate" label="Date of Birth" rules={ruleRequired}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Phone" rules={ruleRequired}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="zipcode" label="Zip Code">
          <Input />
        </Form.Item>
        <Form.Item name="insuredBy" label="Insured By">
          <Select options={insurerOptions} loading={insurersStatus.isLoading} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PatientAddModal;
