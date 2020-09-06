import "./styles.scss";

import { Button, Table } from "antd";
import React, { useState } from "react";
import { NSHandler } from "shared/components";
import useBROAPI from "shared/hooks";

import EquipmentAddModal from "./EquipmentAddModal";

const { Column } = Table;

function EquipmentList() {
  const [shouldShowEquipmentAddModal, setShouldShowEquipmentAddModal] = useState(false);
  const [equipments = [], status, refresh] = useBROAPI("/api/v1/equipments");

  const showEquipmentAddModal = () => setShouldShowEquipmentAddModal(true);
  const closeEquipmentAddModal = () => setShouldShowEquipmentAddModal(false);
  return (
    <div className="equipments-container">
      <div className="actions">
        <Button type="primary" onClick={showEquipmentAddModal}>
          Add Equipment
        </Button>
      </div>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={equipments} rowKey="id">
            <Column title="HCPCS Code" dataIndex="code" />
            <Column title="HCPCS Name" dataIndex="name" />
            <Column title="HCPCS Set Price" dataIndex="setPrice" />
          </Table>
        )}
      </NSHandler>
      {shouldShowEquipmentAddModal && <EquipmentAddModal onClose={closeEquipmentAddModal} onAdd={refresh} />}
    </div>
  );
}

export default EquipmentList;
