import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate here
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './UserContext'; 
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Movies from './pages/Movies';
import RegistrationPage from './pages/RegistrationPage';
import MovieView from './pages/MovieView';
import Logout from './pages/Logout';

function App() {

     const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

  function unsetUser() {
    localStorage.clear();
  }

  
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token !== null) {
    console.log('Token found:', token);  // Log the token being sent to the API
    fetch('https://movieapp-api-lms1.onrender.com/users/details', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log('User data:', data);  // Inspect the full API response
      setUser({
      id: data.user._id,
      email: data.user.email,
      isAdmin: data.user.isAdmin
      });
    })
    .catch(err => {
      console.error('Error fetching user details:', err);
      setUser({
        id: null,
        isAdmin: null
      });
    });
  } else {
    console.log('No token found');
    setUser({
      id: null,
      isAdmin: null
    });
  }
}, []);

    const isLoggedIn = user.id !== null;
  return (
    <>
    
<UserProvider value={{ user, setUser, unsetUser }}>
  <Router>
    <AppNavbar />
    <Container>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/movies" replace /> : <Login />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/movies" element={isLoggedIn ? <Movies /> : <Navigate to="/login" replace />} />
        <Route path="/movies/:id" element={<MovieView />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Container>
  </Router>
</UserProvider>

    
    
      <ToastContainer 
        position="top-center"
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"  // other options: "light", "dark"
      />
    </>
  );
}

export default App;
