import React, { useEffect, useState, useMemo } from "react";
import { Table, message, Button } from "antd";
import { useSearchParams } from "react-router-dom";
import styles from './ProductList.module.scss';
import Header from './Header';
import CreateProductDrawer from '../create/CreateProductDrawer';
import UpdateProductDrawer from "../update/UpdateProductDrawer";
const ProductTable = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, isloading] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();//react router hook for url search

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
    setSearchParams({ page, pageSize });
  };
  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setEditDrawerVisible(false);
    setEditingProduct(null);
  };
  const columns = useMemo(() => [//usememo to reduce re-renders
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
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => {
          setEditingProduct(record);
          setEditDrawerVisible(true);
        }}>Edit</Button>
      ),
    },
  ], []);

  return (
    <div>
      {/* header component containing create btn */}
      <Header onCreate={() => setDrawerVisible(true)} />
      <CreateProductDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)} //to close the drawer on cancle
        onProductCreated={(newProduct) => {
          setProducts((prev) => [newProduct, ...prev]); // show new product in list
        }}
      />
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
      <UpdateProductDrawer
        visible={editDrawerVisible}
        onClose={() => {
          setEditDrawerVisible(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onProductUpdated={handleProductUpdated}
      />
    </div>

  );
};

export default ProductTable;
