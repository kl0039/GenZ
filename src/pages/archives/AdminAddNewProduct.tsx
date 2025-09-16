import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories } from "@/services/products/productService";
import { addProduct } from "@/services/products";
import { Product } from "@/types";
import { X, Upload, Plus } from "lucide-react";
import ProductImageUploader from "@/components/products/ProductImageUploader";
import { DB_CONSTRAINTS } from "@/services/products/types";

// Define character limits based on database constraints
const TEXT_FIELD_LIMITS = {
  name: 500,
  description: 5000, // Assuming this is a text field with higher limit
};

const AdminAddNewProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [imageUrl4, setImageUrl4] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [brandInput, setBrandInput] = useState("");
  const [videoId, setVideoId] = useState("");
  const [backupUrl, setBackupUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Field validation states
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });

  // Validate name length whenever it changes
  useEffect(() => {
    if (name.length > DB_CONSTRAINTS.NAME_MAX_LENGTH) {
      setNameError(`Name must be ${DB_CONSTRAINTS.NAME_MAX_LENGTH} characters or less`);
    } else {
      setNameError("");
    }
  }, [name]);

  // Validate description length whenever it changes
  useEffect(() => {
    if (description.length > DB_CONSTRAINTS.DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(`Description must be ${DB_CONSTRAINTS.DESCRIPTION_MAX_LENGTH} characters or less`);
    } else {
      setDescriptionError("");
    }
  }, [description]);

  const handleAddBrand = () => {
    if (brandInput.trim() && !brands.includes(brandInput.trim())) {
      setBrands([...brands, brandInput.trim()]);
      setBrandInput("");
    }
  };

  const handleRemoveBrand = (brandToRemove: string) => {
    setBrands(brands.filter(brand => brand !== brandToRemove));
  };

  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (data) => {
      if (data) {
        toast.success("Product added successfully");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        navigate("/admin", { state: { from: "product-add" } });
      } else {
        toast.error("Failed to add product - received null response");
      }
    },
    onError: (error) => {
      console.error("Error adding product:", error);
      
      // Check for specific database constraint error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes("value too long for type")) {
        // Debug information to help identify the field causing the issue
        console.error("Current field lengths - name:", name.length, "description:", description.length);
        toast.error("Text too long: Please shorten the product name or description");
      } else {
        toast.error(`Failed to add product: ${errorMessage}`);
      }
      
      setIsLoading(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate field lengths before submission
    if (name.length > DB_CONSTRAINTS.NAME_MAX_LENGTH || description.length > DB_CONSTRAINTS.DESCRIPTION_MAX_LENGTH) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }
    
    if (!name || !description || !categoryId || !price || !stockQuantity || !mainImage) {
      toast.error("Please fill in all required fields and upload a main product image");
      return;
    }

    // Validate image limits
    const totalImages = [mainImage, imageUrl1, imageUrl2, imageUrl3, imageUrl4].filter(Boolean).length;
    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed (1 main + up to 4 additional)");
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stockQuantity, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a complete Product object with a temporary ID
      const productData: Product = {
        id: '', // Temporary ID that will be replaced by the database
        name,
        description,
        category_id: categoryId,
        price: priceNum,
        stock_quantity: stockNum,
        image: mainImage,
        image_url_1: imageUrl1,
        image_url_2: imageUrl2,
        image_url_3: imageUrl3,
        image_url_4: imageUrl4,
        brands: brands,
        backup_url: backupUrl || undefined,
        video_id: videoId || undefined,
        categories: [] // Will be set by the backend based on category_id
      };
      
      console.log("Submitting product data:", productData);
      addProductMutation.mutate(productData);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Failed to add product");
      setIsLoading(false);
    }
  };

  // If mutation is loading, set our local loading state as well
  useEffect(() => {
    if (addProductMutation.isPending) {
      setIsLoading(true);
    } else if (!addProductMutation.isPending) {
      setIsLoading(false);
    }
  }, [addProductMutation.isPending]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <Button variant="outline" onClick={() => navigate("/admin")}>
          Back to Admin
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Product Images Section */}
            <div>
              <Label htmlFor="productImages">Product Images (1-5)*</Label>
              <div className="mt-2">
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

            {/* Basic Information */}
            <div>
              <Label htmlFor="productName">
                Product Name * ({name.length}/{DB_CONSTRAINTS.NAME_MAX_LENGTH})
              </Label>
              <Input
                id="productName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                maxLength={DB_CONSTRAINTS.NAME_MAX_LENGTH}
                className={nameError ? "border-red-500" : ""}
                required
              />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>

            <div>
              <Label htmlFor="productDescription">
                Description * ({description.length}/{DB_CONSTRAINTS.DESCRIPTION_MAX_LENGTH})
              </Label>
              <Textarea
                id="productDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                maxLength={DB_CONSTRAINTS.DESCRIPTION_MAX_LENGTH}
                className={descriptionError ? "border-red-500" : ""}
                required
              />
              {descriptionError && <p className="text-red-500 text-sm mt-1">{descriptionError}</p>}
            </div>

            <div>
              <Label htmlFor="productCategory">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productPrice">Price (£) *</Label>
                <Input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="productStock">Stock Quantity *</Label>
                <Input
                  id="productStock"
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Additional Fields */}
            <div>
              <Label htmlFor="productBrands">Brands</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {brands.map((brand, index) => (
                  <div 
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                  >
                    <span>{brand}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBrand(brand)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  placeholder="Enter brand name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBrand();
                    }
                  }}
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleAddBrand}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="backupUrl">Backup URL (Optional)</Label>
              <Input
                id="backupUrl"
                value={backupUrl}
                onChange={(e) => setBackupUrl(e.target.value)}
                placeholder="Enter backup image URL"
              />
            </div>
            
            <div>
              <Label htmlFor="videoId">Video ID (Optional)</Label>
              <Input
                id="videoId"
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                placeholder="Enter video ID"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading || !!nameError || !!descriptionError}
              className="w-full md:w-auto"
            >
              {isLoading ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddNewProduct;
