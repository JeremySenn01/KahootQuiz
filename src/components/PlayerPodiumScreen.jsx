import React, { Component } from 'react';

//Comparator
function compare(a, b) {
    if (a.score < b.score)
        return 1;
    if (a.score > b.score)
        return -1;
    return 0;
}

class PlayerPodiumScreen extends Component {

    render() {
        let players = JSON.parse(localStorage.getItem("game")).players;
        let yourPlayer = JSON.parse(localStorage.getItem("player"));

        var rank;
        players.sort(compare).forEach((player, index) => {
            //Check player with ID
            if (player.id === yourPlayer.id) {
                rank = index + 1;
            }
        });

        let superScript;
        if (rank === 1) {
            superScript = "st";
        }
        else if (rank === 2) {
            superScript = "nd";
        }
        else if (rank === 3) {
            superScript = "rd";
        }
        else {
            superScript = "th";
        }

        return (
            <div className="ResultScreen">
               <h1> You placed {rank}{superScript}!</h1>
            </div>
        );
    }
}
export default PlayerPodiumScreen;
