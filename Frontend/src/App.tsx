import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./home/components/Home";
import { User } from "./user/components/User";
import { About } from "./home/components/About";

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/user"} element={<User />} />
          <Route path={"/about"} element={<About />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}



export default App;
