import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { useSearchParams } from "react-router-dom";
import styles from './ProductList.module.scss';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, isloading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialPageSize = parseInt(searchParams.get("pageSize")) || 10;

  const [params, setParams] = useState({
    page: initialPage,
    pageSize: initialPageSize,
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
      setParams((prev) => ({ ...prev, total: data.total }));
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to fetch products. Please try again later.");
    } finally {
      isloading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [params.page, params.pageSize]);

  const handlePageChange = (page, pageSize) => {
    setParams((prev) => ({ ...prev, page, pageSize }));
    setSearchParams({ page, pageSize }); // ✅ update URL
  };

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
        onChange: handlePageChange,
      }}
    />
  );
};

export default ProductTable;
