import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

const host = window.location.hostname;

class WaitingScreen extends Component {

    constructor() {
        super();
        this.state = { game: {}, redirectToPlayerOptionScreen: false };
    }

    //Fetch state of game every-so-often
    //Start the game when status is 1
    componentDidMount() {
        setInterval(() => {
            var playerGame = JSON.parse(localStorage.getItem("player"));
            fetch("http://"+host+":8080/quizbackend/v1/games/" + playerGame.pin)
                .then(response => response.json())
                .then(game => {
                    if (game.status === 1) {
                        this.setState({ game, redirectToPlayerOptionScreen: true })
                    }
                    else {
                        this.setState({ game });
                    }
                    localStorage.setItem("game", JSON.stringify(game));
                });
        }, 3000)
    }

    render() {
        const player = JSON.parse(localStorage.getItem("player"));
        return (
            <div className="text-center">
                {this.state.redirectToPlayerOptionScreen && <Redirect to="/playing" />}
                <div className="row">
                    <div className="col md-4">
                        PIN: {player.pin}
                    </div>
                    <div className="col md-4"></div>
                    <div className="col md-4">
                        Name: {player.name}
                    </div>
                </div>
                <div className="row">
                    <div className="col md-12">
                        <h1>You're in. See your Name on the Screen?</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default WaitingScreen;
