import { motion } from 'framer-motion';
import { FaChess } from "react-icons/fa";

const ChessMasterLogo = ({ variant = "default", className = "" }) => {
  // Base styles that apply to all versions
  const baseLogoStyle = "relative flex items-center justify-center";
  
  if (variant === "home") {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        className={`${baseLogoStyle} mx-auto mb-6 ${className}`}
      >
        {/* Responsive sizing based on screen size */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 10px rgba(59, 130, 246, 0.6)",
                "0 0 20px rgba(139, 92, 246, 0.8)",
                "0 0 10px rgba(59, 130, 246, 0.6)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
          />
          <FaChess className="absolute inset-0 text-white w-full h-full p-3 sm:p-4" />
        </div>
      </motion.div>
    );
  }
  
  // Default/Navbar version with text that appears on larger screens
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="w-8 h-8 sm:w-10 sm:h-10 relative"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 8px rgba(59, 130, 246, 0.5)",
              "0 0 12px rgba(139, 92, 246, 0.7)",
              "0 0 8px rgba(59, 130, 246, 0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
        />
        <FaChess className="absolute inset-0 text-white w-full h-full p-1.5 sm:p-2" />
      </motion.div>
      
      {/* Text appears only on larger screens with a nice animation */}
      <motion.div 
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="hidden sm:block"
      >
        {/* <h1 className="font-bold text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Chess Master
        </h1> */}
      </motion.div>
    </div>
  );
};

export default ChessMasterLogo;