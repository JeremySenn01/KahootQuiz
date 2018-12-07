import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

//Comparator
function compare(a, b) {
    if (a.score < b.score)
        return 1;
    if (a.score > b.score)
        return -1;
    return 0;
}

const host = window.location.hostname;

class ResultScreen extends Component {

    constructor() {
        super();
        this.state = { players: undefined, redirectToQuestionScreen: false, redirectToPodium: false }
    }

    //Function for button action
    //Show next question or podium
    handleNextQuestion = () => {
        const game = JSON.parse(localStorage.getItem("game"));

        //Update the current question so that player answer options are updated
        fetch("http://" + host + ":8080/quizbackend/v1/games/ucq/" + game.pin)
            .then(response => response.json())
            .then(game => {
                //Game is done (show podium)
                if (game.status === 2) {
                    this.setState({ redirectToPodium: true });
                }
                //Updated Sucessfully
                else {
                    localStorage.setItem("game", JSON.stringify(game));
                    this.setState({ redirectToQuestionScreen: true });
                }
            });
    }

    render() {
        const game = JSON.parse(localStorage.getItem("game"));
        let players = game.players;

        players = players.sort(compare);

        //Create the ranking <li> elements
        let ranking = players.map((player, index) =>
            <li
                key={player.id}
                style={{ backgroundColor: "lightblue", height: "30px", width: "40%" }}>
                {index + 1}. {player.name}
                <span style={{ float: "right" }}>{player.score} points</span>
            </li>)

        return (
            <div className="ResultScreen">

                {this.state.redirectToQuestionScreen && <Redirect to="/question" />}
                {this.state.redirectToPodium && <Redirect to="/podium" />}

                <div className="row">
                    <div className="col-md-12 text-right">
                        <button onClick={this.handleNextQuestion} className="btn btn-dark text-right">next</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h1>Ranking</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {ranking &&
                            <ul className="ranking">
                                {ranking}
                            </ul>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
export default ResultScreen;
