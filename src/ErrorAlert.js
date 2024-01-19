import React from "react";
import { Alert } from "bootstrap";

const ErrorAlert = ({errorMessage, onClose}) => {
    return (
        <Alert variant='danger' onClose={onClose} dismissible>
            <Alert.Heading>Błąd!</Alert.Heading>
            <p>{errorMessage}</p>
        </Alert>
    );
};

export default ErrorAlert;