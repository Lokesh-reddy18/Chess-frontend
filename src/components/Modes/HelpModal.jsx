import { motion } from "framer-motion"

const HelpModal = ({ showHelpModal, setShowHelpModal }) => {
  if (!showHelpModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={() => setShowHelpModal(false)}></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-gray-900 border-2 border-blue-700 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-blue-800 -mt-6 -mx-6 mb-6 py-2 px-4 border-b-2 border-yellow-500">
          <h2 className="text-2xl font-bold text-yellow-400 uppercase">How to Play</h2>
        </div>

        <div className="space-y-4 text-blue-100">
          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Mobile Mode</h3>
            <p>Tap a piece to select it, then tap a highlighted square to move. Perfect for touchscreens.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Desktop Mode</h3>
            <p>Drag and drop pieces to make moves. Hover over pieces to see possible moves.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Difficulty Levels</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Easy: Computer makes random moves</li>
              <li>Medium: Computer prioritizes captures and checks</li>
              <li>Hard: Computer evaluates positions more deeply</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">Visual Hints</h3>
            <p>Toggle to show or hide move suggestions and highlights.</p>
          </div>
        </div>

        <button
          onClick={() => setShowHelpModal(false)}
          className="mt-6 w-full bg-yellow-500 text-blue-900 font-bold py-2 rounded-md hover:bg-yellow-400"
        >
          Got it!
        </button>
      </motion.div>
    </div>
  )
}

export default HelpModal