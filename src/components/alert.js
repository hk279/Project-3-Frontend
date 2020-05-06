import React from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { Alert as ShardsAlert } from "shards-react";

function Alert(props) {
    if (props.status === "success") {
        return (
            <div className="alert-box">
                <ShardsAlert theme="success">{props.alertText}</ShardsAlert>
            </div>
        );
    } else {
        return (
            <div className="alert-box">
                <ShardsAlert theme="danger">{props.alertText}</ShardsAlert>
            </div>
        );
    }
}

export default Alert;
