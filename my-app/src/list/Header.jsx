import React from 'react';
import { Button } from 'antd';
import styles from './Header.module.scss'; // optional for styling

const Header = ({ title = 'Product List', onCreate }) => {
  return (
    <div className={styles.headerContainer}>
      <h2 className={styles.title}>{title}</h2>
      <Button size='large' className='custom-button' type="primary" onClick={onCreate}>
        Create New Product
      </Button>
    </div>
  );
};

export default Header;
