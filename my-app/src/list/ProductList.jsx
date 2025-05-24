import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { render } from "less";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (page, size) => {
    setLoading(true);
    const skip = (page - 1) * pageSize;
    const res = await fetch(`https://dummyjson.com/products?limit=${size}&skip=${skip}`);
    const data = await res.json();
    setProducts(data.products);
    setTotal(data.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(page, pageSize);
  }, [page, pageSize]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title", className: 'color-primary' },
    { title: "Brand", dataIndex: "brand", key: "brand"},
    { title: "Price", dataIndex: "price", key: "price", render: (p) => `$${p}`},
    { title: "Category", dataIndex: "category", key: "category" },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: (p, size) => {
          setPage(p);
          setPageSize(size); // ⬅️ update state with selected page size
        },      
      }}
      loading={loading}
    />
  );
};

export default ProductTable;
