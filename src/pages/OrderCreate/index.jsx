import React, { useState, useMemo, useEffect } from "react";
import { Form, Select, DatePicker, Button, message } from "antd";
import useBROAPI, {
  useInsurerIdAndNames,
  useEquiments,
  usePhysicianIdAndNames,
  usePatientIdAndNames,
  useOrderStatuses,
  useSalesUsers,
} from "shared/hooks";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function useOrderCreate() {
  const [order, setOrder] = useState(undefined);
  const args = useMemo(
    () => (order ? ["/api/v1/orders", { method: "POST", body: JSON.stringify(order) }] : [undefined, undefined]),
    [order]
  );
  const [, status] = useBROAPI(...args);

  return [setOrder, status];
}

function OrderCreate({ navigate }) {
  const [patients, patientsStatus] = usePatientIdAndNames();
  const [insurers, insurersStatus] = useInsurerIdAndNames();
  const [physicians, physiciansStatus] = usePhysicianIdAndNames();
  const [equipments, equipmentsStatus] = useEquiments();
  const [orderstatuses, orderstatusesStatus] = useOrderStatuses();
  const [salesUsers, salesUsersStatus] = useSalesUsers();
  const [create, status] = useOrderCreate();
  const createOrder = (o) => {
    if (o.currentTarget) return;
    console.log("o :>> ", o);
    create({ ...o, serviceDate: o.serviceDate.format("YYYY-MM-DD") });
  };

  useEffect(() => {
    if (status.isSuccess) {
      message.success("New order created successfully!");
      navigate("/orders");
    } else if (status.isError) {
      message.error("Oops! Failed to create new order");
    }
  }, [status, navigate]);

  const patientOptions = patients.map(({ firstName, lastName, accountId }) => ({
    value: accountId,
    label: firstName + " " + lastName,
  }));
  const physicianOptions = physicians.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  const insurerOptions = insurers.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  const equipmentOptions = equipments.map(({ id, name, code, setPrice }) => ({
    value: id,
    label: `${code} ${name} ($${setPrice})`,
  }));
  const statusOptions = orderstatuses.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  const salesUserOptions = salesUsers.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  return (
    <Form {...layout} id="order-create-form" style={{ width: "70%", marginTop: 32 }} onFinish={createOrder}>
      <Form.Item name="orderedById" label="Patient Name">
        <Select options={patientOptions} loading={patientsStatus.isLoading} />
      </Form.Item>
      <Form.Item name="prescribedById" label="Physician Name">
        <Select options={physicianOptions} loading={physiciansStatus.isLoading} />
      </Form.Item>
      <Form.Item name="insuredById" label="Insurance Company">
        <Select options={insurerOptions} loading={insurersStatus.isLoading} />
      </Form.Item>
      <Form.Item name="status" label="Status">
        <Select options={statusOptions} loading={orderstatusesStatus.isLoading} />
      </Form.Item>
      <Form.Item name="serviceDate" label="Date of Service">
        <DatePicker />
      </Form.Item>
      <Form.Item name="equipmentIds" label="HCPCS Equipements">
        <Select options={equipmentOptions} mode="multiple" loading={equipmentsStatus.isLoading} />
      </Form.Item>
      <Form.Item name="saledByIds" label="Sales Persons">
        <Select options={salesUserOptions} mode="multiple" loading={salesUsersStatus.isLoading} />
      </Form.Item>
      <Button className="right-align" type="primary" htmlType="submit" loading={status.isLoading}>
        Create Order
      </Button>
    </Form>
  );
}

export default OrderCreate;
