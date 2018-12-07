import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import editIcon from "../image_edit.png";
import trashIcon from "../image_trash.png";

const host = window.location.hostname;

class Question extends Component {

    constructor() {
        super();
    }

    deleteQuestion = () => {

        let quiz = JSON.parse(localStorage.getItem("editQuiz"));
        const index = quiz.questions.findIndex(q => q.question === this.props.title);
        quiz.questions.splice(index, 1);

        console.log(quiz.questions);
        console.log(quiz);
        
        

        fetch("http://" + host + ":8080/quizbackend/v1/quizzes/edit",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ description: quiz.description, title: quiz.title, questions: quiz.questions, id: quiz.id }), //Gibt dem Server das quiz
            })
    }

    render() {
        return (
            <div className="row" style={{ marginBottom: "10px", backgroundColor: "lightgrey", borderRadius: "8px" }}>
                <div className="col-md-8 text-left">
                    <h4> {this.props.title} </h4>
                </div>
                <div className="col-md-4 text-right">
                    <Link to="/" className="btn btn-light"><img src={editIcon} alt="edit" height="50" /></Link>
                    &nbsp;
                    <button onClick={this.deleteQuestion} className="btn btn-light"><img src={trashIcon} alt="edit" height="50" /></button>
                </div>
            </div>
        );
    }
}

class EditScreen extends Component {

    constructor() {
        super();
        this.state = { quiz: undefined };
    }

    componentDidMount() {
        let quizId = this.props.match.params.quizId;

        //Get a game from Server
        fetch("http://" + host + ":8080/quizbackend/v1/quizzes/" + quizId)
            .then(response => response.json())
            .then(quiz => {
                console.log(quiz);
                this.setState({ quiz })
                localStorage.setItem("editQuiz", JSON.stringify(quiz));
            })
    }

    render() {
        return (
            <div className="text-center">
                <div className="row">
                    <div className="col-md-3">
                        <button className="btn btn-dark">exit</button>
                    </div>
                    <div className="col-md-6">
                        <h1>{this.state.quiz && this.state.quiz.title}</h1>
                    </div>
                </div>
                {this.state.quiz && this.state.quiz.questions.map(question => {
                    console.log(question.question);
                    return <Question key={question.question} title={question.question} />
                }
                )}
            </div>
        );
    }
}

export default EditScreen;
