import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, ChevronRight, Users, Globe, Shield, Award, Sword } from "lucide-react"

const gameModes = [
  {
    path: "/global-multiplayer",
    title: "Global Multiplayer",
    description: "Challenge players from around the world in real-time matches",
    icon: <Globe size={28} className="text-yellow-400" />,
    color: "blue",
  },
  {
    path: "/random-play",
    title: "Random Play",
    description: "Quick casual games with random moves for fun practice.",
    icon: <Sword size={28} className="text-yellow-400" />,
    color: "indigo",
  },
  {
    path: "/against-stockfish",
    title: "AI Opponents",
    description: "Test your skills against Stockfish, one of the strongest chess engines",
    icon: <Shield size={28} className="text-yellow-400" />,
    color: "red",
  },
  {
    path: "/puzzle",
    title: "Tactical Puzzles",
    description: "Improve your chess vision with challenging puzzles for all skill levels",
    icon: <Award size={28} className="text-yellow-400" />,
    color: "yellow",
  },
  {
    path: "/local-multiplayer",
    title: "Local Multiplayer",
    description: "Play face-to-face with a friend on the same device",
    icon: <Users size={28} className="text-yellow-400" />,
    color: "green",
  },
]

export default function GameModeSelector() {
  const navigate = useNavigate()
  const [selectedMode, setSelectedMode] = useState(null)
  const [activeEffect, setActiveEffect] = useState(null)
  const [hoveredMode, setHoveredMode] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    
    document.title = "Chess Master Game Modes | Choose Your Chess Experience"
    
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = "description"
      document.head.appendChild(metaDescription)
    }
    metaDescription.content = "Select from various chess game modes including global multiplayer, AI opponents, tactical puzzles, and local multiplayer to enhance your chess skills and experience."
    
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = "canonical"
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = window.location.origin + "/modeselector"
    
    return () => {
      document.title = "Chess Master | Online Chess Training & Games"
    }
  }, [])

  const handleModeSelect = (path, index) => {
    setSelectedMode(index)
    setActiveEffect(index)
    setIsLoading(true)
    
    setTimeout(() => {
      navigate(path)
    }, 700)
  }

  const getColorClasses = (color) => {
    switch(color) {
      case 'blue':
        return "border-blue-700 from-blue-800 to-blue-900"
      case 'indigo':
        return "border-indigo-700 from-indigo-800 to-indigo-900"
      case 'red':
        return "border-red-700 from-red-800 to-red-900"
      case 'yellow':
        return "border-yellow-700 from-yellow-800 to-yellow-900"
      case 'green':
        return "border-green-700 from-green-800 to-green-900"
      default:
        return "border-blue-700 from-blue-800 to-blue-900"
    }
  }

  const LoadingSpinner = () => (
    <div className="w-5 h-5 border-t-2 border-blue-900 border-solid rounded-full animate-spin" aria-label="Loading"></div>
  )

  return (
    <div className="relative w-screen overflow-x-hidden bg-gray-950 font-mono">
      <div className="fixed inset-0 z-0 perspective-1000" aria-hidden="true">
        <div 
          className="absolute inset-0 transform-style-3d rotate-x-60 scale-150"
          style={{
            backgroundImage: `linear-gradient(to right, transparent 0%, transparent 12.5%, #222 12.5%, #222 25%, 
                             transparent 25%, transparent 37.5%, #222 37.5%, #222 50%,
                             transparent 50%, transparent 62.5%, #222 62.5%, #222 75%,
                             transparent 75%, transparent 87.5%, #222 87.5%, #222 100%)`,
            backgroundSize: '200px 100px',
            opacity: 0.15
          }}
        ></div>
      </div>

      <div className="relative z-10 pt-16 flex flex-col">
        <header className="w-full bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 border-b-4 border-yellow-500 shadow-lg py-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 pixelated drop-shadow-md">
              CHESS MASTER
            </h1>
            <div className="h-1 w-32 mx-auto bg-yellow-500 mb-4"></div>
            <p className="text-lg text-blue-100">
              Choose Your Chess Experience
            </p>
          </div>
        </header>

        <main className="flex-grow px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel mb-8">
              <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                <h2 className="text-2xl font-bold text-yellow-400 uppercase">Select Game Mode</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameModes.map((mode, index) => (
                  <div 
                    key={index}
                    className={`bg-gray-800 border-2 ${selectedMode === index ? 'border-yellow-500 transform scale-105' : `${getColorClasses(mode.color)}`} rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl game-selector-card cursor-pointer`}
                    onClick={() => handleModeSelect(mode.path, index)}
                    onMouseEnter={() => setHoveredMode(index)}
                    onMouseLeave={() => setHoveredMode(null)}
                    role="button"
                    aria-label={`Select ${mode.title} game mode`}
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleModeSelect(mode.path, index)
                      }
                    }}
                  >
                    <div className={`bg-gradient-to-b ${getColorClasses(mode.color)} px-4 py-3 flex items-center`}>
                      <div className="bg-gray-900 p-2 rounded-full border-2 border-yellow-500 mr-3" aria-hidden="true">
                        {mode.icon}
                      </div>
                      <h3 className="text-xl font-bold text-yellow-400">{mode.title}</h3>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-blue-100 mb-4">{mode.description}</p>
                      
                      <div className={`flex justify-center ${activeEffect === index ? 'animate-pulse' : ''}`}>
                        <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-lg border-2 border-yellow-700 transition-transform transform hover:scale-105 flex items-center">
                          {selectedMode === index && isLoading ? (
                            <>
                              <LoadingSpinner />
                              <span className="ml-2">PREPARING...</span>
                            </>
                          ) : (
                            <>
                              PLAY NOW
                              <ChevronRight className="ml-1 w-5 h-5" aria-hidden="true" />
                            </>
                          )}
                        </span>
                      </div>
                      
                      {hoveredMode === index && (
                        <>
                          <Sparkles className="absolute top-3 right-3 text-yellow-400 w-4 h-4" aria-hidden="true" />
                          <Sparkles className="absolute bottom-3 left-3 text-yellow-400 w-4 h-4" aria-hidden="true" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mb-8 space-x-6" aria-hidden="true">
              <div className="text-4xl text-white">♟</div>
              <div className="text-4xl text-white">♞</div>
              <div className="text-4xl text-white">♝</div>
              <div className="text-4xl text-white">♜</div>
              <div className="text-4xl text-white">♛</div>
              <div className="text-4xl text-white">♚</div>
            </div>

            <div className="text-center mb-8">
              <button
                onClick={() => navigate("/profile")}
                className="inline-block px-8 py-4 bg-gradient-to-b from-gray-700 to-gray-800 text-white rounded-lg border-2 border-blue-700 text-lg font-bold uppercase hover:bg-gray-700 transition duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Go back to profile"
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                  BACK TO PROFILE
                </span>
              </button>
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
              },
              "potentialAction": {
                "@type": "ViewAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://chessmaster.example.com/modeselector"
                }
              }
            })
          }} />
        </main>
      </div>
    </div>
  )
}