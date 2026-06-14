import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, StarIcon, ShieldCheckIcon, MapPinIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: MapPinIcon,
    title: 'Real-time Tracking',
    description: 'Track your ride in real-time with live GPS updates and driver location'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Safe',
    description: 'Enterprise-grade security with driver verification and emergency support'
  },
  {
    icon: ClockIcon,
    title: 'Fast Booking',
    description: 'Book a ride in just 3 clicks with instant driver assignment'
  },
  {
    icon: UsersIcon,
    title: 'Fleet Management',
    description: 'Complete vehicle and driver management for administrators'
  },
  {
    icon: CheckIcon,
    title: 'Multiple Payments',
    description: 'Pay with cash, card, or wallet - your choice'
  },
  {
    icon: StarIcon,
    title: 'Ratings & Reviews',
    description: 'Rate your drivers and help improve service quality'
  }
];

const vehicles = [
  {
    name: 'Toyota Camry',
    capacity: '4 Passengers',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=300&fit=crop'
  },
  {
    name: 'Honda Accord',
    capacity: '4 Passengers',
    image: 'https://images.unsplash.com/photo-1619405399517-01a9ca6ee519?w=500&h=300&fit=crop'
  },
  {
    name: 'Toyota Sienna',
    capacity: '7 Passengers',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop'
  }
];

const testimonials = [
  {
    name: 'Chinedu Okonkwo',
    role: 'Student',
    feedback: 'RideBook made my daily commute so much easier. Fast, reliable, and affordable!',
    rating: 5
  },
  {
    name: 'Amara Johnson',
    role: 'Faculty Member',
    feedback: 'Excellent service. The real-time tracking feature gives me peace of mind.',
    rating: 5
  },
  {
    name: 'Ibrahim Hassan',
    role: 'Driver',
    feedback: 'Great platform to earn extra income. Easy to use and fair pricing.',
    rating: 5
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Smart Ride Booking for Your Campus
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12">
            Waziri Umaru Federal Polytechnic's trusted transportation management system
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link 
              to="/login"
              className="px-8 py-4 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-400 transition border-2 border-white"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold">5,000+</div>
              <p className="text-blue-100">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold">50,000+</div>
              <p className="text-blue-100">Completed Rides</p>
            </div>
            <div>
              <div className="text-4xl font-bold">100+</div>
              <p className="text-blue-100">Active Drivers</p>
            </div>
            <div>
              <div className="text-4xl font-bold">98%</div>
              <p className="text-blue-100">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Why Choose RideBook?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md hover:shadow-lg transition">
                  <Icon className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fleet Section */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Our Modern Fleet
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <div key={vehicle.name} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x300?text=' + vehicle.name;
                  }}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {vehicle.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    {vehicle.capacity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 px-6 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign Up</h3>
              <p className="text-gray-600 dark:text-gray-400">Create your account in seconds</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enter Location</h3>
              <p className="text-gray-600 dark:text-gray-400">Pick your pickup and dropoff points</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Booking</h3>
              <p className="text-gray-600 dark:text-gray-400">Driver assigned instantly</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enjoy Ride</h3>
              <p className="text-gray-600 dark:text-gray-400">Track and complete your journey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            What Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.feedback}"
                </p>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Commute?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and staff who trust RideBook for safe, reliable, and affordable transportation
          </p>
          
          <Link 
            to="/register"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition transform hover:scale-105"
          >
            Get Started Now - It's Free!
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-white mb-4">About RideBook</h3>
            <p className="text-sm">Smart transportation management for modern institutions</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Support</h3>
            <ul className="text-sm space-y-2">
              <li><a href="mailto:support@waziriumaru.edu.ng" className="hover:text-white">Email Support</a></li>
              <li><a href="tel:+2348000000000" className="hover:text-white">Call Us</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Contact Info</h3>
            <p className="text-sm">Birnin Kebbi, Kebbi State</p>
            <p className="text-sm">Nigeria</p>
            <p className="text-sm mt-2">© 2024 RideBook. All rights reserved.</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>Waziri Umaru Federal Polytechnic Birnin Kebbi</p>
        </div>
      </footer>
    </div>
  );
}
