import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import '../QuestionScreen.css';

class QuestionScreen extends Component {

    constructor() {
        super();
        this.state = {
            time: JSON.parse(localStorage.getItem("game")).quiz.currentQuestion.time,
            redirectToResultScreen: false
        };
    }

    componentDidMount() {
        let time = this.state.time;
        let intervalId = setInterval(() => {
            if (time === 0) {
                this.setState({ redirectToResultScreen: true });
            }
            else {
                time--;
            }
            this.setState({ time });
        }, 1000)
    }

    choseColor = (index) => {
        let color = "";
        if (index === 0) {
            color = "red";
        }
        else if (index === 1) {
            color = "green";
        }
        else if (index === 2) {
            color = "blue";
        }
        else if (index === 3) {
            color = "yellow";
        }
        return color;
    }

    render() {
        var game = JSON.parse(localStorage.getItem("game"));

        let answers = game.quiz.currentQuestion.answers;
        let answersArray = Object.entries(answers);

        let result = answersArray.map((a,index) => <li key={a} style={{backgroundColor: this.choseColor(index)}}>{a}</li>);

        return (
            <div className="QuestionScreen">

                {this.state.redirectToResultScreen && <Redirect to="/results" />}

                <div className="row">
                    <div className="col-md-12 text-left">
                        <h1> {this.state.time} </h1>
                    </div>
                    <div className="col-md-12 text-right">
                        <Link to="/results" className="btn btn-dark">Next</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <div className="question">
                            <h1>{game.quiz.currentQuestion.question}</h1>
                        </div>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col-md-12">
                        <ul className="options">
                            {result}
                        </ul>
                    </div>

                </div>
            </div>
        );
    }
}
export default QuestionScreen;
