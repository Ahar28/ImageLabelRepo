import React from "react";
import ImageUpload from "./component/ImageUpload";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Fetch Details from Images</h1>
        <p>Get lablels of any image in seconds</p>
      </header>
      <br></br>
      <br></br>
      <main>
        <ImageUpload />
      </main>
    </div>
  );
}

export default App;
