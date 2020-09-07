import React, { useState, useMemo, useEffect, useCallback, useContext } from "react";
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
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { AuthContext } from "shared/context";
import { getInitialsFromName } from "shared/utils";
import ListActions from "shared/components/ListActions";
import EquipmentOrderAddModal from "./EquipmentOrderAddModal";

const { Dragger } = Upload;
const { Column } = Table;

const ruleReuired = [{ required: true }];
const NotAvailable = "N/A";

function prefixDollar(setPrice) {
  return "$ " + setPrice;
}

function useOrder(id) {
  const args = id ? [`/api/v1/orders/${id}`] : [undefined];
  const [order, status, refresh] = useBROAPI(...args);
  return [order, status, refresh];
}

function useComments(id) {
  const args = id ? [`/api/v1/orders/${id}/comments`] : [undefined];
  const [comments = [], status] = useBROAPI(...args);
  return [comments, status];
}
function useOrderSaleUsers(id) {
  const args = id ? [`/api/v1/orders/${id}/saleUsers`] : [undefined];
  const [users = [], status] = useBROAPI(...args);
  return [users, status];
}
function useOrderDocuments(id) {
  const args = id ? [`/api/v1/orders/${id}/documents`] : [undefined];
  const [documents = [], status, refresh] = useBROAPI(...args);
  return [documents, status, refresh];
}

function useCommentAdd(id) {
  const [inComment, setComment] = useState(undefined);
  const args = useMemo(
    () =>
      inComment
        ? [`/api/v1/orders/${id}/comments`, { method: "POST", body: JSON.stringify(inComment) }]
        : [undefined, undefined],
    [inComment, id]
  );
  const [comment, status] = useBROAPI(...args);

  return [comment, setComment, status];
}
function useUpdateOrderStatus(id) {
  const [payload, setPayload] = useState(undefined);
  const args = useMemo(
    () =>
      payload ? [`/api/v1/orders/${id}/status`, { method: "POST", body: JSON.stringify(payload) }] : [undefined, undefined],
    [payload, id]
  );
  const [data, status] = useBROAPI(...args);

  return [data, setPayload, status];
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
    const opts = {
      method: "POST",
      headers: { "Content-Type": null },
      body: formData,
    };
    return [`/api/v1/orders/${orderId}/documents/upload`, opts];
  }, [file, orderId]);

  const [data, status] = useBROAPI(...args);

  return [data, setFile, status];
}

function CommentEditor({ orderId, onAdd }) {
  const formRef = React.createRef();

  const [comment, add, status] = useCommentAdd(orderId);
  const addComment = (c) => {
    if (c.currentTarget) return;
    add({ ...c, orderId });
  };

  useEffect(() => {
    if (status.isSuccess) {
      onAdd(comment);
      formRef.current.resetFields();
    }
  }, [status, onAdd, comment]); // adding formRef casuing idefinite render

  return (
    <Form ref={formRef} className="comment-add-form" onFinish={addComment} layout="vertical">
      <Form.Item name="content" rules={ruleReuired} label="Add comment">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Button className="right-align" htmlType="submit" loading={status.isLoading} type="primary" ghost>
        Add Comment
      </Button>
    </Form>
  );
}

