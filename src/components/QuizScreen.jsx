import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

const host = window.location.hostname;

class Quiz extends Component {

    constructor() {
        super();
        this.state = { redirectToLobby: false };
    }

    //Start a quiz
    handleStartQuiz = () => {
        //Get a game from Server
        fetch("http://"+host+":8080/quizbackend/v1/games",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ id: this.props.quiz.id }), //Gibt dem Server die ID des zu startenden Quiz zurück
            })
            .then(response => response.json())
            .then(game => {
                localStorage.setItem('game', JSON.stringify(game));
                console.log("status: " + game.quiz.currentQuestion.status);
                this.setState({ redirectToLobby: true })
            })
    }

    //Edit a quiz
    handleEditQuiz = () => {

    }

    render() {
        return (
            <div style={{ backgroundColor: "white", marginBottom: "15px", padding: "6px" }}>
                {this.state.redirectToLobby && <Redirect to="/lobby" />
                }
                <h5>{this.props.quiz.title}</h5>
                <br />
                <button onClick={this.handleStartQuiz} className="btn btn-dark btn-sm">Start</button>
                &nbsp;
                <button onClick={this.handleEditQuiz} className="btn btn-dark btn-sm">Edit</button>
            </div>
        );
    }
}

class QuizScreen extends Component {

    constructor() {
        super();
        this.state = { quizzes: [] };
    }

    componentDidMount() {
        fetch("http://"+host+":8080/quizbackend/v1/quizzes")
            .then(response => response.json())
            .then(quizzes => this.setState({ quizzes }));
    }

    render() {
        return (
            <React.Fragment>
                {this.state.quizzes.map(q => <Quiz quiz={q} key={q.id} />)}
            </React.Fragment>
        );
    }
}

export default QuizScreen;
