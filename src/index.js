import * as React from "react";
import * as ReactDOM from "react-dom";
import { Component, ClassAttributes } from "react";

//function declarations
const formattedSeconds = (sec: number) => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

interface StopwatchProps extends ClassAttributes<Stopwatch> {
  initialSeconds: number;
}

//class definition
class Stopwatch extends Component<StopwatchProps, any> {
  incrementer: any
  laps: any[] //array of lap times in seconds

  constructor(props: StopwatchProps) {
    super(props);
    this.state = {
      secondsElapsed: props.initialSeconds,
      lastClearedIncrementer: null,
    }
    this.laps = [];
  }

  /* click handlers ********************************/
  handleStartClick() {
    //error: incrementer of undefined. this needs to be binded.
    this.incrementer = setInterval(
      () => this.setState({ secondsElapsed: this.state.secondsElapsed + 1, }), 1000
    );
  }

  handleStopClick() {
    clearInterval(this.incrementer);
    this.setState({
      lastClearedIncrementer: this.incrementer,
    });
  }

  handleResetClick() {
    clearInterval(this.incrementer);
    this.laps = [];//error expected an assignment or function call, instead saw expression no-unused-expression. Missing semi-colon.
      this.setState({
        secondsElapsed: 0,
      });
  }

  //running clock time subtracted by total previous lap seconds equals current lap time
  handleLapClick() {
    let previousLapSecondsTotal = 0;
    for (let i = 0; i < this.laps.length; i++) {
      previousLapSecondsTotal += this.laps[i];
    }
    
    this.laps = this.laps.concat([this.state.secondsElapsed - previousLapSecondsTotal]);//this.state.secondsElapsed
    this.forceUpdate();
  }

  handleDeleteClick(index: number) {
    return () => this.laps.splice(index, 1);
  }
  /* end of click handlers ********************************/

  //renderer for HTML
  render() {
    const {
      secondsElapsed,
      lastClearedIncrementer,
    } = this.state;

    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>

        {
          (secondsElapsed === 0 || this.incrementer === lastClearedIncrementer
              ? <button type="button" className="start-btn"
                        onClick={this.handleStartClick.bind(this)}>start
              </button>
              : <button type="button" className="stop-btn"
                        onClick={this.handleStopClick.bind(this)}>stop
              </button>
          )
        }

        {
          (secondsElapsed !== 0 && this.incrementer !== lastClearedIncrementer
              ? <button type="button" onClick={this.handleLapClick.bind(this)}>lap</button>
              : null
          )
        }

        {
          (secondsElapsed !== 0 && this.incrementer === lastClearedIncrementer
              ? <button type="button" onClick={this.handleResetClick.bind(this)}>reset</button>
              : null
          )
        }

        <div className="stopwatch-laps">
          { this.laps && this.laps.map(
            (lap, i) => <Lap key={i} index={i+1} lap={lap} onDelete={this.handleDeleteClick(i)} />
          )
          }
        </div>
      </div>
    );//end return

  }//end renderer

}//end class definition


//HTML component builder
const Lap = (props: { index: number, lap: number, onDelete: () => {} }) => (
  <div key={props.index} className="stopwatch-lap">
    <strong>{props.index}</strong>/ {formattedSeconds(props.lap)}
    <button onClick={props.onDelete} > X </button>
  </div>
);

//app starts here
ReactDOM.render(
  <Stopwatch initialSeconds={0} />,
  document.getElementById("content"),
);
