import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-lg text-gray-600">If you can see this, the preview is working!</p>
        <div className="mt-8 p-4 bg-blue-100 rounded-lg">
          <p className="text-blue-800">This is a simple test to verify the preview is functioning.</p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;