import React from "react";
import "./styles.scss";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import useBROAPI from "shared/hooks";
import { NSHandler } from "shared/components";
import moment from "moment";
import { Card } from "antd";

const axisPros = { axisLine: false, tickSize: 0, tickMargin: 8 };

const formatXAxis = (dateStr) => moment(dateStr).format("Do");

function Home() {
  const [aggregatedOrders = [], status] = useBROAPI("/api/v1/orders/aggregations/status/delivered");
  const [newPatients = [], newPatientsStatus] = useBROAPI("/api/v1/patients/aggregations/new");
  console.log("newPatients :>> ", newPatients);
  return (
    <div className="home">
      <Card title="Delivered Orders" size="small">
        <NSHandler status={status}>
          {() => (
            <ResponsiveContainer height={300}>
              <AreaChart data={aggregatedOrders}>
                <defs>
                  <linearGradient id="uvcolor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#43ddc1" stopOpacity={0.95} />
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#dddddd" />
                <Area type="monotone" dataKey="count" stroke="#43ddc1" strokeWidth={2} fill="url(#uvcolor)" />
                <Tooltip />
                <XAxis dataKey="serviceDate" {...axisPros} tickFormatter={formatXAxis} />
                <YAxis {...axisPros} width={32} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </NSHandler>
      </Card>
      <Card title="New Patients" size="small">
        <NSHandler status={newPatientsStatus}>
          {() => (
            <ResponsiveContainer height={300}>
              <AreaChart data={newPatients}>
                <defs>
                  <linearGradient id="uvcolor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#43ddc1" stopOpacity={0.95} />
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#dddddd" />
                <Area type="monotone" dataKey="count" stroke="#43ddc1" strokeWidth={2} fill="url(#uvcolor)" />
                <Tooltip />
                <XAxis dataKey="createdAt" {...axisPros} tickFormatter={formatXAxis} />
                <YAxis {...axisPros} width={32} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </NSHandler>
      </Card>
      <div></div>
    </div>
  );
}

export default Home;
