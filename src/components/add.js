import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { Button, FormInput, Form, FormGroup } from "shards-react";
import Alert from "./alert";
import LoadingSpinner from "./loadingSpinner";

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

    addData() {
        var name = this.state.formControl.Name.value;
        var platform = this.state.formControl.Platform.value;
        var year = this.state.formControl.Year.value;
        var globalSales = this.state.formControl.Global_Sales.value;

        if (name === "" || platform === "" || year === "" || globalSales === "") {
            this.setState({ alertMessage: "Please fill all fields to submit data.", status: "error" });
        } else if (!this.isNumber(year) || !this.isNumber(globalSales)) {
            this.setState({
                alertMessage: "Year and Global Sales fields need to have a numerical value.",
                status: "error",
            });
        } else {
            var newEntry = {
                Name: name,
                Platform: platform,
                Year: year,
                Global_Sales: globalSales,
            };

            //The state is set in order to render the loading spinner.
            this.setState({ fetchInProgress: true });

            fetch("https://node-mongo-games.herokuapp.com/api/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEntry),
            })
                .catch((error) => {
                    console.error("Error:", error);
                    this.setState({ alertMessage: "Fetch error", status: "error", fetchInProgress: false });
                })
                .then((data) => {
                    console.log(data);
                })
                .then(() => {
                    this.setState({
                        alertMessage: "Data saved successfully!",
                        status: "success",
                        fetchInProgress: false,
                    });
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
            <div className="add">
                <h3>Add a New Entry</h3>
                <Form>
                    <FormGroup>
                        <label htmlFor="Name">Name</label>
                        <FormInput
                            id="Name"
                            type="text"
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
                            onChange={(e) => {
                                this.changeHandler(e);
                            }}
                            valid={this.state.formControl.Global_Sales.valid}
                            invalid={this.state.formControl.Global_Sales.invalid}
                        ></FormInput>
                    </FormGroup>
                </Form>
                <Button
                    className="add-button"
                    onClick={() => {
                        this.addData();
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

export default Add;
