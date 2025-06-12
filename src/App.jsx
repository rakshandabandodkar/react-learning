import React, { useState } from 'react';
import { ConfigProvider, Button, Switch, Layout, Typography, message } from 'antd';
import 'antd/dist/reset.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductTable from './list/ProductList';
import './common/common-style.scss'
import styles from './App.module.scss';
import themeJson from '../theme.json';

function App() {
  return (
    <BrowserRouter basename="/react-learning">
      <ConfigProvider theme={{
        token: themeJson.token
      }}>
        <Layout>
          <Routes>
            {/* Redirect root / to /products */}
            <Route path="/" element={<Navigate to="/products" replace />} />

            {/* Route to your product table */}
            <Route path="/products" element={<ProductTable />} />
          </Routes>
        </Layout>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;