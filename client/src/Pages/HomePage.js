import { useState } from "react";
import {LoginForm , RegistrationForm} from '../components'
import "../public/styles/homePage.css";

const HomePage = (props) => {
  const {setIsLoggedIn} = props;
  
  return (
    <div className="homePage">
       <h1>Home Page</h1>
    </div>
  );
};

export default HomePage;
