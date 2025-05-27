import React, { useState } from 'react';
import { ConfigProvider, Button, Switch, Layout, Typography, message } from 'antd';
import 'antd/dist/reset.css';
const { Title } = Typography;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductTable from './list/ProductList';
import './common/common-style.scss'
import styles from './App.module.scss';

const lightTheme = {
  token: {
    colorPrimary: '#646cff',
    colorBgContainer: '#ffffff',
    colorText: '#000000',
  },
};

const darkTheme = {
  token: {
    colorPrimary: '#646cff',
    colorBgContainer: '#1f1f1f',
    colorText: '#ffffff',
  },
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '20px',
          padding: '2rem',
          background: isDarkMode
            ? darkTheme.token.colorBgContainer
            : lightTheme.token.colorBgContainer,
          color: isDarkMode
            ? darkTheme.token.colorText
            : lightTheme.token.colorText,
          transition: 'all 0.3s ease',
        }}
      >
        <h2 style={{ marginBottom: '0' }}>Theme</h2>
        <Switch
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
      </div>
      <Layout className={styles.padding20}>
        <Title level={2}>Product List</Title>
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
