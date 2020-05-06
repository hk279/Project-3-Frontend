import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "../App.css";
import { Button, FormInput, InputGroup, InputGroupAddon } from "shards-react";
import List from "./list";
import LoadingSpinner from "./loadingSpinner";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            filteredData: [],
            fetchInProgress: false,
        };
        this.clickHandler = this.clickHandler.bind(this);
        this.getData = this.getData.bind(this);
    }
    clickHandler() {
        var searchBox = document.getElementById("query");
        //getData needs to wait for the state to be set so it needs to be in a callback.
        this.setState({ query: searchBox.value }, () => {
            var searchWord = this.state.query;
            if (searchWord !== "") {
                this.getData(searchWord);
            }
        });
    }
    getData(query) {
        console.log("getData is run");
        //Workaround to make setState work within the fetch function.
        var that = this;

        //The state is set in order to render the loading spinner.
        this.setState({ fetchInProgress: true });

        var data = fetch("https://node-mongo-games.herokuapp.com/api/getbyname/" + query)
            .then((response) => {
                return response.json();
            })
            .then((responseJSON) => {
                console.log(responseJSON);
                that.setState({ filteredData: responseJSON, fetchInProgress: false });
                return responseJSON;
            });
        return data;
    }
    render() {
        var spinner = "";
        if (this.state.fetchInProgress === true) {
            spinner = <LoadingSpinner></LoadingSpinner>;
        }

        return (
            <div>
                <div id="intro">
                    <h3>Video Game Sales</h3>
                    <p>This CRUD-application was made with React.js.</p>
                    <p>Search, add, edit and delete video game sales data.</p>
                    <a href="https://www.kaggle.com/gregorut/videogamesales">Link to the dataset</a>
                </div>
                <div id="search">
                    <div className="inline-block">
                        <InputGroup style={{ padding: 0 }}>
                            <FormInput id="query" type="text" placeholder="Search" />
                            <InputGroupAddon type="append">
                                <Button className="button" onClick={this.clickHandler}>
                                    Search
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <Link to="/add" style={{ marginLeft: "3em" }}>
                        <Button className="button" theme="success">
                            Add
                        </Button>
                    </Link>
                </div>
                <div className="loading-spinner">{spinner}</div>
                <div>
                    <List data={this.state.filteredData}></List>
                </div>
            </div>
        );
    }
}

export default Search;
