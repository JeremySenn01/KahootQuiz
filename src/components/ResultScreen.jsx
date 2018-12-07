import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const host = window.location.hostname;

class ResultScreen extends Component {

    constructor() {
        super();
        this.state = { game: undefined }
    }

    componentDidMount() {
        let game = JSON.parse(localStorage.getItem("game"));

        //Get the game which has been updated (Players submitted answers)
        fetch("http://" + host + ":8080/quizbackend/v1/games/question",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ pin: game.pin, questionStatus: 1 }), //Gibt dem Server den Player
            })
            .then(response => response.json())
            .then(game => {
                localStorage.setItem("game", JSON.stringify(game));
                this.setState(game);
            })

        //Get game with Player Answer Submissions
        fetch("http://" + host + ":8080/quizbackend/v1/games/" + game.pin)
            .then(response => response.json())
            .then(game => {
                localStorage.setItem("game", JSON.stringify(game));
                this.setState({ game });

            });
    }

    render() {

        //Find out which answers were submitted
        if (this.state.game !== undefined) {
            var submittedAnswers = this.state.game.quiz.currentQuestion.submittedAnswers;
            var answers1 = this.state.game.quiz.currentQuestion.answers;
            var answers = Object.entries(answers1);
            var submittedAnswerCount = [];
            var data = [];

            //Create Count variable for each answer
            for (let i = 0; i < answers.length; i++) {
                submittedAnswerCount[i] = 0;
            }
            //Increment count of submitted Answers
            for (let i = 0; i < submittedAnswers.length; i++) {
                for (let j = 0; j < answers.length; j++) {
                    if (answers[j][0] === submittedAnswers[i]) {
                        submittedAnswerCount[j]++;
                    }
                }
            }

            for (let i = 0; i < submittedAnswerCount.length; i++) {
                data[i] = { name: answers[i][0], amount: submittedAnswerCount[i] }
            }
        }

        return (
            <div>
                <div className="row">
                    <div className="col-md-12 text-right">
                        <Link to="/ranking" className="btn btn-dark text-right">ranking</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-right">
                        <h1>{ /*this.state.quiz.currentQuestion.question */} </h1>
                    </div>
                </div>
                <BarChart width={730} height={250} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{fill: "black"}}/>
                    <YAxis tick={{fill: "black"}}/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#8884d8"/>
                </BarChart>
            </div>
        );
    }
}
export default ResultScreen;
