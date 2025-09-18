"use client";

import { FaLeaf, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      {/* Header */}
      <div className="bg-[#1A3129] text-white text-center py-12">
        <h1 className="text-3xl font-bold text-green-400">Contact Us</h1>
        <p className="mt-2 text-sm max-w-2xl mx-auto">
          We’d love to hear from you! Whether you have a question about our
          Ayurvedic plans, need guidance, or just want to connect — reach out
          below.
        </p>
      </div>

      {/* Contact Section */}
      <div className="flex-1 max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Get in Touch
          </h2>
          <p className="text-sm mb-8 text-gray-600">
            Have questions about Ayurvedic wellness, dosha plans, or
            collaborations? Contact us anytime — we’d love to help you.
          </p>

          {/* Contact Details */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <span className="text-green-600 text-xl">📧</span>
              <span className="text-gray-700 text-sm">
                support@ayurwellness.com
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-600 text-xl">📱</span>
              <span className="text-gray-700 text-sm">+91 98765-43210</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-600 text-xl">📞</span>
              <span className="text-gray-700 text-sm">+91 080-22334455</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl">📍</span>
              <span className="text-gray-700 text-sm leading-relaxed">
                Ayurvedic Wellness Center <br />
                221B Green Street, Civil Lines <br />
                Jabalpur, Madhya Pradesh, India
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Social Links */}
          <h3 className="text-lg font-semibold text-green-700 mb-3">
            Connect with Us
          </h3>
          <div className="flex space-x-5 text-2xl">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 transition"
            >
              <FaLeaf />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 transition"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 transition"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-md rounded-2xl p-8">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Send a Message
          </h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Write your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
