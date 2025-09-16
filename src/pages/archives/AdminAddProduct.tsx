
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories } from '@/services/products/productService';
import { updateProductDetails } from '@/services/products/productMutations';
import { fetchProductById } from '@/services/products/queries/productQueries';
import { toast } from 'sonner';
import { Product, Category } from '@/types';
import ProductImageUploader from '@/components/products/ProductImageUploader';
import ProductFormFields from '@/components/admin/ProductFormFields';
import ProductCategoriesSelector from '@/components/admin/ProductCategoriesSelector';
import ProductFormActions from '@/components/admin/ProductFormActions';
import { useForm } from "react-hook-form";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AdminAddProduct = () => {
  const [mainImage, setMainImage] = useState('');
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [imageUrl3, setImageUrl3] = useState('');
  const [imageUrl4, setImageUrl4] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Convert URL parameter :id to null to prevent API calls with invalid id
  const productId = id && id !== ':id' ? id : null;

  // Initialize form with default values
  const form = useForm<Product>({
    defaultValues: {
      id: '',
      name: '',
      description: '',
      price: 0,
      image: '',
      backup_url: '',
      stock_quantity: 0,
      category_id: '',
      brands: [],
      video_id: '',
      categories: []
    }
  });
  
  const { setValue, watch, handleSubmit } = form;

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const enrichedCategoriesData: Category[] = categoriesData.map(cat => {
    if ('level' in cat) return cat as Category;
    return { ...cat, level: 0 } as Category;
  });

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productId ? fetchProductById(productId) : null,
    enabled: !!productId
  });

  const getCompleteCategories = (categories: any[]): Category[] => {
    return categories.map(cat => {
      const completeCategory = enrichedCategoriesData.find(c => c.id === cat.id);
      return completeCategory || { ...cat, level: 0 } as Category;
    });
  };

  useEffect(() => {
    if (productData) {
      // Populate form with product data
      Object.keys(productData).forEach(key => {
        if (key in form.getValues()) {
          setValue(key as keyof Product, productData[key as keyof Product]);
        }
      });

      // Set selected categories
      setPrimaryCategory(productData.category_id);
      
      if (productData.categories && productData.categories.length > 0) {
        setSelectedCategories(getCompleteCategories(productData.categories));
      } else if (productData.category_id) {
        const primaryCat = enrichedCategoriesData.find(c => c.id === productData.category_id);
        if (primaryCat) {
          setSelectedCategories([primaryCat]);
        }
      }
      
      // Set image values for the ProductImageUploader
      setMainImage(productData.image || '');
      
      // Set additional image URLs from the individual fields
      setImageUrl1(productData.image_url_1 || '');
      setImageUrl2(productData.image_url_2 || '');
      setImageUrl3(productData.image_url_3 || '');
      setImageUrl4(productData.image_url_4 || '');
      
      setIsEditing(true);
    }
  }, [productData, enrichedCategoriesData, setValue, form]);

  const onSubmit = async (data: Product) => {
    setIsLoading(true);

    try {
      // Update form data with images
      data.image = mainImage;
      data.image_url_1 = imageUrl1;
      data.image_url_2 = imageUrl2;
      data.image_url_3 = imageUrl3;
      data.image_url_4 = imageUrl4;
      
      // Apply brands as array - properly handle different types
      const brandsInput = form.getValues('brands');
      if (typeof brandsInput === 'string' && brandsInput) {
        // Fix the TypeScript error by converting to string first
        const brandsString = String(brandsInput);
        const brandsArray = brandsString.split(',').map(brand => brand.trim()).filter(Boolean);
        data.brands = brandsArray;
      } else if (Array.isArray(brandsInput)) {
        // Already an array, make sure all items are strings
        data.brands = brandsInput.map(item => String(item));
      } else {
        // Default to empty array if undefined or null
        data.brands = [];
      }
      
      // Add categories
      data.category_id = primaryCategory;
      data.categories = selectedCategories;

      // For new products, ensure we don't send an empty id string
      const idToUse = isEditing && productId ? productId : '';
      
      // Log the data being sent
      console.log('Submitting product data:', { 
        ...data, 
        id: idToUse
      });

      // Call API to save product
      await updateProductDetails(idToUse, data);
      
      toast.success(isEditing ? 'Product updated successfully' : 'Product added successfully');
      navigate('/admin', { 
        state: { from: isEditing ? 'product-edit' : 'product-add' } 
      });
      
    } catch (error) {
      toast.error('Failed to save product');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while product data is being fetched
  if (productId && productLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-48">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p>Loading product data...</p>
        </div>
      </div>
    );
  }

  // Show error message if on edit route with invalid ID
  if (id === ':id') {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold">Invalid Product ID</h2>
          <p>The product ID is invalid. Please select a product from the admin dashboard.</p>
          <Button 
            className="mt-2" 
            onClick={() => navigate('/admin')}
          >
            Return to Admin Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <div className="md:col-span-1 space-y-6">
            <ProductFormFields 
              form={form} 
            />

            <ProductCategoriesSelector
              primaryCategory={primaryCategory}
              setPrimaryCategory={setPrimaryCategory}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              categories={enrichedCategoriesData}
            />
          </div>

          {/* Right Column - Image Uploader */}
          <div className="md:col-span-1 space-y-6">
            <div>
              <Label>Product Images</Label>
              <ProductImageUploader
                mainImage={mainImage}
                imageUrl1={imageUrl1}
                imageUrl2={imageUrl2}
                imageUrl3={imageUrl3}
                imageUrl4={imageUrl4}
                onMainImageChange={setMainImage}
                onImageUrl1Change={setImageUrl1}
                onImageUrl2Change={setImageUrl2}
                onImageUrl3Change={setImageUrl3}
                onImageUrl4Change={setImageUrl4}
                maxImages={5}
              />
            </div>
          </div>
        </div>

        <ProductFormActions
          isEditing={isEditing}
          isLoading={isLoading}
          onCancel={() => navigate('/admin')}
        />
      </form>
    </div>
  );
};

export default AdminAddProduct;
