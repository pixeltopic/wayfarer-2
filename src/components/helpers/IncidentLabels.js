import React from "react";
import { Label, Icon } from "semantic-ui-react";

const styleIncidentIcon = typeNum => {
  // returns the icon name based on the provided incidentType. (todo: add these icons to labels so they correspond)
  switch(typeNum) {
    case 1: return "cog"; // construction
    case 2: return "map pin"; // event
    case 3: return "clock"; // congestion
    case 4: return "exclamation circle"; // Incident or accident
    default: return "";
  }
}

const styleIncidentSeverity = severityNum => {
  // returns the icon name based on the provided incidentType. (todo: add these icons to labels so they correspond)
  switch(severityNum) {
    case 0: return "green";
    case 1: return "olive";
    case 2: return "yellow";
    case 3: return "orange";
    case 4: return "red";
    default: return "";
  }
}

export const IncidentLabel = ({ typeNum, severityNum }) => {
  const color = styleIncidentSeverity(severityNum);
  const iconName = styleIncidentIcon(typeNum);
  switch(typeNum) {
    case 1: return (<Label color={color}><Icon name={iconName} inverted/>Construction</Label>);
    case 2: return (<Label color={color}><Icon name={iconName} inverted/>Event</Label>);
    case 3: return (<Label color={color}><Icon name={iconName} inverted/>Congestion</Label>);
    case 4: return (<Label color={color}><Icon name={iconName} inverted/>Incident or Accident</Label>);
    default: return null;
  }
}

export const IncidentTypeLabel = props => {
  switch(props.num) {
    case 1: return (<Label basic color="yellow">Construction</Label>);
    case 2: return (<Label basic color="olive"><Icon name="flag outline" color="olive" />Event</Label>);
    case 3: return (<Label basic color="orange">Congestion</Label>);
    case 4: return (<Label basic color="red"><Icon name="warning sign" color="red" />Incident or Accident</Label>);
    default: return null;
  }
}

export const IncidentSeverityLabel = props => {
  switch(props.num) {
    case 0: return (<Label basic color="green">Severity: Very Low</Label>)
    case 1: return (<Label basic color="olive">Severity: Low</Label>);
    case 2: return (<Label basic color="yellow">Severity: Moderate</Label>);
    case 3: return (<Label basic color="orange">Severity: High</Label>);
    case 4: return (<Label basic color="red"><Icon name="warning sign" color="red" />Severity: Very High</Label>);
    default: return null;
  }
}

export const ImpactingLabel = ({ bool }) => {
  if (bool) return (<Label><Icon name="car" />Impacting Traffic</Label>);
  return (null);
}