import React from 'react';
import { Plus, BookOpen, Users, DollarSign, TrendingUp, Settings, BarChart } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Students', value: '2,847', icon: <Users className="w-6 h-6" />, change: '+12.5%' },
    { title: 'Active Courses', value: '24', icon: <BookOpen className="w-6 h-6" />, change: '+4.3%' },
    { title: 'Revenue (ETH)', value: '156.8', icon: <DollarSign className="w-6 h-6" />, change: '+22.4%' },
    { title: 'Completion Rate', value: '84%', icon: <TrendingUp className="w-6 h-6" />, change: '+5.2%' },
  ];

  const courses = [
    { title: 'Web3 Development Fundamentals', students: 486, revenue: '23.4 ETH', progress: 75 },
    { title: 'Smart Contract Security', students: 324, revenue: '18.2 ETH', progress: 60 },
    { title: 'DeFi Architecture', students: 256, revenue: '15.8 ETH', progress: 45 },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <a
            href={"/courses/create"}
            className="flex items-center px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Course
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-600/20 rounded-lg">
                  {stat.icon}
                </div>
                <span className="text-green-400 text-sm">{stat.change}</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course List */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Active Courses</h2>
              <button className="text-sm text-indigo-400 hover:text-indigo-300">View All</button>
            </div>
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        {course.students} students
                        <span className="mx-2">•</span>
                        <DollarSign className="w-4 h-4 mr-1" />
                        {course.revenue}
                      </div>
                    </div>
                    <button className="text-indigo-400 hover:text-indigo-300">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-indigo-500 rounded-full h-2"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Panel */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Analytics</h2>
              <button className="text-sm text-indigo-400 hover:text-indigo-300">
                <BarChart className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Revenue Distribution</h3>
                <div className="w-full h-40 bg-gray-700/50 rounded-lg flex items-end p-4">
                  {[40, 65, 45, 80, 55, 70, 45].map((height, index) => (
                    <div
                      key={index}
                      className="w-1/7 mx-1 bg-indigo-500 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Top Performing Categories</h3>
                <div className="space-y-2">
                  {['Development', 'Security', 'DeFi', 'NFTs'].map((category, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{category}</span>
                      <span className="text-indigo-400">{Math.floor(Math.random() * 30 + 70)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;