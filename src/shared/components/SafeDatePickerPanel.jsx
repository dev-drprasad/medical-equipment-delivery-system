import React, { useState } from "react";
import { Popconfirm } from "antd";
import { DatePickerPanel } from "shared/components";

export default function SafeDatePickerPanel({ onChange, defaultValue, ...rest }) {
  const [[newDate, confirmed], setNewDate] = useState([undefined, true]);
  const handleChange = (d) => setNewDate([d, false]);
  const handleConfirm = () => {
    onChange(newDate);
    setNewDate(([d]) => [d, true]);
  };
  const handleCancel = () => setNewDate([undefined, true]);

  return (
    <Popconfirm
      title={`Reschedule to ${newDate?.format("Do") || "..."} ?`}
      cancelText="My bad"
      okText="Yes"
      placement="left"
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      visible={!confirmed}
    >
      <DatePickerPanel value={newDate || defaultValue} defaultValue={defaultValue} onChange={handleChange} {...rest} />
    </Popconfirm>
  );
}
