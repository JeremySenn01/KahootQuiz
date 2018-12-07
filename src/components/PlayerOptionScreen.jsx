import React, { Component } from 'react';
import { Redirect } from 'react-router';

import '../PlayerOptionScreen.css';

const host = window.location.hostname;

class PlayerOptionScreen extends Component {

    constructor() {
        super();
        this.state = { redirectToPlayerResult: false, answered: false, intervalId: undefined }
    }

    //Wait for Response
    componentDidMount() {
        let intervalId = setInterval(() => {
            var playerGame = JSON.parse(localStorage.getItem("player"));

            fetch("http://" + host + ":8080/quizbackend/v1/games/" + playerGame.pin)
                .then(response => response.json())
                .then(game => {
                    //question status has changed (question moved on)
                    if (game.quiz.currentQuestion.status === 1) {
                        this.setState({ redirectToPlayerResult: true })
                    }

                });
        }, 3000)
        this.setState({ intervalId })
    }

    //Clear Interval
    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    //Submit answer
    handleEnterAnswer = (answer) => {
        console.log(answer[0]);
        localStorage.setItem("playerAnswer", JSON.stringify(answer));
        const player = JSON.parse(localStorage.getItem("player"));
        const playerAnswer = JSON.parse(localStorage.getItem("playerAnswer"));

        //Send answer to server
        fetch("http://" + host + ":8080/quizbackend/v1/games/submit",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ pin: player.pin, answer: answer[0] }), //Gibt dem Server den Player
            })
            .then(response => response.json())
            .then(game => {
                console.log(game);
                this.setState({ redirectToPlayerResult: true });
            });

        if (playerAnswer[1] === true) {
            player.score += 1000;
            console.log("increased score:" + player.score);

            //Update Player Score
            fetch("http://" + host + ":8080/quizbackend/v1/games/updatePlayer",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    //Gibt dem Serven den updateten Player
                    body: JSON.stringify({ pin: player.pin, id: player.id, score: player.score })
                })
                .then(response => response.json())
                .then(player => {
                    localStorage.setItem("player", JSON.stringify(player));
                })
        }
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
        const game = JSON.parse(localStorage.getItem("game"));
        const player = JSON.parse(localStorage.getItem("player"));

        let answers = game.quiz.currentQuestion.answers;
        let answersArray = Object.entries(answers);

        let result = answersArray.map((a, index) =>
            <li style={{ backgroundColor: this.choseColor(index) }} onClick={e => this.handleEnterAnswer(a)} key={a}>{a}</li>
        );

        return (
            <div className="PlayerOptionScreen">
                {this.state.redirectToPlayerResult && <Redirect to="/playerResult" />}
                <div className="row">
                    <div className="col-md-6 text-left">
                        PIN: {player.pin}
                    </div>
                    <div className="col-md-6 text-right">
                        Name: {player.name}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <ul className="options">
                            {result}
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-right">
                        Score: {player.score}
                    </div>
                </div>

            </div>
        );
    }
}
export default PlayerOptionScreen;
