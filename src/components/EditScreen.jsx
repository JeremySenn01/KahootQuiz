import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

const host = window.location.hostname;

class EditScreen extends Component {

    constructor() {
        super();
    }

    componentDidMount() {
       
    }

    render() {
        return (
            <div className="text-center">
               Edit
            </div>
        );
    }
}

export default EditScreen;
