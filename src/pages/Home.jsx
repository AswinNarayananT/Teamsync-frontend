import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate =useNavigate()

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="flex flex-col min-h-screen bg-black">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-900/10 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/2 right-1/2 w-64 h-64 bg-purple-900/5 rounded-full filter blur-3xl"></div>
            </div>

            {/* Navbar */}
            <nav className="bg-gray-950/90 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                TeamSync
                            </span>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-400 hover:text-white transition-colors duration-200">Features</a>
                            <a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">About</a>
                            <button 
                                onClick={() => navigate("/login")}  
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-semibold transform transition-all duration-200 hover:scale-105"
                            >
                                Get Started
                            </button>
                        </div>
                        
                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button 
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors duration-200"
                            >
                                <svg 
                                    className="h-6 w-6" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-950/95 backdrop-blur-xl border-t border-gray-800">
                            <a 
                                href="#features" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                                onClick={toggleMenu}
                            >
                                Features
                            </a>
                            <a 
                                href="#about" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                                onClick={toggleMenu}
                            >
                                About
                            </a>
                            <button 
                                className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-semibold transition-all duration-200 text-left"
                                onClick={() => {
                                    toggleMenu();
                                    navigate("/login");
                                }}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 py-16 md:py-24 lg:py-32 text-center flex-1 flex items-center">
                <div className="max-w-6xl mx-auto px-6">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Transform Your Team's
                        <br className="hidden sm:block" /> 
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Collaboration
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 mt-6 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Streamline project management with intuitive issue tracking, real-time collaboration, 
                        integrated video calls, and powerful progress monitoring. Join as a project owner or team member 
                        and experience seamless teamwork.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button 
                            onClick={() => navigate("/login")}  
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-xl hover:shadow-blue-500/25 transform transition-all duration-200 hover:scale-105 text-lg"
                        >
                            Start Your Project
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-16 md:py-20 bg-gray-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Everything You Need for 
                            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> Success</span>
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Powerful tools designed for modern teams to collaborate, track progress, and deliver results
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-200 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Issue Tracking</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Create, assign, and manage features and bugs with detailed tracking. Stay on top of every issue from creation to completion.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-200 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Team Collaboration</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Real-time chat, video calls, and seamless communication tools. Connect with your team wherever they are, whenever they need.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-200 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Progress Tracking</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Visual dashboards and real-time progress monitoring. Track project milestones and team performance at a glance.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-200 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Video Conferencing</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Integrated video calls for team meetings, project discussions, and instant collaboration without leaving the platform.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-200 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Role Management</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Flexible project ownership and membership roles. Control access, permissions, and responsibilities with precision.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-200 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Real-time Chat</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Instant messaging, file sharing, and project-specific channels. Keep conversations organized and accessible.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="relative z-10 py-16 md:py-20 bg-gradient-to-r from-gray-950 to-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Built for Modern Teams
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        TeamSync brings together all the tools your team needs in one powerful platform. 
                        Whether you're tracking bugs, developing new features, or managing complex projects, 
                        we've got you covered with intuitive design and robust functionality.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                                10K+
                            </div>
                            <p className="text-gray-400">Projects Managed</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent mb-2">
                                50K+
                            </div>
                            <p className="text-gray-400">Issues Resolved</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-2">
                                99.9%
                            </div>
                            <p className="text-gray-400">Uptime</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate("/login")}  
                        className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-xl hover:shadow-blue-500/25 transform transition-all duration-200 hover:scale-105 text-lg"
                    >
                        Join TeamSync Today
                    </button>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="relative z-10 bg-gray-950 text-white py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                            TeamSync
                        </div>
                        <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
                            Empowering teams to collaborate effectively, track progress seamlessly, and deliver exceptional results through innovative project management.
                        </p>
                        <div className="flex justify-center space-x-6 mb-8">
                            <span className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200">Privacy</span>
                            <span className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200">Terms</span>
                            <span className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200">Support</span>
                        </div>
                        <p className="text-gray-500">© 2024 TeamSync. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;