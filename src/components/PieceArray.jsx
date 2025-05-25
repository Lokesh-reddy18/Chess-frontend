import { motion } from "framer-motion"
import bB from "./pieces/bB.webp"
import bK from "./pieces/bK.webp"
import bN from "./pieces/bN.webp"
import bP from "./pieces/bP.webp"
import bQ from "./pieces/bQ.webp"
import bR from "./pieces/bR.webp"
import wB from "./pieces/wB.webp"
import wK from "./pieces/wK.webp"
import wN from "./pieces/wN.webp"
import wP from "./pieces/wP.webp"
import wQ from "./pieces/wQ.webp"
import wR from "./pieces/wR.webp"

function PieceArray() {
  const pieces = [
    { src: wP, alt: "White Pawn", width: 25, delay: 0 },
    { src: wN, alt: "White Knight", width: 30, delay: 0.1 },
    { src: wB, alt: "White Bishop", width: 30, delay: 0.2 },
    { src: wR, alt: "White Rook", width: 30, delay: 0.3 },
    { src: wQ, alt: "White Queen", width: 35, delay: 0.4 },
    { src: wK, alt: "White King", width: 40, delay: 0.5 },
    { src: bK, alt: "Black King", width: 40, delay: 0.6 },
    { src: bQ, alt: "Black Queen", width: 35, delay: 0.7 },
    { src: bR, alt: "Black Rook", width: 30, delay: 0.8 },
    { src: bB, alt: "Black Bishop", width: 30, delay: 0.9 },
    { src: bN, alt: "Black Knight", width: 30, delay: 1.0 },
    { src: bP, alt: "Black Pawn", width: 25, delay: 1.1 },
  ]

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
      {pieces.map((piece, index) => (
        <motion.div
          key={index}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: piece.delay,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
          whileHover={{
            scale: 1.2,
            rotate: [0, 10, -10, 0],
            transition: { duration: 0.5 },
          }}
          className="relative group"
        >
          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{
              background:
                index < 6
                  ? "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(0, 0, 0, 0) 70%)"
                  : "radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(0, 0, 0, 0) 70%)",
              filter: "blur(8px)",
            }}
          />

          <img
            src={piece.src || "/placeholder.svg"}
            width={piece.width}
            height={piece.width}
            alt={piece.alt}
            className="relative z-10"
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  )
}

export default PieceArray

