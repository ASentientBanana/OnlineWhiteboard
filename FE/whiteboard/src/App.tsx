import React from "react";
import "./App.css";
import "materialize-css/dist/css/materialize.css";
import { Navbar } from "./components/navbar/navbar";
import { ColorProvider } from "./contexts/colorContext";
import { DrawingPage } from "./pages/drwing/DrawingPage";
import { RegisterUser } from "./pages/registerUser/RegisterUser";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:4001");
function App() {
  return (
    <div className="App">
      <ColorProvider>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" >
              <RegisterUser socket={socket} />
            </Route>
            <Route path="/login">
              <RegisterUser socket={socket} />
            </Route>
            <Route path="/draw/:name">
              <DrawingPage socket={socket} />
            </Route>
          </Switch>
        </Router>
      </ColorProvider>
    </div>
  );
}

export default App;
