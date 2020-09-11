import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Card, message } from "antd";
import { SafeDatePickerPanel } from "shared/components";
import useBROAPI from "shared/hooks";
import moment from "moment";

function useUpdateAppointment(id) {
  const [payload, setPayload] = useState(undefined);
  console.log("payload :>> ", payload);
  const args = useMemo(
    () =>
      payload
        ? [`/api/v1/orders/${id}/appointment`, { method: "POST", body: JSON.stringify({ appointment: payload }) }]
        : [undefined, undefined],
    [payload, id]
  );
  const [data, status] = useBROAPI(...args);

  return [data, setPayload, status];
}

export default function OrderAppointment({ order }) {
  const [, updateAppointment, updateAppointmentStatus] = useUpdateAppointment(order?.id);
  const handleAppointmentChange = useCallback(
    (appointment) => {
      updateAppointment(appointment.format("YYYY-MM-DD"));
    },
    [updateAppointment]
  );

  useEffect(() => {
    if (updateAppointmentStatus.isSuccess) {
      message.success("Appointment date updated successfully!");
    }
    if (updateAppointmentStatus.isError) {
      message.error("Failed to update appointment date");
    }
  }, [updateAppointmentStatus]);

  return (
    <Card size="small" title="Appointment">
      <SafeDatePickerPanel
        onChange={handleAppointmentChange}
        loading={updateAppointmentStatus.isLoading}
        disabled={updateAppointmentStatus.isLoading}
        defaultValue={order.appointment ? moment(order.appointment) : undefined}
      />
    </Card>
  );
}
