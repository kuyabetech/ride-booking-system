import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to a backend endpoint
    toast.success('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email</h3>
            <p className="text-gray-700 dark:text-gray-300">support@waziriumaru.edu.ng</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Phone</h3>
            <p className="text-gray-700 dark:text-gray-300">+234 (0) 800-000-0000</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Location</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Waziri Umaru Federal Polytechnic<br />
              Birnin Kebbi, Kebbi State<br />
              Nigeria
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Business Hours</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Monday - Friday: 8:00 AM - 5:00 PM<br />
              Saturday: 9:00 AM - 1:00 PM<br />
              Sunday: Closed
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Message subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Your message here..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-[1.02]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
