import React from "react";
import Slider from "meteor/empirica:slider";
import NineDotsCanvas from './NineDotsCanvas'

export default class SocialExposure extends React.Component {
  renderSocialInteraction(otherPlayer) {
    const value = otherPlayer.round.get("value");
    return (
      <div className="alter" key={otherPlayer._id}>
        <img src={otherPlayer.get("avatar")} className="profile-avatar" />
        <div className="range">
          <NineDotsCanvas
            linePoints = {otherPlayer.round.get("linePoints").map(c => this.scaleCoords(c))}
            dimension = {100}
            player = {null}
          />
        </div>
      </div>
    );
  }

  scaleCoords = c => {
    const x = c.x * 100 / 500
    const y = c.y * 100 / 500
    return {x, y}
  }

  render() {
    const { game, player } = this.props;

    const otherPlayers = _.reject(game.players, p => p._id === player._id);

    if (otherPlayers.length === 0) {
      return null;
    }

    return (
      <div className="social-exposure">
        <p>
          <strong>There are {otherPlayers.length} other players:</strong>
        </p>
        {otherPlayers.map(p => this.renderSocialInteraction(p))}
      </div>
    );
  }
}
