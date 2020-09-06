import "./styles.scss";

import { Button, Table } from "antd";
import React, { useState, useMemo } from "react";
import { NSHandler, Search, ListActions } from "shared/components";
import useBROAPI from "shared/hooks";
import { includes, listsearch } from "shared/utils";

import EquipmentAddModal from "./EquipmentAddModal";

const { Column } = Table;

const searchFields = ["id", "name", "code"];

function EquipmentList() {
  const [searchText, setSearchText] = useState("");
  const [shouldShowEquipmentAddModal, setShouldShowEquipmentAddModal] = useState(false);
  const [equipments = [], status, refresh] = useBROAPI("/api/v1/equipments");

  const showEquipmentAddModal = () => setShouldShowEquipmentAddModal(true);
  const closeEquipmentAddModal = () => setShouldShowEquipmentAddModal(false);

  const searched = useMemo(() => listsearch(equipments, searchFields, searchText), [equipments, searchText]);

  return (
    <div className="equipments-container">
      <ListActions>
        <Search placeholder="Search for anything..." onSearch={setSearchText} style={{ width: 320 }} size="large" />
        <Button type="primary" onClick={showEquipmentAddModal} size="large">
          Add Equipment
        </Button>
      </ListActions>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={searched} rowKey="id">
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
