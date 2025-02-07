import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    secretcode: "",
    profile_pic: "",
  });

  const [UploadPhoto, setUploadPhoto] = useState(null); 
  const [errors, setErrors] = useState({});

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error for current field
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password must have at least one lowercase, one uppercase, one digit, and one allowed special character (excluding =, --, ;, ', ")
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    const disallowedCharsRegex = /[=;'"\-]/; // Disallowed characters, including =, ';', '"', and '-'
    return passwordRegex.test(password) && !disallowedCharsRegex.test(password);
  };
  
  

  const validateSecretCode = (code) => {
    const secretCodeRegex = /^[a-zA-Z0-9@$!%*?&]{4,6}$/;
    return secretCodeRegex.test(code);
  };

  const handleUploadPhoto = async(e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 2 * 1024 * 1024; // 2 MB
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, profile_pic: "Invalid file type. Only JPEG/PNG allowed." }));
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({ ...prev, profile_pic: "File size exceeds 2MB." }));
        return;
      }
      const uploadPhoto = await uploadFile(file)
      console.log("uploadPhoto: ",uploadPhoto)
      setUploadPhoto(file);
      setData((prev)=>{
        return{
          ...prev,
          profile_pic : uploadPhoto?.url
        }
      })
      setErrors((prev) => ({ ...prev, profile_pic: "" })); // Clear error
    }
  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    setUploadPhoto(null);
    setErrors((prev) => ({ ...prev, profile_pic: "" })); // Clear error
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!validateEmail(data.email)) {
      newErrors.email = "Invalid email address.";
      isValid = false;
    }
    if (!validatePassword(data.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character. It must not contain ';', '=', or '\"'.";
      isValid = false;
    }
    
    if (data.password !== data.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match.";
      isValid = false;
    }
    if (!validateSecretCode(data.secretcode)) {
      newErrors.secretcode = "Secret code is required and should be 4-6 characters long.";
      isValid = false;
    }
    if (!UploadPhoto) {
      newErrors.profile_pic = "Profile photo is required.";
      isValid = false;
    }

    setErrors(newErrors);
    if (isValid) {
      console.log("Form data submitted:", data, UploadPhoto);
      // Proceed with form submission logic
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

      try {
        const response = await axios.post(URL,data)
        console.log("response",response)
        toast.success(response.data.message)
      } catch (error) {
        toast.error(error?.response?.data?.message)
      }

    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-sm mx-2 rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to Chat App!</h3>
        <form className="grid gap-3 mt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col mb-2 gap-1">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name..."
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handleOnChange}
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="flex flex-col mb-2 gap-1">
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email..."
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="flex flex-col mb-2 gap-1">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password..."
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="flex flex-col mb-2 gap-1">
            <label htmlFor="confirmpassword">Confirm Password: </label>
            <input
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              placeholder="Re-enter your password..."
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.confirmpassword}
              onChange={handleOnChange}
              required
            />
            {errors.confirmpassword && <p className="text-red-500 text-sm">{errors.confirmpassword}</p>}
          </div>

          <div className="flex flex-col mb-2 gap-1">
            <label htmlFor="secretcode">Secret Code: </label>
            <input
              type="password"
              id="secretcode"
              name="secretcode"
              placeholder="Enter your secret code..."
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.secretcode}
              onChange={handleOnChange}
              required
            />
            {errors.secretcode && <p className="text-red-500 text-sm">{errors.secretcode}</p>}
          </div>

          <div className="flex flex-col mb-2 gap-1">
            <label htmlFor="profile_pic">
              Photo:
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {UploadPhoto ? UploadPhoto.name : "Upload your photo"}
                </p>
                {UploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleClearUploadPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
            {errors.profile_pic && <p className="text-red-500 text-sm">{errors.profile_pic}</p>}
          </div>

          <button
            type="submit"
            className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
          >
            Register
          </button>
        </form>
        <p className="my-3 text-center">
          Already have an account?{" "}
          <Link to={"/email"} className="hover:text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;