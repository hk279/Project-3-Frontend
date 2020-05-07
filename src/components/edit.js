import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { Button, FormInput, Form, FormGroup } from "shards-react";
import Alert from "./alert";
import LoadingSpinner from "./loadingSpinner";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            initialData: "",
            formControl: {
                Name: {
                    value: "",
                    valid: false,
                    invalid: false,
                },
                Platform: {
                    value: "",
                    valid: false,
                    invalid: false,
                },
                Year: {
                    value: "",
                    valid: false,
                    invalid: false,
                },
                Global_Sales: {
                    value: "",
                    valid: false,
                    invalid: false,
                },
            },
            fetchInProgress: false,
            alertMessage: "",
            status: "",
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.isEntered = this.isEntered.bind(this);
        this.isNumber = this.isNumber.bind(this);
    }

    //Initial data is set for the text fields on component mount.
    componentDidMount() {
        this.getData(this.state.id).then((r) => {
            this.setState({ initialData: r });
        });
    }

    changeHandler(event) {
        var fieldName = event.target.id;
        var newValue = event.target.value;
        var newValidState;
        var newInvalidState;

        if (fieldName === "Year" || fieldName === "Global_Sales") {
            newValidState = this.isNumber(newValue);
            if (newValidState === true) {
                newInvalidState = false;
            } else {
                newInvalidState = true;
            }
        } else {
            newValidState = this.isEntered(newValue);
            if (newValidState === true) {
                newInvalidState = false;
            } else {
                newInvalidState = true;
            }
        }

        this.setState({
            formControl: {
                ...this.state.formControl,
                [fieldName]: {
                    value: newValue,
                    valid: newValidState,
                    invalid: newInvalidState,
                },
            },
        });
    }

    //Validator that checks if there is a value given to the input field.
    isEntered(value) {
        if (value.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    //Validator for the year and global sales fields that checks if the given value is a number.
    isNumber(value) {
        var numberValue = Number(value);
        var nan = isNaN(numberValue);
        if (nan === false && value !== "") {
            return true;
        } else {
            return false;
        }
    }

    //Gets the initial field values based on the id in the URL parameter.
    async getData(entryId) {
        //The state is set in order to render the loading spinner.
        this.setState({ fetchInProgress: true });

        var url = "https://node-mongo-games.herokuapp.com/api/get/" + entryId;
        var data = await fetch(url)
            .catch(() => {
                this.setState({ fetchInProgress: false, alertMessage: "Fetch error", status: "error" });
            })
            .then((response) => {
                return response.json();
            })
            .then((r) => {
                this.setState({ fetchInProgress: false });
                return r;
            });
        return data;
    }

    updateData() {
        var name = document.getElementById("Name").value;
        var platform = document.getElementById("Platform").value;
        var year = document.getElementById("Year").value;
        var globalSales = document.getElementById("Global_Sales").value;

        if (name === "" || platform === "" || year === "" || globalSales === "") {
            this.setState({ alertMessage: "Please fill all fields.", status: "error" });
        } else if (!this.isNumber(year) || !this.isNumber(globalSales)) {
            this.setState({
                alertMessage: "Year and Global Sales fields need to have a numerical value.",
                status: "error",
            });
        } else {
            var updatedData = {
                _id: this.state.id,
                Name: name,
                Platform: platform,
                Year: year,
                Global_Sales: globalSales,
            };

            //The state is set in order to render the loading spinner.
            this.setState({ fetchInProgress: true });

            fetch("https://node-mongo-games.herokuapp.com/api/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            })
                .catch(() => {
                    this.setState({ fetchInProgress: false, alertMessage: "Fetch error", status: "error" });
                })
                .then((response) => response.json())
                .then(() => {
                    this.setState({ fetchInProgress: false, alertMessage: "Edit successful!", status: "success" });
                });
        }
    }
    render() {
        var spinner = "";
        if (this.state.fetchInProgress === true) {
            spinner = <LoadingSpinner></LoadingSpinner>;
        }

        var alert = "";
        if (this.state.alertMessage.length > 0) {
            alert = <Alert alertText={this.state.alertMessage} status={this.state.status}></Alert>;
        }

        return (
            <div className="edit">
                <Form>
                    <FormGroup>
                        <label htmlFor="Name">Name</label>
                        <FormInput
                            id="Name"
                            type="text"
                            defaultValue={this.state.initialData.Name}
                            onChange={(e) => {
                                this.changeHandler(e);
                            }}
                            valid={this.state.formControl.Name.valid}
                            invalid={this.state.formControl.Name.invalid}
                        ></FormInput>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="Platform">Platform</label>
                        <FormInput
                            id="Platform"
                            type="text"
                            defaultValue={this.state.initialData.Platform}
                            onChange={(e) => {
                                this.changeHandler(e);
                            }}
                            valid={this.state.formControl.Platform.valid}
                            invalid={this.state.formControl.Platform.invalid}
                        ></FormInput>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="Year">Year</label>
                        <FormInput
                            id="Year"
                            type="text"
                            defaultValue={this.state.initialData.Year}
                            onChange={(e) => {
                                this.changeHandler(e);
                            }}
                            valid={this.state.formControl.Year.valid}
                            invalid={this.state.formControl.Year.invalid}
                        ></FormInput>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="Global_Sales">Global Sales</label>
                        <FormInput
                            id="Global_Sales"
                            type="text"
                            defaultValue={this.state.initialData.Global_Sales}
                            onChange={(e) => {
                                this.changeHandler(e);
                            }}
                            valid={this.state.formControl.Global_Sales.valid}
                            invalid={this.state.formControl.Global_Sales.invalid}
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
                <div className="loading-spinner">{spinner}</div>
                <div className="alert">{alert}</div>
                <Link to="/">
                    <Button theme="secondary">Back to Search</Button>
                </Link>
            </div>
        );
    }
}

export default Edit;
