import React from "react";
import { Switch, Route } from "react-router-dom";

import HomePage from "../pages/ProductListPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProductListPage from "../pages/ProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage";

export default function Main() {
  return (
    <Switch>
      <Route exact path="/" component={ProductListPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />

      <Route exact path="/products" component={ProductListPage} />
      <Route exact path="/products/:productId" component={ProductDetailPage} />
    </Switch>
  );
}
