import React, { Component } from "react";
import { Icon, Popup } from "semantic-ui-react";

export default class Marker extends Component {
  render () {
    return (
      <div>
        {/* {this.props.text} */}
        
        <Popup trigger={<Icon name="home" circular size="large" />} header={this.props.header}/>
      </div>
    );
  }
}