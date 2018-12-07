import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import '../LobbyScreen.css';

const host = window.location.hostname;

class LobbyScreen extends Component {

    constructor() {
        super();
        this.state = { game: {}, loaded: false, error: "", redirectToQuestionScreen: false, intervalId: undefined}
    }

    //Fetch game every-so-often
    componentDidMount() {
      let intervalId = setInterval(() => {
            const game = JSON.parse(localStorage.getItem("game"));
            
            fetch("http://"+host+":8080/quizbackend/v1/games/" + game.pin)
                .then(response => response.json())
                .then(game => {
                    this.setState({ game, loaded: true })
                    localStorage.setItem("game", JSON.stringify(game));
                });
        }, 2000)
        this.setState({intervalId});
    }

    //Cancel Interval
    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    //Start the game by setting the state to "playing"
    handleStartGame = () => {        
        fetch("http://"+host+":8080/quizbackend/v1/games/lobby",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ pin: this.state.game.pin, status: 1}), //Sagt dem Server, er soll das Spiel starten,
                                                                         //indem er den Status des Spiels ändert
        })
        .then(response => response.json())
        .then(game => {
            console.log("Starting Game");
            this.setState({redirectToQuestionScreen: true});
            localStorage.setItem("game", JSON.stringify(game));
        });
    }

    render() {
        const game = JSON.parse(localStorage.getItem('game'));

        var players = [];
        if (this.state.game.players) {
            players = this.state.game.players.map(p => <li className="name" key={p.id}>{p.name}</li>);
        }
        return (
            <div className="lobbyScreen">
                {this.state.redirectToQuestionScreen && <Redirect to="/question" />}
                <div className="row lobbyTitle">
                    <div className="col md-4">
                        <h3>Players: {this.state.loaded && this.state.game.players.length}</h3>
                    </div>
                    <div className="col md-4">
                        <h1>Lobby: {game.pin}</h1>
                    </div>
                    <div className="col md-4">
                        <button onClick={this.handleStartGame} className="btn btn-dark">Start</button>
                    </div>
                </div>
                <div className="lobbyPlayers">
                    <ul> {players} </ul>
                </div>
                {this.state.error}
            </div>
        );
    }
}
export default LobbyScreen;
