import React, { useEffect, useState, useMemo } from "react";
import { Table, message, Button, Space, Modal, Layout, Menu, theme } from "antd";
import { useSearchParams } from "react-router-dom";
import styles from './ProductList.module.scss';
import Header from './Header';
import Logo from '../assets/logo.png'
import CreateProductDrawer from '../create/CreateProductDrawer';
import UpdateProductDrawer from "../update/UpdateProductDrawer";
import { ProductOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { Sider, Content } = Layout;
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
    }
    catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to fetch products. Please try again later.");
    }
    finally {
      isloading(false);
    }
  };

  const handleDelete = async (productId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        isloading(true);
        try {
          const res = await fetch(`https://dummyjson.com/products/${productId}`, {
            method: "DELETE",
          });

          if (!res.ok) {
            throw new Error(`Delete failed with status ${res.status}`);
          }

          const data = await res.json();
          message.success("Product deleted successfully");

          // Remove the deleted product from local state
          setProducts((prev) => prev.filter((product) => product.id !== productId));
        } catch (error) {
          console.error("Delete error:", error);
          message.error("Failed to delete product");
        }
        finally {
          isloading(false);
        }
      }
    });
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

  const columns = useMemo(() => [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      className: styles.colorprimary
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      className: "hidden sm:table-cell"
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "200px",
      key: "price",
      render: (p) => <span className={styles.price}>${p}</span>
    },
    {
      title: "Category",
      dataIndex: "category",
      width: "160px",
      key: "category"
    },
    {
      title: "Action",
      className: "text-center",
      width: "250px",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button className="!p-0" type="link" onClick={() => {
            setEditingProduct(record);
            setEditDrawerVisible(true);
          }}><EditOutlined /><span className="hidden sm:flex">Edit</span></Button>
          <Button className="!p-0" danger type="link" onClick={() => handleDelete(record.id)}>
            <DeleteOutlined /><span className="hidden sm:flex">Delete</span>
          </Button>
        </Space>

      ),
    },
  ], []);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <Layout>
        <Sider
          className="min-h-screen"
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className={styles.logostyle}>
            <img src={Logo} alt="logo" />
            <span className="logotext font-bold text-white hidden md:flex">SHOPPING</span>
          </div>
          <Menu
            className={styles.menustyle}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <ProductOutlined />,
                label: <span className="hidden sm:flex">Products</span>,
              }
            ]}
          />
        </Sider>
        <Layout>
          {/* header component containing create btn */}
          <Header onCreate={() => setDrawerVisible(true)} />
          <CreateProductDrawer
            visible={drawerVisible}
            onClose={() => setDrawerVisible(false)} //to close the drawer on cancle
            onProductCreated={(newProduct) => {
              setProducts((prev) => [newProduct, ...prev]); // show new product in list
            }}
          />
          <Content>
            <Table
              className={styles.tablestyle}
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
              CurrentEditedProduct={editingProduct}
              onProductUpdated={handleProductUpdated}
            />
          </Content>
        </Layout>
      </Layout>
    </>

  );
};

export default ProductTable;
