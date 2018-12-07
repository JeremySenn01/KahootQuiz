import React, { Component } from 'react';
import { Link } from "react-router-dom";

//Comparator
function compare(a, b) {
    if (a.score < b.score)
        return 1;
    if (a.score > b.score)
        return -1;
    return 0;
}

class PodiumScreen extends Component {

    constructor() {
        super();
        this.state = {}
    }

    render() {
        let players = JSON.parse(localStorage.getItem("game")).players;

        players = players.sort(compare);
        let podium = players.filter(player => players.indexOf(player) < 3).map((player, index) => <li key={player.id}> {index + 1}. {player.name} {player.score} points</li>)

        return (
            <div className="ResultScreen">
                <div className="row" >
                    <div className="col-md-12 text-right">
                        <Link className="btn btn-dark" to="/quizzes">done</Link>
                    </div>
                </div>
                <div className="row" >
                    <div className="col-md-12 text-center">
                        <h1> Podium </h1>
                        <ul className="players">
                            {podium}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
export default PodiumScreen;
