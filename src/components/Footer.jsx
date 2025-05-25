"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
Mail,
Github,
Twitter,
Youtube,
Linkedin,
ChevronRight
} from "lucide-react"
import ChessMasterLogo from "./ChessMasterLogo"

export default function Footer() {
const currentYear = new Date().getFullYear()
const [emailInput, setEmailInput] = useState("")
const [subscriptionStatus, setSubscriptionStatus] = useState(null)
const [isSubmitting, setIsSubmitting] = useState(false)

const footerLinks = [
{
title: "Game Modes",
links: [
  { name: "Play Online", path: "/global-multiplayer" },
  { name: "Daily Puzzles", path: "/puzzle" },
  { name: "vs Computer", path: "/against-stockfish" },
  { name: "Local Play", path: "/local-multiplayer" },
],
},
{
title: "Learn",
links: [
  { name: "Tutorials", path: "/tutorials" },
  { name: "Strategies", path: "/strategies" },
  { name: "Opening Database", path: "/openings" },
  { name: "Video Lessons", path: "/lessons" },
],
},
{
title: "Community",
links: [
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Use", path: "/terms" },
],
},
]

const socialLinks = [
{ name: "GitHub", icon: <Github size={20} />, link: "https://github.com" },
{ name: "Twitter", icon: <Twitter size={20} />, link: "https://twitter.com" },
{ name: "LinkedIn", icon: <Linkedin size={20} />, link: "https://www.linkedin.com" },
{ name: "YouTube", icon: <Youtube size={20} />, link: "https://youtube.com" },
]

const handleEmailSubmit = async (e) => {
e.preventDefault()

// Basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(emailInput)) {
setSubscriptionStatus({
  success: false,
  message: "Please enter a valid email address",
})
return
}

setIsSubmitting(true)

try {
// Simulating an API call to a newsletter service
await new Promise((resolve) => setTimeout(resolve, 1000))

setSubscriptionStatus({
  success: true,
  message: "Thank you for subscribing!",
})

setEmailInput("")
} catch (error) {
setSubscriptionStatus({
  success: false,
  message: "Subscription failed. Please try again.",
})
} finally {
setIsSubmitting(false)
}
}

return (
<footer className="bg-gray-900 text-blue-100 pt-12 pb-6 border-t-2 border-blue-700">
{/* Subtle chess board pattern background */}
<div>
</div>

<div className="max-w-6xl mx-auto px-4 relative z-10">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
    {/* Logo and about section */}
    <div className="md:col-span-1">
      <Link to="/" className="inline-block mb-4">
        <ChessMasterLogo variant="footer" />
      </Link>
      <p className="text-sm text-blue-300 mb-4">
        The ultimate chess experience with multiple game modes and a global community of players.
      </p>
      <div className="flex space-x-3 mb-4">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`Follow us on ${social.name}`}
            className="bg-blue-900 p-1.5 rounded-full border border-blue-700 text-yellow-400 hover:text-yellow-300 hover:bg-blue-800 transition-colors"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>

    {/* Navigation links */}
    {footerLinks.map((section, index) => (
      <div key={index} className="md:col-span-1">
        <h3 className="text-yellow-400 font-medium mb-4">
          {section.title}
        </h3>
        <ul className="space-y-2">
          {section.links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="text-blue-300 hover:text-yellow-400 transition-colors flex items-center text-sm group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-1">
                  <ChevronRight size={12} className="text-yellow-400" />
                </span>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>

  {/* Newsletter section */}
  <div className="border-t border-blue-800 pt-8 pb-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="md:w-1/2">
        <h4 className="text-yellow-400 font-medium mb-2 flex items-center">
          <Mail size={16} className="mr-2" />
          Subscribe to our newsletter
        </h4>
        <form onSubmit={handleEmailSubmit} className="flex max-w-md">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Your email"
            className="bg-gray-800 border border-blue-700 rounded-l px-3 py-2 w-full focus:outline-none focus:border-yellow-500 text-sm"
            aria-label="Email for newsletter"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-yellow-500 text-blue-900 px-4 text-sm font-medium rounded-r
            ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow-400"}`}
          >
            {isSubmitting ? "..." : "Subscribe"}
          </button>
        </form>
        {subscriptionStatus && (
          <p className={`text-xs mt-2 ${subscriptionStatus.success ? "text-green-500" : "text-red-500"}`}>
            {subscriptionStatus.message}
          </p>
        )}
      </div>
    </div>
  </div>
  
  {/* Bottom section with social links and copyright - styled as requested */}
  <div className="w-full bg-gray-900 border-2 border-blue-700 rounded-lg p-4 shadow-lg mt-6">
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <div className="flex flex-wrap justify-center gap-4">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`Follow us on ${social.name}`}
            className="bg-blue-900 p-2 rounded-full border border-blue-700 text-yellow-400 hover:text-yellow-300 hover:bg-blue-800 transition-colors"
          >
            {social.icon}
          </a>
        ))}
      </div>

      <div className="text-sm text-blue-300 text-center sm:text-right">
        <div className="flex items-center justify-center">
          <span className="mr-2 text-yellow-400 text-xl" aria-hidden="true">
            ♟
          </span>
          <p>&copy; {currentYear} Chess Master. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div className="flex justify-center mt-6">
    <div className="flex space-x-4" aria-hidden="true">
      <div className="text-2xl text-yellow-400 opacity-60">♟</div>
      <div className="text-2xl text-yellow-400 opacity-60">♞</div>
      <div className="text-2xl text-yellow-400 opacity-60">♝</div>
      <div className="text-2xl text-yellow-400 opacity-60">♜</div>
      <div className="text-2xl text-yellow-400 opacity-60">♛</div>
      <div className="text-2xl text-yellow-400 opacity-60">♚</div>
    </div>
  </div>
</footer>
)
}