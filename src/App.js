import React, { Component } from 'react';
import './App.css';
import SearchRouteForm from "./components/SearchRouteForm";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <SearchRouteForm />
          
        </header>
      </div>
    );
  }
}

export default App;
