import "./App.scss";

import { Router } from "@reach/router";
import Dashboard from "Dashboard";
import InsurerList from "pages/InsurerList ";
import Login from "pages/Login";
import OrderCreate from "pages/OrderCreate";
import OrderDetail from "pages/OrderDetail";
import OrderList from "pages/OrderList";
import PatientList from "pages/PatientList";
import PhysicianList from "pages/PhysicianList";
import TeamList from "pages/TeamList";
import UserList from "pages/UserList";
import EquipmentList from "pages/EquipmentList";
import React, { useState, useCallback } from "react";
import { ProtectedRoute } from "shared/components";
import { AuthContext } from "shared/context";

const LS_USER_KEY = "rboUser";

function getUserFromStorage() {
  let user;
  try {
    user = JSON.parse(localStorage.getItem(LS_USER_KEY)) || undefined;
  } catch (err) {
    console.err(err);
  }
  return user;
}

function App() {
  const [user, setUser] = useState(getUserFromStorage);

  const login = useCallback((user) => {
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(LS_USER_KEY);
    setUser(undefined);
  }, []);

  return (
    <AuthContext.Provider value={[user, login]}>
      <Router id="router">
        <Login path="login" />
        <ProtectedRoute user={user} component={Dashboard} logout={logout} path="/">
          <PatientList path="patients" />
          <InsurerList path="insurers" />
          <PhysicianList path="physicians" />
          <OrderList path="orders" />
          <OrderDetail path="orders/:id" />
          <OrderCreate path="orders/new" />
          <TeamList path="teams" />
          <UserList path="users" />
          <EquipmentList path="equipments" />
          {/* <JobList path="/" />
            <JobDetail path="stream/:id" />
            <JobCreate path="stream/create" />
            <SchemaList path="schema" />
            <Documentation path="docs" /> */}
          {/* <ProtectedRoute component={Notifications} path="notifications" /> */}
          {/* <ProtectedRoute
              component={SchemaRegister}
              path="generate-schema"
              adminOnly
            />
            <RillNetwork path="network" />
            <Logout path="logout" />
            <NotFound default /> */}
        </ProtectedRoute>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
