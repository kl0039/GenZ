
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchAllProducts, deleteProduct } from '@/services/products/productService';
import { toast } from 'sonner';
import { Product, Category } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge"

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts
  });

  const filteredProducts = products ? products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully");
        refetch(); // Refresh the product list
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button onClick={() => navigate('/admin/product/add')} className="flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <div className="relative">
        <Input
          placeholder="Search products..."
          className="pl-10 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const primaryCategory = product.categories?.[0];
                const categoryName = typeof primaryCategory === 'string' ? primaryCategory : primaryCategory?.name || 'N/A';
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {categoryName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>£{product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>
                      <Badge variant={product.availability === 'Y' ? 'default' : 'secondary'}>
                        {product.availability === 'Y' ? 'Available' : 'Unavailable'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/admin/product/edit/${product.id}`)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProducts;
