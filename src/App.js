import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Redirect } from 'react-router';

import QuizScreen from './components/QuizScreen';
import LobbyScreen from './components/LobbyScreen';
import WaitingScreen from './components/WaitingScreen';
import PlayerOptionScreen from "./components/PlayerOptionScreen";
import QuestionScreen from "./components/QuestionScreen";
import ResultScreen from "./components/ResultScreen";
import PlayerResultScreen from "./components/PlayerResultScreen";
import RankingScreen from "./components/RankingScreen";
import PodiumScreen from "./components/PodiumScreen";
import PlayerPodiumScreen from "./components/PlayerPodiumScreen";
import EditScreen from "./components/EditScreen";
import EditQuestionScreen from "./components/EditQuestionScreen";


import './App.css';

const host = window.location.hostname;

class MainScreen extends Component {

  constructor() {
    super();
    this.state = { redirectToWaitingScreen: false, error: "", game: {} }
  }

  handleEnter = () => {
    let pin = this.inputPin.value;
    let name = this.inputNickname.value;
    let worked = false;

    //Name is long enough
    if (name.length > 2) {

      //Enter the Game and receive player -> save to localStorage
      fetch("http://" + host + ":8080/quizbackend/v1/games/enter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({ pin: pin, name: name, score: 0, id: -1 }), //Gibt dem Server den Player
        })
        .then(response => {
          if (response.status === 200) {
            worked = true;
            return response.json();
          }
        })
        .then(player => {
          if (worked) {
            localStorage.setItem("player", JSON.stringify(player));
            this.setState({ redirectToWaitingScreen: true })
          }
        })
        .catch(this.setState({ error: "Couldn't enter game" }))
    }
    //Name is too short -> show error
    else {
      this.setState({ error: "Name is too short" })
    }
  }

  render() {
    return (
      <div className="row">
        {this.state.redirectToWaitingScreen && <Redirect to="/waiting" />}

        <div className="col-sm-2 col-md-4 col-lg-5"></div>

        <div className="col-sm-8 col-md-4 col-lg-2  text-center">
          <input ref={input => this.inputPin = input} className="form-control" placeholder="game pin" style={{ marginBottom: "5px" }}></input>
          <input ref={input => this.inputNickname = input} className="form-control" placeholder="nickname"></input>
          <br />
          <button onClick={this.handleEnter} className="btn btn-dark">Enter</button>
          <br /><br />
          <Link to="/quizzes" className="btn btn-dark">Create Game</Link>
          <br />
          {this.state.error}
        </div>

        <div className="col-sm-2 col-md-4 col-lg-5"></div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <Route exact path="/" component={MainScreen} />
          <Route exact path="/quizzes" component={QuizScreen} />
          <Route exact path="/lobby" component={LobbyScreen} />
          <Route exact path="/waiting" component={WaitingScreen} />
          <Route exact path="/playing" component={PlayerOptionScreen} />
          <Route exact path="/question" component={QuestionScreen} />
          <Route exact path="/results" component={ResultScreen} />
          <Route exact path="/playerResult" component={PlayerResultScreen} />
          <Route exact path="/ranking" component={RankingScreen} />
          <Route exact path="/podium" component={PodiumScreen} />
          <Route exact path="/playerPodium" component={PlayerPodiumScreen} />
          <Route exact path="/edit/:quizId" component={EditScreen} />
          <Route exact path="/editQuestion/:questionId" component={EditQuestionScreen} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;