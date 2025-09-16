
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Edit, Plus, Save, Trash2 } from 'lucide-react';

// Mock data - in a real application, this would come from your database
const initialDeliveryOptions = [
  { id: '1', name: 'Standard Delivery', cost: 3.99, freeThreshold: 35, estimatedDays: '3-5', active: true },
  { id: '2', name: 'Express Delivery', cost: 5.99, freeThreshold: 50, estimatedDays: '1-2', active: true },
  { id: '3', name: 'Next Day Delivery', cost: 7.99, freeThreshold: null, estimatedDays: '1', active: true },
  { id: '4', name: 'Click & Collect', cost: 0, freeThreshold: 0, estimatedDays: '1-3', active: true },
];

const AdminDelivery = () => {
  const [deliveryOptions, setDeliveryOptions] = useState(initialDeliveryOptions);
  const [editingOption, setEditingOption] = useState(null);
  const [newOption, setNewOption] = useState({
    name: '',
    cost: 0,
    freeThreshold: null,
    estimatedDays: '',
    active: true
  });
  const [showNewForm, setShowNewForm] = useState(false);

  const handleEditClick = (option) => {
    setEditingOption(option.id);
  };

  const handleSaveEdit = (id) => {
    // Save changes and exit edit mode
    setEditingOption(null);
  };

  const handleInputChange = (id, field, value) => {
    setDeliveryOptions(deliveryOptions.map(option => 
      option.id === id ? { ...option, [field]: value } : option
    ));
  };

  const handleNewInputChange = (field, value) => {
    setNewOption({ ...newOption, [field]: value });
  };

  const handleAddOption = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setDeliveryOptions([...deliveryOptions, { ...newOption, id }]);
    setNewOption({
      name: '',
      cost: 0,
      freeThreshold: null,
      estimatedDays: '',
      active: true
    });
    setShowNewForm(false);
  };

  const handleDeleteOption = (id) => {
    setDeliveryOptions(deliveryOptions.filter(option => option.id !== id));
  };

  const handleToggleActive = (id) => {
    setDeliveryOptions(deliveryOptions.map(option => 
      option.id === id ? { ...option, active: !option.active } : option
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Delivery Settings</h2>
        
        {!showNewForm && (
          <Button onClick={() => setShowNewForm(true)} className="flex items-center gap-2">
            <Plus size={16} /> Add Delivery Option
          </Button>
        )}
      </div>

      {showNewForm && (
        <div className="p-4 border rounded-lg mb-6">
          <h3 className="font-semibold mb-4">New Delivery Option</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Name</Label>
              <Input 
                id="new-name" 
                value={newOption.name}
                onChange={(e) => handleNewInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-cost">Cost (£)</Label>
              <Input 
                id="new-cost" 
                type="number"
                step="0.01" 
                value={newOption.cost}
                onChange={(e) => handleNewInputChange('cost', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-threshold">Free Shipping Threshold (£)</Label>
              <Input 
                id="new-threshold" 
                type="number"
                step="0.01"
                value={newOption.freeThreshold === null ? '' : newOption.freeThreshold}
                onChange={(e) => handleNewInputChange('freeThreshold', e.target.value === '' ? null : parseFloat(e.target.value))}
                placeholder="Leave empty if no free shipping"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-days">Estimated Delivery (days)</Label>
              <Input 
                id="new-days" 
                value={newOption.estimatedDays}
                onChange={(e) => handleNewInputChange('estimatedDays', e.target.value)}
                placeholder="e.g. 1-2 or 3-5"
              />
            </div>
          </div>
          
          <div className="flex gap-2 items-center mb-4">
            <Checkbox 
              id="new-active"
              checked={newOption.active}
              onCheckedChange={(checked) => handleNewInputChange('active', checked)}
            />
            <Label htmlFor="new-active">Active</Label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNewForm(false)}>Cancel</Button>
            <Button onClick={handleAddOption}>Add Option</Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Free Threshold</TableHead>
              <TableHead>Est. Days</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveryOptions.map((option) => (
              <TableRow key={option.id}>
                <TableCell>
                  {editingOption === option.id ? (
                    <Input 
                      value={option.name} 
                      onChange={(e) => handleInputChange(option.id, 'name', e.target.value)}
                    />
                  ) : (
                    option.name
                  )}
                </TableCell>
                <TableCell>
                  {editingOption === option.id ? (
                    <Input 
                      type="number" 
                      step="0.01"
                      value={option.cost} 
                      onChange={(e) => handleInputChange(option.id, 'cost', parseFloat(e.target.value))}
                      className="w-20"
                    />
                  ) : (
                    `£${option.cost.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {editingOption === option.id ? (
                    <Input 
                      type="number" 
                      step="0.01"
                      value={option.freeThreshold === null ? '' : option.freeThreshold} 
                      onChange={(e) => handleInputChange(option.id, 'freeThreshold', e.target.value === '' ? null : parseFloat(e.target.value))}
                      placeholder="None"
                      className="w-24"
                    />
                  ) : (
                    option.freeThreshold === null ? 'None' : `£${option.freeThreshold.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {editingOption === option.id ? (
                    <Input 
                      value={option.estimatedDays} 
                      onChange={(e) => handleInputChange(option.id, 'estimatedDays', e.target.value)}
                      className="w-20"
                    />
                  ) : (
                    option.estimatedDays + ' days'
                  )}
                </TableCell>
                <TableCell>
                  <Checkbox 
                    checked={option.active}
                    onCheckedChange={() => handleToggleActive(option.id)}
                  />
                </TableCell>
                <TableCell className="flex space-x-2">
                  {editingOption === option.id ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSaveEdit(option.id)}
                    >
                      <Save size={16} />
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(option)}
                    >
                      <Edit size={16} />
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteOption(option.id)}
                  >
                    <Trash2 size={16} />
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

export default AdminDelivery;
