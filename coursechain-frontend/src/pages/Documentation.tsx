import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Book, FileText } from 'lucide-react';

// Simulated Strapi response since we don't have a real backend
const MOCK_DOCS = {
  data: {
    attributes: {
      title: "Getting Started with CourseForge",
      content: `
# Welcome to CourseForge Documentation

## Quick Start Guide

### 1. Connect Your Wallet
First, connect your MetaMask wallet by clicking the "Connect Wallet" button in the top right corner.

### 2. Create Your Course
- Navigate to the dashboard
- Click "New Course"
- Fill in your course details
- Upload your content

### 3. Smart Contract Integration
CourseForge automatically generates a smart contract for your course, handling:
- Payment processing
- Content access control
- Revenue distribution

### 4. Publish and Share
Once your course is ready:
- Set your price in ETH
- Preview your content
- Hit publish!

## Advanced Topics

### Custom Smart Contracts
Learn how to customize your course's smart contract...

### Content Protection
Understanding how we secure your content...

### Revenue Models
Different ways to monetize your courses...
      `
    }
  }
};

const Documentation = () => {
  const [docs, setDocs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to Strapi
    const fetchDocs = async () => {
      try {
        // In a real app, this would be: await axios.get('YOUR_STRAPI_URL/api/docs')
        setDocs(MOCK_DOCS.data);
      } catch (error) {
        console.error('Error fetching docs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center space-x-4 mb-8">
          <Book className="w-8 h-8 text-indigo-500" />
          <h1 className="text-4xl font-bold">{docs.attributes.title}</h1>
        </div>
        
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="sticky top-24 bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#quick-start" className="flex items-center text-gray-300 hover:text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Quick Start Guide
                  </a>
                </li>
                <li>
                  <a href="#advanced" className="flex items-center text-gray-300 hover:text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Advanced Topics
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className="col-span-9">
            <div className="prose prose-invert prose-indigo max-w-none">
              <ReactMarkdown>{docs.attributes.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;