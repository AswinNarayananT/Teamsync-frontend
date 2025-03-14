import React from 'react'

const Home = () => {
    return (
        <div className="flex flex-col bg-gray-100">
          {/* Hero Section */}
          <section className="bg-gray-200 py-28 text-center">
            <div className="max-w-4xl mx-auto px-6">
              <h1 className="text-5xl font-bold text-gray-900">
                Streamline Your Projects, <br /> Amplify Your Success
              </h1>
              <p className="text-lg text-gray-600 mt-4">
                Empower your team with our intuitive project management platform.
                Collaborate seamlessly, track progress effortlessly, and deliver results consistently.
              </p>
              <button className="mt-6 px-6 py-3 bg-black text-white font-medium rounded-lg shadow-md hover:bg-gray-800 transition">
                Get Started
              </button>
            </div>
          </section>
    
          {/* Features Section */}
          <section className="py-16 bg-white text-center">
            <h2 className="text-2xl font-semibold uppercase text-gray-800">Features</h2>
            <p className="text-xl text-gray-700 mt-2">Everything you need to manage projects effectively</p>
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="bg-gray-100 p-6 rounded-lg shadow-md w-80">
                <h3 className="text-lg font-semibold">Task Management</h3>
                <p className="text-gray-600">Create, assign, and track tasks with ease.</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md w-80">
                <h3 className="text-lg font-semibold">Team Collaboration</h3>
                <p className="text-gray-600">Work together seamlessly with real-time updates.</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-md w-80">
                <h3 className="text-lg font-semibold">Progress Tracking</h3>
                <p className="text-gray-600">Monitor project progress with visual dashboards.</p>
              </div>
            </div>
          </section>
    
          {/* Pricing Section */}
          <section className="bg-gray-100 py-16 text-center">
            <h2 className="text-2xl font-semibold uppercase text-gray-800">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-700 mt-2">Choose the plan that's right for your team</p>
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="bg-white p-6 rounded-lg shadow-md w-72 border">
                <h3 className="text-lg font-semibold">Basic</h3>
                <p className="text-gray-600">$9/month - Perfect for small teams</p>
                <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                  Start Free Trial
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md w-72 border border-black">
                <h3 className="text-lg font-semibold">Professional</h3>
                <p className="text-gray-600">$19/month - For growing teams</p>
                <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                  Start Free Trial
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md w-72 border">
                <h3 className="text-lg font-semibold">Enterprise</h3>
                <p className="text-gray-600">Custom Pricing - For large organizations</p>
                <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                  Contact Sales
                </button>
              </div>
            </div>
          </section>
    
          {/* Footer */}
          <footer className="bg-gray-900 text-white py-8 text-center">
            <p className="text-lg">Making project management simple and efficient for teams of all sizes.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <span className="text-gray-400 cursor-pointer hover:text-white">Facebook</span>
              <span className="text-gray-400 cursor-pointer hover:text-white">Instagram</span>
              <span className="text-gray-400 cursor-pointer hover:text-white">Twitter</span>
            </div>
            <p className="mt-4 text-gray-400">© 2024 TeamSync. All rights reserved.</p>
          </footer>
        </div>
      );
}

export default Home
