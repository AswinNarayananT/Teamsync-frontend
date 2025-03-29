import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

const OtpVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; 

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [message, setMessage] = useState("");


  const updateLocalStorageTimer = (time) => {
    localStorage.setItem("otpTimer", JSON.stringify({ time, timestamp: Date.now() }));
  };


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    const storedTimer = JSON.parse(localStorage.getItem("otpTimer"));
    if (storedTimer) {
      const elapsed = Math.floor((Date.now() - storedTimer.timestamp) / 1000);
      const remainingTime = Math.max(storedTimer.time - elapsed, 0);
      setTimer(remainingTime);
      setIsResendDisabled(remainingTime > 0);
    }
  }, []);


  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          updateLocalStorageTimer(newTime);
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/accounts/verify-otp/", { email, otp });
      setMessage("✅ OTP Verified Successfully!");
      setTimer(0);
      localStorage.removeItem("otpTimer");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      setMessage("❌ Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/api/v1/accounts/resend-otp/", { email });
      setMessage("✅ OTP Resent Successfully!");
      setTimer(120); 
      updateLocalStorageTimer(120);
      setIsResendDisabled(true);
    } catch (error) {
      setMessage("❌ Failed to resend OTP. Try again later.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">OTP Verification</h2>
        <p className="text-gray-400">Enter the OTP sent to <b className="text-white">{email}</b></p>

        {message && <p className="mt-2 text-red-400">{message}</p>}

        <form onSubmit={handleVerifyOtp} className="mt-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 border border-gray-600 rounded-lg text-center text-lg tracking-widest bg-gray-700 text-white outline-none"
            maxLength={6}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg mt-4 transition duration-300"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-4">
          {isResendDisabled ? (
            <p className="text-gray-500">Resend OTP in {formatTime(timer)}</p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-blue-400 hover:underline"
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
