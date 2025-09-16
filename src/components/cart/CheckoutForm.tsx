
import React, { useState } from 'react';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CheckoutFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  isAuthenticated: boolean;
  formData: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postcode: string;
  };
  onFormDataChange: (key: string, value: string) => void;
}

// Define UK postcode validation schema using zod
const ukPostcodeSchema = z.string().refine(
  (value) => {
    // UK postcode regex pattern
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return ukPostcodeRegex.test(value.trim());
  },
  { message: "Please enter a valid UK postcode" }
);

const CheckoutForm = ({ 
  email, 
  onEmailChange, 
  isAuthenticated, 
  formData, 
  onFormDataChange 
}: CheckoutFormProps) => {
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear any previous errors for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // If it's the postcode field, validate as user types
    if (name === 'postcode' && value) {
      try {
        ukPostcodeSchema.parse(value);
      } catch (err) {
        if (err instanceof z.ZodError) {
          // Only set error if the postcode is long enough (don't show errors while user is still typing)
          if (value.length > 5) {
            setErrors(prev => ({
              ...prev,
              postcode: "Please enter a valid UK postcode"
            }));
          }
        }
      }
    }
    
    // Pass the change up to the parent component
    if (name === 'email') {
      onEmailChange(value);
    } else {
      onFormDataChange(name, value);
    }
  };

  return (
    <div id="checkout-steps" className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Checkout</h2>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-asianred-600"></span>
          <span className="w-3 h-3 rounded-full bg-gray-200"></span>
          <span className="w-3 h-3 rounded-full bg-gray-200"></span>
        </div>
      </div>

      <div id="shipping-form" className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Shipping Information (UK Only)</h3>
        
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please correct the errors in your shipping information.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input 
              type="text" 
              name="firstName"
              placeholder="First Name" 
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-asianred-600" 
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input 
              type="text" 
              name="lastName"
              placeholder="Last Name" 
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-asianred-600" 
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="md:col-span-2">
            <input 
              type="text" 
              name="address"
              placeholder="Address Line" 
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-asianred-600" 
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input 
              type="text" 
              name="city"
              placeholder="City/Town" 
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-asianred-600" 
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input 
              type="text" 
              name="postcode"
              placeholder="Postcode" 
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-asianred-600 ${errors.postcode ? 'border-red-500' : ''}`}
              value={formData.postcode}
              onChange={handleInputChange}
            />
            {errors.postcode && (
              <p className="text-red-500 text-sm mt-1">{errors.postcode}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">UK postcodes only (e.g., SW1A 1AA)</p>
          </div>
        </div>
        {!isAuthenticated && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Email Address</h4>
            <input 
              type="email" 
              name="email"
              placeholder="Email for order confirmation" 
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-asianred-600"
              value={email}
              onChange={handleInputChange} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
