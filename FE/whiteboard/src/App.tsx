import React from 'react';
import './App.css';
import "materialize-css/dist/css/materialize.css";
import {Navbar} from './components/navbar/navbar';
import {Whiteboard} from './components/whiteboard/whiteboard';
import {ColorProvider} from "./contexts/colorContext";

function App() {
  return (
    <div className="App">
      <Navbar />
      <ColorProvider>
      <Whiteboard />
      </ColorProvider>
    </div>
  );
}

export default App;
