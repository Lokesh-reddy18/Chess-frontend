import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Footer from "./Footer"
import ChessMasterLogo from "./ChessMasterLogo"
import { useEffect } from "react"

export default function TermsAndConditions() {
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
            Terms and Conditions
          </h1>
          
          <div className="text-gray-200 space-y-6">
            <p className="text-sm text-gray-400">Last Updated: April 27, 2025</p>
            
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Acceptance of Terms</h2>
              <p>
                Welcome to Chess Master. These Terms and Conditions govern your access to and use of our website, 
                mobile application, and services. By accessing or using Chess Master, you agree to be bound by these 
                Terms. If you do not agree to these Terms, please do not use our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Definitions</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>"Service" refers to the Chess Master website, application, and all content and functionalities provided therein.</li>
                <li>"User," "You," and "Your" refer to the individual accessing or using the Service.</li>
                <li>"We," "Us," and "Our" refer to Chess Master and its operators.</li>
                <li>"Content" includes text, graphics, logos, images, audio, video, software, and other material.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Account Registration</h2>
              <p className="mb-3">
                To access certain features of our Service, you may be required to register for an account. When registering, you agree to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Be responsible for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="mt-3">
                We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">User Conduct</h2>
              <p className="mb-3">
                When using our Service, you agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Use the Service for illegal or unauthorized purposes</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use cheating tools, bots, or automation software</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Post or transmit harmful or malicious code</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or store personal data about other users without consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Intellectual Property</h2>
              <p className="mb-3">
                The Service and all Content, features, and functionality are owned by Chess Master and are protected by 
                copyright, trademark, and other intellectual property laws. You may not:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Reproduce, distribute, modify, or create derivative works</li>
                <li>Use any Content for commercial purposes without our permission</li>
                <li>Remove any copyright, trademark, or other proprietary notices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">User Content</h2>
              <p className="mb-3">
                By submitting content to our Service (such as profile information or messages), you:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content</li>
                <li>Represent that you own or have the necessary rights to such content</li>
                <li>Acknowledge that we have the right to remove any content that violates these Terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
                INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT,
                OR COURSE OF PERFORMANCE. WE DO NOT WARRANT THAT THE SERVICE WILL FUNCTION UNINTERRUPTED, SECURE, OR AVAILABLE AT
                ANY PARTICULAR TIME OR LOCATION, OR THAT ANY ERRORS OR DEFECTS WILL BE CORRECTED.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Limitation of Liability</h2>
              <p>
                IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                INCLUDING LOSS OF PROFITS, DATA, USE, OR GOODWILL, WHETHER IN AN ACTION IN CONTRACT, TORT, OR OTHERWISE,
                ARISING OUT OF OR IN CONNECTION WITH THE USE OF OR INABILITY TO USE THE SERVICE. OUR TOTAL LIABILITY FOR
                ANY CLAIMS ARISING FROM THESE TERMS WILL NOT EXCEED THE AMOUNT PAID BY YOU, IF ANY, TO USE OUR SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Chess Master and its officers, directors, employees, and agents,
                from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal and
                accounting fees, arising out of or in any way connected with your access to or use of the Service or
                your violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Termination</h2>
              <p>
                We may terminate or suspend your access to the Service immediately, without prior notice or liability,
                for any reason whatsoever, including without limitation if you breach these Terms. Upon termination,
                your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. The updated version will be indicated
                by an updated "Last Updated" date. By continuing to access or use our Service after any revisions become
                effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws, without regard to its
                conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be
                considered a waiver of those rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-3">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-3 text-blue-400">legal@chessmaster.example.com</p>
            </section>
          </div>
        </motion.div>
      </main>

    </div>
  )
}