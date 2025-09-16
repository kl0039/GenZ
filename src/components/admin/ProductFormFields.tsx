
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/types';
import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";

interface ProductFormFieldsProps {
  form: UseFormReturn<Product>;
}

const ProductFormFields: React.FC<ProductFormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="min-h-[120px]" 
                required 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  {...field}
                  value={field.value === 0 ? '' : field.value}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  required 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  {...field}
                  value={field.value === 0 ? '' : field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  required 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="brands"
        render={({ field }) => {
          // Handle the value properly for rendering
          let displayValue = '';
          if (Array.isArray(field.value)) {
            displayValue = field.value.join(', ');
          } else if (field.value) {
            displayValue = String(field.value);
          }
          
          return (
            <FormItem>
              <FormLabel>Brands</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter brands separated by commas" 
                  value={displayValue}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Enter brands separated by commas (e.g., "Brand1, Brand2")
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="backup_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Backup URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Optional backup image URL" />
            </FormControl>
            <FormDescription>
              An alternate image URL if the main image fails to load
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="video_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video ID</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Optional related video ID" />
            </FormControl>
            <FormDescription>
              ID of a related video for this product
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProductFormFields;
