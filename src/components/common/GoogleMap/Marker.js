import React, { Component } from "react";
import { Icon, Popup, Card, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { formCache, updateActiveDiscover, fetchPlaceDetails } from "../../../actions";

class Marker extends Component {

  state = { disablePlaceButton: false };

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

  pickPlaceStyle = () => {

    switch(this.props.establishment) {
      case "shopping": return { name: "cart", color: "green" };
      case "entertainment": return { name: "star", color: "yellow" };
      case "food": return { name: "food", color: "olive" };
      default:
        return "question";
    }
  }

  renderIncidentMarker = () => (
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

  onClickPlaceDetails = place_id => {
    console.log("Place_id:",place_id);
    this.setState(
      { disablePlaceButton: true },
      () => this.props.fetchPlaceDetails(place_id, () => this.props.updateActiveDiscover("placeDetails"))
    );
  }

  placeDetailsButton = place_id => {
    // given a place_id from a place found from Google maps, fetches details from google related to the location.
    // will also update the active component to show the details. (A callback will be passed intro marker from PlaceResults)
    
    return (
      <Button 
        basic color='green' 
        disabled={this.state.disablePlaceButton} 
        loading={this.state.disablePlaceButton} 
        onClick={() => this.onClickPlaceDetails(place_id)}
      >
        Details
      </Button>
    );
  }

  renderPlaceMarker = () => (
    <Popup
        on="click"
        size="small"
        trigger={
          <Icon 
            name={this.props.iconName || "star"} 
            color={"olive" || null} 
            circular size="big"
            inverted
          />
        } 
        
      >
        <Popup.Content as={Card}>
          <Card.Content>
            <Card.Header>{this.props.placeData.name}</Card.Header>
            <Card.Meta>Rating: {this.props.placeData.rating}/5 based on {this.props.placeData.user_ratings_total} user ratings.</Card.Meta>
            <Card.Description>
              <p>
                <Icon name="calendar outline" color="olive" />{this.props.placeData.opening_hours.open_now ? "Open Now" : "Closed" }
              </p>
              <p>
                <Icon name="map marker" color="red" />{this.props.placeData.vicinity}
              </p>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='blue'>
                Get Directions
              </Button>
              {this.placeDetailsButton(this.props.placeData.place_id)}
            </div>
          </Card.Content>
        </Popup.Content>
      </Popup>
  );

  renderNormalMarker = () => (<Icon name={this.props.iconName} color={this.props.iconColor} circular size="big" inverted />);

  renderNormalMarkerWithPopup = () => (<Popup trigger={<Icon name={this.props.iconName} color={this.props.iconColor} circular size="big" inverted />} header={this.props.header}/>);

  renderMarkerType = () => {
    switch(this.props.type) {
      case "incident":
        if (this.props.popup) {
          return this.renderIncidentMarker();
        } else {
          console.log("Unimplemented");
          return null;
        }
      case "place":
        if (this.props.popup) {
          return this.renderPlaceMarker();
        } else {
          console.log("Unimplemented");
          return null;
        }
      default:
        if (this.props.popup) {
          return this.renderNormalMarkerWithPopup();
        } else {
          return this.renderNormalMarker();
        }
    }
  }

  render () {
    return this.renderMarkerType();
  }
}

const ConnectedMarker = connect(null, { formCache, updateActiveDiscover, fetchPlaceDetails })(Marker);

ConnectedMarker.defaultProps = {
  popup: false, // only true if enabling popup functionality
  header: null, // popup text
  type: "", // if only true if rendering Incidents onto the map. UPDATE: Must be a string of either "incident" "place" or null/""
  iconName: "home", // if not an incidentMarker, you can specify a custom iconName.
  iconColor: null // custom icon color if not incident marker
}

export default ConnectedMarker;