import React, { useState, useEffect } from "react";
import { Users, Globe, ChevronRight, Award, Sword, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const [activeTab, setActiveTab] = useState("story");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let pageTitle = "About Chess Master | Online Chess Training & Games";
    if (activeTab === "features") {
      pageTitle = "Chess Master Features | Learn and Play Chess Online";
    } else if (activeTab === "creator") {
      pageTitle = "Meet The Creator | Chess Master Online Platform";
    }
    document.title = pageTitle;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Learn about Chess Master, a simple chess platform to practice, learn, and enjoy chess online. Join our community of chess enthusiasts from over 20 countries.";
    
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = window.location.origin + "/about";
    
    return () => {
      document.title = "Chess Master | Online Chess Training & Games";
    };
  }, [activeTab]);

  const stats = [
    { label: "Active Players", value: "1,000+", icon: <Users size={24} className="text-yellow-400" aria-hidden="true" /> },
    { label: "Countries", value: "20+", icon: <Globe size={24} className="text-yellow-400" aria-hidden="true" /> }
  ];

  const chessPieces = ["♟", "♞", "♝", "♜", "♛", "♚"];
  
  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-gray-950 font-mono">
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

      <div className="relative z-10 py-16 md:py-28 min-h-screen flex flex-col">
        <header className="w-full bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 border-b-4 border-yellow-500 shadow-lg py-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 drop-shadow-md">
              CHESS MASTER
            </h1>
            <div className="h-1 w-32 mx-auto bg-yellow-500 mb-4"></div>
            <p className="text-lg text-blue-100">
              A simple chess platform created to help players practice, learn, and enjoy the game online.
            </p>
          </div>
        </header>

        <nav className="bg-gray-900 border-b-2 border-blue-800 shadow-md" aria-label="About page navigation">
          <div className="max-w-6xl mx-auto px-4 py-2 flex justify-center">
            {["story", "features", "creator"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 mx-2 text-lg font-bold uppercase transition-all ${
                  activeTab === tab
                    ? "bg-blue-800 text-yellow-400 border-2 border-yellow-500 shadow-yellow-400/20 shadow-md"
                    : "text-blue-300 hover:bg-blue-900 border-2 border-transparent"
                }`}
                aria-pressed={activeTab === tab}
                aria-label={`View ${tab === "story" ? "About" : tab === "features" ? "Features" : "Creator"} section`}
              >
                {tab === "story" && "About"}
                {tab === "features" && "Features"}
                {tab === "creator" && "Creator"}
              </button>
            ))}
          </div>
        </nav>

        <main className="flex-grow px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === "story" && (
              <div className="space-y-8">
                <section className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                  <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                    <h2 className="text-2xl font-bold text-yellow-400 uppercase">The Story</h2>
                  </div>
                  
                  <p className="mb-4 text-blue-100">
                    Chess Master started as a personal project in 2023. As a chess enthusiast myself, I wanted to create a 
                    simple platform where players could practice and improve their skills.
                  </p>
                  <p className="text-blue-100">
                    What began as a hobby project has slowly grown into a small community of chess players from around 
                    the world. I continue to develop and maintain the site in my spare time, adding new features based 
                    on user feedback.
                  </p>
                </section>
                
                <section className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                  <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                    <h2 className="text-2xl font-bold text-yellow-400 uppercase">Chess Master Today</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {stats.map((stat) => (
                      <div key={stat.label} className="bg-gray-800 border-2 border-blue-600 p-4 flex items-center">
                        <div className="mr-4 bg-blue-900 p-3 rounded-full border-2 border-yellow-500">
                          {stat.icon}
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-400">{stat.value}</div>
                          <div className="text-blue-200 text-sm">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-blue-100">
                    While still a modest platform, Chess Master continues to grow through word of mouth and the 
                    support of its community.
                  </p>

                  <div className="flex justify-center mt-6 space-x-4" aria-hidden="true">
                    {chessPieces.map((piece, index) => (
                      <div key={index} className="text-4xl text-white">{piece}</div>
                    ))}
                  </div>
                </section>
              </div>
            )}
            
            {activeTab === "features" && (
              <section className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                  <h2 className="text-2xl font-bold text-yellow-400 uppercase">Features</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800 border-2 border-blue-600 p-4 flex items-center">
                    <div className="mr-4 bg-blue-900 p-2 rounded-full">
                      <Shield size={24} className="text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="text-blue-100">Play chess against a simple AI opponent</div>
                  </div>
                  
                  <div className="bg-gray-800 border-2 border-blue-600 p-4 flex items-center">
                    <div className="mr-4 bg-blue-900 p-2 rounded-full">
                      <Award size={24} className="text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="text-blue-100">Practice with chess puzzles at various difficulty levels</div>
                  </div>
                  
                  <div className="bg-gray-800 border-2 border-blue-600 p-4 flex items-center">
                    <div className="mr-4 bg-blue-900 p-2 rounded-full">
                      <Sword size={24} className="text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="text-blue-100">Learn basic openings and strategies</div>
                  </div>
                  
                  <div className="bg-gray-800 border-2 border-blue-600 p-4 flex items-center">
                    <div className="mr-4 bg-blue-900 p-2 rounded-full">
                      <Users size={24} className="text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="text-blue-100">Track your progress and see your rating change over time</div>
                  </div>
                  
                  <div className="bg-gray-800 border-2 border-blue-600 p-4 flex items-center">
                    <div className="mr-4 bg-blue-900 p-2 rounded-full">
                      <Globe size={24} className="text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="text-blue-100">Challenge other players to friendly matches</div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="bg-gray-800 border-2 border-yellow-600 p-4">
                    <h3 className="text-xl font-bold text-yellow-400 uppercase mb-4">Coming Soon</h3>
                    <ul className="space-y-2 text-blue-100" aria-label="Upcoming features">
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" aria-hidden="true"></div>
                        More advanced AI opponents
                      </li>
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" aria-hidden="true"></div>
                        Analysis tools for reviewing your games
                      </li>
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" aria-hidden="true"></div>
                        Mobile-friendly interface
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            )}
            
            {activeTab === "creator" && (
              <section className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                  <h2 className="text-2xl font-bold text-yellow-400 uppercase">About the Creator</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                  <div className="w-32 h-32 rounded-full border-4 border-yellow-500 p-1 bg-blue-900">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img 
                        src="/api/placeholder/128/128" 
                        alt="Chess Master" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400">Lokesh Reddy</h3>
                    <p className="text-blue-300">Web Developer</p>
                    <p className="mt-2 text-blue-100">
                      I'm a web developer who loves chess. I created Chess Master as a way to combine my 
                      passion for programming and chess into something useful for the community.
                    </p>
                  </div>
                </div>
                <p className="text-blue-100">
                  I maintain Chess Master in my free time and am always open to feedback and suggestions for 
                  improvements. Feel free to reach out if you have ideas or want to contribute to the project!
                </p>
              </section>
            )}
          </div>
        </main>

        <div className="w-full bg-gray-900 border-t-4 border-blue-800 py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-yellow-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 uppercase">
                Ready to Play Some Chess?
              </h2>
              
              <p className="text-blue-100 mb-8">
                Join our growing community of chess enthusiasts and improve your game today.
              </p>
              
              <Link
                to="/signup"
                className="inline-block px-8 py-4 bg-yellow-500 text-blue-900 text-xl font-bold uppercase rounded-lg hover:bg-yellow-400 transition-colors shadow-lg border-2 border-yellow-700 transform hover:scale-105 transition-transform flex items-center justify-center"
                aria-label="Sign up for Chess Master"
              >
                <span>PLAY NOW</span>
                <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
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
            },
            "author": {
              "@type": "Person",
              "name": "Lokesh Reddy"
            }
          })
        }} />
      </div>
    </div>
  );
}