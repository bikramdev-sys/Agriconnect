import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Building2, 
  ExternalLink,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const WEB3FORMS_ACCESS_KEY = '36721ff9-419a-4a6a-8f4d-77c17f6ddf52';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'buyer_support',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Submit to Web3Forms (Delivers directly to bikramdevsaw9@gmail.com inbox)
      const web3Payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || 'Not Provided',
        subject: formData.subject.trim() || `Inquiry: ${formData.inquiryType}`,
        message: formData.message.trim(),
        inquiry_category: formData.inquiryType,
        from_name: 'AgriConnect Advisory Desk'
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(web3Payload)
      }).catch((web3Err) => {
        console.warn('Web3Forms client-side warning:', web3Err);
      });

      // 2. Submit to AgriConnect Backend (Saves into MongoDB Atlas for Admin Panel)
      await api.contact.submit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim() || `Inquiry: ${formData.inquiryType}`,
        message: formData.message.trim(),
      });

      toast.success(
        'Thank you! Your message has been sent to bikramdevsaw9@gmail.com and saved to the admin panel. 🌾',
        { duration: 6000 }
      );

      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'buyer_support',
        subject: '',
        message: ''
      });
    } catch (err) {
      toast.error(err?.message || 'Failed to send inquiry. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    {
      title: 'Farmer Support Helpline',
      subtitle: 'Toll-free across India',
      detail: '1800-AGRI-CONNECT',
      subtext: 'Daily 6:00 AM – 9:00 PM (6 languages)',
      icon: Phone,
      action: 'tel:18002474266',
      badge: 'Free Calling'
    },
    {
      title: 'WhatsApp Kisan Mitra',
      subtitle: 'Instant messaging & crop photos',
      detail: '+91 98765 43210',
      subtext: 'Share harvest photos, get instant quotes',
      icon: MessageSquare,
      action: 'https://wa.me/919876543210',
      badge: 'Fastest Response'
    },
    {
      title: 'Email Help Desks',
      subtitle: 'General & documentation queries',
      detail: 'support@agriconnect.org',
      subtext: 'Farmer queries: kisan@agriconnect.org',
      icon: Mail,
      action: 'mailto:support@agriconnect.org',
      badge: '24/7 Monitored'
    },
    {
      title: 'Jamshedpur Central Desk',
      subtitle: 'Eastern regional operations',
      detail: '+91 (0657) 243-8891',
      subtext: 'Bistupur Hub, Jamshedpur, Jharkhand',
      icon: Building2,
      action: 'tel:06572438891',
      badge: 'Regional Office'
    }
  ];

  const regionalHubs = [
    {
      city: 'Jamshedpur Operations Hub',
      state: 'Jharkhand',
      address: 'Plot 14, Agri Logistics Hub, Main Road, Bistupur, Jamshedpur - 831001',
      phone: '+91 (0657) 243-8891',
      timing: 'Mon – Sat: 7:00 AM – 8:00 PM',
      type: 'Eastern Regional Operations & Aggregation Depot',
      isPrimary: true
    },
    {
      city: 'Pune Agricultural Hub',
      state: 'Maharashtra',
      address: 'Tower B, Agro-Tech Innovation Park, Shivaji Nagar, Pune - 411005',
      phone: '+91 (020) 2554-9102',
      timing: 'Mon – Sat: 7:00 AM – 8:00 PM',
      type: 'National Technology & Logistics Headquarters',
      isPrimary: false
    },
    {
      city: 'Bengaluru Southern Hub',
      state: 'Karnataka',
      address: 'Green Sprout Complex, 100 Feet Road, Indiranagar, Bengaluru - 560038',
      phone: '+91 (080) 4120-7741',
      timing: 'Mon – Sat: 8:00 AM – 7:00 PM',
      type: 'Southern Regional Distribution Center',
      isPrimary: false
    },
    {
      city: 'Chandigarh Grain Corridor',
      state: 'Punjab & Haryana',
      address: 'Plot 44, Kisan Bhawan Complex, Sector 17, Chandigarh - 160017',
      phone: '+91 (0172) 2790-412',
      timing: 'Mon – Sat: 8:00 AM – 6:00 PM',
      type: 'Organic Basmati & Grains Division',
      isPrimary: false
    }
  ];

  const contactFaqs = [
    {
      q: 'Can I visit the Jamshedpur Agricultural Hub in person?',
      a: 'Yes! Farmers, local vendors, and institutional buyers are welcome to visit our Jamshedpur Hub at Bistupur to inspect grading standards, pick up reusable crates, or register crops in person.'
    },
    {
      q: 'How fast will someone respond to my message?',
      a: 'During working hours (6:00 AM – 9:00 PM IST), our customer care team responds to emails and form inquiries within 90 minutes. Urgent farmer support via WhatsApp or our toll-free phone number is handled immediately.'
    },
    {
      q: 'Is phone support available in regional languages?',
      a: 'Yes, our Kisan Helpline advisors fluently speak Hindi, Bengali, Santhali, Marathi, Punjabi, Kannada, and English to ensure every farmer can communicate effortlessly.'
    },
    {
      q: 'How do restaurants or retailers set up recurring supply contracts?',
      a: 'Select "Bulk Procurement" in the inquiry form below or email procurement@agriconnect.org. A dedicated account manager will prepare scheduled farm delivery contracts with transparent pricing.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      
      {/* 1. Standardized Hero Banner */}
      <section className="relative overflow-hidden pt-32 sm:pt-36 pb-16 sm:pb-20 bg-gradient-to-b from-forest-950 via-[#0B2316] to-forest-950 text-white border-b border-forest-900/60">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-fresh/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-forest-700/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Subtle Topic Kicker */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-forest-900/80 border border-forest-800 text-fresh text-xs font-bold tracking-wide uppercase mb-5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Regional Support & Inquiries</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight max-w-4xl mx-auto leading-tight mb-5">
              Get in Touch with <span className="text-fresh">AgriConnect</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Have questions about listing harvests, placing commercial procurement contracts, or visiting our Jamshedpur Operations Hub? Our team is available 7 days a week.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <a
                href="tel:18002474266"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-fresh hover:bg-fresh-light text-forest-950 font-extrabold text-sm shadow-md hover:shadow-fresh/20 transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 text-forest-950" />
                <span>Call Toll-Free Helpline</span>
              </a>
              <a
                href="#contact-form"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-all active:scale-95"
              >
                <Send className="w-4 h-4 text-fresh" />
                <span>Send Direct Message</span>
              </a>
            </div>

            {/* Standardized Metric / Highlights Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-forest-800/80 text-center">
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-fresh">1800-AGRI</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Toll-Free Kisan Help</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-white">Jamshedpur</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Regional Operations Hub</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-fresh">&lt; 90 Mins</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Average Response Time</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-white">6 Languages</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Multilingual Field Support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Top Quick Contact Cards Grid (Flush, Clean Alignment) */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {contactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <a
                key={idx}
                href={card.action}
                target={card.action.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="bg-white rounded-2xl p-6 border border-forest-100 shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-forest-50 border border-forest-100 text-forest-800 flex items-center justify-center group-hover:scale-105 group-hover:bg-forest-900 group-hover:text-fresh transition-all shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-forest-700">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-forest-950 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-agriText-muted mb-3">
                    {card.subtitle}
                  </p>
                  <p className="font-display font-extrabold text-sm sm:text-base text-forest-900 group-hover:text-forest-700 transition-colors">
                    {card.detail}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-forest-50 text-[11px] text-gray-500">
                  {card.subtext}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* 3. Main Two-Column Contact Section with Jamshedpur Map & Balanced Alignment */}
      <section id="contact-form" className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border border-forest-100 shadow-soft h-full flex flex-col justify-between">
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-950 mb-2">
                Send Our Agricultural Advisors a Message
              </h2>
              <p className="text-agriText-muted text-sm mb-6">
                Fill out the details below and we will route your inquiry directly to our agricultural team.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-4">
              <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-sm text-forest-950 placeholder:text-gray-400 focus:outline-none focus:border-forest-700 focus:bg-white transition-all"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. rahul@example.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-sm text-forest-950 placeholder:text-gray-400 focus:outline-none focus:border-forest-700 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-sm text-forest-950 placeholder:text-gray-400 focus:outline-none focus:border-forest-700 focus:bg-white transition-all"
                  />
                </div>

                {/* Inquiry Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                    Inquiry Category
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-sm text-forest-950 focus:outline-none focus:border-forest-700 focus:bg-white transition-all font-medium"
                  >
                    <option value="buyer_support">Buyer Support & Orders</option>
                    <option value="farmer_onboarding">Farmer Registration & Crop Listing</option>
                    <option value="bulk_procurement">Bulk / Commercial Procurement</option>
                    <option value="logistics_pickup">Farmgate Logistics & Pickup</option>
                    <option value="jamshedpur_visit">Jamshedpur Hub Visit / Inquiry</option>
                    <option value="general_partnership">Partnerships & Media</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Weekly vegetable procurement for restaurant"
                  className="w-full px-4 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-sm text-forest-950 placeholder:text-gray-400 focus:outline-none focus:border-forest-700 focus:bg-white transition-all"
                />
              </div>

              {/* Message */}
              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                  Detailed Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Please describe your crop requirements, farm location, or inquiry details..."
                  className="w-full flex-1 min-h-[110px] px-4 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-sm text-forest-950 placeholder:text-gray-400 focus:outline-none focus:border-forest-700 focus:bg-white transition-all resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-w-[240px] px-8 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-fresh" />
                      <span>Submit Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Jamshedpur Map & Response Promise */}
          <div className="lg:col-span-5 h-full flex flex-col justify-between gap-5">
            
            {/* Jamshedpur Interactive Map Card */}
            <div className="bg-white rounded-3xl p-6 border border-forest-100 shadow-soft overflow-hidden flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-forest-700" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-forest-950">
                        Jamshedpur Hub
                      </h3>
                      <p className="text-[11px] text-forest-700 font-semibold">
                        Jharkhand, India
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Jamshedpur+Jharkhand+India"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center space-x-1"
                  >
                    <span>Open Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-agriText-muted leading-relaxed mb-3">
                  Plot 14, Agri Logistics Hub, Main Road, Bistupur, Jamshedpur, Jharkhand - 831001
                </p>
              </div>

              {/* Google Maps Embed of Jamshedpur */}
              <div className="w-full h-[190px] rounded-2xl overflow-hidden border border-forest-200/80 shadow-inner relative my-2">
                <iframe
                  title="AgriConnect Jamshedpur Operations Hub"
                  src="https://maps.google.com/maps?q=Jamshedpur%2C%20Jharkhand%2C%20India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <div className="pt-3 border-t border-forest-50 flex items-center justify-between text-xs font-semibold text-forest-900">
                <span>📞 +91 (0657) 243-8891</span>
                <span className="text-gray-500">🕒 Mon – Sat: 7 AM – 8 PM</span>
              </div>
            </div>

            {/* Response Promise Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-forest-900 text-white shadow-xl flex flex-col justify-between shrink-0">
              <div>
                <div className="flex items-center space-x-2 text-fresh text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Our Response Promise</span>
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white mb-1.5">
                  Direct Help When Every Hour Matters
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed mb-3.5">
                  Fresh harvests cannot wait. Whether you need immediate dispatch coordination or have order inquiries, our agrarian support team is active 7 days a week.
                </p>
              </div>

              <div className="space-y-2 text-xs text-gray-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh shrink-0" />
                  <span>Average response time under 90 minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh shrink-0" />
                  <span>Direct phone assistance in regional languages</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh shrink-0" />
                  <span>Verified farmgate logistics coordination</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Nationwide Regional Agricultural Hubs Grid */}
      <section className="py-14 bg-white border-y border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-950">
              Our Regional Agricultural Hubs
            </h2>
            <p className="text-agriText-muted text-sm mt-1.5">
              Visit our local aggregation centers across major agricultural belts in India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {regionalHubs.map((hub, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  hub.isPrimary
                    ? 'bg-forest-50/80 border-forest-300 shadow-soft ring-1 ring-forest-400/40'
                    : 'bg-cream/40 border-forest-100 hover:bg-forest-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-sm text-forest-950">
                      {hub.city}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      hub.isPrimary
                        ? 'bg-forest-800 text-white border-forest-800'
                        : 'bg-white text-forest-700 border-forest-200'
                    }`}>
                      {hub.state}
                    </span>
                  </div>
                  <p className="text-xs text-agriText-muted mb-3 leading-relaxed">
                    {hub.address}
                  </p>
                </div>

                <div className="pt-3 border-t border-forest-100 text-[11px] font-semibold text-forest-900 space-y-1">
                  <p>📞 {hub.phone}</p>
                  <p className="text-gray-500">🕒 {hub.timing}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact FAQs */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-950">
            Frequently Asked Contact Inquiries
          </h2>
        </div>

        <div className="space-y-3.5">
          {contactFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-forest-100 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left py-4 px-6 flex items-center justify-between font-bold text-forest-950 hover:text-forest-700 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <span className="text-xl font-display text-forest-600 ml-4 shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-agriText-muted leading-relaxed border-t border-forest-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
