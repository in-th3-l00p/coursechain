import React from 'react';
import { ArrowRight, Sparkles, Shield, Zap, Users, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

const Home = () => {
  const { isConnected } = useWeb3();

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Build & Sell Courses on Web3
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Create, manage, and monetize your online courses with blockchain technology. 
            Secure content delivery and transparent transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <Link to="/dashboard" className="px-8 py-4 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                Go to Dashboard
                <LayoutDashboard className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <button className="px-8 py-4 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            )}
            <Link to="/docs" className="px-8 py-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              View Documentation
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose CourseForge?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="w-12 h-12 text-indigo-500" />,
              title: "Secure Content",
              description: "Your content is protected by blockchain technology and smart contracts"
            },
            {
              icon: <Zap className="w-12 h-12 text-indigo-500" />,
              title: "Fast Payments",
              description: "Instant cryptocurrency payments with low transaction fees"
            },
            {
              icon: <Users className="w-12 h-12 text-indigo-500" />,
              title: "Community Driven",
              description: "Build and grow your community with Web3 integration"
            }
          ].map((feature, index) => (
            <div key={index} className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90" />
          <div className="relative p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Building?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already using CourseForge to build their online education empire.
            </p>
            <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Start Creating Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;