import React,{useState,useEffect} from "react";
import "./App.css";
import "materialize-css/dist/css/materialize.css";
import { Navbar } from "./components/navbar/Navbar";
import { ColorProvider } from "./contexts/ColorContext";
import { WinnerBannerProvider } from "./contexts/WinnerBannerProvider";
import { NameProvider } from "./contexts/NameProvider";
import { DrawingPage } from "./pages/drwing/DrawingPage";
import  Gallery  from "./pages/gallery/Gallery";
import { RegisterUser } from "./pages/registerUser/RegisterUser";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import io from "socket.io-client";
// import {getSocket} from './util';
 {/* povezuje se socket sa serverom */}
function App() {

  const [socket,setSocket] = useState<SocketIOClient.Socket>()
 useEffect(()=>{
   console.log('socket sync ');
  },[socket])
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
            <Route exact path="/login">
              <RegisterUser socket={socket} />
            </Route>
            <Route exact path="/draw/:name/:room" component={DrawingPage} />{/*:name je parametar u URL-u koji pasujemona stranicu to je username */}
            <Route exact path="/gallery/:name">{/*:name je parametar u URL-u koji pasujemona stranicu to je username */}
              <Gallery  />
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
