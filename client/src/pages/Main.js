import React from "react";
import imageCat from "../images/catFunny.jpg";
export const Main = () => {
  return (
    <div className="container-size">
      <h1>Welcome</h1>
      <img src={imageCat} alt={imageCat} />
    </div>
  );
};
