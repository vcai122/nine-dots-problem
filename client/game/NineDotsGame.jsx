import React, { Component, createRef } from 'react'
import NineDotsCanvas from './NineDotsCanvas'

const Mode = {
  ReadyToDraw: 0, 
  Drawing: 1,
  FinishedDrawing: 2
}

const dimension = 500

export default class NineDotsGame extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      linePoints: this.props.player.round.get("linePoints"),
      drawingStage: Mode.ReadyToDraw,
      selectedPoint: -1 //for editing points after lines have been drawn
    }
    this.canvasRef = React.createRef()
  }

  reset = () => {
    this.setState({
      linePoints: [],
      drawingStage: Mode.ReadyToDraw,
      selectedPoint: -1
    })
    this.props.player.round.set("linePoints", [])
  }

  handleMouseDown = (event) => {
    const { drawingStage } = this.state
    const coords = this.getCoords(event)

    if (drawingStage === Mode.ReadyToDraw) {
      this.setState({
        linePoints: [coords],
        drawingStage: Mode.Drawing
      }, () => {
        this.props.player.round.set("linePoints", this.state.linePoints)
      })
    }
    else if (drawingStage === Mode.Drawing) {
      this.setState(prevState => ({
        drawingStage: prevState.linePoints.length === 5? 
          Mode.FinishedDrawing : prevState.drawingStage
      }), () => {
        this.props.player.round.set("linePoints", this.state.linePoints)
      })
    }
    else {
      this.setState(prevState => ({
        selectedPoint: prevState.selectedPoint === -1? this.getSelectedPoint(coords.x, coords.y) : -1
      }), () => {
        this.props.player.round.set("linePoints", this.state.linePoints)
      })
    }
  }

  handleMouseMove = (event) => {
    const { drawingStage } = this.state;
    const coords = this.getCoords(event)
    if (drawingStage === Mode.Drawing) {
      this.setState(prevState => ({
        linePoints: [...prevState.linePoints.slice(0, prevState.linePoints.length - 1), coords]
      }))
    }
    else if (drawingStage === Mode.FinishedDrawing) {
      this.setState(prevState => ({
        linePoints: prevState.selectedPoint === -1?
        prevState.linePoints :
        [
          ...prevState.linePoints.slice(0, prevState.selectedPoint), 
          coords, 
          ...prevState.linePoints.splice(prevState.selectedPoint + 1, prevState.linePoints.length)
        ]
      }))
    }
  }

  handleMouseUp = (event) => {
    const { drawingStage } = this.state;
    const coords = this.getCoords(event)
    if (drawingStage === Mode.Drawing) {
      this.setState(prevState => ({
        linePoints: [...prevState.linePoints, coords]
      }))
    }
  }

  render() {
    return (
      <div>
        <div>
          <NineDotsCanvas
            linePoints = {this.state.linePoints}
            dimension = {dimension}
            ref = {this.canvasRef}
            handleMouseDown = {this.handleMouseDown}
            handleMouseMove = {this.handleMouseMove}
            handleMouseUp = {this.handleMouseUp}
            player = {this.props.player}
          />
      </div>
      <button onClick = {this.reset}> Reset </button>
    </div>
    )
  }

  getCoords = (event) => {
    //gets the coodinates corresponding to an event
    const canvas = this.canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return {x, y}
  }


  getSelectedPoint = (x, y) => {
    //gets the index corresponding to the selected point in linePoints, returns -1 if no points were selected
    const { linePoints } = this.state
    for (let i = 0; i < linePoints.length; i++) {
      const point = linePoints[i]
      const d = Math.sqrt( (point.x - x) * (point.x - x) + (point.y - y) * (point.y - y) )
      if (d < 10) return i
    }
    return -1
  }
}


