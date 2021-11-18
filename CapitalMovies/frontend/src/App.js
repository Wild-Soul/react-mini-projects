import React from 'react';
import { Switch, Route } from 'react-router-dom'

import { Home } from './home';
import { Navbar } from './Navbar';

function App() {
  return <Switch>
    <Route path="/" exact>
      <Navbar />
      <Home />
    </Route>
  </Switch>
}

export default App;
