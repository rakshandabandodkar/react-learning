import React, { useState } from 'react';
import { ConfigProvider, Button, Switch, Layout, Typography, message } from 'antd';
import 'antd/dist/reset.css';
const { Title } = Typography;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductTable from './list/ProductList';
import './common/common-style.scss'
import styles from './App.module.scss';
import themeJson from '../theme.json';

function App() {
  return (
    <ConfigProvider theme={{
      token: themeJson.token
    }}>
      <Layout>
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
