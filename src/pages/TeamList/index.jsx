import "./styles.scss";

import { Button, Table } from "antd";
import React, { useState, useMemo } from "react";
import { NSHandler, Search, ListActions } from "shared/components";
import useBROAPI from "shared/hooks";

import TeamAddModal from "./TeamAddModal";
import { listsearch } from "shared/utils";

const { Column } = Table;

const searchFields = ["id", "name", "role"];

function TeamList() {
  const [shouldShowTeamAddModal, setShouldShowTeamAddModal] = useState(false);
  const [teams = [], status, refresh] = useBROAPI("/api/v1/teams");

  const showTeamAddModal = () => setShouldShowTeamAddModal(true);
  const closeTeamAddModal = () => setShouldShowTeamAddModal(false);

  const [searchText, setSearchText] = useState("");
  const searched = useMemo(() => listsearch(teams, searchFields, searchText), [teams, searchText]);
  return (
    <div className="teams-container">
      <ListActions>
        <Search placeholder="Search for anything..." onSearch={setSearchText} style={{ width: 320 }} size="large" />
        <Button type="primary" onClick={showTeamAddModal} size="large">
          Add Team
        </Button>
      </ListActions>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={searched} rowKey="id">
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
