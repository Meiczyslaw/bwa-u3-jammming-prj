import React from 'react';
import './Track.css';

export class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
  }
  addTrack(track) {
    this.props.onAdd(this.props.track);
  }
  removeTrack(track) {
    this.props.onRemove(this.props.track);
  }
  renderAction() {
    const anchorTag = this.props.isRemoval ? '-' : '+';
    const clickAction = this.props.isRemoval ? this.removeTrack : this.addTrack;
    return (
      <a className="Track-action" onClick={clickAction}>{anchorTag}</a>
    );
  }
  render() {
    return(
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}
