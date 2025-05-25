import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, CheckCircle, User, Mail, Lock, ChevronRight } from "lucide-react"
import { BASE_URL } from "../../url"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"

const LoadingSpinner = () => (
  <div className="w-5 h-5 border-t-2 border-blue-900 border-solid rounded-full animate-spin" aria-label="Loading"></div>
);

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    window.scrollTo(0, 0)
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile`, {
          withCredentials: true,
        })
        if (res.data) {
          navigate("/modeselector")
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.debug("User not authenticated:", error.message)
        }
      }
    }
    
    checkAuthStatus()
  }, [navigate])

  useEffect(() => {
    document.title = "Chess Master Registration | Create Your Chess Account";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Join Chess Master today. Create your player account to access personalized chess training, compete in matches, and track your progress as you improve your chess skills.";
    
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = window.location.origin + "/signup";
    
    return () => {
      document.title = "Chess Master | Online Chess Training & Games";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword)
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Username is required"
    } else if (formData.name.length < 3) {
      newErrors.name = "Username must be at least 3 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const { name, email, password } = formData

    setIsLoading(true)

    try {
      const res = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setIsSuccess(true)
      toast.success("Account created successfully! Redirecting to login...")

      setTimeout(() => {
        navigate("/login")
      }, 1500)
    } catch (error) {
      const errorMessage = error.message || "Registration failed. Please try again."
      if (process.env.NODE_ENV === 'development') {
        console.error("Error during signup:", error)
      }
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const chessPieces = ["♟", "♞", "♝", "♜", "♛", "♚"]

  return (
    <div className="relative w-screen bg-gray-950 font-mono overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, transparent 0%, transparent 12.5%, #222 12.5%, #222 25%, 
                            transparent 25%, transparent 37.5%, #222 37.5%, #222 50%,
                            transparent 50%, transparent 62.5%, #222 62.5%, #222 75%,
                            transparent 75%, transparent 87.5%, #222 87.5%, #222 100%)`,
            backgroundSize: '200px 100px',
            opacity: 0.15
          }}
          aria-hidden="true"
        ></div>
      </div>

      <div className="relative z-10 flex flex-col">
        <header className="w-full bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 border-b-4 border-yellow-500 shadow-lg py-4 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 drop-shadow-md">
              CHESS MASTER
            </h1>
            <div className="h-1 w-32 mx-auto bg-yellow-500 mb-4"></div>
            <p className="text-lg text-blue-100">
              Create a new player account
            </p>
          </div>
        </header>

        <main className="flex-grow px-4 sm:px-8 py-8 sm:py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg">
              <div className="bg-blue-800 -mt-8 -mx-6 mb-8 py-2 px-4 border-b-2 border-yellow-500">
                <h2 className="text-2xl font-bold text-yellow-400 uppercase">New Player Registration</h2>
              </div>

              <form className="space-y-5" onSubmit={onSubmitHandler} aria-label="Registration form">
                <div>
                  <label htmlFor="username" className="block text-lg font-medium text-yellow-400 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="name"
                      className={`pl-10 block w-full px-4 py-3 bg-gray-800 border-2 ${
                        errors.name ? "border-red-500" : "border-blue-600"
                      } rounded-lg text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                      placeholder="Choose your player name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="username"
                      aria-required="true"
                      autoFocus
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-400" role="alert">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-yellow-400 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`pl-10 block w-full px-4 py-3 bg-gray-800 border-2 ${
                        errors.email ? "border-red-500" : "border-blue-600"
                      } rounded-lg text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      aria-required="true"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-400" role="alert">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-lg font-medium text-yellow-400 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className={`pl-10 block w-full px-4 py-3 bg-gray-800 border-2 ${
                        errors.password ? "border-red-500" : "border-blue-600"
                      } rounded-lg text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      aria-required="true"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-yellow-400"
                      onClick={() => togglePasswordVisibility("password")}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-400" role="alert">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-lg font-medium text-yellow-400 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`pl-10 block w-full px-4 py-3 bg-gray-800 border-2 ${
                        errors.confirmPassword ? "border-red-500" : "border-blue-600"
                      } rounded-lg text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      aria-required="true"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-yellow-400"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-400" role="alert">{errors.confirmPassword}</p>}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-yellow-500 text-blue-900 text-xl font-bold uppercase rounded-lg hover:bg-yellow-400 transition-colors shadow-lg border-2 border-yellow-700 transform hover:scale-105 transition-transform flex justify-center items-center"
                    disabled={isLoading || isSuccess}
                    aria-busy={isLoading}
                  >
                    {isLoading && (
                      <span className="mr-2">
                        <LoadingSpinner />
                      </span>
                    )}
                    {isSuccess && (
                      <CheckCircle className="w-5 h-5 text-blue-900 mr-2" aria-hidden="true" />
                    )}
                    <span>{isLoading ? "SETTING UP PLAYER..." : isSuccess ? "PLAYER CREATED!" : "JOIN THE GAME"}</span>
                    {!isLoading && !isSuccess && (
                      <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-blue-200">
                  Already have a player account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-yellow-400 hover:text-yellow-300 transition duration-150 ease-in-out"
                  >
                    SIGN IN
                  </Link>
                </p>
              </div>

              <div className="flex justify-center mt-6 space-x-4" aria-hidden="true">
                {chessPieces.map((piece, index) => (
                  <div key={index} className="text-4xl text-white">{piece}</div>
                ))}
              </div>
            </div>
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Chess Master - Player Registration",
              "description": "Create your Chess Master account to start your chess journey, track progress, and join competitions.",
              "mainEntity": {
                "@type": "WebApplication",
                "name": "Chess Master",
                "applicationCategory": "GameApplication",
                "operatingSystem": "Web"
              }
            })
          }} />
        </main>
      </div>
    </div>
  )
}

export default SignUp