import './styles.scss';

import {Button, Table} from 'antd';
import React, {useState} from 'react';
import {NSHandler} from 'shared/components';
import useBROAPI from 'shared/hooks';

import PhysicianAddModal from './PhysicianAddModal';

const {Column} = Table;

function PhysicianList() {
  const [shouldShowPhysicianAddModal, setShouldShowPhysicianAddModal] =
      useState(false);
  const [physicians = [], status, refresh] = useBROAPI('/api/v1/physicians');

  const showPhysicianAddModal = () => setShouldShowPhysicianAddModal(true);
  const closePhysicianAddModal = () => setShouldShowPhysicianAddModal(false);
  return (
    <div className='patients-container'>
      <div className='actions'>
        <Button type='primary' onClick={showPhysicianAddModal}>
          Add Physician
        </Button>
      </div>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={physicians} rowKey='id'>
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
