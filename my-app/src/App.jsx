import React, { useState } from 'react';
import { ConfigProvider, Button, Switch, Layout, Typography, message } from 'antd';
import 'antd/dist/reset.css';
const { Title } = Typography;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductTable from './list/ProductList';
import './common/common-style.scss'
import styles from './App.module.scss';
function App() {
  return (
    <ConfigProvider >

      <Layout className={styles.padding20}>
        <Title level={2}>My Products</Title>
        <Router>
          <Routes>
            {/* Redirect root / to /products */}
            <Route path="/" element={<Navigate to="/products" replace />} />

            {/* Route to your product table */}
            <Route path="/products" element={<ProductTable />} />
          </Routes>
        </Router>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
