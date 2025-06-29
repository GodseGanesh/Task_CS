import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showResend, setShowResend] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (otpSent) {
      setCountdown(30); // start from 30 seconds
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // run every 1 sec
    }
    return () => clearInterval(timer);
  }, [otpSent]);

  const handleSendOtp = async () => {
    if (!email) return alert("Please enter your email.");
    try {
      const res = await axios.post(`${baseUrl}/api/send_otp/`, {
        email,
      });
      if (res.status === 200) {
        setOtpSent(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResendOtp = async () => {
    console.log("Resending OTP to:", email);
    try {
      const res = await axios.post(`${baseUrl}/api/send_otp/`, {
        email,
      });
      if (res.status === 200) {
        setShowResend(false);
      }
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => setShowResend(true), 120000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/api/verify_otp/`, {
        email,
        otp,
      });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      navigate("/messages");
    } catch (error) {
      console.log(error);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow rounded">
        <h3 className="mb-3">Login</h3>
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
            <strong>{error}</strong>
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={otpSent}
            />
          </div>
          {!otpSent && (
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          )}
          {otpSent && (
            <>
              <div className="mb-3 mt-3">
                <label>Enter OTP</label>
                <input
                  className="form-control"
                  type="text"
                  maxLength="4"
                  value={otp}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, ""); // remove non-digits
                    setOtp(onlyNums);
                  }}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
              {showResend ? (
                <button
                  type="button"
                  className="btn btn-link mt-2"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-muted mt-2">
                  Resend Otp in {countdown} seconds
                </p>
              )}
            </>
          )}
        </form>

        <p className="mt-3 text-center">
          New User ? <Link to="/">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
