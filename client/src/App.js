import React, {Fragment, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import Landing from "./component/layout/Landing";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
// Redux
import { Provider} from 'react-redux';
import store from './store';
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';


if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () =>  {

  useEffect (() => {
store.dispatch(loadUser());
  }, []);
  return (
 <Provider store={store}>
 <Router>
<Fragment>
<Navbar/>
<Route exact path ="/" component={Landing} />
<section>
  <Switch>
    <Route exact path="/register" component={Register}/>
    <Route exact path="/login" component={Login}/>
  </Switch>
</section>
</Fragment>

</Router>
</Provider>
)};
export default App;
