import React from "react";
import { Label, Icon } from "semantic-ui-react";

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
  if (bool) return (<Label basic color="black"><Icon name="car" color="black" />Impacting Traffic</Label>);
  return (null);
}