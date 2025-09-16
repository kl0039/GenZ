
import React from 'react';

interface DeliveryOptionsProps {
  deliveryOption: string;
  onDeliveryChange: (option: string) => void;
  isEligibleForFreeDelivery: boolean;
}

const DeliveryOptions = ({ 
  deliveryOption, 
  onDeliveryChange,
  isEligibleForFreeDelivery 
}: DeliveryOptionsProps) => {
  return (
    <div id="delivery-options" className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Delivery Options</h3>
      <div id="parcel-details" className="p-4 bg-gray-50 rounded-lg mb-4">
        <div className="flex justify-between mb-3">
          <span className="text-gray-600">Parcel Weight:</span>
          <span className="font-semibold">4.5 kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Parcel Size:</span>
          <span className="font-semibold">Medium (40x30x20 cm)</span>
        </div>
      </div>
      <div className="space-y-4">
        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-asianred-600">
          <div className="flex items-center gap-4">
            <input 
              type="radio" 
              name="delivery" 
              className="text-asianred-600" 
              value="standard"
              checked={deliveryOption === 'standard'}
              onChange={() => onDeliveryChange('standard')}
            />
            <div>
              <p className="font-semibold">Standard Delivery</p>
              <p className="text-sm text-gray-600">2-3 working days</p>
            </div>
          </div>
          <span className="font-semibold">£4.99</span>
        </label>
        <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-asianred-600">
          <div className="flex items-center gap-4">
            <input 
              type="radio" 
              name="delivery" 
              className="text-asianred-600"
              value="express"
              checked={deliveryOption === 'express'}
              onChange={() => onDeliveryChange('express')}
            />
            <div>
              <p className="font-semibold">Express Delivery</p>
              <p className="text-sm text-gray-600">Next working day</p>
            </div>
          </div>
          <span className="font-semibold">£7.99</span>
        </label>
      </div>
      {isEligibleForFreeDelivery && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 flex items-center gap-2">
            <i className="fa-solid fa-tag"></i>
            <span>You're eligible for free delivery! Order value over £60</span>
          </p>
        </div>
      )}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-700 flex items-center gap-2">
          <i className="fa-solid fa-box"></i>
          <span>Bulk order discount available! Add more items to save on delivery</span>
        </p>
      </div>
    </div>
  );
};

export default DeliveryOptions;
