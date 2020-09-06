import React, { useState } from "react";
import { Table, Button, Input } from "antd";
import useBROAPI from "shared/hooks";
import { NSHandler } from "shared/components";
import PatientAddModal from "./PatientAddModal";
import "./styles.scss";

const { Column } = Table;

function PatientList() {
  const [shouldShowPatientAddModal, setShouldShowPatientAddModal] = useState(false);
  const [patients = [], status, refresh] = useBROAPI("/api/v1/patients");

  const showPatientAddModal = () => setShouldShowPatientAddModal(true);
  const closePatientAddModal = () => setShouldShowPatientAddModal(false);
  const handleSearch = () => {};
  return (
    <div className="patients-container">
      <div className="actions">
        <Input.Search placeholder="input search text" onSearch={handleSearch} style={{ width: 250 }} size="large" />
        <Button type="primary" onClick={showPatientAddModal} size="large">
          Add Patient
        </Button>
      </div>
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
