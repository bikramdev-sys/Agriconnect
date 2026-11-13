import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Sprout, 
  Store, 
  CheckCircle,
  CheckCircle2,
  ArrowRight,
  Camera,
  RotateCcw,
  Sparkles,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getCartoonAvatar } from '../utils/avatar';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { registerFarmer, registerBuyer } = useAuth();

  const [role, setRole] = useState(searchParams.get('role') === 'buyer' ? 'buyer' : 'farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Profile Picture Upload State
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    farmName: '',
    location: '',
    specialties: ['Vegetables'],
    buyerType: 'Retail Grocery Store',
    password: '',
    confirmPassword: '',
    avatar: ''
  });

  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'buyer') setRole('buyer');
    if (r === 'farmer') setRole('farmer');
  }, [searchParams]);

  const cropOptions = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Organic Produce'];

  const toggleSpecialty = (crop) => {
    setFormData((prev) => {
      const exists = prev.specialties.includes(crop);
      if (exists) {
        if (prev.specialties.length === 1) return prev; // Keep at least one
        return { ...prev, specialties: prev.specialties.filter((c) => c !== crop) };
      } else {
        return { ...prev, specialties: [...prev.specialties, crop] };
      }
    });
  };

  // Image Upload with Automatic Canvas Compression
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size must be under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 450;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setAvatarPreview(compressedDataUrl);
        setIsCustomAvatar(true);
        setFormData((prev) => ({ ...prev, avatar: compressedDataUrl }));
        toast.success('Profile picture selected! 📸');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleResetToCartoon = () => {
    setIsCustomAvatar(false);
    setAvatarPreview('');
    setFormData((prev) => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Photo removed.');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (!agreedTerms) {
      toast.error('Please agree to terms and conditions.');
      return;
    }

    // Determine final avatar: either custom uploaded photo or personal cartoon avatar
    const finalAvatar = isCustomAvatar && formData.avatar
      ? formData.avatar
      : getCartoonAvatar(formData.name || (role === 'farmer' ? 'Kisan' : 'Buyer'), role);

    const submissionData = {
      ...formData,
      avatar: finalAvatar
    };

    try {
      if (role === 'farmer') {
        await registerFarmer(submissionData);
        navigate('/dashboard/farmer');
      } else {
        await registerBuyer(submissionData);
        navigate('/dashboard/buyer');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-[#FAFAF5] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-forest-100 p-6 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950">
            {role === 'farmer' ? 'Register as a Verified Farmer' : 'Register as a Produce Buyer'}
          </h1>
          <p className="text-xs sm:text-sm text-agriText-muted mt-2">
            Join hundreds of local agricultural producers and conscious buyers across India.
          </p>

          {/* Role Toggle Switch */}
          <div className="inline-flex p-1 rounded-2xl bg-forest-50 border border-forest-200 mt-6">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'farmer' ? 'bg-forest-900 text-white shadow-xs' : 'text-forest-900 hover:bg-white'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-fresh" />
              <span>I am a Farmer / Grower</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'buyer' ? 'bg-forest-900 text-white shadow-xs' : 'text-forest-900 hover:bg-white'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-fresh" />
              <span>I am a Buyer / Retailer</span>
            </button>
          </div>
        </div>

        {/* Standard Profile Picture Upload */}
        <div className="mb-6 p-3.5 rounded-2xl bg-white border border-forest-100/90 shadow-2xs flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          {/* Avatar Preview Circle */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-forest-50 border-2 border-forest-200 hover:border-forest-600 cursor-pointer transition-all shrink-0 group flex items-center justify-center shadow-xs"
            title="Click to choose profile photo"
          >
            {isCustomAvatar && avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-forest-100/70 text-forest-700">
                <User className="w-7 h-7 text-forest-600" />
              </div>
            )}

            {/* Hover Camera Overlay */}
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Details & Action Buttons */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-0.5">
              <label className="text-xs font-bold text-forest-950 uppercase tracking-wider">
                Profile Photo
              </label>
              <span className="text-[11px] text-agriText-muted font-normal lowercase">(optional)</span>
            </div>

            <p className="text-[11px] text-agriText-muted mb-2">
              JPG, PNG or WEBP (max 8MB). Leave blank for default avatar.
            </p>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg border border-forest-200 hover:bg-forest-50 text-forest-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 text-forest-600" />
                <span>{isCustomAvatar ? 'Change Photo' : 'Upload Photo'}</span>
              </button>

              {isCustomAvatar && (
                <button
                  type="button"
                  onClick={handleResetToCartoon}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={role === 'farmer' ? 'e.g. Ramesh Patel' : 'e.g. Priya Sundaram'}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:border-forest-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:border-forest-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:border-forest-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                {role === 'farmer' ? 'Farm Location (City / State) *' : 'Delivery City / State *'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Nashik, Maharashtra"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:border-forest-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {role === 'farmer' ? (
            <div>
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                Farm / Orchard Name
              </label>
              <input
                type="text"
                value={formData.farmName}
                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                placeholder="e.g. Patel Organic Agro Fields"
                className="w-full px-3.5 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:border-forest-600 focus:bg-white"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                Buyer Organization Type
              </label>
              <select
                value={formData.buyerType}
                onChange={(e) => setFormData({ ...formData, buyerType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-xs text-forest-950 font-semibold focus:outline-none focus:border-forest-600"
              >
                <option value="Retail Grocery Store">Retail Grocery Store</option>
                <option value="Restaurant / Food Service">Restaurant / Food Service</option>
                <option value="Wholesale Distributor">Wholesale Distributor</option>
                <option value="Individual Conscious Consumer">Individual Conscious Consumer</option>
              </select>
            </div>
          )}

          {role === 'farmer' && (
            <div>
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-2">
                Main Crop Categories (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {cropOptions.map((crop) => {
                  const isSelected = formData.specialties.includes(crop);
                  return (
                    <button
                      type="button"
                      key={crop}
                      onClick={() => toggleSpecialty(crop)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-forest-900 text-white border-forest-900'
                          : 'bg-forest-50/70 text-forest-800 border-forest-200 hover:bg-forest-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {crop}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:border-forest-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-agriText-muted hover:text-forest-900"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-50/50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:border-forest-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-agriText-muted">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="rounded accent-forest-700"
              />
              <span>I agree to AgriConnect’s Direct Fair Agricultural Trade Guidelines and Terms.</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 mt-4"
          >
            <span>Create {role === 'farmer' ? 'Farmer Profile' : 'Buyer Account'}</span>
            <ArrowRight className="w-4 h-4 text-fresh" />
          </button>
        </form>

        <p className="text-center text-xs text-agriText-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-forest-800 hover:text-forest-600 underline">
            Log in here
          </Link>
        </p>

      </div>
    </div>
  );
}
