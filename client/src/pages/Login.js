import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import api from "../service/api.config";
export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const checkUser = async (e) => {
    e.preventDefault();
    const user = {
      username,
      email,
      password,
    };
    try {
      await api.login(user);
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/main");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container-size">
      <h1>Login</h1>
      <Form onSubmit={(e) => checkUser(e)}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3 input-size">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button className="button-size" type="submit">
          Sign In
        </Button>
      </Form>
      <div className="m-3">
        <a className="link" href="/signup">
          Don't have a account? Signup Now!
        </a>
      </div>
    </div>
  );
};
