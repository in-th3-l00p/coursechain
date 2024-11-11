// src/pages/CourseDetail.tsx

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit,
  Save,
  BookOpen,
  Users,
  Layers,
  ChevronRight,
  DollarSign,
  Plus,
} from 'lucide-react';
import LoadingPage from '../components/LoadingPage';

interface ICourse {
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number; // in ETH
  createdAt: string; // human-readable date
  owner: string; // owner's name for mock
}

const mockCourseData: ICourse = {
  title: 'Introduction to Blockchain',
  slug: 'introduction-to-blockchain',
  description:
    'Learn the fundamentals of blockchain technology, its applications, and how to develop decentralized applications.',
  category: 'Development',
  price: 0.5, // ETH
  createdAt: 'April 27, 2024',
  owner: 'John Doe',
};

type Tab = 'Lessons' | 'Students' | 'Analytics';

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Mocked course state
  const [course, setCourse] = useState<ICourse>(mockCourseData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    category: course.category,
    price: course.price.toString(),
  });
  const [loading, setLoading] = useState(false); // Simulate loading state

  // New state for active tab
  const [activeTab, setActiveTab] = useState<Tab>('Lessons');

  // Mocked ownership (Assume current user is the owner)
  const currentUser = 'John Doe';
  const isOwner = currentUser === course.owner;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    setLoading(true);
    // Simulate saving changes
    setTimeout(() => {
      setCourse({
        ...course,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
      });
      setIsEditing(false);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li>
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  Dashboard
                </button>
              </div>
            </li>
            <ChevronRight className="flex items-center text-gray-400 hover:text-white" />
            <li>
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/courses')}
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  Courses
                </button>
              </div>
            </li>
            <ChevronRight className="flex items-center text-gray-400 hover:text-white" />
            <li aria-current="page">
              <div className="flex items-center">
                <span className="text-gray-400 hover:text-white">{course.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-transparent text-3xl font-bold focus:outline-none border-b border-gray-600"
            />
          ) : (
            <h1 className="text-3xl font-bold">{course.title}</h1>
          )}
          {isOwner && (
            <button
              onClick={isEditing ? handleSaveChanges : handleEditToggle}
              className="flex items-center px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isEditing ? <Save className="w-5 h-5 mr-2" /> : <Edit className="w-5 h-5 mr-2" />}
              {isEditing ? 'Save Changes' : 'Edit Course'}
            </button>
          )}
        </div>

        {/* Course Metadata */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Description
            </label>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-700 text-white rounded-lg p-4 focus:outline-none placeholder-gray-500"
                placeholder="Enter course description"
              ></textarea>
            ) : (
              <p className="text-gray-300">{course.description}</p>
            )}
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Category
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded-lg p-4 focus:outline-none placeholder-gray-500"
                  placeholder="e.g., Development, Security"
                />
              ) : (
                <p className="text-gray-300">{course.category}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Price (ETH)
              </label>
              {isEditing ? (
                <div className="flex items-center bg-gray-700 rounded-lg px-4 py-2">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.0001"
                    className="bg-transparent flex-1 focus:outline-none text-white placeholder-gray-500"
                    placeholder="Enter course price in ETH"
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-300">{course.price} ETH</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Metadata */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Created At */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Created At
              </label>
              <p className="text-gray-300">{course.createdAt}</p>
            </div>

            {/* Owner */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Owner
              </label>
              <p className="text-gray-300">{course.owner}</p>
            </div>
          </div>
        </div>

        {/* Tabs for Course Content */}
        <div className="bg-gray-800 rounded-xl p-6">
          {/* Tab Navigation */}
          <div className="flex space-x-6 border-b border-gray-700 mb-6">
            <button
              className={`pb-2 ${
                activeTab === 'Lessons'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('Lessons')}
            >
              Lessons
            </button>
            <button
              className={`pb-2 ${
                activeTab === 'Students'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('Students')}
            >
              Students
            </button>
            <button
              className={`pb-2 ${
                activeTab === 'Analytics'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('Analytics')}
            >
              Analytics
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'Lessons' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Lessons</h2>
                {isOwner && (
                  <button className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Lesson
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {/* Mocked Lesson Items */}
                {[1, 2, 3].map((lessonNumber) => (
                  <div
                    key={lessonNumber}
                    className="flex justify-between items-center bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-gray-400 mr-4" />
                      <span className="text-white">Lesson {lessonNumber} Title</span>
                    </div>
                    {isOwner && (
                      <button className="text-indigo-400 hover:text-indigo-300">
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Students' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Enrolled Students</h2>
                {isOwner && (
                  <button className="text-sm text-indigo-400 hover:text-indigo-300">
                    View All
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {/* Mocked Student Items */}
                {['Alice', 'Bob', 'Charlie'].map((student, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-4" />
                      <span className="text-white">{student}</span>
                    </div>
                    {isOwner && (
                      <button className="text-indigo-400 hover:text-indigo-300">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Analytics' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Course Analytics</h2>
              <div className="bg-gray-700 rounded-lg p-6">
                <p className="text-gray-400">
                  Analytics data will be displayed here once available.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
