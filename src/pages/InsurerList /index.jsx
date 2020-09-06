import "./styles.scss";

import { Button, Table } from "antd";
import React, { useMemo, useState } from "react";
import { ListActions, NSHandler, Search } from "shared/components";
import useBROAPI from "shared/hooks";
import { listsearch } from "shared/utils";

import InsurerAddModal from "./InsurerAddModal";

const { Column } = Table;

const searchFields = ["id", "name", "address", "city", "zipcode", "phoneNumber"];

function InsurerList() {
  const [searchText, setSearchText] = useState("");
  const [shouldShowInsurerAddModal, setShouldShowInsurerAddModal] = useState(false);
  const [insurers = [], status, refresh] = useBROAPI("/api/v1/insurers");

  const showInsurerAddModal = () => setShouldShowInsurerAddModal(true);
  const closeInsurerAddModal = () => setShouldShowInsurerAddModal(false);

  const searched = useMemo(() => listsearch(insurers, searchFields, searchText), [insurers, searchText]);
  return (
    <div className="insurers-container">
      <ListActions>
        <Search placeholder="Search for anything..." onSearch={setSearchText} style={{ width: 320 }} size="large" />
        <Button type="primary" onClick={showInsurerAddModal} size="large">
          Add Insurer
        </Button>
      </ListActions>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={searched} rowKey="id">
            <Column title="Name" dataIndex="name" />
            <Column title="Address" dataIndex="address" />
            <Column title="City" dataIndex="city" />
            <Column title="Zip Code" dataIndex="zipcode" />
          </Table>
        )}
      </NSHandler>
      {shouldShowInsurerAddModal && <InsurerAddModal onClose={closeInsurerAddModal} onAdd={refresh} />}
    </div>
  );
}

export default InsurerList;
