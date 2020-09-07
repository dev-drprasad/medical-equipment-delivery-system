import "./App.less";

import { Router } from "@reach/router";
import Dashboard from "Dashboard";
import EquipmentList from "pages/EquipmentList";
import InsurerList from "pages/InsurerList ";
import Login from "pages/Login";
import NotFound from "pages/NotFound";
import OrderCreate from "pages/OrderCreate";
import OrderDetail from "pages/OrderDetail";
import OrderList from "pages/OrderList";
import PatientList from "pages/PatientList";
import PatientDetail from "pages/PatientDetail";
import PhysicianList from "pages/PhysicianList";
import TeamList from "pages/TeamList";
import UserList from "pages/UserList";
import React, { useCallback, useState } from "react";
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
          <PatientList path="/" />
          <PatientDetail path="patients/:id" />
          <InsurerList path="insurers" />
          <PhysicianList path="physicians" />
          <OrderList path="orders" />
          <OrderDetail path="orders/:id" />
          <OrderCreate path="orders/new" />
          <TeamList path="teams" />
          <UserList path="users" />
          <EquipmentList path="equipments" />
          <NotFound default />
        </ProtectedRoute>
        <NotFound default />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
