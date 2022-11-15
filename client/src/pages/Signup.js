import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api.config";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
export const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const postUser = async (e) => {
    e.preventDefault();
    const user = {
      username,
      email,
      password,
    };
    try {
      await api.signup(user);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container-size">
      <h1>Create Account</h1>
      <Form onSubmit={(e) => postUser(e)}>
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
          Sign Up
        </Button>
      </Form>
      <div className="m-3">
        <a className="link" href="/login">
          Already have an account? Login here
        </a>
      </div>
    </div>
  );
};
