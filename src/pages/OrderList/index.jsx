import React, { useState, useMemo } from "react";
import { Button, Table, Form, DatePicker } from "antd";
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
  const [{ searchText, filters }, setSearchText] = useState({ searchText: "", filters: [] });

  const [orders = [], status] = useBROAPI("/api/v1/orders");
  const handleDateSelect = (_, dateStr) => {
    console.log("dateStr :>> ", dateStr);
    setSearchText({
      searchText,
      filters: dateStr
        ? [
            ["serviceDate", dateStr],
            ["status", "scheduled"],
          ]
        : [],
    });
  };
  const handleSearch = (searchText) => {
    setSearchText({ filters, searchText });
  };

  const filtered = useMemo(() => orders.filter((o) => filters.every(([f, v]) => o[f] === v)), [orders, filters]);
  console.log("filtered :>> ", filtered);
  const searched = useMemo(() => listsearch(filtered, searchFields, searchText), [searchText, filtered]);

  return (
    <div className="orders-container">
      <ListActions>
        <Search placeholder="Search for anything..." onSearch={handleSearch} style={{ width: 320 }} size="large" />
        <DatePicker
          placeholder="Delivery Scheduled On"
          style={{ marginLeft: 8, width: 220 }}
          onChange={handleDateSelect}
          size="large"
        />

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
            <Column title="Patient Name" render={patientNameAnchored} sorter={sorters(getPatientNameFromOrder, "string")} />
            <Column title="Physician Name" render={physicianNameAnchored} sorter={sorters("prescribedBy.name", "string")} />
          </Table>
        )}
      </NSHandler>
    </div>
  );
}

export default OrderList;
