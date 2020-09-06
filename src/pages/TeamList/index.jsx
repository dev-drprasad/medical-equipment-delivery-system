import "./styles.scss";

import { Button, Table } from "antd";
import React, { useState } from "react";
import { NSHandler } from "shared/components";
import useBROAPI from "shared/hooks";

import TeamAddModal from "./TeamAddModal";

const { Column } = Table;

function TeamList() {
  const [shouldShowTeamAddModal, setShouldShowTeamAddModal] = useState(false);
  const [teams = [], status, refresh] = useBROAPI("/api/v1/teams");

  const showTeamAddModal = () => setShouldShowTeamAddModal(true);
  const closeTeamAddModal = () => setShouldShowTeamAddModal(false);
  return (
    <div className="teams-container">
      <div className="actions">
        <Button type="primary" onClick={showTeamAddModal}>
          Add Team
        </Button>
      </div>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={teams} rowKey="id">
            <Column title="Team ID" dataIndex="id" />
            <Column title="Name" dataIndex="name" />
            <Column title="BRM Role" dataIndex={["role", "name"]} />
          </Table>
        )}
      </NSHandler>
      {shouldShowTeamAddModal && <TeamAddModal onClose={closeTeamAddModal} onAdd={refresh} />}
    </div>
  );
}

export default TeamList;
