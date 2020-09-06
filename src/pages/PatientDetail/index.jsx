import React, { useState, useMemo, useEffect, useCallback } from "react";
import useBROAPI, { useOrderStatuses, mergeStatuses } from "shared/hooks";
import { NSHandler } from "shared/components";
import {
  Descriptions,
  List,
  Comment,
  Avatar,
  Button,
  Input,
  Form,
  Select,
  message,
  DatePicker,
  Card,
  Upload,
  Typography,
  Table,
} from "antd";
import { Link } from "@reach/router";

import "./styles.scss";

const { Column } = Table;

const NotAvailable = "N/A";

function OrderIdAnchored(_, order) {
  return <Link to={`/patients/${order.id}`}>{order.id}</Link>;
}

function usePatient(id) {
  const args = id ? [`/api/v1/patients/${id}`] : [undefined];
  const [order, status] = useBROAPI(...args);
  return [order, status];
}

function useUpdateAppointment(id) {
  const [payload, setPayload] = useState(undefined);
  const args = useMemo(
    () =>
      payload
        ? [`/api/v1/orders/${id}/appointment`, { method: "POST", body: JSON.stringify(payload) }]
        : [undefined, undefined],
    [payload, id]
  );
  const [data, status] = useBROAPI(...args);

  return [data, setPayload, status];
}

function useDocumentUploader(orderId) {
  const [file, setFile] = useState(undefined);

  const args = useMemo(() => {
    if (!file || !orderId) return [undefined, undefined];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("orderId", orderId);
    const opts = { method: "POST", headers: { "Content-Type": null }, body: formData };
    return [`/api/v1/orders/${orderId}/documents/upload`, opts];
  }, [file, orderId]);
  console.log("args :>> ", args);
  const [data, status] = useBROAPI(...args);

  return [data, setFile, status];
}

function PatientDetail({ id: idStr }) {
  const id = Number(idStr);
  const [patient, status] = usePatient(Number.isFinite(id) && id > 0 ? id : undefined);
  const [orderstatuses, orderstatusesStatus] = useOrderStatuses();
  const [, updateAppointment, updateAppointmentStatus] = useUpdateAppointment(patient?.id);
  const [, uploadDocument, uploadDocumentStatus] = useDocumentUploader(patient?.id);
  const [newComments, setNewComments] = useState([]);

  const addNewComment = useCallback((comment) => {
    setNewComments((comments) => [...comments, comment]);
  }, []);

  const handleDocumentChange = ({ file, event, fileList }) => {
    if (file) {
      uploadDocument(file);
    }
  };

  useEffect(() => {
    if (updateAppointmentStatus.isSuccess) {
      message.success("Appointment date updated successfully!");
    }
    if (updateAppointmentStatus.isError) {
      message.error("Failed to update appointment date");
    }
  }, [updateAppointmentStatus]);

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
              <Table dataSource={patient.orders}>
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
