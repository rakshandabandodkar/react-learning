import React, { useState, useEffect } from "react";
import {
    Drawer,
    Form,
    Input,
    InputNumber,
    Button,
    Space,
    Modal,
    message,
    Select,
} from "antd";
const { Option } = Select;

const UpdateProductDrawer = ({ visible, onClose, CurrentEditedProduct, onProductUpdated }) => {
    const [form] = Form.useForm();
    const [loading, isloading] = useState(false);
    const [categories, setCategories] = useState([]);

    const handleClose = () => {
        const currentValues = form.getFieldsValue();
        const originalValues = {
            title: CurrentEditedProduct?.title,
            price: CurrentEditedProduct?.price,
            brand: CurrentEditedProduct?.brand,
            category: CurrentEditedProduct?.category
        };

        const hasChanged = Object.keys(originalValues).some((key) => {
            return currentValues[key] !== originalValues[key];
        });

        if (hasChanged) {
            Modal.confirm({
                title: "Discard Changes?",
                content: "You have unsaved changes. Are you sure you want to close?",
                okText: "Yes",
                cancelText: "No",
                onOk: () => {
                    form.resetFields();
                    onClose();
                },
            });
        } else {
            onClose();
        }
    };


    const handleSave = async () => {
        try {//try block to handle the product creation 
            const values = await form.validateFields();
            isloading(true);//loading state when api call is made
            const res = await fetch(`https://dummyjson.com/products/${CurrentEditedProduct.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                throw new Error(`Failed with status ${res.status}`);
            }

            const data = await res.json();
            message.success("Product updated successfully!");//message to show when product is updated 
            form.resetFields();
            onClose();
            onProductUpdated(data); // pass updated product to parent
        }
        catch (error) {
            console.error("Error creating product:", error);
            message.error("Failed to update product");
        }
        finally {
            isloading(false);
        }
    };

    useEffect(() => {
        if (CurrentEditedProduct) {
            form.setFieldsValue(CurrentEditedProduct);
        }
    }, [CurrentEditedProduct, form]);

    useEffect(() => {
        // Fetch categories when drawer opens
        if (visible) {
            fetch('https://dummyjson.com/products/category-list')
                .then((res) => res.json())
                .then((data) => setCategories(data))
                .catch(() => message.error("Failed to fetch categories"));
        }
    }, [visible]);

    return (
        <Drawer
            title="Update Product"
            open={visible}
            width={600}
            className="custom-drawer"
            onClose={handleClose}
            footer={
                <div className="drawer-footer">
                    <Space>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="primary" onClick={handleSave} loading={loading}>
                            Save
                        </Button>
                    </Space>
                </div>
            }
        >
            <Form
                layout="vertical"
                form={form}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Please enter a title" }]}
                >
                    <Input placeholder="Product title" />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: "Please enter price" }]}
                >
                    <InputNumber
                        min={1}
                        style={{ width: "100%" }}
                        placeholder="Product price"
                    />
                </Form.Item>

                <Form.Item
                    label="Brand"
                    name="brand"
                    rules={[{ required: true, message: "Please enter brand" }]}
                >
                    <Input placeholder="Product brand" />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: "Please select category" }]}
                >
                    <Select placeholder="Select a category">
                        {categories.map((cat) => (
                            <Option key={cat} value={cat}>
                                {/* to make the first letter capital inside list*/}
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default UpdateProductDrawer;
