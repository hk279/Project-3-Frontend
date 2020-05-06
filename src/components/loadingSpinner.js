import React from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

export default function LoadingSpinner() {
    return <Loader type="Bars" color="#0067f4" height={50} width={50} timeout={3000} />;
}
