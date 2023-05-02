import React, { useState, useEffect } from "react";
import "./AppearanceToggler.scss";
import { ReactComponent as Moon } from "../../assets/images/appearance-icons/new-moon-symbol.svg";
import { ReactComponent as Astronaut } from "../../assets/images/appearance-icons/astronaut-space-cute-funny.svg";
import { ReactComponent as Mars } from "../../assets/images/appearance-icons/mars.svg";

const AppearanceToggler = () => {

  const [appearanceTheme, setAppearanceTheme] = useState(
    localStorage.getItem("appearance") || "Light"
  );

  useEffect(()=>{
    setAppearanceTheme(localStorage.getItem("appearance") || "Light")
  },[])

  useEffect(() => {
    localStorage.setItem("appearance", appearanceTheme);
    if (appearanceTheme === "Dark") {
      document.documentElement.setAttribute("data-appearance", "Dark");
    } else {
      document.documentElement.setAttribute("data-appearance", "Light");
    }

  }, [appearanceTheme]);



  const handleClick = () => {
    setAppearanceTheme(appearanceTheme === "Light" ? "Dark" : "Light");
  };

  return (
    <button className="AppearanceToggler" onClick={handleClick}>
      {appearanceTheme === "Light" ? (
        <>
          <Moon className="icon moon" />
          <Astronaut className="icon astronaut" />
        </>
      ) : (
        <>
          <Mars className="icon mars" />
          <Astronaut className="icon astronaut" />
        </>
      )}
    </button>
  );
};

export default AppearanceToggler;
