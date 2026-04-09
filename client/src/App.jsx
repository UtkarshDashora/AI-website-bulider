import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import Editor from './pages/Editor'
import LivePreview from './pages/LivePreview'
import PricingPage from './pages/Pricing'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import { useSelector, useDispatch } from 'react-redux'
import { useGetCurrentUser } from './hooks/useGetCurrentUser'
import { getRedirectResult } from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";
import { setUser } from './redux/Userslice';

export const serverUrl = import.meta.env.VITE_SERVER_URL || "https://ai-website-bulider1.onrender.com"


function App() {
  const dispatch = useDispatch()
  useGetCurrentUser()
  const { userData } = useSelector((state) => state.user)

  // Handle Firebase redirect for mobile login
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("[Auth] Redirect result found:", result.user.email);
          const { data } = await axios.post(`${serverUrl}/api/auth/google`, {
            name: result.user.displayName,
            email: result.user.email,
            avatar: result.user.photoURL
          }, { withCredentials: true });
          
          if (data.success) {
            dispatch(setUser(data.user));
          }
        }
      } catch (error) {
        console.error("[Auth] Redirect result error:", error);
      }
    };
    handleRedirectResult();
  }, [dispatch]);

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={userData ? <Dashboard /> : <Home />}
        />
        <Route
          path="/generate"
          element={userData ? <Generate /> : <Home />}
        />
        <Route
          path="/editor/:id"
          element={userData ? <Editor /> : <Home />}
        />
        <Route
          path="/live/:id"
          element={<LivePreview />}
        />
        <Route
          path="/pricing"
          element={<PricingPage />}
        />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </Router>
  )
}

export default App


