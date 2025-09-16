
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CookieConsent } from "@/components/CookieConsent";

// Import new page components
import Index from "@/pages/Index";
import Speakers from "@/pages/Speakers";
import Agenda from "@/pages/Agenda";
import Partners from "@/pages/Partners";
import Contact from "@/pages/Contact";
import Login from "@/pages/archives/Login";
import Register from "@/pages/archives/Register";
import Cart from "@/pages/archives/Cart";
import Checkout from "@/pages/archives/Checkout";
import OrderConfirmation from "@/pages/archives/OrderConfirmation";
import Orders from "@/pages/archives/Orders"; 
import ProductsPage from "@/pages/archives/ProductsPage";
import ProductDetail from "@/pages/archives/ProductDetail";
import Recipes from "@/pages/archives/Recipes";
import LiveCooking from "@/pages/archives/LiveCooking";
import CommunityForum from "@/pages/archives/CommunityForum";
import CulturalArticles from "@/pages/archives/CulturalArticles";
import BlogArticles from "@/pages/archives/BlogArticles";
import ArticleDetail from "@/pages/archives/ArticleDetail";
import AdminDashboard from "@/pages/archives/AdminDashboard";
import AdminAddProduct from "@/pages/archives/AdminAddProduct";
import AdminAddNewProduct from "@/pages/archives/AdminAddNewProduct";
import NotFound from "@/pages/archives/NotFound";
import VideoDetail from "@/pages/archives/VideoDetail";
import Privacy from "@/pages/archives/Privacy";
import TermsConditions from "@/pages/archives/TermsConditions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <CookieConsent />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Index />} />
              <Route path="/speakers" element={<Speakers />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products/:category" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/live-cooking" element={<LiveCooking />} />
              <Route path="/community" element={<CommunityForum />} />
              <Route path="/articles" element={<CulturalArticles />} />
              <Route path="/blog" element={<BlogArticles />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/video/:id" element={<VideoDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/add-product" element={<AdminAddProduct />} />
              <Route path="/admin/add-new-product" element={<AdminAddNewProduct />} />
              <Route path="/admin/edit-product/:id" element={<AdminAddProduct />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
