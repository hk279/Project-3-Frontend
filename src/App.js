import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Search from "./components/search";
import Add from "./components/add";
import Edit from "./components/edit";

function App() {
    return (
        <div id="app">
            <Router id="router">
                <Switch>
                    <Route path="/" exact component={Search} />
                    <Route path="/add" component={Add} />
                    <Route path="/edit/:id" component={Edit} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
