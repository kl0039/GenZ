
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-20 mt-10">
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6 text-asianred-600">Asianfood.ai Terms and Conditions</h1>

          <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <h2 className="text-xl font-semibold mb-3 text-yellow-800">Disclaimer (Please read before making your purchase)</h2>
            <p className="mb-4 text-yellow-700">
              The information provided on the Asianfood.ai website is for general informational purposes only and is not intended as professional or dietary advice. You should seek professional guidance before relying on any content on the Site. While we make every effort to ensure the information is accurate and up-to-date, we make no guarantees, representations, or warranties (express or implied) as to its completeness or accuracy. This disclaimer does not apply to Asianfood.ai's responsibilities regarding goods sold via the online store.
            </p>
            <p className="mb-4 text-yellow-700">
              Product details, including images and descriptions, are intended to enhance your shopping experience but may not always reflect the most current packaging or formulation. Always refer to the physical product for the most accurate and up-to-date information. Product packaging and ingredient lists are subject to change by manufacturers.
            </p>
            <p className="mb-4 text-yellow-700">
              If specific delivery instructions are needed, please include them during checkout or email us at <a href="mailto:info@asianfood.ai" className="text-asianred-600 hover:text-asianred-700 underline">info@asianfood.ai</a>. These instructions will be passed to our courier partners. Delivery services are provided by third-party couriers, and we are not liable for service-related issues beyond our control.
            </p>
            <p className="text-yellow-700">
              This policy is in addition to your statutory rights.
            </p>
          </div>

          <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400">
            <h2 className="text-xl font-semibold mb-3 text-blue-800">Orders for Delivery Outside the UK</h2>
            <p className="text-blue-700">
              Different Terms and Conditions apply for international orders. The terms on this page apply only to UK orders (United Kingdom includes England, Scotland, Wales, and Northern Ireland).
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contents</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li><a href="#use-website" className="text-asianred-600 hover:text-asianred-700">Use of the Asianfood.ai Website</a></li>
              <li><a href="#becoming-customer" className="text-asianred-600 hover:text-asianred-700">Becoming a Customer</a></li>
              <li><a href="#contract" className="text-asianred-600 hover:text-asianred-700">Your Contract with Us</a></li>
              <li><a href="#price-payment" className="text-asianred-600 hover:text-asianred-700">Price and Payment</a></li>
              <li><a href="#delivery" className="text-asianred-600 hover:text-asianred-700">Delivery</a></li>
              <li><a href="#cancelling" className="text-asianred-600 hover:text-asianred-700">Cancelling Your Order</a></li>
              <li><a href="#returns" className="text-asianred-600 hover:text-asianred-700">Returns After Delivery</a></li>
              <li><a href="#refunds" className="text-asianred-600 hover:text-asianred-700">Refunds</a></li>
              <li><a href="#general" className="text-asianred-600 hover:text-asianred-700">General Provisions</a></li>
              <li><a href="#product-info" className="text-asianred-600 hover:text-asianred-700">Using Product Information</a></li>
              <li><a href="#contact" className="text-asianred-600 hover:text-asianred-700">Contacting Us</a></li>
            </ol>
          </div>

          <hr className="my-8" />

          <section id="use-website" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Use of the Asianfood.ai Website</h2>
            
            <h3 className="text-lg font-semibold mb-2">1.1 Use</h3>
            <p className="mb-4">
              Asianfood.ai is provided for your personal use subject to these Terms. By accessing or using our website, you agree to be bound by these Terms.
            </p>

            <h3 className="text-lg font-semibold mb-2">1.2 Accuracy of Content</h3>
            <p className="mb-4">
              We reserve the right to update content or product information at any time without notice. While we strive to ensure accuracy, we do not warrant that the information is error-free.
            </p>

            <h3 className="text-lg font-semibold mb-2">1.3 Maintenance</h3>
            <p className="mb-4">
              We may perform maintenance occasionally, which could result in temporary downtime.
            </p>

            <h3 className="text-lg font-semibold mb-2">1.4 Data Ownership</h3>
            <p className="mb-4">
              All data (including wish lists or cart contents) you submit or we generate is the intellectual property of Asianfood.ai and may not be used without our written permission.
            </p>

            <h3 className="text-lg font-semibold mb-2">1.5 Privacy Policy</h3>
            <p className="mb-4">
              All data collection and use are governed by our Privacy Policy.
            </p>
          </section>

          <section id="becoming-customer" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Becoming a Customer</h2>
            
            <h3 className="text-lg font-semibold mb-2">2.1 Registration</h3>
            <p className="mb-4">
              You must be over 18 and provide accurate personal and payment details. You may register or check out as a guest.
            </p>

            <h3 className="text-lg font-semibold mb-2">2.2 Login Details</h3>
            <p className="mb-4">
              Keep your username and password secure. You are responsible for any activity under your account.
            </p>

            <h3 className="text-lg font-semibold mb-2">2.3 Right to Refuse Service</h3>
            <p className="mb-4">
              We may decline or suspend accounts and orders at our sole discretion.
            </p>
          </section>

          <section id="contract" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Your Contract with Us</h2>
            
            <h3 className="text-lg font-semibold mb-2">3.1 Order Acknowledgment</h3>
            <p className="mb-4">
              You will receive an acknowledgment email upon placing an order. This does not constitute acceptance.
            </p>

            <h3 className="text-lg font-semibold mb-2">3.2 Contract Formation</h3>
            <p className="mb-4">
              A legally binding contract is formed when we confirm dispatch. All contracts are governed by the laws of England.
            </p>

            <h3 className="text-lg font-semibold mb-2">3.3 Availability</h3>
            <p className="mb-4">
              Out-of-stock items will be clearly marked. We may limit quantities per order and reserve the right to discontinue items.
            </p>
          </section>

          <section id="price-payment" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Price and Payment</h2>
            
            <h3 className="text-lg font-semibold mb-2">4.1 Pricing Errors</h3>
            <p className="mb-4">
              In the event of pricing errors, we will contact you within 7 days. You may accept the revised price, cancel part, or cancel the entire order. Lack of response within 2 days will result in cancellation of affected items.
            </p>

            <h3 className="text-lg font-semibold mb-2">4.2 VAT</h3>
            <p className="mb-4">
              All prices include VAT (where applicable). Delivery charges are additional and detailed on our Delivery Info page.
            </p>

            <h3 className="text-lg font-semibold mb-2">4.3 Payment Methods</h3>
            <p className="mb-4">
              We accept UK-based credit/debit cards and PayPal. All payments must be made in GBP (£).
            </p>

            <h3 className="text-lg font-semibold mb-2">4.4 Timing</h3>
            <p className="mb-4">
              Your payment will be taken at the time of order submission, not contract formation.
            </p>
          </section>

          <section id="delivery" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Delivery</h2>
            
            <h3 className="text-lg font-semibold mb-2">5.1 Charges</h3>
            <p className="mb-4">
              Delivery fees vary by order size, weight, and location. See our Delivery Info for full details.
            </p>

            <h3 className="text-lg font-semibold mb-2">5.2 Delivery Estimates</h3>
            <p className="mb-4">
              Delivery times are estimates and may vary, especially for remote areas or bulky items.
            </p>

            <h3 className="text-lg font-semibold mb-2">5.3 Signature on Delivery</h3>
            <p className="mb-4">
              Some items may require a signature. We may deliver to another adult at your address if you're unavailable. We are not responsible for perishable items left unattended or delayed due to missed delivery.
            </p>

            <h3 className="text-lg font-semibold mb-2">5.4 Special Instructions</h3>
            <p className="mb-4">
              Instructions to leave parcels in a specific location (e.g., with a neighbour) are passed to couriers, but Asianfood.ai is not liable for loss or damage if this option is used.
            </p>

            <h3 className="text-lg font-semibold mb-2">5.5 Large Items</h3>
            <p className="mb-4">
              Ensure access before ordering bulky goods. Do not schedule installations or services until your order has arrived.
            </p>

            <h3 className="text-lg font-semibold mb-2">5.6 Alcohol Sales</h3>
            <p className="mb-4">
              By purchasing alcohol, you confirm you are over 18. Couriers may request ID and can refuse delivery if age verification fails.
            </p>
          </section>

          <section id="cancelling" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cancelling Your Order</h2>
            <p className="mb-4">
              To cancel before dispatch, contact us at <a href="mailto:info@asianfood.ai" className="text-asianred-600 hover:text-asianred-700 underline">info@asianfood.ai</a> or via our customer service form. Orders not yet dispatched will be refunded in full. If dispatched, you must return the items at your expense within 30 days. We will deduct the original delivery charge from your refund.
            </p>
          </section>

          <section id="returns" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Returns After Delivery</h2>
            
            <h3 className="text-lg font-semibold mb-2">7.1 Change of Mind</h3>
            <p className="mb-4">
              You may return items within 15 calendar days of delivery. Full details are outlined in our Return & Refund Policy.
            </p>

            <h3 className="text-lg font-semibold mb-2">7.2 Exceptions</h3>
            <p className="mb-4">
              Perishable, chilled/frozen, opened, or hygiene-sensitive items cannot be returned unless faulty.
            </p>

            <h3 className="text-lg font-semibold mb-2">7.3 Return Costs</h3>
            <p className="mb-4">
              You are responsible for return shipping unless the item is faulty or misdescribed.
            </p>

            <h3 className="text-lg font-semibold mb-2">7.4 Faulty or Damaged Goods</h3>
            <p className="mb-4">
              Report faulty or missing items within 3 calendar days of delivery for a refund, replacement, or repair. Claims after 3 days may not be accepted.
            </p>

            <h3 className="text-lg font-semibold mb-2">7.5 How to Return</h3>
            <p className="mb-4">
              Returns must include your delivery note. Post items to:<br />
              <strong>Asianfood.ai Returns Department</strong><br />
              [Insert Return Address Here]<br />
              We recommend obtaining proof of postage.
            </p>
          </section>

          <section id="refunds" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Refunds</h2>
            
            <h3 className="text-lg font-semibold mb-2">8.1 Method</h3>
            <p className="mb-4">
              Refunds are issued to the original payment method. Alipay refunds may incur a 5% admin fee for cancellations prior to dispatch.
            </p>

            <h3 className="text-lg font-semibold mb-2">8.2 Timeframe</h3>
            <p className="mb-4">
              Refunds are processed within 15 calendar days after receipt of returned items. Your bank may require additional time.
            </p>

            <h3 className="text-lg font-semibold mb-2">8.3 Return Costs</h3>
            <p className="mb-4">
              We do not reimburse return shipping unless the product was faulty or incorrectly supplied.
            </p>
          </section>

          <section id="general" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. General Provisions</h2>
            
            <h3 className="text-lg font-semibold mb-2">9.1 Entire Agreement</h3>
            <p className="mb-4">
              These Terms constitute the full agreement between you and Asianfood.ai.
            </p>

            <h3 className="text-lg font-semibold mb-2">9.2 Non-Waiver</h3>
            <p className="mb-4">
              Our failure to enforce a provision does not waive future enforcement rights.
            </p>

            <h3 className="text-lg font-semibold mb-2">9.3 Our Liability</h3>
            <p className="mb-4">
              We are only liable for foreseeable losses arising directly from a breach of these Terms.
            </p>

            <h3 className="text-lg font-semibold mb-2">9.4 Liability Cap</h3>
            <p className="mb-4">
              Our liability is limited to the value of your order.
            </p>

            <h3 className="text-lg font-semibold mb-2">9.5 Assignment</h3>
            <p className="mb-4">
              You may not transfer your rights. We may assign ours if it doesn't affect your rights.
            </p>

            <h3 className="text-lg font-semibold mb-2">9.6 Amendments</h3>
            <p className="mb-4">
              We may update these Terms without notice. The version at the time of your order applies.
            </p>

            <h3 className="text-lg font-semibold mb-2">9.7 Governing Law</h3>
            <p className="mb-4">
              These Terms are governed by English law. Disputes will be handled in English courts.
            </p>
          </section>

          <section id="product-info" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Using Product Information</h2>
            <p className="mb-4">
              Ingredients and images on our website are for reference only and may change without notice. Always refer to the product packaging. Contact <a href="mailto:info@asianfood.ai" className="text-asianred-600 hover:text-asianred-700 underline">info@asianfood.ai</a> if you need confirmation before purchase.
            </p>
            <p className="mb-4">
              All images and content are owned by Asianfood.ai and must not be used without permission.
            </p>
          </section>

          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contacting Us</h2>
            <p className="mb-4">
              For any questions, please contact:
            </p>
            <p className="mb-2">
              <strong>Customer Service – Asianfood.ai</strong>
            </p>
            <p>
              Email: <a href="mailto:info@asianfood.ai" className="text-asianred-600 hover:text-asianred-700 underline">info@asianfood.ai</a>
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsConditions;
