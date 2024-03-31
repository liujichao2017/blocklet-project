// src/Profile.js

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';
import './Profile.css'; // Ensure to create this CSS file for styling

const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  mobile: yup.string().matches(/^[0-9]+$/, 'Mobile number must be digits').required('Mobile number is required'),
});

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', mobile: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile({ ...profile, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = async () => {
    try {
      await profileSchema.validate(profile, { abortEarly: false });
      return true;
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
      }
      setErrors(validationErrors);
      return false;
    }
  };

  const saveProfile = async () => {
    const isValid = await validateForm();
    if (isValid) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setEditMode(false);
      toast.success('Profile saved successfully!');
    } else {
      toast.error('Please correct the errors before saving.');
    }
  };

  return (
    <div className="profile-container">
      <ToastContainer />
      {editMode ? (
        <>
          <input aria-label="Name" name="name" placeholder="Name" value={profile.name} onChange={handleInputChange} />
          {errors.name && <div className="error">{errors.name}</div>}
          <input aria-label="Email" name="email" placeholder="Email" type="email" value={profile.email} onChange={handleInputChange} />
          {errors.email && <div className="error">{errors.email}</div>}
          <input aria-label="Mobile" name="mobile" placeholder="Mobile" value={profile.mobile} onChange={handleInputChange} />
          {errors.mobile && <div className="error">{errors.mobile}</div>}
          <button onClick={saveProfile}>Save</button>
        </>
      ) : (
        <>
          <p><span className="profile-label">Name:</span> {profile.name}</p>
          <p><span className="profile-label">Email:</span> {profile.email}</p>
          <p><span className="profile-label">Mobile:</span> {profile.mobile}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

export default Profile;
