import React, { useState } from 'react';
import { ConfigProvider, Button, Switch } from 'antd';
import 'antd/dist/reset.css';

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
          padding: '2rem',
          minHeight: '100vh',
          background: isDarkMode
            ? darkTheme.token.colorBgContainer
            : lightTheme.token.colorBgContainer,
          color: isDarkMode
            ? darkTheme.token.colorText
            : lightTheme.token.colorText,
          transition: 'all 0.3s ease',
        }}
      >
        <h1>Ant Design v5 Theme Switcher</h1>
        <Switch
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)}
          checkedChildren="Dark"
          unCheckedChildren="Light"
          style={{ marginBottom: '1rem' }}
        />
        <br />
        <Button type="primary">Primary Button</Button>
      </div>
    </ConfigProvider>
  );
}

export default App;
