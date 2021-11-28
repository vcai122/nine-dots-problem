import React from "react";
import Slider from "meteor/empirica:slider";
import NineDotsGame from "./NineDotsGame";

export default class TaskResponse extends React.Component {

  // setPlayerValue = value => {
  //   const { player } = this.props;
  //   player.round.set("value", value);
  // }

  handleSubmit = event => {
    event.preventDefault();
    this.props.player.stage.submit();
  };

  renderSubmitted() {
    return (
      <div className="task-response">
        <div className="response-submitted">
          <h5>Waiting on other players...</h5>
          Please wait until all players are ready
        </div>
      </div>
    );
  }

  render() {
    const { player } = this.props;

    // If the player already submitted, show submitted screen
    if (player.stage.submitted) {
      return this.renderSubmitted();
    }

    return (
      <div className="task-response">
        <NineDotsGame player = {player}/>
        <form onSubmit={this.handleSubmit}>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
