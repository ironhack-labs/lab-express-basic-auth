import React from "react";
import Button from "react-bootstrap/Button";
export const Home = () => {
  return (
    <div className="container">
      <h1>Authentication</h1>
      <Button size="lg" href="/login" className="m-3">
        Sign In
      </Button>
      <Button size="lg" href="/signup" className="m-3">
        Sign Up
      </Button>
    </div>
  );
};
