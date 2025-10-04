import React, { useContext, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import bg from "../assets/authBg.png";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        formData,
        { withCredentials: true }
      );
      setUserData(result.data);
      console.log("Signup successful:", result.data);

      // Navigate to customize page after successful signup
      navigate("/customize");
    } catch (error) {
      console.error(
        "Error during signup:",
        error.response?.data?.message || error.message
      );
      setUserData(null);
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-[90%] max-w-[500px] h-[550px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px] relative"
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          Create <span className="text-blue-400">Virtual Assistant</span> Account
        </h1>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your Name"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
        />

        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a Password"
            className="w-full h-[60px] rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px] text-white border-2 border-white text-[18px]"
            required
          />
          {!showPassword ? (
            <IoEye
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <IoEyeOff
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        <button
          type="submit"
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p
          className="text-[white] text-[18px] cursor-pointer mt-4"
          onClick={() => navigate("/signin")}
        >
          Already have an account? <span className="text-blue-400">Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
