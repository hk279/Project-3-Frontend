import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import "../App.css";
import { Button, FormInput, Form, FormGroup } from "shards-react";
import Alert from "./alert";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            initialData: "",
        };
    }

    //Initial data is set for the text fields on component mount.
    componentDidMount() {
        this.getData(this.state.id).then((r) => {
            this.setState({ initialData: r });
        });
    }

    //Gets the initial field values based on the id in the URL parameter.
    async getData(entryId) {
        var url = "https://node-mongo-games.herokuapp.com/api/get/" + entryId;
        var data = await fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((r) => {
                return r;
            });
        console.log("getData returns\n" + data);
        return data;
    }

    updateData() {
        var name = document.getElementById("Name").value;
        var platform = document.getElementById("Platform").value;
        var year = document.getElementById("Year").value;
        var globalSales = document.getElementById("Global_Sales").value;

        var message;

        if (name === "" || platform === "" || year === "" || globalSales === "") {
            message = "Please fill all fields to submit data.";
            ReactDOM.render(
                <Alert alertText={message} status="error"></Alert>,
                document.getElementsByClassName("alert")[0]
            );
        } else {
            message = "Edit successful!";

            var updatedData = {
                _id: this.state.id,
                Name: name,
                Platform: platform,
                Year: year,
                Global_Sales: globalSales,
            };
            console.log("Updated data:\n" + JSON.stringify(updatedData));

            fetch("https://node-mongo-games.herokuapp.com/api/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            })
                .catch((error) => {
                    message = "Fetch error";
                    console.error("Error:", error);
                    ReactDOM.render(
                        <Alert alertText={message} status="error"></Alert>,
                        document.getElementsByClassName("alert")[0]
                    );
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Updated data:\n" + JSON.stringify(data));
                    ReactDOM.render(
                        <Alert alertText={message} status="success"></Alert>,
                        document.getElementsByClassName("alert")[0]
                    );
                });
        }
    }
    render() {
        console.log("Render is run");
        return (
            <div className="edit">
                <Form>
                    <FormGroup>
                        <label htmlFor="Name">Name</label>
                        <FormInput id="Name" type="text" defaultValue={this.state.initialData.Name}></FormInput>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="Platform">Platform</label>
                        <FormInput id="Platform" type="text" defaultValue={this.state.initialData.Platform}></FormInput>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="Year">Year</label>
                        <FormInput id="Year" type="text" defaultValue={this.state.initialData.Year}></FormInput>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="Global_Sales">Global Sales</label>
                        <FormInput
                            id="Global_Sales"
                            type="text"
                            defaultValue={this.state.initialData.Global_Sales}
                        ></FormInput>
                    </FormGroup>
                </Form>
                <Button
                    className="submit-button"
                    onClick={() => {
                        this.updateData();
                    }}
                >
                    Submit
                </Button>
                <div className="alert"></div>
                <Link to="/">
                    <Button theme="secondary">Back to Search</Button>
                </Link>
            </div>
        );
    }
}

export default Edit;
