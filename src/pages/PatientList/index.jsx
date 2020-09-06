import "./styles.scss";

import { Button, Input, Table } from "antd";

import React, { useMemo, useState } from "react";
import { NSHandler, Search, ListActions } from "shared/components";
import useBROAPI from "shared/hooks";
import { listsearch } from "shared/utils";
import PatientAddModal from "./PatientAddModal";

const { Column } = Table;

const searchFields = ["accountId", "firstName", "lastName", "birthDate", "address", "zipcode", "phoneNumber"];

function usePatients() {
  const [searchText, setSearchText] = useState("");
  const [patients = [], status, refresh] = useBROAPI("/api/v1/patients");
  const searched = useMemo(() => listsearch(patients, searchFields, searchText), [searchText, patients]);
  return [searched, status, refresh, setSearchText];
}

function PatientList() {
  const [shouldShowPatientAddModal, setShouldShowPatientAddModal] = useState(false);
  const [patients = [], status, refresh, search] = usePatients();

  const showPatientAddModal = () => setShouldShowPatientAddModal(true);
  const closePatientAddModal = () => setShouldShowPatientAddModal(false);

  return (
    <div className="patients-container">
      <ListActions>
        <Search placeholder="Search for anything..." onSearch={search} style={{ width: 320 }} size="large" />
        <Button type="primary" onClick={showPatientAddModal} size="large">
          Add Patient
        </Button>
      </ListActions>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={patients} rowKey="accountId">
            <Column title="Account ID" dataIndex="accountId" />
            <Column title="First Name" dataIndex="firstName" />
            <Column title="Last Name" dataIndex="lastName" />
            <Column title="Address" dataIndex="address" />
            <Column title="Date of Birth" dataIndex="birthDate" />
          </Table>
        )}
      </NSHandler>
      {shouldShowPatientAddModal && <PatientAddModal onClose={closePatientAddModal} onAdd={refresh} />}
    </div>
  );
}

export default PatientList;
