import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        console.log(response?.data);
        setProducts(response?.data);
        setFilteredProducts(response?.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products/category/jewelery")
      .then((response) => {
        console.log(response?.data);
        setCategories(response?.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Filter products based on search term and category
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product?.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "" || product.category === categoryFilter)
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  // State for the modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Show the modal and set the selected product
  const handleView = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // State for the update form
  const [updateData, setUpdateData] = useState(null);

  // Handle form submission for update
  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    if (updateData) {
      console.log("Updated data:", updateData);
      const updatedProducts = products.map((product) => {
        if (product.id === updateData.id) {
          return updateData;
        }
        return product;
      });
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setUpdateData(null);
    } else {
      alert("Please fill in the update form.");
    }
  };

  // Handle delete event
  const handleDelete = (product) => {
    console.log("Deleted product:", product);
    const updatedProducts = products.filter((p) => p.id !== product.id);
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  return (
    <Container>
      {/* Search bar */}
      <Row className="mb-3">
        <Col>
          <InputGroup>
            <FormControl
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Dropdown menu for category filtration */}
      <Row className="mb-3">
        <Col>
          <DropdownButton
            id="category-filter"
            title={
              categoryFilter ? `Category: ${categoryFilter}` : "All Categories"
            }
          >
            <Dropdown.Item onClick={() => setCategoryFilter("")}>
              All Categories
            </Dropdown.Item>
            {categories?.map((category) => (
              <Dropdown.Item
                key={category.id} // Use a unique identifier from the object
                onClick={() => setCategoryFilter(category.category)} // Update with the correct property
              >
                {category.title} {/* Update with the correct property */}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
      </Row>

      {/* Product table */}
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th className="text-center">Product Id</th>
                <th className="text-center">Product Title</th>
                <th className="text-center">Product Price</th>
                <th className="text-center">Product Description</th>
                <th className="text-center">Product Category</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.map((product, index) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>{product.price}</td>
                  <td>{product.description}</td>
                  <td>{product.category}</td>
                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                        variant="primary"
                        onClick={() => handleView(product)}
                      >
                        View
                      </Button>{" "}
                      <Button
                        variant="warning"
                        onClick={() => setUpdateData(product)}
                      >
                        Update
                      </Button>{" "}
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(product)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* View product modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <p>Id: {selectedProduct.id}</p>
              <p>Product Title: {selectedProduct.title}</p>
              <p>Price: {selectedProduct.price}</p>
              <p>Description: {selectedProduct.description}</p>
              <p>Category: {selectedProduct.category}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update product form */}
      {updateData && (
        <Modal show={true} onHide={() => setUpdateData(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateSubmit}>
              <Form.Group controlId="updateTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={updateData.title}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="updatePrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={updateData.price}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, price: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="updateDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={updateData.description}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="updateCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={updateData.category}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, category: e.target.value })
                  }
                />
              </Form.Group>
              <Button className="mt-3" variant="primary" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default ProductTable;
