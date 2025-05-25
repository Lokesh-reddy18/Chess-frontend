import React, { useState, useEffect } from "react";
import { 
  Mail, 
  MessageSquare, 
  User, 
  Send, 
  MapPin, 
  PhoneCall, 
  Clock,
  CheckCircle,
  AlertCircle,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("contact");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    document.title = "Chess Master Contact | Get Support & Connect With Us";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Contact Chess Master team for support, feedback, or suggestions. Get quick responses to your questions about our online chess platform.";
    
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = window.location.origin + "/contact";
    
    return () => {
      document.title = "Chess Master | Online Chess Training & Games";
    };
  }, []);

  const socialLinks = [
    { name: "GitHub", icon: <Github size={20} className="text-yellow-400" />, link: "https://github.com" },
    { name: "Twitter", icon: <Twitter size={20} className="text-yellow-400" />, link: "https://twitter.com" },
    { name: "LinkedIn", icon: <Linkedin size={20} className="text-yellow-400" />, link: "https://www.linkedin.com" },
    { name: "YouTube", icon: <Youtube size={20} className="text-yellow-400" />, link: "https://youtube.com" }
  ];

  const faqItems = [
    {
      id: 1,
      question: "How do I report a bug in the game?",
      answer: "You can report bugs through our support system by clicking on \"Help\" in the main menu or by emailing support@chessmaster.com with details of the issue you encountered."
    },
    {
      id: 2,
      question: "How can I suggest a new feature?",
      answer: "We welcome your ideas! Send your feature suggestions to ideas@chessmaster.com or use the \"Feedback\" option in your account settings."
    },
    {
      id: 3,
      question: "Can I change my username?",
      answer: "Yes, premium users can change their username once every 30 days in account settings. Free users should contact support for assistance."
    },
    {
      id: 4,
      question: "How do I recover my password?",
      answer: "On the login page, click \"Forgot Password\" and follow the instructions sent to your registered email. If you can't access your email, contact our support team."
    }
  ];
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        success: false,
        message: "Please fill out all required fields."
      });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        success: false,
        message: "Please enter a valid email address."
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Form submitted:", formData);
      }
      
      setFormStatus({
        success: true,
        message: "Thank you for your message! We'll get back to you soon."
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Form submission failed:", error);
      }
      
      setFormStatus({
        success: false,
        message: "Message could not be sent. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-gray-950 font-mono">
      <div className="fixed inset-0 z-0" aria-hidden="true">
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
              Contact us with any questions, feedback or suggestions about Chess Master
            </p>
          </div>
        </header>

        <nav className="bg-gray-900 border-b-2 border-blue-800 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-2 flex justify-center">
            {["contact", "info", "faq"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 mx-2 text-lg font-bold uppercase transition-all ${
                  activeTab === tab
                    ? "bg-blue-800 text-yellow-400 border-2 border-yellow-500 shadow-yellow-400/20 shadow-md"
                    : "text-blue-300 hover:bg-blue-900 border-2 border-transparent"
                }`}
                aria-pressed={activeTab === tab}
                aria-label={`${tab.charAt(0).toUpperCase() + tab.slice(1)} tab`}
              >
                {tab === "contact" && "Contact Form"}
                {tab === "info" && "Info"}
                {tab === "faq" && "FAQ"}
              </button>
            ))}
          </div>
        </nav>

        <main className="flex-grow px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === "contact" && (
              <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                  <h2 className="text-2xl font-bold text-yellow-400 uppercase">Send a Message</h2>
                </div>
                
                {formStatus && (
                  <div
                    className={`mb-6 p-4 rounded-lg flex items-start ${
                      formStatus.success 
                        ? "bg-green-900/50 border border-green-700 text-green-400" 
                        : "bg-red-900/50 border border-red-700 text-red-400"
                    }`}
                    role="alert"
                    aria-live="assertive"
                  >
                    {formStatus.success ? (
                      <CheckCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    ) : (
                      <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    )}
                    <p>{formStatus.message}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
                  <div>
                    <label htmlFor="name" className="block text-blue-300 font-medium mb-2 flex items-center">
                      <User size={16} className="mr-2 text-yellow-400" aria-hidden="true" />
                      Your Name <span className="text-yellow-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-2 border-blue-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                      placeholder="John Doe"
                      required
                      autoComplete="name"
                      aria-required="true"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-blue-300 font-medium mb-2 flex items-center">
                      <Mail size={16} className="mr-2 text-yellow-400" aria-hidden="true" />
                      Your Email <span className="text-yellow-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-2 border-blue-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                      placeholder="john@example.com"
                      required
                      autoComplete="email"
                      aria-required="true"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-blue-300 font-medium mb-2 flex items-center">
                      <MessageSquare size={16} className="mr-2 text-yellow-400" aria-hidden="true" />
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border-2 border-blue-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                      placeholder="How can we help you?"
                      autoComplete="off"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-blue-300 font-medium mb-2 flex items-center">
                      <MessageSquare size={16} className="mr-2 text-yellow-400" aria-hidden="true" />
                      Your Message <span className="text-yellow-500 ml-1">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full bg-gray-800 border-2 border-blue-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                      placeholder="Type your message here..."
                      required
                      aria-required="true"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-yellow-500 text-blue-900 text-xl font-bold uppercase rounded-lg hover:bg-yellow-400 transition-colors shadow-lg border-2 border-yellow-700 py-3 px-4 flex items-center justify-center ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <LoadingSpinner />
                          <span className="ml-2">SENDING...</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send size={18} className="mr-2" aria-hidden="true" />
                          SEND MESSAGE
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === "info" && (
              <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                  <h2 className="text-2xl font-bold text-yellow-400 uppercase">Contact Information</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-800 border-2 border-blue-600 rounded-lg p-4 flex items-start">
                    <div className="mr-4 bg-blue-900 p-3 rounded-full border-2 border-yellow-500">
                      <MapPin size={24} className="text-yellow-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-yellow-400">Location</h3>
                      <address className="text-blue-200 not-italic">
                        Silchar<br />
                        India
                      </address>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 border-2 border-blue-600 rounded-lg p-4 flex items-start">
                    <div className="mr-4 bg-blue-900 p-3 rounded-full border-2 border-yellow-500">
                      <Mail size={24} className="text-yellow-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-yellow-400">Email</h3>
                      <p className="text-blue-200">
                        <a href="mailto:kollilokeshreddy18@gmail.com" className="hover:text-yellow-400 transition-colors">
                          kollilokeshreddy18@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 border-2 border-blue-600 rounded-lg p-4 flex items-start">
                    <div className="mr-4 bg-blue-900 p-3 rounded-full border-2 border-yellow-500">
                      <PhoneCall size={24} className="text-yellow-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-yellow-400">Phone</h3>
                      <p className="text-blue-200">
                        <a href="tel:+1234567890" className="hover:text-yellow-400 transition-colors">
                          +1 (234) 567-890
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 border-2 border-blue-600 rounded-lg p-4 flex items-start">
                    <div className="mr-4 bg-blue-900 p-3 rounded-full border-2 border-yellow-500">
                      <Clock size={24} className="text-yellow-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-yellow-400">Hours</h3>
                      <p className="text-blue-200">
                        Monday - Friday<br />
                        9:00 AM - 5:00 PM IST
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 border-2 border-blue-600 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Connect With Us</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 bg-blue-900 rounded-lg border-2 border-blue-700 hover:border-yellow-500 transition-colors"
                        aria-label={`Visit our ${social.name} page`}
                      >
                        <div className="mr-2" aria-hidden="true">
                          {social.icon}
                        </div>
                        <span className="text-blue-200">{social.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-800 border-2 border-blue-600 rounded-lg overflow-hidden">
                  <div className="bg-blue-800 px-4 py-2 border-b-2 border-yellow-500">
                    <h3 className="text-lg font-bold text-yellow-400">Our Location</h3>
                  </div>
                  <div className="h-64 w-full bg-blue-900/30 flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="mb-3 text-yellow-400" aria-hidden="true">
                        <MapPin size={48} />
                      </div>
                      <p className="text-blue-200 mb-4">
                        Interactive map would be displayed here
                      </p>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-yellow-500 text-blue-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors border-2 border-yellow-700"
                        aria-label="View our location on Google Maps"
                      >
                        VIEW ON GOOGLE MAPS
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "faq" && (
              <div className="bg-gray-900 border-2 border-blue-700 rounded-lg p-6 shadow-lg game-panel">
                <div className="bg-blue-800 -mt-8 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
                  <h2 className="text-2xl font-bold text-yellow-400 uppercase">Frequently Asked Questions</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  {faqItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-800 border-2 border-blue-600 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(item.id)}
                        className="w-full px-5 py-4 flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-inset"
                        aria-expanded={expandedFaq === item.id}
                        aria-controls={`faq-answer-${item.id}`}
                      >
                        <h3 className="font-semibold text-blue-200">
                          {item.question}
                        </h3>
                        <div className="text-yellow-400 flex-shrink-0 ml-4" aria-hidden="true">
                          {expandedFaq === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </button>
                      
                      {expandedFaq === item.id && (
                        <div 
                          id={`faq-answer-${item.id}`}
                          className="px-5 pb-4"
                        >
                          <div className="border-t border-blue-700 pt-3 mt-1">
                            <p className="text-blue-300">{item.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-900/30 border-2 border-yellow-600 rounded-lg p-4">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Still Have Questions?</h3>
                  <p className="text-blue-200 mb-4">
                    If you couldn't find an answer to your question in our FAQ, please don't hesitate to contact us directly. Our support team is ready to help you with any inquiries.
                  </p>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="inline-block px-6 py-3 bg-yellow-500 text-blue-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors border-2 border-yellow-700"
                  >
                    CONTACT US
                  </button>
                </div>
              </div>
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
              
              <a
                href="/signup"
                className="inline-block px-8 py-4 bg-yellow-500 text-blue-900 text-xl font-bold uppercase rounded-lg hover:bg-yellow-400 transition-colors shadow-lg border-2 border-yellow-700 transform hover:scale-105 transition-transform"
                aria-label="Sign up and play chess now"
              >
                PLAY NOW
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Chess Master Contact",
          "description": "Contact the Chess Master team with your questions or feedback",
          "mainEntity": {
            "@type": "WebApplication",
            "name": "Chess Master",
            "applicationCategory": "GameApplication",
            "operatingSystem": "Web",
            "description": "An online chess platform for training, playing, and improving chess skills",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR",
            }
          }
        })
      }} />
    </div>
  );
}