import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About RideBook</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            RideBook is designed to provide a modern, efficient, and secure transportation management system 
            for Waziri Umaru Federal Polytechnic Birnin Kebbi. Our mission is to simplify ride booking, 
            improve fleet management, and enhance the overall transportation experience for students, 
            staff, and faculty.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Real-time ride tracking with GPS integration</li>
            <li>Secure payment processing with multiple options</li>
            <li>Professional driver management and verification</li>
            <li>Comprehensive analytics and reporting</li>
            <li>Mobile-responsive design for all devices</li>
            <li>Role-based access control</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold">Backend</h3>
              <p className="text-sm">Node.js, Express, MySQL</p>
            </div>
            <div>
              <h3 className="font-semibold">Frontend</h3>
              <p className="text-sm">React, Vite, Tailwind CSS</p>
            </div>
            <div>
              <h3 className="font-semibold">Real-time</h3>
              <p className="text-sm">Socket.io, WebSockets</p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact & Support</h2>
          <p className="text-gray-700 dark:text-gray-300">
            For more information or support, please contact us at:
          </p>
          <ul className="mt-4 text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>Email:</strong> support@waziriumaru.edu.ng</li>
            <li><strong>Phone:</strong> +234 (0) 800-000-0000</li>
            <li><strong>Location:</strong> Birnin Kebbi, Kebbi State, Nigeria</li>
          </ul>
        </section>
      </div>
    </motion.div>
  );
};

export default About;
