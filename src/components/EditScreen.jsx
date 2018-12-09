import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import editIcon from "../image_edit.png";
import trashIcon from "../image_trash.png";

const host = window.location.hostname;

class Question extends Component {
    render() {
        return (
            <div className="row" style={{ marginBottom: "10px", backgroundColor: "lightgrey", borderRadius: "8px" }}>
                <div className="col-md-8 text-left">
                    <h4> {this.props.question.question} </h4>
                </div>
                <div className="col-md-4 text-right">
                    <Link to="/" className="btn btn-light"><img src={editIcon} alt="edit" height="50" /></Link>
                    &nbsp;
                    <button onClick={() => this.props.deleteQuestion(this.props.question.id)} className="btn btn-light"><img src={trashIcon} alt="edit" height="50" /></button>
                </div>
            </div>
        );
    }
}

class EditScreen extends Component {

    constructor() {
        super();
        this.state = { quiz: undefined, info: "" };
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

    deleteQuestion = (questionId) => {
        if (window.confirm("Do you really want to delete this question?")) {
            const index = this.state.quiz.questions.findIndex(q => q.id === questionId);
            this.state.quiz.questions.splice(index, 1);
            var info;

            fetch("http://" + host + ":8080/quizbackend/v1/quizzes/edit/" + this.state.quiz.id + "+" + questionId)
                .then(response => {
                    if (response.status === 200) {
                        info = "The question was deleted";
                    }
                    else if (response.status === 404) {
                        info = "Coundn't delete the question";
                    }
                    return response;
                }
                );
            this.setState({ info, quiz: this.state.quiz })
        }
    }

    render() {
        return (
            <div className="text-center">
                <div className="row">
                    <div className="col-md-3">
                        <Link to="/quizzes" className="btn btn-dark">exit</Link>
                    </div>
                    <div className="col-md-6">
                        <h1>{this.state.quiz && this.state.quiz.title}</h1>
                        <h6 style={{ backgroundColor: "lightyellow", borderRadius: "5px" }}>{this.state.info}</h6>
                    </div>
                </div>
                {this.state.quiz && this.state.quiz.questions.map(question => {
                    return <Question key={question.id} question={question} deleteQuestion={this.deleteQuestion} />
                }
                )}
                <div className="row">
                    <div className="col-md-12">
                        <Link to={"/editQuestion/"+ -1}className="btn btn-outline-dark"
                            style={{
                                backgroundColor: "rgba(211,211,211,0.6)", width: "100%", height: "65px",
                                border: "5px dashed grey", fontSize: "20px", color: "black"
                            }}>
                            Add Question
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditScreen;
