import React from "react";
import { Button, Table } from "antd";
import { Link } from "@reach/router";
import useBROAPI from "shared/hooks";
import { NSHandler } from "shared/components";
import "./styles.scss";
const { Column } = Table;

function getPatientNameFromOrder(order) {
  console.log("order :>> ", order);
  return order.orderedBy.firstName + " " + order.orderedBy.lastName;
}

function patientNameAnchored(_, order) {
  const patientName = getPatientNameFromOrder(order);
  return <Link to={`/patients/${order.orderedBy.accountId}`}>{patientName}</Link>;
}

function physicianNameAnchored(_, order) {
  return <Link to={`/physicians/${order.prescribedBy.id}`}>{order.prescribedBy.name}</Link>;
}
function orderIdAnchored(id) {
  return <Link to={`/orders/${id}`}>{id}</Link>;
}

function OrderList({ navigate }) {
  console.log("navigate :>> ", navigate);
  const [orders = [], status] = useBROAPI("/api/v1/orders");

  return (
    <div className="orders-container">
      <div className="actions">
        <Button type="primary" onClick={() => navigate("/orders/new")}>
          Create Order
        </Button>
      </div>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={orders} rowKey="id">
            <Column title="Order ID" dataIndex="id" render={orderIdAnchored} />
            <Column title="Status" dataIndex="status" />
            <Column title="Date of Service" dataIndex="serviceDate" />
            <Column title="Patient Name" render={patientNameAnchored} />
            <Column title="Physician Name" render={physicianNameAnchored} />
          </Table>
        )}
      </NSHandler>
    </div>
  );
}

export default OrderList;
