import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Mail, Lock, ChevronRight, Eye, EyeOff, CheckCircle } from "lucide-react"
import { login } from "../../store/authSlice"
import axios from "axios"
import { BASE_URL } from "../../url"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const LoadingSpinner = () => (
  <div className="w-5 h-5 border-t-2 border-blue-900 border-solid rounded-full animate-spin" aria-label="Loading"></div>
);

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile`, {
          withCredentials: true,
        })
        if (res.data) {
          dispatch(login(res.data))
          navigate("/modeselector")
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.debug("User not authenticated:", error.message)
        }
      }
    }
    
    checkAuthStatus()
  }, [dispatch, navigate])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = "Chess Master Login | Improve Your Chess Skills Online";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Sign in to Chess Master to continue your chess journey. Access personalized training, play matches against AI or real players, and track your progress.";
    
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = window.location.origin + "/login";
    
    return () => {
      document.title = "Chess Master | Online Chess Training & Games";
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault()
    setFormError("")

    if (!email || !password) {
      setFormError("Please fill in all fields")
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()
      if (response.ok) {
        setIsSuccess(true)

        dispatch(
          login({
            ...data,
            username: data.username || email.split("@")[0], 
          }),
        )

        toast.success("Login successful! Preparing your chessboard...")

        setTimeout(async () => {
          try {
            const profileRes = await axios.get(`${BASE_URL}/profile`, {
              withCredentials: true,
            })

            if (profileRes.data) {
              dispatch(login(profileRes.data))
            }

            navigate("/modeselector")
          } catch (profileError) {
            if (process.env.NODE_ENV === 'development') {
              console.error("Error fetching profile after login:", profileError)
            }
            navigate("/modeselector")
          }
        }, 300)
      } else {
        const errorMessage = data.error || "Login failed. Please check your credentials."
        setFormError(errorMessage)
        toast.error(errorMessage)
        setIsLoading(false)
      }
    } catch (error) {
      const errorMessage = "Connection error. Please try again later."
      if (process.env.NODE_ENV === 'development') {
        console.error("Error during login:", error)
      }
      setFormError(errorMessage)
      toast.error(errorMessage)
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
              Sign in to continue your chess journey
            </p>
          </div>
        </header>

        <main className="flex-grow px-4 sm:px-8 py-8 sm:py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg">
              <div className="bg-blue-800 -mt-8 -mx-6 mb-8 py-2 px-4 border-b-2 border-yellow-500">
                <h2 className="text-2xl font-bold text-yellow-400 uppercase">Player Login</h2>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200" role="alert">
                  {formError}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLogin} aria-label="Login form">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 block w-full px-4 py-3 bg-gray-800 border-2 border-blue-600 rounded-lg text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      aria-required="true"
                      autoFocus
                    />
                  </div>
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 block w-full px-4 py-3 bg-gray-800 border-2 border-blue-600 rounded-lg text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      aria-required="true"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-yellow-400"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-400 hover:text-yellow-400 transition duration-150 ease-in-out"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div>
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
                    <span>{isLoading ? "PREPARING BOARD..." : isSuccess ? "GAME READY!" : "ENTER GAME"}</span>
                    {!isLoading && !isSuccess && (
                      <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-blue-200">
                  Need a player account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-yellow-400 hover:text-yellow-300 transition duration-150 ease-in-out"
                  >
                    SIGN UP
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
              "@type": "WebApplication",
              "name": "Chess Master",
              "applicationCategory": "GameApplication",
              "operatingSystem": "Web",
              "description": "An online chess platform for training, playing, and improving chess skills",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }} />
        </main>
      </div>
    </div>
  )
}

export default Login