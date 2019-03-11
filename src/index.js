import * as React from "react";
import * as ReactDOM from "react-dom";
import { Component, ClassAttributes } from "react";

const formattedSeconds = (sec: number) => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

interface StopwatchProps extends ClassAttributes<Stopwatch> {
  initialSeconds: number;
}

class Stopwatch extends Component<StopwatchProps, any> {
  constructor(props: StopwatchProps) {
    super(props);
    this.state = {
      secondsElapsed: props.initialSeconds,
      lastClearedIncrementer: undefined,
      laps: [],
      stopwatchRunning: false,
      incrementer: 0, //included incrementer within State, so that the "start" button will change to "stop" immediately if "start" is clicked.
    }
  }

  //if this is clicked multiple times before the second it changes to "stop" button, the clock fast forwards.
  //so need to check if stopwatch is already running before doing setInterval.
  handleStartClick() {
    if(this.state.stopwatchRunning === false) {
      this.setState({
        stopwatchRunning: true,      
        incrementer: setInterval(
          () => this.setState({ secondsElapsed: this.state.secondsElapsed + 1, }), 
          1000
        ),
      });

      // this.incrementer = setInterval(
      //   () => this.setState({ secondsElapsed: this.state.secondsElapsed + 1, }), 
      //   1000
      // );
    }    
  }

  handleStopClick() {
    clearInterval(this.state.incrementer);
    this.setState({
      lastClearedIncrementer: this.state.incrementer,
      stopwatchRunning: false,
    });
  }

  handleResetClick() {
    clearInterval(this.state.incrementer);
    this.setState({
      secondsElapsed: 0,
      laps: [],
      stopwatchRunning: false,
    });
  }

  handleLapClick() {
    //running clock time subtracted by total previous lap seconds equals current lap time
    let previousLapSecondsTotal = 0;
    for (let i = 0; i < this.state.laps.length; i++) {
      previousLapSecondsTotal += this.state.laps[i];
    }
    
    this.setState({
      laps: this.state.laps.concat([this.state.secondsElapsed - previousLapSecondsTotal]),
    });
  }

  handleDeleteClick(index: number) {
    //make a copy of this.state.laps before removing element
    const newLaps = [...this.state.laps];
    newLaps.splice(index, 1);

    return () => this.setState({
      laps: newLaps,
    });
  }

  //change the "start" button to "stop" instantly instead of a second later, by checking stopwatchRunning value
  render() {   
    const {
      secondsElapsed,
      lastClearedIncrementer,
      stopwatchRunning,
    } = this.state;

    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>

        {
          ( (secondsElapsed === 0 && stopwatchRunning === false) || this.state.incrementer === lastClearedIncrementer
              ? <button type="button" className="start-btn"
                        onClick={this.handleStartClick.bind(this)}>start
              </button>
              : <button type="button" className="stop-btn"
                        onClick={this.handleStopClick.bind(this)}>stop
              </button>
          )
        }

        {
          (secondsElapsed !== 0 && this.state.incrementer !== lastClearedIncrementer
              ? <button type="button" onClick={this.handleLapClick.bind(this)}>lap</button>
              : null
          )
        }

        {
          (secondsElapsed !== 0 && this.state.incrementer === lastClearedIncrementer
              ? <button type="button" onClick={this.handleResetClick.bind(this)}>reset</button>
              : null
          )
        }

        <div className="stopwatch-laps">
          { this.state.laps && this.state.laps.map(
              (lap, i) => <Lap key={i} index={i+1} lap={lap} onDelete={this.handleDeleteClick(i)} />
            )
          }
        </div>
      </div>
    );

  }

}

const Lap = (props: { index: number, lap: number, onDelete: () => void }) => (
  <div key={props.index} className="stopwatch-lap">
    <strong>{props.index}</strong>/ {formattedSeconds(props.lap)}
    <button onClick={props.onDelete} > X </button>
  </div>
);

ReactDOM.render(
  <Stopwatch initialSeconds={0} />,
  document.getElementById("content"),
);
