import './styles.scss';

import {Button, Table} from 'antd';
import React, {useState} from 'react';
import {NSHandler} from 'shared/components';
import useBROAPI from 'shared/hooks';

import InsurerAddModal from './InsurerAddModal';

const {Column} = Table;

function InsurerList() {
  const [shouldShowInsurerAddModal, setShouldShowInsurerAddModal] =
      useState(false);
  const [insurers = [], status, refresh] = useBROAPI('/api/v1/insurers');

  const showInsurerAddModal = () => setShouldShowInsurerAddModal(true);
  const closeInsurerAddModal = () => setShouldShowInsurerAddModal(false);
  return (
    <div className='insurers-container'>
      <div className='actions'>
        <Button type='primary' onClick={showInsurerAddModal}>
          Add Insurer
        </Button>
      </div>
      <NSHandler status={status}>
        {() => (
          <Table dataSource={insurers} rowKey='id'>
            <Column title='Name' dataIndex='name' />
            <Column title='Address' dataIndex='address' />
            <Column title='City' dataIndex='city' />
            <Column title='Zip Code' dataIndex='zipcode' />
          </Table>
        )}
      </NSHandler>
      {shouldShowInsurerAddModal && <InsurerAddModal onClose={closeInsurerAddModal} onAdd={refresh} />}
    </div>
  );
}

export default InsurerList;
