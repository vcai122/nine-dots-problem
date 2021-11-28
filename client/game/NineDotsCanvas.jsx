import React, { Component } from 'react'

export default class NineDotsCanvas extends Component {

  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }
  

  render() {
    const { dimension, handleMouseDown, handleMouseMove, handleMouseUp } = this.props
    return (
      <canvas
        id = 'canvas'
        style = {{backgroundColor: 'WhiteSmoke'}}
        width = {dimension}
        height = {dimension}
        ref = {this.canvasRef}
        onMouseDown = {handleMouseDown}
        onMouseMove = {handleMouseMove}
        onMouseUp = {handleMouseUp}
      />
    )
  }

  componentDidMount() {
    this.drawCanvas()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.linePoints === this.props.linePoints) return
    this.drawCanvas()
  }

  drawCanvas = () => {
    //redraws everything
    const { dimension, linePoints, player } = this.props
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let count = 0
    for (let x = dimension/4; x < dimension; x+= dimension/4) {
      for (let y = dimension/4; y < dimension; y += dimension/4) {
        if (this.isCovered(x, y)) {
          this.drawDot(ctx, x, y, true)
          count++
        }
        else {
          this.drawDot(ctx, x, y, false)
        }
      }
    }

    if (player) player.round.set("value", count);

    for (let i = 1; i < linePoints.length; i++) {
      const {x: x1, y: y1} = linePoints[i - 1]
      const {x: x2, y: y2} = linePoints[i]
      this.drawLine(ctx, x1, y1, x2, y2)
    }
    linePoints.forEach(point => this.drawPoint(ctx, point.x, point.y))
  }

  getBoundingClientRect = () => {
    return this.canvasRef.current.getBoundingClientRect()
  }

  isCovered = (x, y) => {
    const { linePoints } = this.props
    for (let i = 1; i < linePoints.length; i++) {
      const {x: x1, y: y1} = linePoints[i - 1]
      const {x: x2, y: y2} = linePoints[i]
      const d = this.distanceToLineSeg(x, y, x1, y1, x2, y2)
      if (d < 10) return true
    }
    return false
  }

  drawDot = (ctx, x, y, covered) => {
    const { dimension } = this.props
    ctx.beginPath()
    ctx.arc(x, y, dimension/75, 0, 2 * Math.PI, false)
    ctx.fillStyle = covered? 'green' : 'black'
    ctx.fill()
  }

  drawPoint = (ctx, x, y) => {
    const { dimension, player } = this.props
    ctx.beginPath()
    ctx.arc(x, y, dimension/75, 0, 2 * Math.PI, false)
    ctx.fillStyle = player? 'white' : 'grey'
    ctx.fill()
    ctx.lineWidth = dimension/600
    ctx.strokeStyle = player? 'black' : 'grey'
    ctx.stroke()
  }

  drawLine(ctx, x1, y1, x2, y2) {
    const { dimension, player } = this.props
    ctx.strokeStyle = player? 'black' : 'grey';
    ctx.lineWidth = dimension/120;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  distanceToLineSeg = (x, y, x1, y1, x2, y2) => {
    //calculates distance from point to line segment
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;
  
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;
  
    var xx, yy;
  
    if (param < 0) {
      xx = x1;
      yy = y1;
    }
    else if (param > 1) {
      xx = x2;
      yy = y2;
    }
    else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
  
    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

}
