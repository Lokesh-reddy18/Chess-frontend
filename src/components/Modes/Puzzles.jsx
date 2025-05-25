"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Award, Sword, Shield } from "lucide-react"

export default function Puzzles() {
  const [activeCategory, setActiveCategory] = useState("big-three")

  useEffect(() => {
    window.scrollTo(0, 0)

    // SEO Optimization
    document.title = "Chess Master: Tactical Puzzles | Improve Your Chess Skills"

    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement("meta")
      metaDescription.name = "description"
      document.head.appendChild(metaDescription)
    }
    metaDescription.content =
      "Challenge your mind with tactical chess puzzles designed for all skill levels. Improve your chess vision, strategic thinking, and problem-solving abilities."

    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement("link")
      canonicalLink.rel = "canonical"
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = window.location.origin + "/puzzles"

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Game",
      name: "Chess Master - Tactical Puzzles",
      description: "Challenge your mind with tactical chess puzzles designed for all skill levels.",
      genre: "Board Game",
      gamePlatform: "Web Browser",
      applicationCategory: "GameApplication",
    }

    let scriptTag = document.querySelector('script[type="application/ld+json"]')
    if (!scriptTag) {
      scriptTag = document.createElement("script")
      scriptTag.type = "application/ld+json"
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(structuredData)

    return () => {
      document.title = "Chess Master | Online Chess Training & Games"
    }
  }, [])

  // Top puzzles
  const topPuzzles = [
    {
      path: "/puzzle1",
      title: "The Magician's Puzzle",
      description: "A complex puzzle that requires creative thinking and tactical vision",
      icon: "♞", // Knight
      color: "blue",
    },
    {
      path: "/puzzle2",
      title: "The Mighty Knight Puzzle",
      description: "Master the knight's unique movement to solve this challenging puzzle",
      icon: "♛", // Queen
      color: "red",
    },
    {
      path: "/puzzle3",
      title: "The Enigmatic Puzzle",
      description: "An intricate puzzle that will test even the most skilled players",
      icon: "♟", // Pawn
      color: "green",
    },
  ]

  // Mate in one puzzles
  const mateInOne = [
    {
      path: "/puzzle4",
      title: "Easy Mate-in-One",
      description: "Perfect for beginners looking to improve their checkmate vision",
      icon: "♝", // Bishop
      color: "yellow",
    },
    {
      path: "/puzzle5",
      title: "Normal Mate-in-One",
      description: "Standard difficulty checkmate puzzles for intermediate players",
      icon: "♜", // Rook
      color: "purple",
    },
    {
      path: "/puzzle6",
      title: "Hard Mate-in-One",
      description: "Challenge yourself with these difficult mate-in-one positions",
      icon: "♚", // King
      color: "gray",
    },
  ]

  // Debounce function for performance optimization
  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  // Navigate to puzzle with debounce for better performance
  const handlePuzzleClick = debounce((path) => {
    if (path) {
      window.location.href = path // Using direct location change for demo
    }
  }, 100)

  // Get color class based on color name
  const getColorClass = (color) => {
    const colorMap = {
      blue: "border-blue-600 bg-blue-900",
      red: "border-red-600 bg-red-900",
      green: "border-green-600 bg-green-900",
      yellow: "border-yellow-600 bg-yellow-900",
      purple: "border-purple-600 bg-purple-900",
      gray: "border-gray-600 bg-gray-800",
    }
    return colorMap[color] || "border-blue-600 bg-blue-900"
  }

  // Get title color based on color name
  const getTitleColor = (color) => {
    const colorMap = {
      blue: "text-blue-300",
      red: "text-red-300",
      green: "text-green-300",
      yellow: "text-yellow-400",
      purple: "text-purple-300",
      gray: "text-gray-300",
    }
    return colorMap[color] || "text-blue-300"
  }

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-gray-950 font-mono">
      {/* Chess board background with perspective */}
      <div className="fixed inset-0 z-0 perspective-1000">
        <div
          className="absolute inset-0 transform-style-3d rotate-x-60 scale-150"
          style={{
            backgroundImage: `linear-gradient(to right, transparent 0%, transparent 12.5%, #222 12.5%, #222 25%, 
                             transparent 25%, transparent 37.5%, #222 37.5%, #222 50%,
                             transparent 50%, transparent 62.5%, #222 62.5%, #222 75%,
                             transparent 75%, transparent 87.5%, #222 87.5%, #222 100%)`,
            backgroundSize: "200px 100px",
            opacity: 0.15,
          }}
        ></div>
      </div>

      {/* Game UI Container */}
      <div className="relative z-10 py-16 md:py-28 min-h-screen flex flex-col">
        {/* Game Header Banner */}
        <header className="w-full bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 border-b-4 border-yellow-500 shadow-lg py-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 pixelated drop-shadow-md">
              CHESS PUZZLES
            </h1>
            <div className="h-1 w-32 mx-auto bg-yellow-500 mb-4"></div>
            <p className="text-lg text-blue-100">
              Challenge your mind with tactical puzzles and improve your chess skills
            </p>
          </div>
        </header>

        {/* Game Menu Tabs */}
        <nav className="bg-gray-900 border-b-2 border-blue-800 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-2 flex justify-center">
            <button
              onClick={() => setActiveCategory("big-three")}
              className={`px-6 py-3 mx-2 text-lg font-bold uppercase transition-all ${
                activeCategory === "big-three"
                  ? "bg-blue-800 text-yellow-400 border-2 border-yellow-500 shadow-yellow-400/20 shadow-md"
                  : "text-blue-300 hover:bg-blue-900 border-2 border-transparent"
              }`}
              aria-label="Show the big three puzzles"
            >
              The Big Three
            </button>
            <button
              onClick={() => setActiveCategory("mate-in-one")}
              className={`px-6 py-3 mx-2 text-lg font-bold uppercase transition-all ${
                activeCategory === "mate-in-one"
                  ? "bg-blue-800 text-yellow-400 border-2 border-yellow-500 shadow-yellow-400/20 shadow-md"
                  : "text-blue-300 hover:bg-blue-900 border-2 border-transparent"
              }`}
              aria-label="Show mate in one puzzles"
            >
              Mate in One
            </button>
          </div>
        </nav>

        {/* Main Content Area - Game Panel Style */}
        <main className="flex-grow px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {activeCategory === "big-three" && (
              <div className="space-y-6">
                <section className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                  <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                    <h2 className="text-2xl font-bold text-yellow-400 uppercase">The Big Three (Hardest Puzzles)</h2>
                  </div>

                  <p className="mb-6 text-blue-100">
                    These are our most challenging puzzles designed to test your tactical vision and strategic thinking.
                    Only the most skilled players can solve all three!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topPuzzles.map((puzzle, index) => (
                      <article
                        key={index}
                        onClick={() => handlePuzzleClick(puzzle.path)}
                        className="bg-gray-800 border-4 border-blue-700 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform shadow-lg hover:shadow-blue-700/30"
                        aria-label={puzzle.title}
                      >
                        <div className={`py-2 text-center ${getColorClass(puzzle.color)}`}>
                          <span className="text-4xl">{puzzle.icon}</span>
                        </div>

                        <div className="p-4">
                          <h3 className={`text-xl font-bold mb-2 ${getTitleColor(puzzle.color)}`}>{puzzle.title}</h3>
                          <p className="text-blue-100 text-sm mb-4">{puzzle.description}</p>

                          <div className="flex justify-center">
                            <button
                              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded flex items-center border-2 border-yellow-600 transform active:translate-y-1 transition-transform"
                              aria-label={`Solve ${puzzle.title}`}
                            >
                              SOLVE <ChevronRight size={18} className="ml-1" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                  <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                    <h2 className="text-2xl font-bold text-yellow-400 uppercase">Puzzle Rewards</h2>
                  </div>

                  <div className="flex flex-col md:flex-row justify-around items-center">
                    <div className="flex flex-col items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 flex items-center justify-center bg-blue-900 rounded-full border-2 border-yellow-500 mb-2">
                        <Shield size={32} className="text-yellow-400" />
                      </div>
                      <p className="text-yellow-400 font-bold">+20 XP</p>
                      <p className="text-blue-200 text-sm">Per Solve</p>
                    </div>

                    <div className="flex flex-col items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 flex items-center justify-center bg-blue-900 rounded-full border-2 border-yellow-500 mb-2">
                        <Award size={32} className="text-yellow-400" />
                      </div>
                      <p className="text-yellow-400 font-bold">Special Badge</p>
                      <p className="text-blue-200 text-sm">All Three Solved</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 flex items-center justify-center bg-blue-900 rounded-full border-2 border-yellow-500 mb-2">
                        <Sword size={32} className="text-yellow-400" />
                      </div>
                      <p className="text-yellow-400 font-bold">+50 Rating</p>
                      <p className="text-blue-200 text-sm">Per Perfect Solve</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeCategory === "mate-in-one" && (
              <section className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                  <h2 className="text-2xl font-bold text-yellow-400 uppercase">Mate in One Move</h2>
                </div>

                <p className="mb-6 text-blue-100">
                  Practice your checkmate vision with these carefully selected positions. Find the winning move that
                  leads to an immediate checkmate!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {mateInOne.map((puzzle, index) => (
                    <article
                      key={index}
                      onClick={() => handlePuzzleClick(puzzle.path)}
                      className="bg-gray-800 border-4 border-blue-700 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform shadow-lg hover:shadow-blue-700/30"
                      aria-label={puzzle.title}
                    >
                      <div className={`py-2 text-center ${getColorClass(puzzle.color)}`}>
                        <span className="text-4xl">{puzzle.icon}</span>
                      </div>

                      <div className="p-4">
                        <h3 className={`text-xl font-bold mb-2 ${getTitleColor(puzzle.color)}`}>{puzzle.title}</h3>
                        <p className="text-blue-100 text-sm mb-4">{puzzle.description}</p>

                        <div className="flex justify-center">
                          <button
                            className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded flex items-center border-2 border-yellow-600 transform active:translate-y-1 transition-transform"
                            aria-label={`Solve ${puzzle.title}`}
                          >
                            SOLVE <ChevronRight size={18} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="bg-gray-800 border-2 border-yellow-600 p-4 rounded">
                  <h3 className="text-xl font-bold text-yellow-400 uppercase mb-4">Difficulty Levels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-900/50 p-3 border border-blue-700 rounded">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-green-400 font-bold">EASY</span>
                      </div>
                      <p className="text-blue-100 text-sm">Perfect for beginners and casual players</p>
                    </div>

                    <div className="bg-blue-900/50 p-3 border border-blue-700 rounded">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                        <span className="text-yellow-400 font-bold">NORMAL</span>
                      </div>
                      <p className="text-blue-100 text-sm">Designed for intermediate players</p>
                    </div>

                    <div className="bg-blue-900/50 p-3 border border-blue-700 rounded">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-red-500 font-bold">HARD</span>
                      </div>
                      <p className="text-blue-100 text-sm">Challenging positions for advanced players</p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>

        {/* Call to Action - Game Button Style */}
        <div className="w-full bg-gray-900 border-t-4 border-blue-800 py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-yellow-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 uppercase">Ready for More Challenges?</h2>

              <p className="text-blue-100 mb-8">
                Practice regularly to improve your tactical skills and climb the leaderboard!
              </p>

              <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
                <a
                  href="/play"
                  className="inline-block px-8 py-4 bg-yellow-500 text-blue-900 text-xl font-bold uppercase rounded-lg hover:bg-yellow-400 transition-colors shadow-lg border-2 border-yellow-700 transform hover:scale-105 transition-transform"
                  aria-label="Play a chess match"
                >
                  PLAY MATCH
                </a>

                <a
                  href="/leaderboard"
                  className="inline-block px-8 py-4 bg-blue-700 text-yellow-400 text-xl font-bold uppercase rounded-lg hover:bg-blue-600 transition-colors shadow-lg border-2 border-blue-900 transform hover:scale-105 transition-transform"
                  aria-label="View leaderboard"
                >
                  LEADERBOARD
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
