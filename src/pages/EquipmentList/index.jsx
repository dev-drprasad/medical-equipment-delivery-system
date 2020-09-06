import "./styles.scss";

import { Button, Table } from "antd";
import React, { useState } from "react";
import { NSHandler } from "shared/components";
import useBROAPI from "shared/hooks";

import InsurerAddModal from "./InsurerAddModal";

const { Column } = Table;

function EquipmentList() {
  const [shouldShowEquipAddModal, setShouldShowEquipAddModal] = useState(false);
  const [equipments = [], status, refresh] = useBROAPI("/api/v1/equipments");

  const showInsurerAddModal = () => setShouldShowEquipAddModal(true);
  const closeInsurerAddModal = () => setShouldShowEquipAddModal(false);
  return (
    <div className="insurers-container">
      <div className="actions">
        <Button type="primary" onClick={showInsurerAddModal}>
          Add Insurer
        </Button>
      </div>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={equipments} rowKey="id">
            <Column title="Name" dataIndex="name" />
            <Column title="Address" dataIndex="address" />
            <Column title="City" dataIndex="city" />
            <Column title="Zip Code" dataIndex="zipcode" />
          </Table>
        )}
      </NSHandler>
      {shouldShowEquipAddModal && <InsurerAddModal onClose={closeInsurerAddModal} onAdd={refresh} />}
    </div>
  );
}

export default EquipmentList;
