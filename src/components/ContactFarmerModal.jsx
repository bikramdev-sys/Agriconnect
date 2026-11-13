import React, { useState } from 'react';
import { X, Send, Sparkles, MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

export default function ContactFarmerModal({ isOpen, onClose, farmer, productName }) {
  const [message, setMessage] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !farmer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a short message for the farmer.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Deliver directly to bikramdevsaw9@gmail.com via Web3Forms
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: '36721ff9-419a-4a6a-8f4d-77c17f6ddf52',
          name: 'AgriConnect Buyer',
          email: 'buyer@agriconnect.org',
          phone: buyerPhone || 'Not Provided',
          subject: `Produce Inquiry: ${productName || 'Fresh Produce'} for ${farmer.name || farmer.farmName}`,
          message: `Inquiry for ${farmer.name || 'Farmer'} regarding ${productName || 'Produce'}${orderQuantity ? ` (Qty: ${orderQuantity})` : ''}:\n\n${message.trim()}`,
          from_name: 'AgriConnect Farmer Inquiry Desk'
        })
      }).catch((e) => console.warn('Web3Forms dispatch notice:', e));

      // 2. Save in Database for Admin Panel
      await api.contact.submit({
        name: 'AgriConnect Buyer',
        email: 'buyer@example.com',
        phone: buyerPhone || '',
        subject: `Inquiry regarding ${productName || 'Produce'} (${orderQuantity ? `${orderQuantity} units` : 'Bulk'})`,
        message: message.trim(),
        farmerId: farmer.id || '',
        farmerName: farmer.name || farmer.farmName || '',
      });

      toast.success(`Inquiry sent! Routed to bikramdevsaw9@gmail.com and ${farmer.name || farmer.farmName}. 🌾`);
      setMessage('');
      setBuyerPhone('');
      setOrderQuantity('');
      onClose();
    } catch (err) {
      toast.error(err?.message || 'Failed to dispatch inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-forest-100 overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-900 to-forest-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={farmer.avatar}
              alt={farmer.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-forest-400"
            />
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Contact {farmer.name}
              </h3>
              <p className="text-xs text-fresh flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {farmer.farmName || farmer.location}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-300">
            Send a direct field inquiry for bulk procurement, harvest date coordination, or recurring supply.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1">
              Produce Inquiring About
            </label>
            <input
              type="text"
              readOnly
              value={productName || 'Fresh Farm Produce'}
              className="w-full px-4 py-2.5 rounded-xl bg-forest-50 border border-forest-200 text-xs font-bold text-forest-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1">
                Your Phone / WhatsApp
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-forest-200 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1">
                Target Quantity (kg / crates)
              </label>
              <input
                type="text"
                placeholder="e.g. 50 kg or 5 crates"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-forest-200 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1">
              Your Message
            </label>
            <textarea
              rows="3"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi Ramesh, I am looking to procure weekly tomatoes for my grocery outlet..."
              className="w-full p-3 rounded-xl border border-forest-200 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-agriText-muted hover:text-forest-900 hover:bg-forest-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 disabled:opacity-60 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-fresh" />
              <span>{isSubmitting ? 'Sending...' : 'Send Farmer Message'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
