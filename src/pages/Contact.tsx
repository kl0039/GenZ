import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Share2, Linkedin, Twitter, Instagram } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    inquiryType: '',
    message: ''
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      inquiryType: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          inquiryType: formData.inquiryType,
          message: formData.message,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        inquiryType: '',
        message: ''
      });
    } catch (err: any) {
      console.error("Contact form send error:", err);
      toast({
        title: "Unable to send message",
        description: err?.message ?? "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const teamMembers = [
    {
      name: "Frankie Lai",
      role: "Head of Partnerships Development",
      email: "ka.lai@surrey.ac.uk",
      image: "/lovable-uploads/e595e5d3-bcf9-4d43-83f9-97ceb75d3a40.png?v=" + Date.now(),
      borderColor: "border-blue-500"
    },
    {
      name: "Mabela Budila",
      role: "Business Development Manager",
      email: "m.budila@surrey.ac.uk",
      image: "/lovable-uploads/70c4adba-459c-4350-bd08-40a12c81bac1.png?v=" + Date.now(),
      borderColor: "border-green-500"
    },
    {
      name: "Wei Jin",
      role: "Research Specialist",
      email: "wei.jin@surrey.ac.uk",
      image: "/lovable-uploads/db4533e3-2a0f-4156-9a7d-f47709d49aa3.png?v=" + Date.now(),
      borderColor: "border-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-yellow-300">Touch</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Have questions about the GenZ Immersive Summit? We're here to help! Reach 
            out to our team for inquiries, partnerships, or support.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground mb-8">Contact Information</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Our team is ready to assist you with any questions or inquiries 
                about the summit.
              </p>

              <div className="space-y-6">
                {/* Email Us */}
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Email Us</h3>
                    <p className="text-muted-foreground mb-2 text-sm">
                      To request the full engagement prospectus and discuss how your 
                      organisation can take part, please contact:
                    </p>
                    <a href="mailto:m.budila@surrey.ac.uk" className="text-blue-500 hover:underline">
                      m.budila@surrey.ac.uk
                    </a>
                    <br />
                    <a href="mailto:ka.lai@surrey.ac.uk" className="text-blue-500 hover:underline">
                      ka.lai@surrey.ac.uk
                    </a>
                  </div>
                </div>

                {/* Visit Us */}
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Visit Us</h3>
                    <div className="text-muted-foreground text-sm space-y-1">
                      <p>Surrey Business School</p>
                      <p>GK Medic Building (MS)</p>
                      <p>University of Surrey</p>
                      <p>Guildford</p>
                      <p>Surrey</p>
                      <p>GU2 7XH</p>
                    </div>
                  </div>
                </div>

                {/* Follow Us */}
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Follow Us</h3>
                    <p className="text-muted-foreground mb-3 text-sm">Stay updated on social media</p>
                    <div className="flex space-x-3">
                      <a href="https://www.linkedin.com/company/107277142" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href="#" className="text-blue-400 hover:text-blue-500">
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a href="https://www.instagram.com/frankiekclai/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                        <Instagram className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-background shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name
                      </label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name
                      </label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Inquiry Type
                    </label>
                    <Select value={formData.inquiryType} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="General Information" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Information</SelectItem>
                        <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                        <SelectItem value="sponsorship">Sponsorship</SelectItem>
                        <SelectItem value="media">Media Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground text-lg mb-12">
            The people behind GenZ Immersive Summit
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className={`w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 ${member.borderColor}`}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                <a
                  href={`mailto:${member.email}`}
                  className="text-orange-500 hover:underline text-sm"
                >
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;