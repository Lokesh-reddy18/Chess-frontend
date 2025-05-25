import { lazy, Suspense } from "react"
import { Provider } from "react-redux"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import store from "./store/store"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "./components/Navbar"
import LoadingScreen from "./components/Loading"
import Footer from "./components/Footer"
import PageNotFound from "./components/PageNotFound"
import About from "./components/About"
import Contact from "./components/Contact"
import PrivacyPolicy from "./components/PrivacyPolicy"
import TermsAndConditions from "./components/TermsOfUse"

const Home = lazy(() => import("./components/Home"))
const SignUp = lazy(() => import("./components/Auth/SignUp"))
const Login = lazy(() => import("./components/Auth/Login"))
const Profile = lazy(() => import("./components/Profile"))
const GameModeSelector = lazy(() => import("./components/GameModeSelector"))
const GameOverModal = lazy(() => import("./components/GameOverModal"))

const RandomPlay = lazy(() => import("./components/Modes/RandomPlay"))
const LocalMultiplayer = lazy(() => import("./components/Modes/LocalMultiplayer"))
const GlobalMultiplayer = lazy(() => import("./components/Modes/GlobalMultiplayer"))
const AgainstStockfish = lazy(() => import("./components/Modes/AgainstStockfish"))
const Puzzles = lazy(() => import("./components/Modes/Puzzles"))

const Puzzle1 = lazy(() => import("./components/Puzzles/Puzzle1"))
const Puzzle2 = lazy(() => import("./components/Puzzles/Puzzle2"))
const Puzzle3 = lazy(() => import("./components/Puzzles/Puzzle3"))
const Puzzle4 = lazy(() => import("./components/Puzzles/Puzzle4"))
const Puzzle5 = lazy(() => import("./components/Puzzles/Puzzle5"))
const Puzzle6 = lazy(() => import("./components/Puzzles/Puzzle6"))

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <ToastContainer position="top-center" />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/modeselector" element={<GameModeSelector />} />
            <Route path="/gameovermodal" element={<GameOverModal />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/random-play" element={<RandomPlay />} />
            <Route path="/local-multiplayer" element={<LocalMultiplayer />} />
            <Route path="/global-multiplayer" element={<GlobalMultiplayer />} />
            <Route path="/puzzle" element={<Puzzles />} />
            <Route path="/against-stockfish" element={<AgainstStockfish />} />

            <Route path="/puzzle1" element={<Puzzle1 />} />
            <Route path="/puzzle2" element={<Puzzle2 />} />
            <Route path="/puzzle3" element={<Puzzle3 />} />
            <Route path="/puzzle4" element={<Puzzle4 />} />
            <Route path="/puzzle5" element={<Puzzle5 />} />
            <Route path="/puzzle6" element={<Puzzle6 />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </Provider>
  )
}

export default App

