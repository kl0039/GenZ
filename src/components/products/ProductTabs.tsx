
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ProductTabsProps {
  product: any;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => (
  <div className="mt-12">
    <Tabs defaultValue="details">
      <TabsList className="grid w-full grid-cols-1 lg:w-auto">
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="mt-4 space-y-4">
        <div className="prose max-w-none">
          <p>{product.description}</p>
          {product.details && product.details.ingredients && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Ingredients</h3>
              <ul className="list-disc pl-5">
                {product.details.ingredients.map((ingredient: string, idx: number) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default ProductTabs;
