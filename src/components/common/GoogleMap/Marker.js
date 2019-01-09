import React, { Component } from "react";
import { Icon, Popup } from "semantic-ui-react";

class Marker extends Component {

  styleIncident = () => {
    // returns the icon name based on the provided incidentType. (todo: add these icons to labels so they correspond)
    switch(this.props.incidentType) {
      case 1: return "cog"; // construction
      case 2: return "map pin"; // event
      case 3: return "clock"; // congestion
      case 4: return "exclamation circle"; // Incident or accident
      default: return "";
    }
  }

  styleIncidentSeverity = () => {
    // returns the icon name based on the provided incidentType. (todo: add these icons to labels so they correspond)
    switch(this.props.incidentSeverity) {
      case 0: return "green";
      case 1: return "olive";
      case 2: return "yellow";
      case 3: return "orange";
      case 4: return "red";
      default: return "";
    }
  }


  renderType = () => {
    if (this.props.popup) {
      if (!this.props.incidentMarker)
        return <Popup trigger={<Icon name={this.props.iconName} color={this.props.iconColor} circular size="big" inverted />} header={this.props.header}/>;
      else
        return (
          <Popup 
            trigger={
              <Icon 
                name={this.styleIncident() || "question circle"} 
                color={this.styleIncidentSeverity() || null} 
                circular size="big"
                inverted
              />
            } 
            header={this.props.header}
          />
        );
    } else {
      return (<Icon name={this.props.iconName} color={this.props.iconColor} circular size="big" inverted />);
    }
  }

  render () {
    return this.renderType();
  }
}

Marker.defaultProps = {
  popup: false, // only true if enabling popup functionality
  header: null, // popup text
  incidentMarker: false, // if only true if rendering Incidents onto the map
  iconName: "home", // if not an incidentMarker, you can specify a custom iconName.
  iconColor: null // custom icon color if not incident marker
}

export default Marker;