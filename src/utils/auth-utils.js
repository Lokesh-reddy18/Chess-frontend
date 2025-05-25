import Cookies from "js-cookie"
import { logout } from "../store/authSlice"

// Helper function to handle logout consistently across components
export const handleLogout = async (dispatch, navigate) => {
    try {
      // Call server-side logout to invalidate session
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  
    // Clear client-side authentication tokens
    Cookies.remove("token", { path: '/' });
    localStorage.removeItem("authState");
    sessionStorage.removeItem("authState");
  
    // Reset Redux state
    dispatch(logout());
  
    // Navigate to login
    navigate("/login");
    return true;
  };

