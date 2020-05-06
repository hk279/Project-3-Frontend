import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import "../App.css";
import Edit from "./edit";
import Alert from "./alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faEdit } from "@fortawesome/free-solid-svg-icons";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            dataDeleted: false,
            message: "",
            status: "",
        };
        this.deleteData = this.deleteData.bind(this);
    }

    deleteData(id) {
        //Workaround to make setState work inside fetch.
        var that = this;
        var url = "https://node-mongo-games.herokuapp.com/api/delete/" + id;

        fetch(url, { method: "DELETE" })
            .catch((err) => {
                console.log(err);
                //Sets the state in order to render the alert box.
                that.setState({ dataDeleted: false, message: "Fetch error", status: "error" });
            })
            .then(() => {
                //A function to remove the deleted entry from this component's state.
                function filterFunction(entry) {
                    return entry._id !== id;
                }

                var newData = that.state.data.filter(filterFunction);

                //Sets the new, filtered data into the state and other state values in order to render the alert box.
                that.setState({
                    data: newData,
                    dataDeleted: true,
                    message: "Entry successfully deleted!",
                    status: "success",
                });

                console.log("Data successfully deleted!");
            });
    }
    editData(data) {
        ReactDOM.render(<Edit entry={data}></Edit>, document.getElementById("root"));
    }

    componentDidMount() {
        console.log("componentDidMount");
        this.setState({ data: this.props.data });
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            console.log("componentDidUpdate");
            //Sets the state of dataDeleted to false in order to not show the alert box after updating the component.
            this.setState({ data: this.props.data, dataDeleted: false });
        }
    }

    render() {
        /* Conditional rendering for the alert box. Shows the alert after an entry has been deleted. 
        Updating the component after the delete will make the alert disappear. */
        var alert;
        if (this.state.dataDeleted === true) {
            alert = <Alert alertText={this.state.message} status={this.state.status}></Alert>;
        } else if (this.state.dataDeleted === false && this.state.status === "error") {
            alert = <Alert alertText={this.state.message} status={this.state.status}></Alert>;
        } else {
            alert = null;
        }

        /* Renders the table only if there are results with the search term.*/
        if (this.state.data.length > 0) {
            return (
                <div id="table">
                    <div className="alert-box">{alert}</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Platform</th>
                                <th>Year</th>
                                <th>Global Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.Name}</td>
                                    <td>{item.Platform}</td>
                                    <td>{item.Year}</td>
                                    <td>{item.Global_Sales}</td>
                                    <td>
                                        <div
                                            className="icon-button"
                                            onClick={() => {
                                                this.deleteData(item._id);
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                className="icon deleteIcon"
                                                icon={faTimesCircle}
                                                size="lg"
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="icon-button">
                                            <Link to={"/edit/" + item._id}>
                                                <FontAwesomeIcon className="icon editIcon" icon={faEdit} size="lg" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default List;
