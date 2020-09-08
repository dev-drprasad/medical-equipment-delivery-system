import React from "react";
import useBROAPI from "shared/hooks";
import { NSHandler } from "shared/components";
import { Descriptions, Card, Table } from "antd";
import { Link } from "@reach/router";

import "./styles.scss";

const { Column } = Table;

const NotAvailable = "N/A";

function OrderIdAnchored(_, order) {
  return <Link to={`/orders/${order.id}`}>{order.id}</Link>;
}

function usePatient(id) {
  const args = id ? [`/api/v1/patients/${id}`] : [undefined];
  const [order, status] = useBROAPI(...args);
  return [order, status];
}

function PatientDetail({ id: idStr }) {
  const id = Number(idStr);
  const [patient, status] = usePatient(Number.isFinite(id) && id > 0 ? id : undefined);

  return (
    <div className="order-detail">
      <NSHandler status={status}>
        {() => (
          <>
            <div className="column-left">
              <Card title={`Account ID: ${patient.accountId}`} size="small">
                <Descriptions colon>
                  <Descriptions.Item label="Patient Name" span={1.5}>
                    {patient.firstName} {patient.lastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Patient DOB" span={1.5}>
                    {patient.birthDate || NotAvailable}
                  </Descriptions.Item>
                  <Descriptions.Item label="Patient Address" span={1.5}>
                    {patient.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Patient Zipcode" span={1.5}>
                    {patient.zipcode}
                  </Descriptions.Item>
                  <Descriptions.Item label="Patient Phone" span={1.5}>
                    {patient.phoneNumber}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
              <Table dataSource={patient.orders} rowKey="id">
                <Column title="Order ID" dataIndex="id" render={OrderIdAnchored} />
                <Column title="Status" dataIndex="status" />
                <Column title="Date of Service" dataIndex="serviceDate" />
              </Table>
            </div>
          </>
        )}
      </NSHandler>
    </div>
  );
}

export default PatientDetail;
