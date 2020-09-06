import React, { useState, useMemo } from "react";
import { Button, Table } from "antd";
import { Link } from "@reach/router";
import useBROAPI from "shared/hooks";
import { NSHandler, Search, ListActions } from "shared/components";
import "./styles.scss";
import { listsearch, sorters } from "shared/utils";
const { Column } = Table;

function getPatientNameFromOrder(order) {
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
const searchFields = ["id", "serviceDate", "status", "orderedBy.firstName", "orderedBy.lastName", "prescribedBy.name"];
function OrderList({ navigate }) {
  const [searchText, setSearchText] = useState("");

  const [orders = [], status] = useBROAPI("/api/v1/orders");
  const searched = useMemo(() => listsearch(orders, searchFields, searchText), [searchText, orders]);

  return (
    <div className="orders-container">
      <ListActions>
        <Search placeholder="Search for anything..." onSearch={setSearchText} style={{ width: 320 }} size="large" />
        <Button type="primary" onClick={() => navigate("/orders/new")} size="large">
          Create Order
        </Button>
      </ListActions>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={searched} rowKey="id">
            <Column title="Order ID" dataIndex="id" render={orderIdAnchored} sorter={sorters("id", "number")} />
            <Column title="Status" dataIndex="status" />
            <Column title="Date of Service" dataIndex="serviceDate" sorter={sorters("serviceDate", "date")} />
            <Column
              title="Patient Name"
              render={patientNameAnchored}
              sorter={sorters(getPatientNameFromOrder, "string")}
            />
            <Column
              title="Physician Name"
              render={physicianNameAnchored}
              sorter={sorters("prescribedBy.name", "string")}
            />
          </Table>
        )}
      </NSHandler>
    </div>
  );
}

export default OrderList;
