import React, { useState } from 'react';

const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-gray-900">TeamSync</span>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
                            <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
                            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                                Sign In
                            </button>
                        </div>
                        
                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button 
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
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
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
                            <a 
                                href="#features" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                onClick={toggleMenu}
                            >
                                Features
                            </a>
                            <a 
                                href="#pricing" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                onClick={toggleMenu}
                            >
                                Pricing
                            </a>
                            <a 
                                href="#contact" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                onClick={toggleMenu}
                            >
                                Contact
                            </a>
                            <button 
                                className="w-full mt-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-left"
                                onClick={toggleMenu}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="bg-gray-200 py-12 md:py-20 lg:py-28 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                        Streamline Your Projects, <br className="hidden sm:block" /> Amplify Your Success
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 mt-4">
                        Empower your team with our intuitive project management platform.
                        Collaborate seamlessly, track progress effortlessly, and deliver results consistently.
                    </p>
                    <button className="mt-6 px-5 py-2.5 md:px-6 md:py-3 bg-black text-white font-medium rounded-lg shadow-md hover:bg-gray-800 transition">
                        Get Started
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-12 md:py-16 bg-white text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl md:text-2xl font-semibold uppercase text-gray-800">Features</h2>
                    <p className="text-lg md:text-xl text-gray-700 mt-2">Everything you need to manage projects effectively</p>
                    <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 md:gap-8 mt-10">
                        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full md:w-80">
                            <h3 className="text-lg font-semibold">Task Management</h3>
                            <p className="text-gray-600">Create, assign, and track tasks with ease.</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full md:w-80">
                            <h3 className="text-lg font-semibold">Team Collaboration</h3>
                            <p className="text-gray-600">Work together seamlessly with real-time updates.</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full md:w-80">
                            <h3 className="text-lg font-semibold">Progress Tracking</h3>
                            <p className="text-gray-600">Monitor project progress with visual dashboards.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="bg-gray-100 py-12 md:py-16 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl md:text-2xl font-semibold uppercase text-gray-800">Simple, Transparent Pricing</h2>
                    <p className="text-base md:text-lg text-gray-700 mt-2">Choose the plan that's right for your team</p>
                    <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 md:gap-8 mt-10">
                        <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-72 border">
                            <h3 className="text-lg font-semibold">Basic</h3>
                            <p className="text-gray-600">$9/month - Perfect for small teams</p>
                            <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                                Start Free Trial
                            </button>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-72 border border-black">
                            <h3 className="text-lg font-semibold">Professional</h3>
                            <p className="text-gray-600">$19/month - For growing teams</p>
                            <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                                Start Free Trial
                            </button>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-72 border">
                            <h3 className="text-lg font-semibold">Enterprise</h3>
                            <p className="text-gray-600">Custom Pricing - For large organizations</p>
                            <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="bg-white py-12 md:py-16 text-center">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl md:text-2xl font-semibold uppercase text-gray-800">Contact Us</h2>
                    <p className="text-base md:text-lg text-gray-700 mt-2">Get in touch with our team</p>
                    <form className="mt-8 space-y-4 text-left">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea id="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border"></textarea>
                        </div>
                        <button type="submit" className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                            Send Message
                        </button>
                    </form>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 text-center mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-base md:text-lg">Making project management simple and efficient for teams of all sizes.</p>
                    <div className="mt-4 flex justify-center space-x-4 md:space-x-6">
                        <span className="text-gray-400 cursor-pointer hover:text-white">Facebook</span>
                        <span className="text-gray-400 cursor-pointer hover:text-white">Instagram</span>
                        <span className="text-gray-400 cursor-pointer hover:text-white">Twitter</span>
                    </div>
                    <p className="mt-4 text-gray-400">© 2024 TeamSync. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;