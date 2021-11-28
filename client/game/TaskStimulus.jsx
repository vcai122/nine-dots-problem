import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
    const { round, stage, player } = this.props;

    return (
      <div className="task-stimulus">
        Welcome to the Nine Dots Game! Draw 4 connected lines that connects all the dots.
      </div>
    );
  }
}
