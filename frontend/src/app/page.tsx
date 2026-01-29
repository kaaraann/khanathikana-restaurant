'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Indian');

  const categories = ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai'];
  
  const featuredDishes = [
    { name: 'Butter Chicken', description: 'Tender chicken in rich, creamy tomato sauce with aromatic spices. A royal treat for your taste buds!', price: 320, category: 'Indian' },
    { name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection with bell peppers and onions.', price: 280, category: 'Indian' },
    { name: 'Biryani Special', description: 'Fragrant basmati rice layered with tender meat and aromatic spices.', price: 350, category: 'Indian' },
    { name: 'Dal Makhani', description: 'Slow-cooked black lentils in creamy butter sauce.', price: 220, category: 'Indian' },
  ];

  const reviews = [
    { name: 'Priya S.', rating: 5, comment: 'Best Indian food in town! The butter chicken is to die for.', avatar: '👩' },
    { name: 'Rahul M.', rating: 5, comment: 'Amazing ambiance and even better food. Highly recommended!', avatar: '👨' },
    { name: 'Sarah K.', rating: 5, comment: 'Authentic flavors that remind me of home cooking.', avatar: '👩‍🦰' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2D2D2D]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">
              Khanathikana
            </h1>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-white hover:text-[#D4A574] transition-colors">Home</a>
              <a href="#menu" className="text-stone-400 hover:text-[#D4A574] transition-colors">Menu</a>
              <a href="#about" className="text-stone-400 hover:text-[#D4A574] transition-colors">About</a>
              <a href="#reviews" className="text-stone-400 hover:text-[#D4A574] transition-colors">Reviews</a>
              <a href="#contact" className="text-stone-400 hover:text-[#D4A574] transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login"
                className="bg-[#D4A574] text-[#2D2D2D] px-6 py-2.5 rounded-full font-semibold hover:bg-[#C49A6C] transition-all duration-300"
              >
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 bg-[#F5F1EB]">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-[#D4A574]/10 text-[#D4A574] px-4 py-2 rounded-full text-sm font-medium border border-[#D4A574]/20">
                  ⭐ #1 Restaurant in Town
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-semibold text-stone-800 leading-tight">
                Famous
                <span className="block text-[#D4A574]">
                  Indian Dishes
                </span>
              </h1>
              
              <p className="text-stone-500 text-lg max-w-lg leading-relaxed">
                From refreshing citrus blends to nutrient-packed green mixes, we've got the perfect sip to suit every taste and mood. Indulge in the purity of nature, one glass at a time.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#menu"
                  className="bg-[#D4A574] text-[#2D2D2D] px-8 py-4 rounded-full font-semibold hover:bg-[#C49A6C] transition-all duration-300 inline-flex items-center gap-2"
                >
                  Explore Dishes
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a 
                  href="#contact"
                  className="bg-white text-stone-700 border border-stone-300 px-8 py-4 rounded-full font-semibold hover:border-stone-400 transition-all duration-300"
                >
                  Book a Table
                </a>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-8 pt-8">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-[#D4A574]/20 border-2 border-[#F5F1EB] flex items-center justify-center text-lg">👨</div>
                    <div className="w-10 h-10 rounded-full bg-[#D4A574]/20 border-2 border-[#F5F1EB] flex items-center justify-center text-lg">👩</div>
                    <div className="w-10 h-10 rounded-full bg-[#D4A574]/20 border-2 border-[#F5F1EB] flex items-center justify-center text-lg">👨‍🦱</div>
                  </div>
                  <div>
                    <p className="text-stone-800 font-semibold">Satisfied</p>
                    <p className="text-stone-500 text-sm">Customers Reviews</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#D4A574]">4.9</p>
                  <div className="flex text-amber-500 text-sm">★★★★★</div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-stone-800">50+</p>
                  <p className="text-stone-500 text-sm">Famous Dishes</p>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[600px]">
                <div className="absolute inset-0 bg-white rounded-3xl shadow-lg"></div>
                
                {/* Food Image Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-9xl mb-4">🍛</div>
                    <div className="text-6xl absolute top-10 right-10">🥘</div>
                    <div className="text-5xl absolute bottom-20 left-10">🍗</div>
                    <div className="text-4xl absolute top-20 left-20">🥗</div>
                  </div>
                </div>
                
                {/* Floating Card */}
                <div className="absolute bottom-10 right-0 bg-white p-4 rounded-2xl border border-stone-200 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">👨‍🍳</div>
                    <div>
                      <p className="text-stone-800 font-semibold">Master Chef</p>
                      <p className="text-stone-500 text-sm">20+ Years Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Environment Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-semibold text-stone-800 text-center mb-4">
            OUR ENVIRONMENT
          </h2>
          <p className="text-stone-500 text-center max-w-2xl mx-auto mb-12">
            Experience dining in our beautifully crafted space, where every corner tells a story of tradition and elegance.
          </p>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2 bg-[#2D2D2D] rounded-3xl overflow-hidden relative group h-80 md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center text-8xl">🏛️</div>
              <div className="absolute bottom-6 left-6 z-20">
                <p className="text-white font-semibold text-xl">Main Dining Hall</p>
                <p className="text-stone-400">Elegant & Spacious</p>
              </div>
            </div>
            <div className="bg-[#2D2D2D] rounded-3xl overflow-hidden relative group h-40">
              <div className="absolute inset-0 flex items-center justify-center text-5xl">🌿</div>
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-medium">Garden Area</p>
              </div>
            </div>
            <div className="bg-[#2D2D2D] rounded-3xl overflow-hidden relative group h-40">
              <div className="absolute inset-0 flex items-center justify-center text-5xl">🍷</div>
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-medium">Bar Lounge</p>
              </div>
            </div>
            <div className="bg-[#2D2D2D] rounded-3xl overflow-hidden relative group h-40">
              <div className="absolute inset-0 flex items-center justify-center text-5xl">🎉</div>
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-medium">Private Events</p>
              </div>
            </div>
            <div className="bg-[#2D2D2D] rounded-3xl overflow-hidden relative group h-40">
              <div className="absolute inset-0 flex items-center justify-center text-5xl">❄️</div>
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-medium">AC Section</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="menu" className="py-20 bg-[#F5F1EB]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-stone-800 mb-4">
                OUR CATEGORIES
              </h2>
              <p className="text-stone-500 mb-8">
                Savor the world's most iconic dishes, from rich Indian curries to spicy Mexican delights, Asian flavors, and traditional specialties. A global feast awaits!
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-[#2D2D2D] text-white'
                        : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <a href="#menu" className="text-[#D4A574] font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            
            <div className="bg-[#2D2D2D] rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-semibold mb-2 text-[#D4A574]">
                EXQUISITE INGREDIENTS
              </h3>
              <h4 className="text-3xl font-semibold mb-8">
                UNFORGETTABLE DISHES
              </h4>
              
              <div className="space-y-4">
                {featuredDishes.map((dish, idx) => (
                  <div 
                    key={dish.name}
                    className="flex items-center justify-between py-4 border-b border-stone-700"
                  >
                    <div className="flex-1">
                      <h5 className={`font-semibold text-lg ${idx === 0 ? 'text-[#D4A574]' : 'text-white'}`}>
                        {dish.name}
                      </h5>
                      {idx === 0 && (
                        <p className="text-stone-400 text-sm mt-1 max-w-xs">
                          {dish.description}
                        </p>
                      )}
                    </div>
                    <p className="text-[#D4A574] font-semibold">₹{dish.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Food Image Section */}
          <div className="mt-12 relative h-80 rounded-3xl overflow-hidden bg-[#2D2D2D]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🍲</div>
                <p className="text-white text-xl">Freshly Prepared with Love</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold text-stone-800 mb-4">
              WHAT OUR GUESTS SAY
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our valued customers have to say about their dining experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div 
                key={idx}
                className="bg-[#F5F1EB] p-8 rounded-3xl border border-stone-200 hover:border-[#D4A574] transition-all duration-300"
              >
                <div className="flex text-amber-500 text-xl mb-4">
                  {'★'.repeat(review.rating)}
                </div>
                <p className="text-stone-700 mb-6 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center text-2xl">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-stone-800 font-semibold">{review.name}</p>
                    <p className="text-stone-500 text-sm">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Map Section */}
      <section id="contact" className="py-20 bg-[#F5F1EB]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-stone-800 mb-4">
                FIND US HERE
              </h2>
              <p className="text-stone-500 mb-8">
                Visit us for an unforgettable dining experience. We're located in the heart of the city, easily accessible from all major areas.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center text-xl">📍</div>
                  <div>
                    <h4 className="font-semibold text-stone-800">Address</h4>
                    <p className="text-stone-500">123 Restaurant Street, Food District, City - 400001</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center text-xl">📞</div>
                  <div>
                    <h4 className="font-semibold text-stone-800">Phone</h4>
                    <p className="text-stone-500">+91 07969 223344</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center text-xl">🕐</div>
                  <div>
                    <h4 className="font-semibold text-stone-800">Opening Hours</h4>
                    <p className="text-stone-500">Mon - Sun: 11:00 AM - 11:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center text-xl">✉️</div>
                  <div>
                    <h4 className="font-semibold text-stone-800">Email</h4>
                    <p className="text-stone-500">support@khanathikana.com</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <a href="#" className="w-12 h-12 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center hover:bg-[#D4A574] transition-all">
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center hover:bg-[#D4A574] transition-all">
                  <span className="text-xl">📸</span>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center hover:bg-[#D4A574] transition-all">
                  <span className="text-xl">🐦</span>
                </a>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-[#2D2D2D] rounded-3xl overflow-hidden h-96 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-white font-semibold">Interactive Map</p>
                  <p className="text-stone-400 text-sm">Click to open in Google Maps</p>
                </div>
              </div>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute inset-0"
              ></a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Khanathikana
              </h3>
              <p className="text-stone-400 max-w-md mb-6">
                Experience the finest Indian cuisine crafted with love and tradition. Every dish tells a story of authentic flavors and culinary excellence.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-stone-400 hover:text-[#D4A574] transition-colors">📘</a>
                <a href="#" className="text-stone-400 hover:text-[#D4A574] transition-colors">📸</a>
                <a href="#" className="text-stone-400 hover:text-[#D4A574] transition-colors">🐦</a>
                <a href="#" className="text-stone-400 hover:text-[#D4A574] transition-colors">📺</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-stone-400 hover:text-[#D4A574] transition-colors">Home</a></li>
                <li><a href="#menu" className="text-stone-400 hover:text-[#D4A574] transition-colors">Menu</a></li>
                <li><a href="#about" className="text-stone-400 hover:text-[#D4A574] transition-colors">About Us</a></li>
                <li><a href="#reviews" className="text-stone-400 hover:text-[#D4A574] transition-colors">Reviews</a></li>
                <li><a href="#contact" className="text-stone-400 hover:text-[#D4A574] transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-stone-400">
                <li>📍 123 Restaurant Street</li>
                <li>📞 +91 07969 223344</li>
                <li>✉️ support@khanathikana.com</li>
                <li>🕐 11 AM - 11 PM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-stone-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-400 text-sm">
              © 2024 Khanathikana. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-stone-400 hover:text-[#D4A574] transition-colors">Privacy Policy</a>
              <a href="#" className="text-stone-400 hover:text-[#D4A574] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
