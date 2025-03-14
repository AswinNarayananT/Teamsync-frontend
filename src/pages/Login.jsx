import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Background Blur Effect */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8 text-white">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h2>

        {/* Form */}
        <form className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Submit Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded-lg font-semibold">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center gap-2">
          <div className="h-[1px] w-full bg-gray-500"></div>
          <p className="text-sm text-gray-400">OR</p>
          <div className="h-[1px] w-full bg-gray-500"></div>
        </div>

        {/* Google Sign-In */}
        <button className="w-full flex items-center justify-center gap-3 border border-gray-500 p-3 rounded-lg hover:bg-gray-700 transition-all">
          <FcGoogle className="text-2xl" />
          <span>Continue with Google</span>
        </button>

        {/* Toggle between Login & Sign Up */}
        <p className="text-center mt-4 text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            className="text-blue-400 cursor-pointer hover:underline ml-2"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
