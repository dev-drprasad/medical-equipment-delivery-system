import './styles.scss';

import {Button, Table} from 'antd';
import React, {useMemo, useState} from 'react';
import {ListActions, NSHandler, Search} from 'shared/components';
import useBROAPI from 'shared/hooks';
import {listsearch} from 'shared/utils';

import PhysicianAddModal from './PhysicianAddModal';

const {Column} = Table;

const searchFields =
    ['id', 'name', 'address', 'phoneNumber', 'zipcode', 'city'];

function PhysicianList() {
  const [shouldShowPhysicianAddModal, setShouldShowPhysicianAddModal] =
      useState(false);
  const [physicians = [], status, refresh] = useBROAPI('/api/v1/physicians');

  const showPhysicianAddModal = () => setShouldShowPhysicianAddModal(true);
  const closePhysicianAddModal = () => setShouldShowPhysicianAddModal(false);

  const [searchText, setSearchText] = useState('')
  const searched = useMemo(
      () => listsearch(physicians, searchFields, searchText),
      [physicians, searchText]);

  return (
    <div className='patients-container'>
      <ListActions>
        <Search placeholder='Search for anything...' onSearch={setSearchText} style={
    { width: 320 }} size='large' />
        <Button type='primary' onClick={showPhysicianAddModal} size='large'>
          Add Physician
        </Button>
      </ListActions>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={searched} rowKey='id'>
            <Column title='Name' dataIndex='name' />
            <Column title='Address' dataIndex='address' />
            <Column title='City' dataIndex='city' />
            <Column title='Zip Code' dataIndex='zipcode' />
          </Table>
        )}
      </NSHandler>
      {shouldShowPhysicianAddModal && <PhysicianAddModal onClose={closePhysicianAddModal} onAdd={refresh} />}
    </div>
  );
}

export default PhysicianList;
