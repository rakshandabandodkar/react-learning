import React from 'react';
import { Button } from 'antd';
import styles from './Header.module.scss'; // optional for styling
import { PlusOutlined } from '@ant-design/icons';

const Header = ({ title = 'Product List', onCreate }) => {
  return (
    <div className={styles.headerContainer}>
      <h2 className={styles.title}>{title}</h2>
      <Button type="primary" onClick={onCreate}>
        <PlusOutlined />Add Product
      </Button>
    </div>
  );
};

export default Header;
