import React, { Component } from 'react';
import { Redirect } from 'react-router';

const host = window.location.hostname;

class PlayerResultScreen extends Component {

    constructor() {
        super();
        this.state = { intervalId: undefined, redirectToOptionScreen: false, redirectToPlayerPodium: false, waiting: true }
    }

    //Get the current question / Update and post player score
    componentDidMount() {
        const game = JSON.parse(localStorage.getItem("game"));
        let oldQuestion = game.quiz.currentQuestion;

        //Fetch question from server
        let intervalId = setInterval(() => {
            fetch("http://" + host + ":8080/quizbackend/v1/games/" + game.pin)
                .then(response => response.json())
                .then(game => {
                    //Waiting for Results
                    if (game.quiz.currentQuestion.status === 1) {
                        this.setState({ waiting: false });
                    }
                    //Current Question was updated                    
                    if (game.quiz.currentQuestion.question !== oldQuestion.question) {
                        localStorage.setItem("game", JSON.stringify(game));
                        this.setState({ redirectToOptionScreen: true });
                    }
                    //game is done (showing podium)
                    if (game.status === 2) {
                        console.log("game is done");
                        this.setState({ redirectToPlayerPodium: true });
                    }

                });
        }, 3000)
        this.setState({ intervalId });

    }

    //Clear interval
    componentWillUnmount() {
        clearInterval(this.state.intervalId);
        console.log("unmounting PLayerResultScreen");
    }

    render() {
        const playerAnswer = JSON.parse(localStorage.getItem("playerAnswer"));
        const player = JSON.parse(localStorage.getItem("player"));
        
        let answer;
        let bg;

        if (!this.state.waiting) {
            // Update The score of the Player
            if (playerAnswer[1] === true) {
                answer = "Correct!!!"
                bg = "green";
            }
            else {
                answer = "Wrong";
                bg = "red";
            }
        }
        else {
            answer = "Waiting...";
        }
        return (
            <div className="PlayerResultScreen" style={{ backgroundColor: bg }}>
                {(!this.state.waiting && this.state.redirectToOptionScreen) && <Redirect to="/playing" />}
                {this.state.redirectToPlayerPodium && <Redirect to="/playerPodium" />}

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
                        <h1>{answer}</h1>
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
export default PlayerResultScreen;