function OrderDetail({ id: idStr }) {
  const [user] = useContext(AuthContext);
  const id = Number(idStr);
  const [order, status, refresh] = useOrder(Number.isFinite(id) && id > 0 ? id : undefined);
  const [orderstatuses, orderstatusesStatus] = useOrderStatuses();
  const [, updateStatus, updateStatusStatus] = useUpdateOrderStatus(order?.id);
  const [, updateAppointment, updateAppointmentStatus] = useUpdateAppointment(order?.id);
  const [, uploadDocument, uploadDocumentStatus] = useDocumentUploader(order?.id);
  const [comments, commentsStatus] = useComments(order?.id);
  const [saleUsers, saleUsersStatus] = useOrderSaleUsers(order?.id);
  const [documents, documentsStatus, refreshDocuments] = useOrderDocuments(order?.id);

  const [newComments, setNewComments] = useState([]);
  const [shouldShowAddEquipmentModal, setShouldShowAddEquipmentModal] = useState(false);

  const showAddEquipmentModal = () => setShouldShowAddEquipmentModal(true);
  const hideAddEquipmentModal = () => setShouldShowAddEquipmentModal(false);

  const addNewComment = useCallback((comment) => {
    setNewComments((comments) => [...comments, comment]);
  }, []);

  const handleStatusChange = useCallback(
    (status) => {
      updateStatus({ status, id: order?.id });
    },
    [updateStatus, order]
  );

  const handleAppointmentChange = useCallback(
    (appointment) => {
      updateAppointment({
        appointment: appointment.format("YYYY-MM-DD"),
        id: order?.id,
      });
    },
    [updateStatus, order]
  );

  const handleDocumentChange = ({ file }) => {
    if (file) {
      uploadDocument(file);
    }
  };

  useEffect(() => {
    if (status.isLoading && showAddEquipmentModal) {
      hideAddEquipmentModal();
    }
  }, [status]);

  useEffect(() => {
    if (updateStatusStatus.isSuccess) {
      message.success("Order status updated successfully!");
    }
    if (updateStatusStatus.isError) {
      message.error("Failed to update order status");
    }
  }, [updateStatusStatus]);

  useEffect(() => {
    if (updateAppointmentStatus.isSuccess) {
      message.success("Appointment date updated successfully!");
    }
    if (updateAppointmentStatus.isError) {
      message.error("Failed to update appointment date");
    }
  }, [updateAppointmentStatus]);

  useEffect(() => {
    if (uploadDocumentStatus.isSuccess) {
      message.success("Document uploaded successfully!");
      refreshDocuments();
    }
    if (uploadDocumentStatus.isError) {
      message.error("Failed to upload document");
    }
  }, [uploadDocumentStatus, refreshDocuments]);

  const allComments = useMemo(() => [...comments, ...newComments], [comments, newComments]);
  const orderstatusOptions = orderstatuses.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  const orderStatusStatus = updateStatusStatus.isInit
    ? orderstatusesStatus
    : mergeStatuses(orderstatusesStatus, updateStatusStatus);
  return (
    <div className="order-detail">
      <NSHandler status={status}>
        {() => (
          <>
            <div className="column-left">
              <Card title={`Order ID: ${order.id}`} size="small">
                <Descriptions colon>
                  <Descriptions.Item label="Status" span={1.5}>
                    <Select
                      style={{ width: 160 }}
                      onChange={handleStatusChange}
                      options={orderstatusOptions}
                      loading={orderStatusStatus.isLoading}
                      disabled={updateStatusStatus.isLoading}
                      defaultValue={order.status}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Service" span={1.5}>
                    {order.serviceDate ? moment(order.serviceDate).format("Do MMM YYYY") : NotAvailable}
                  </Descriptions.Item>
                  <Descriptions.Item label="Patient Name" span={1.5}>
                    <Link to={`patients/${order.orderedBy.accountId}`}>
                      {order.orderedBy.firstName} {order.orderedBy.lastName} ({order.orderedBy.accountId})
                    </Link>
                  </Descriptions.Item>
                  <Descriptions.Item label="Patient DOB" span={1.5}>
                    {order.orderedBy.birthDate ? moment(order.orderedBy.birthDate).format("Do MMM  YYYY") : NotAvailable}
                  </Descriptions.Item>
                  <Descriptions.Item label="Patient Address" span={1.5}>
                    {order.orderedBy.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Patient Phone" span={1.5}>
                    {order.orderedBy.phoneNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Physician Name" span={1.5}>
                    <Link to={`physicians/${order.prescribedBy.id}`}>{order.prescribedBy.name}</Link>
                  </Descriptions.Item>
                  <Descriptions.Item label="" span={1.5}></Descriptions.Item>
                  <Descriptions.Item label="Insurance ID" span={1.5}>
                    {order.orderedBy.insuranceID}
                  </Descriptions.Item>
                  <Descriptions.Item label="Insurance Company" span={1.5}>
                    <Link to={`insurers/${order.insuredBy.id}`}>{order.insuredBy.name}</Link>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
              <ListActions>
                <h4 style={{ marginBottom: 0 }}>Equipments</h4>
                <Button type="primary" onClick={showAddEquipmentModal} ghost>
                  Update Equipments
                </Button>
              </ListActions>
              <Table
                dataSource={order.equipments}
                rowKey="id"
                showHeader={false}
                pagination={false}
                style={{ marginBottom: 16 }}
              >
                <Column dataIndex="code"></Column>
                <Column dataIndex="name"></Column>
                <Column dataIndex="setPrice" render={prefixDollar} align="right"></Column>
              </Table>
              <NSHandler
                status={commentsStatus}
                noDataMessage={allComments.length === 0 ? "No comments have been added." : ""}
                style={{ height: "min-content" }}
              >
                {() => (
                  <>
                    <List
                      className="order-comments"
                      header="Comments"
                      itemLayout="horizontal"
                      dataSource={allComments}
                      renderItem={(comment) => (
                        <li>
                          <Comment
                            author={comment.user.name}
                            avatar={<Avatar>{getInitialsFromName(comment.user.name)}</Avatar>}
                            content={comment.content}
                            datetime={"@ " + moment(comment.createdAt).format("Do MMM YYYY HH:mm A")}
                          />
                        </li>
                      )}
                    />
                  </>
                )}
              </NSHandler>
              <Comment
                avatar={<Avatar>{getInitialsFromName(user.name)}</Avatar>}
                content={<CommentEditor orderId={id} onAdd={addNewComment} />}
              />
            </div>
            <div className="column-right">
              <Card size="small" title="Appointment">
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={handleAppointmentChange}
                  loading={updateAppointmentStatus.isLoading}
                  disabled={updateAppointmentStatus.isLoading}
                  defaultValue={order.appointment ? moment(order.appointment) : undefined}
                />
              </Card>
              <Card size="small" title="Sales Persons">
                <List
                  dataSource={saleUsers}
                  renderItem={(user) => <List.Item>{user.name}</List.Item>}
                  loading={saleUsersStatus.isLoading}
                  size="small"
                  bordered
                />
              </Card>
              <Card size="small" title="Documents">
                <List
                  className="document-list"
                  dataSource={documents}
                  renderItem={(document) => (
                    <List.Item>
                      <div>
                        <Typography.Text ellipsis>
                          <a target="_blank" rel="noopener noreferrer" href={`/api/${document.path}?__token=${user?.token}`}>
                            {document.name}
                          </a>
                        </Typography.Text>
                        <div style={{ color: "rgba(0,0,0,0.45)", fontSize: 11 }}>
                          @ {moment(document.createdAt).format("Do MMM YYYY HH:mm A")}
                        </div>
                      </div>
                    </List.Item>
                  )}
                  loading={documentsStatus.isLoading}
                  size="small"
                  bordered
                />
                <Dragger
                  className="document-uploader"
                  accept=".pdf"
                  beforeUpload={() => false}
                  onChange={handleDocumentChange}
                  disabled={uploadDocumentStatus.isLoading}
                  fileList={[]}
                >
                  <p className="ant-upload-drag-icon">
                    <PlusOutlined />
                  </p>
                  <p className="ant-upload-hint">
                    {uploadDocumentStatus.isLoading ? "Uploading..." : "Click to upload document"}
                  </p>
                </Dragger>
              </Card>
            </div>
            {shouldShowAddEquipmentModal && (
              <EquipmentOrderAddModal
                defaultSelectedEquipments={order.equipments.map(({ id }) => id)}
                orderId={order.id}
                onUpdate={refresh}
                onClose={hideAddEquipmentModal}
              />
            )}
          </>
        )}
      </NSHandler>
    </div>
  );
}

export default OrderDetail;
