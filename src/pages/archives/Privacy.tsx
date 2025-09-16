
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-20 mt-10">
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="mb-4"><strong>Effective Date:</strong> May 5, 2025</p>

          <p className="mb-6">
            AsianFood.ai respects your privacy and is committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, and protect data when you log in using
            Facebook/Google on our platform, especially in the context of services related to our online mall experience.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-2">When you log in through social platforms, we may collect:</p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-1">Your public profile information (name, profile picture)</li>
            <li className="mb-1">Your email address (if granted permission)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-2">The information we collect is used to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Authenticate your identity</li>
            <li className="mb-1">Personalize your shopping and browsing experience</li>
            <li className="mb-1">Improve our services and user interface</li>
            <li className="mb-1">Send transactional updates related to your interactions within the AsianFood.ai mall</li>
          </ul>
          <p className="mb-6">We do <strong>not</strong> sell or share your personal data with third parties for advertising or marketing purposes.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Sharing</h2>
          <p className="mb-2">We may share your data only with:</p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-1">Service providers directly supporting AsianFood.ai (e.g., payment processors, order fulfillment)</li>
            <li className="mb-1">As required by law or legal process</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Retention and Security</h2>
          <p className="mb-6">
            Your information is stored securely and retained only for as long as needed to provide our services.
            We implement best practices to prevent unauthorized access or misuse.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          <p className="mb-6">
            You may request access to or deletion of your data by contacting us at <a href="mailto:asianfood.ai001@gmail.com" className="text-asianred-600 hover:text-asianred-700">asianfood.ai001@gmail.com</a>.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p className="mb-6">If you have any questions or concerns about this policy, please contact us at: <a href="mailto:asianfood.ai001@gmail.com" className="text-asianred-600 hover:text-asianred-700">asianfood.ai001@gmail.com</a></p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
