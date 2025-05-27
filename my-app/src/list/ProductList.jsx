import React, { useEffect, useState, useRef } from "react";
import { Table, message } from "antd";
import styles from './ProductList.module.scss';

const ProductTable = () => {

  const [products, setProducts] = useState([]);
  const [loading, isloading] = useState(false);

  const [params, setParams] = useState({
    page: parseInt(localStorage.getItem("page")) || 1,
    pageSize: parseInt(localStorage.getItem("pageSize")) || 10,
    total: 0,
  });

  const fetchProducts = async () => {
    const { page, pageSize } = params;
    isloading(true);

    try {
      const skip = (page - 1) * pageSize;
      const res = await fetch(`https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`);

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }

      const data = await res.json();
      setProducts(data.products);
      setParams(prev => ({ ...prev, total: data.total }));
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to fetch products. Please try again later.");
    } finally {
      isloading(false);
    }
  };
  const renderCount = useRef(1);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`ProductTable rendered ${renderCount.current} times`);
  });
  useEffect(() => {
    fetchProducts();
  }, [params.page, params.pageSize]);

  useEffect(() => {
    localStorage.setItem("page", params.page);
    localStorage.setItem("pageSize", params.pageSize);
  }, [params.page, params.pageSize]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title", className: styles.colorprimary },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (p) => <span className={styles.price}>${p}</span>
    },
    { title: "Category", dataIndex: "category", key: "category" },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      loading={loading}
      pagination={{
        current: params.page,
        pageSize: params.pageSize,
        total: params.total,
        showSizeChanger: true,
        onChange: (page, pageSize) =>
          setParams(prev => ({ ...prev, page, pageSize })),
      }}
    />
  );
};

export default ProductTable;
