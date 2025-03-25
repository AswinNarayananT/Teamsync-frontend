import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api";

const OtpVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = location.state?.email || ""; // Get email passed from register page

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); // 60 seconds countdown
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  // Handle OTP Submission
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/v1/accounts/verify-otp/", { email, otp });
      setMessage("OTP Verified Successfully!");
      setTimeout(() => navigate("/dashboard"), 2000); 
    } catch (error) {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      await api.post("/api/v1/accounts/resend-otp/", { email });
      setMessage("OTP Resent Successfully!");
      setTimer(60); // Reset timer
      setIsResendDisabled(true);
    } catch (error) {
      setMessage("Failed to resend OTP. Try again later.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">OTP Verification</h2>
        <p className="text-gray-600">Enter the OTP sent to your email: <b>{email}</b></p>

        {message && <p className="text-red-500 mt-2">{message}</p>}

        <form onSubmit={handleVerifyOtp} className="mt-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 border rounded-lg text-center text-lg tracking-widest"
            maxLength={6}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg mt-4"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-4">
          {isResendDisabled ? (
            <p className="text-gray-500">Resend OTP in {timer} sec</p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-blue-500 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
