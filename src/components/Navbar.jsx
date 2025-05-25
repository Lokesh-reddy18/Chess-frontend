"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { ChevronDown, User, LogOut, Home, Shield, Sword } from "lucide-react"
import { logout, login } from "../store/authSlice"
import Cookies from "js-cookie"
import axios from "axios"
import { BASE_URL } from "../url"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ChessMasterLogo from "./ChessMasterLogo"

function ChessNavbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const profileMenuRef = useRef(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await axios.post(
        `${BASE_URL}/user/logout`,
        {},
        {
          withCredentials: true,
        },
      )

      // Then remove the cookie and update Redux state
      Cookies.remove("token", { path: "/" })
      dispatch(logout())
      toast.success("Logged out successfully")
      navigate("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      toast.error("Logout failed. Please try again.")

      // As a fallback, still try to remove the cookie and update Redux state
      Cookies.remove("token", { path: "/" })
      dispatch(logout())
      navigate("/login")
    }
  }

  // Check authentication once on component mount
  useEffect(() => {
    // Only make the API call if we're not already authenticated or missing user data
    if (!authStatus || !userData?.username) {
      axios
        .get(`${BASE_URL}/profile`, {
          withCredentials: true,
        })
        .then((res) => {
          dispatch(login(res.data))
        })
        .catch((error) => {
          console.error("Error fetching profile:", error)
        })
    }
  }, [authStatus, userData, dispatch])

  // Override authStatus to false if the route is /login or /signup
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup"
  const effectiveAuthStatus = isAuthPage ? false : authStatus

  return (
    <div className="w-full bg-gray-900 border-b-4 border-blue-800 shadow-lg text-blue-100 font-mono z-50 fixed top-0 left-0">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <ChessMasterLogo />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-yellow-400 pixelated">CHESS MASTER</span>
              <span className="text-xs text-blue-300">Master your game</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 font-bold uppercase transition-colors ${
                location.pathname === "/"
                  ? "text-yellow-400 border-b-2 border-yellow-500"
                  : "text-blue-200 hover:text-yellow-400"
              }`}
            >
              <div className="flex items-center space-x-1">
                <Home size={18} />
                <span>Home</span>
              </div>
            </Link>

            {effectiveAuthStatus && userData?.username ? (
              <>
                <Link
                  to="/modeselector"
                  className={`px-3 py-2 font-bold uppercase transition-colors ${
                    location.pathname === "/modeselector"
                      ? "text-yellow-400 border-b-2 border-yellow-500"
                      : "text-blue-200 hover:text-yellow-400"
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Shield size={18} />
                    <span>Play</span>
                  </div>
                </Link>

                <Link
                  to="/puzzle"
                  className={`px-3 py-2 font-bold uppercase transition-colors ${
                    location.pathname === "/puzzle"
                      ? "text-yellow-400 border-b-2 border-yellow-500"
                      : "text-blue-200 hover:text-yellow-400"
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Sword size={18} />
                    <span>Puzzles</span>
                  </div>
                </Link>

                {/* Profile dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded font-bold uppercase ${
                      isProfileMenuOpen
                        ? "bg-blue-800 text-yellow-400 border-2 border-yellow-500"
                        : "text-blue-200 hover:text-yellow-400"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-900 border-2 border-yellow-500 flex items-center justify-center text-yellow-400 font-bold">
                      {userData?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="capitalize">{userData?.username?.split(" ")[0]}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${isProfileMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border-2 border-blue-700 rounded shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-blue-200 hover:bg-blue-800 hover:text-yellow-400 transition-colors duration-300"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User size={16} className="mr-3 text-yellow-400" />
                        <span>Profile</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-blue-200 hover:bg-blue-800 hover:text-yellow-400 transition-colors duration-300 w-full text-left"
                      >
                        <LogOut size={16} className="mr-3 text-yellow-400" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-4 py-2 font-bold uppercase text-blue-200 hover:text-yellow-400 transition-colors duration-300"
                >
                  Sign Up
                </Link>

                <Link
                  to="/login"
                  className="px-6 py-2 bg-blue-800 hover:bg-blue-700 text-yellow-400 border-2 border-yellow-500 font-bold uppercase rounded transition-colors duration-300"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center p-2 bg-blue-800 text-yellow-400 border-2 border-yellow-500 rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <span>✕</span> : <span>≡</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t-2 border-blue-700">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 py-2 px-3 text-lg font-bold uppercase text-blue-200 hover:bg-blue-800 hover:text-yellow-400 transition-colors duration-300 rounded"
            >
              <Home size={18} className="text-yellow-400" />
              <span>Home</span>
            </Link>

            {effectiveAuthStatus && userData?.username ? (
              <>
                <Link
                  to="/modeselector"
                  className="flex items-center space-x-3 py-2 px-3 text-lg font-bold uppercase text-blue-200 hover:bg-blue-800 hover:text-yellow-400 transition-colors duration-300 rounded"
                >
                  <Shield size={18} className="text-yellow-400" />
                  <span>Play</span>
                </Link>

                <Link
                  to="/puzzle"
                  className="flex items-center space-x-3 py-2 px-3 text-lg font-bold uppercase text-blue-200 hover:bg-blue-800 hover:text-yellow-400 transition-colors duration-300 rounded"
                >
                  <Sword size={18} className="text-yellow-400" />
                  <span>Puzzles</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-3 py-2 px-3 text-lg font-bold uppercase text-blue-200 hover:bg-blue-800 hover:text-yellow-400 transition-colors duration-300 rounded"
                >
                  <User size={18} className="text-yellow-400" />
                  <span>Profile</span>
                </Link>

                <div className="pt-2 mt-2 border-t border-blue-700">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 py-2 px-3 text-lg font-bold uppercase text-blue-200 hover:bg-blue-800 hover:text-yellow-400 transition-colors duration-300 w-full rounded"
                  >
                    <LogOut size={18} className="text-yellow-400" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="flex items-center space-x-3 py-2 px-3 text-lg font-bold uppercase text-blue-200 hover:bg-blue-800 hover:text-yellow-400 transition-colors duration-300 rounded"
                >
                  <User size={18} className="text-yellow-400" />
                  <span>Sign Up</span>
                </Link>

                <Link
                  to="/login"
                  className="flex items-center space-x-3 py-2 px-3 bg-blue-800 text-yellow-400 border-2 border-yellow-500 rounded text-lg font-bold uppercase transition-colors duration-300 mt-2"
                >
                  <LogOut size={18} />
                  <span>Login</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChessNavbar
