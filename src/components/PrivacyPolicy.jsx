import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Footer from "./Footer"
import ChessMasterLogo from "./ChessMasterLogo"
import { useEffect } from "react"

export default function PrivacyPolicy() {
  const navigate = useNavigate()

   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Chess board pattern background */}
      <div
        className="fixed inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(45deg, #111 25%, transparent 25%), 
                          linear-gradient(-45deg, #111 25%, transparent 25%), 
                          linear-gradient(45deg, transparent 75%, #111 75%), 
                          linear-gradient(-45deg, transparent 75%, #111 75%)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
        }}
        aria-hidden="true"
      ></div>

      {/* Header with back button */}
      <header className="relative z-10 w-full bg-gradient-to-r from-gray-900 to-black py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-300 hover:text-blue-400 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go back"
          >
            <ChevronLeft size={20} className="mr-1" />
            <span>Back</span>
          </motion.button>
          <div className="flex-1 flex justify-center">
            <ChessMasterLogo variant="small" />
          </div>
          <div className="w-20"></div> {/* Empty div for balance */}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 sm:p-10 shadow-lg shadow-blue-900/10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8 text-center">
            Privacy Policy
          </h1>
          
          <div className="text-gray-200 space-y-6">
            <p className="text-sm text-gray-400">Last Updated: April 27, 2025</p>
            
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Introduction</h2>
              <p>
                Welcome to Chess Master. We respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                use our website and services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Information We Collect</h2>
              <p className="mb-3">
                We collect information that you provide directly to us, such as when you create an account, 
                participate in games, or communicate with us. This may include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Personal identifiers (name, email address, username)</li>
                <li>Account credentials</li>
                <li>Game statistics and performance data</li>
                <li>Communications you send to us</li>
              </ul>
              <p className="mt-3">
                We also automatically collect certain information when you use our services, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Device information (browser type, operating system, IP address)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">How We Use Your Information</h2>
              <p className="mb-3">We use your information for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and complete transactions</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Personalize your experience</li>
                <li>Develop new features and services</li>
                <li>Protect against fraudulent, unauthorized, or illegal activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Sharing of Information</h2>
              <p>
                We may share your information in the following situations:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>With service providers who perform services on our behalf</li>
                <li>For legal, protection, and safety purposes</li>
                <li>In connection with a business transaction such as a merger or acquisition</li>
                <li>When you provide consent for us to do so</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect the security of your personal information. 
                However, please be aware that no security system is impenetrable, and we cannot guarantee the absolute security of 
                your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Your Data Rights</h2>
              <p className="mb-3">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access to your personal data</li>
                <li>Correction of inaccurate or incomplete data</li>
                <li>Deletion of your personal data</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Children's Privacy</h2>
              <p>
                Our services are not intended for children under the age of 13. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child has provided 
                us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Changes to this Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated 
                "Last Updated" date. We encourage you to review this Privacy Policy frequently to stay informed about how 
                we are protecting your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <p className="mt-3 text-blue-400">support@chessmaster.example.com</p>
            </section>
          </div>
        </motion.div>
      </main>

    </div>
  )
}