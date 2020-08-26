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
  // const {name} = useParams();
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
        <ColorProvider>
          <Route exact path="/" component={RegisterUser}></Route>
          <Route  path="/login">
            <RegisterUser />
          </Route>
          <Route path="/draw/:name">
                <DrawingPage socket={socket} />
          </Route>
        </ColorProvider>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
