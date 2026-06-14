import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookRide = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [fare, setFare] = useState(null);

  const calculateRoute = () => {
    if (!pickup || !dropoff) {
      toast.error('Please enter both pickup and dropoff locations');
      return;
    }
    
    // Mock calculation - in production would use Google Maps API
    const mockDistance = Math.random() * 10 + 1;
    const mockDuration = Math.floor(mockDistance * 5 + 5);
    const calculatedFare = Math.round(500 + mockDistance * 100);
    
    setDistance(mockDistance.toFixed(1));
    setDuration(mockDuration);
    setFare(calculatedFare);
    
    toast.success('Route calculated successfully!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!distance) {
      toast.error('Please calculate route first');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Ride booked successfully!');
      navigate('/user/ride-history');
    } catch (error) {
      toast.error('Failed to book ride');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8">
          <h1 className="text-2xl font-bold text-white">Book a Ride</h1>
          <p className="text-primary-100 mt-2">Schedule your transportation with ease</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPinIcon className="inline h-4 w-4 mr-1" />
              Pickup Location
            </label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="e.g., Main Gate, Hostel A"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Dropoff Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPinIcon className="inline h-4 w-4 mr-1" />
              Destination
            </label>
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="e.g., Library, Cafeteria"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Calculate Route Button */}
          <button
            type="button"
            onClick={calculateRoute}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition font-medium"
          >
            Calculate Route & Fare
          </button>

          {/* Ride Details */}
          {distance && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">Trip Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{distance} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{duration} mins</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Fare</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">₦{fare?.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Schedule Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <CalendarIcon className="inline h-4 w-4 mr-1" />
              Schedule Time
            </label>
            <DatePicker
              selected={scheduledDate}
              onChange={setScheduledDate}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !distance}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default BookRide;
