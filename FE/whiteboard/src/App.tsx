import React from "react";
import "./App.css";
import "materialize-css/dist/css/materialize.css";
import { Navbar } from "./components/navbar/Navbar";
import { ColorProvider } from "./contexts/ColorContext";
import { WinnerBannerProvider } from "./contexts/WinnerBannerProvider";
import { NameProvider } from "./contexts/NameProvider";
import { DrawingPage } from "./pages/drwing/DrawingPage";
import { RegisterUser } from "./pages/registerUser/RegisterUser";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:4009");{/* povezuje se socket sa serverom */}
function App() {
  return (
    <div className="App">
      <ColorProvider>
      <WinnerBannerProvider>
        <NameProvider>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" > {/* ovo su putanje sta da se renderuje u zavisnosti od url-a */}
              <RegisterUser socket={socket} />{/* ovde se prosledjuje socket da bi komponente imale pristup soketu */}
            </Route>
            <Route path="/login">
              <RegisterUser socket={socket} />
            </Route>
            <Route path="/draw/:name">{/*:name je parametar u URL-u koji pasujemona stranicu to je username */}
              <DrawingPage socket={socket} />
            </Route>
          </Switch>
        </Router>
        </NameProvider>
      </WinnerBannerProvider>
      </ColorProvider>
    </div>
  );
}

export default App;
