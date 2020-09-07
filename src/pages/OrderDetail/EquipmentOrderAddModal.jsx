import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Modal, Table, message } from "antd";
import useBROAPI from "shared/hooks";
const { Column } = Table;

function useAddEquipmentToOrder(orderId) {
  const [payload, setPayload] = useState();

  const args = useMemo(
    () =>
      payload
        ? [`api/v1/orders/${orderId}/equipments`, { method: "POST", body: JSON.stringify(payload) }]
        : [undefined, undefined],
    [orderId, payload]
  );
  const [data, status] = useBROAPI(...args);

  const add = useCallback((p) => setPayload(p), []);

  return [data, status, add];
}

function EquipmentOrderAddModal({ orderId, defaultSelectedEquipments, onClose, onUpdate }) {
  const [, status, addEquipments] = useAddEquipmentToOrder(orderId);
  const [equipments = [], equipmentsStatus] = useBROAPI("/api/v1/equipments");

  const [selectedEquipments, setSelectedEquipments] = useState(() => defaultSelectedEquipments);

  const handleAdd = () => {
    addEquipments([...selectedEquipments]);
  };

  useEffect(() => {
    if (status.isSuccess) {
      message.success("Order updated successfully!");
      onUpdate();
    }
  }, [status, onUpdate]);

  const isOKDisabled = defaultSelectedEquipments.length === 0 && selectedEquipments.length === 0;

  return (
    <Modal
      title="Update Equipments"
      okText="Update Equipments"
      okButtonProps={{ loading: status.isLoading, disabled: isOKDisabled }}
      onOk={handleAdd}
      onCancel={onClose}
      width={600}
      visible
    >
      <>
        <Table
          dataSource={equipments}
          loading={equipmentsStatus.isLoading}
          rowKey="id"
          rowSelection={{ type: "checkbox", onChange: setSelectedEquipments, selectedRowKeys: selectedEquipments }}
          showHeader={false}
          pagination={false}
          scroll={{ y: 350 }}
          size="small"
        >
          <Column dataIndex="code" />
          <Column dataIndex="name" />
          <Column dataIndex="setPrice" />
        </Table>
      </>
    </Modal>
  );
}

export default EquipmentOrderAddModal;
