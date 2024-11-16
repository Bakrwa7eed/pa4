import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toast } from "lucide-react";

// API Service
const BASE_URL = 'http://localhost:3000';
const api = {
  async fetchProducts() {
    const res = await fetch(`${BASE_URL}/products`);
    return res.json();
  },
  async createProduct(product) {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.json();
  },
  async updateProduct(id, product) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.json();
  },
  async deleteProduct(id) {
    await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
  }
};

// Components
const NavBar = () => (
  <div className="bg-slate-800 p-4 mb-8">
    <nav className="container mx-auto flex gap-4 text-white">
      <Link to="/" className="hover:text-slate-300">Home</Link>
      <Link to="/products" className="hover:text-slate-300">Products</Link>
      <Link to="/cart" className="hover:text-slate-300">Cart</Link>
    </nav>
  </div>
);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <div className="text-center">Loading products...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="shadow-lg">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600">Price: ${product.price}</p>
            <p className="text-gray-600">Quantity: {product.quantity}</p>
            <Button 
              className="mt-4 w-full"
              onClick={() => alert('Added to cart')}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ProductForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    id: initialData.id || '',
    name: initialData.name || '',
    price: initialData.price || '',
    quantity: initialData.quantity || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">ID</label>
        <Input
          type="text"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Price</label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Quantity</label>
        <Input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {initialData.id ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
};

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await api.fetchProducts();
    setProducts(data);
  };

  const handleCreate = async (formData) => {
    await api.createProduct(formData);
    loadProducts();
  };

  const handleUpdate = async (formData) => {
    await api.updateProduct(formData.id, formData);
    loadProducts();
    setSelectedProduct(null);
  };

  const handleDelete = async (id) => {
    await api.deleteProduct(id);
    loadProducts();
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {selectedProduct ? 'Edit Product' : 'Create New Product'}
          </h2>
          <ProductForm
            onSubmit={selectedProduct ? handleUpdate : handleCreate}
            initialData={selectedProduct}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Product List</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Pages
const HomePage = () => (
  <div className="container mx-auto px-4">
    <h1 className="text-3xl font-bold mb-8">Welcome to Our Shop</h1>
    <ProductList />
  </div>
);

const ProductsPage = () => (
  <div className="container mx-auto px-4">
    <h1 className="text-3xl font-bold mb-8">Product Management</h1>
    <AdminPanel />
  </div>
);

const CartPage = () => (
  <div className="container mx-auto px-4">
    <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Your cart is empty</p>
      </CardContent>
    </Card>
  </div>
);

// Main App
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;