import { Rocket } from 'lucide-react';

const LoadingPage = () => {
  return (
    <div className="fixed w-screen h-screen z-50 top-0 left-0 flex items-center justify-center bg-gradient-to-r from-indigo-800 to-purple-800">
      <div className="text-center">
        <div className="flex items-center justify-center mb-8">
          <Rocket className="h-16 w-16 text-indigo-300 animate-bounce" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-white">
          CourseChain
        </h1>
        <p className="text-xl text-gray-200">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
