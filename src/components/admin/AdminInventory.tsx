
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

// Mock data - in a real application, this would come from your database
const initialInventory = [
  { id: '1', product: 'Premium Soy Sauce', stock: 120, reorderLevel: 20, lastUpdated: '2023-09-15' },
  { id: '2', product: 'Gochujang Paste', stock: 85, reorderLevel: 15, lastUpdated: '2023-09-14' },
  { id: '3', product: 'Chinese Rice Vinegar', stock: 60, reorderLevel: 10, lastUpdated: '2023-09-10' },
  { id: '4', product: 'Thai Fish Sauce', stock: 45, reorderLevel: 10, lastUpdated: '2023-09-08' },
  { id: '5', product: 'Japanese Rice', stock: 200, reorderLevel: 30, lastUpdated: '2023-09-01' },
];

const AdminInventory = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStocks, setEditingStocks] = useState({});

  const filteredInventory = inventory.filter(item => 
    item.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockChange = (id, value) => {
    setEditingStocks({
      ...editingStocks,
      [id]: parseInt(value) || 0
    });
  };

  const updateStock = (id) => {
    setInventory(inventory.map(item => 
      item.id === id ? { 
        ...item, 
        stock: editingStocks[id],
        lastUpdated: new Date().toISOString().split('T')[0]
      } : item
    ));
    
    // Clear this item from editing state
    const newEditingStocks = {...editingStocks};
    delete newEditingStocks[id];
    setEditingStocks(newEditingStocks);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inventory Management</h2>
      </div>

      <div className="relative">
        <Input
          placeholder="Search inventory..."
          className="pl-10 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Update Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id} className={item.stock <= item.reorderLevel ? "bg-red-50" : ""}>
                <TableCell className="font-medium">{item.product}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>{item.reorderLevel}</TableCell>
                <TableCell>{item.lastUpdated}</TableCell>
                <TableCell className="flex space-x-2">
                  <Input 
                    type="number" 
                    className="w-24"
                    placeholder="New stock"
                    value={editingStocks[item.id] !== undefined ? editingStocks[item.id] : ''}
                    onChange={(e) => handleStockChange(item.id, e.target.value)}
                  />
                  <Button 
                    size="sm"
                    disabled={editingStocks[item.id] === undefined}
                    onClick={() => updateStock(item.id)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminInventory;
