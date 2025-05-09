import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate, Link, useNavigate  } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import UserContext from '../UserContext'; 

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

function authenticate(e) {
  e.preventDefault();

  fetch('https://movieapp-api-lms1.onrender.com/users/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(res => res.json())
  .then(data => {

    if (data.access !== undefined) {
      localStorage.setItem('token', data.access);
      retrieveUserDetails(data.access);
      setEmail('');
      setPassword('');
        toast.success('You are now loggedin!', {
          onClose: () => navigate('/movies'),
          autoClose: 500
        });
    } else if (data.error === "No Email Found") {
      toast.error('Email does not exist');
    } else if (data.message === "Email and password do not match") {
      toast.error('Email and password do not match');
    } else {
      toast.error('Login failed');
    }
  });
}

function retrieveUserDetails(token) {
  fetch('https://movieapp-api-lms1.onrender.com/users/details', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log("User details response:", data);

    setUser({
      id: data.user._id,
      email: data.user.email,
      isAdmin: data.user.isAdmin
    });

    navigate('/movies');
  });
}

  useEffect(() => {
    if(email !== '' && password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return (
    user.id !== null ? 
      <Navigate to="/movies" />
    : 
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={6} className="mx-auto p-4 border rounded shadow-lg bg-white">
          <h1 className="text-center mb-4">Login</h1>
          <Form onSubmit={(e) => authenticate(e)}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            { 
              isActive ? 
                <Button variant="primary" type="submit" className="w-100" id="loginBtn">
                  Login
                </Button>
              : 
                <Button variant="danger" type="submit" className="w-100" id="loginBtn" disabled>
                  Login
                </Button>
            }

            <div className="mt-3 text-center">
              <p>Don't have an account? <Link to="/register">Click here to register</Link></p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
