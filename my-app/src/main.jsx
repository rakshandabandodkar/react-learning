import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App as AntdApp } from "antd"; // ✅ Import Ant Design's App
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AntdApp> {/* ✅ Wrap your app */}
      <App />
    </AntdApp>
  </StrictMode>,
)
