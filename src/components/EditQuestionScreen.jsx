import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";

class EditQuestionScreen extends Component {
    constructor() {
        super();

        this.state = { quizId: undefined, questionNr: undefined, title: "", a1: "", a2: "", a3: "", a4: "" }
    }

    componentDidMount() {
        let questionId = this.props.match.params.questionId;
        let quiz = JSON.parse(localStorage.getItem("editQuiz"));

        //edit question
        if (questionId !== "-1") {
            console.log(questionId);

            let question = quiz.questions.find(q => q.id === questionId);

            let questionNr = quiz.questions.indexOf(question);
            let title = question.question;
            let answers = Object.entries(question.answers);

            this.setState({ questionNr, title, answers, quizId: quiz.id, a1: answers[0], a2: answers[1], a3: answers[2], a4: answers[3]})
        }
        //new question
        else {
            this.setState({ questionNr: quiz.questions.length + 1, quizId: quiz.id });
        }
    }

    saveQuestion = () => {
        let title = this.state.title;
        let a1 = this.state.a1;
        let a2 = this.state.a2;
        let a3 = this.state.a3;
        let a4 = this.state.a4;



    }

    render() {
        return (
            <div>
                <div className="row" style={{ marginBottom: "60px" }}>
                    <div className="col-md-2">
                        <Link to={"/edit/" + this.state.quizId} className="btn btn-dark">cancel</Link>
                    </div>
                    <div className="col-md-8">
                        <h1>Question {this.state.questionNr}</h1>
                    </div>
                    <div className="col-md-2">
                        <Link to="" className="btn btn-dark">save</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <p>Question (required)</p>
                        <textarea rows="3" cols="50" style={{ resize: "none" }} maxLength="172"></textarea>
                    </div>
                    <div className="col-md-4 ">
                        <select className="btn btn-dark" style={{ height: "50px", width: "50%" }}>
                            <option value="5">5 sec</option>
                            <option value="10">10 sec</option>
                            <option value="20">20 sec</option>
                            <option value="30">30 sec</option>
                            <option value="60">60 sec</option>
                            <option value="90">90 sec</option>
                            <option value="120">120 sec</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <p>Answer 1 (reqiured)</p>
                        <textarea ref={input => (this.answ1 = input)} value={this.state.a1} cols="40" rows="2" style={{ resize: "none" }} maxLength="90"></textarea>
                </div>
                <div className="col-md6">
                    <p>Answer 2 (reqiured)</p>
                    <textarea ref={input => (this.answ2 = input)} value={this.state.a2} cols="40" rows="2" style={{ resize: "none" }} maxLength="90"></textarea>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <p>Answer 3</p>
                    <textarea ref={input => (this.answ3 = input)} value={this.state.a3} cols="40" rows="2" style={{ resize: "none" }} maxLength="90"></textarea>
                </div>
                <div className="col-md-6">
                    <p>Answer 4</p>
                    <textarea ref={input => (this.answ4 = input)} value={this.state.a4} cols="40" rows="2" style={{ resize: "none" }} maxLength="90"></textarea>
                </div>
            </div>
            </div >
        );
    }
}

export default EditQuestionScreen;