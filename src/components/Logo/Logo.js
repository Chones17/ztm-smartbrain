import React from "react";
import Tilt from "react-parallax-tilt";
import "./Logo.css";
import brain from "./brain.png";

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt className="Tilt br2 shadow-2 h4 w4">
        <div className="pa3">
          <img src={brain} alt={"logo"} />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
