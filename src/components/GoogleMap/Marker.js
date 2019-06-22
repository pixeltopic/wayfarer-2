import React, { Component } from "react";
import { Icon, Popup, Card, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { formCache, updateActiveDiscover, fetchPlaceDetails, fetchDirections } from "../../actions";
import { formNames } from "../../utils";

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

  nameIncident = () => {
    switch(this.props.incidentType) {
      case 1: return "Construction";
      case 2: return "Event";
      case 3: return "Congestion";
      case 4: return "Incident";
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
      on="click"
      size="small"
      trigger={
        <Icon 
          name={this.styleIncident() || "question circle"} 
          color={this.styleIncidentSeverity() || null}
          circular size="big"
          inverted
        />
      }  
    >
      <Popup.Content as={Card}>
        <Card.Content>
          <Card.Header><Icon name={this.styleIncident() || null} color={this.styleIncidentSeverity() || null}/>{this.nameIncident()}</Card.Header>
          <Card.Description>
            {this.props.incidentData.fullDesc}
          </Card.Description>
        </Card.Content>
      </Popup.Content>
    </Popup>
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

  onClickPlaceDirections = () => {
    const searchProps = { 
      origin: this.props.placeFormData.address || "", 
      destination: this.props.placeData.vicinity || "", 
      mode: "driving", 
      altRoutes: false, 
      units: "imperial",
      avoidTolls: false, 
      avoidHighways: false, 
      avoidFerries: false, 
      avoidIndoor: false 
    }
    this.props.formCache(formNames.SEARCH_ROUTE_FORM, searchProps);
    this.setState(
      { disablePlaceButton: true }, 
      () => this.props.fetchDirections(searchProps, () => this.props.updateActiveDiscover("directions"))
    );
  }

  placeDirectionsButton = () => {
    // given a place_id from a place found from Google maps, fetches details from google related to the location.
    // will also update the active component to show the details. (A callback will be passed intro marker from PlaceResults)
    
    return (
      <Button 
        basic color='blue' 
        disabled={this.state.disablePlaceButton || !this.props.placeFormData.address || !this.props.placeData.vicinity} 
        loading={this.state.disablePlaceButton} 
        onClick={() => this.onClickPlaceDirections()}
        fluid={this.props.activeItem === "placeDetails"}
      >
        Get Directions
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
            color={this.props.iconColor || "olive"} 
            circular size="big"
            inverted
          />
        } 
        
      >
        <Popup.Content as={Card}>
          <Card.Content>
            <Card.Header>{this.props.placeData.name}</Card.Header>
            <Card.Meta>
              {this.props.placeData.user_ratings_total ? `Rating: ${this.props.placeData.rating}/5 based on ${this.props.placeData.user_ratings_total} user ratings.` : "No ratings found"}
            </Card.Meta>
            <Card.Description>
              <p>
                <Icon name="calendar outline" color="olive" />
                {this.props.placeData.opening_hours ? (this.props.placeData.opening_hours.open_now ? "Open Now" : "Closed") : "No opening hour data found" }
              </p>
              <p>
                <Icon name="map marker" color="red" />{this.props.placeData.vicinity}
              </p>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            {this.props.activeItem !== "placeDetails" ? (<div className='ui two buttons'>
              {this.placeDirectionsButton()}
              {this.placeDetailsButton(this.props.placeData.place_id)}
            </div>) : this.placeDirectionsButton()}
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

const mapStateToProps = state => {
  return {
    placeFormData: state.form[formNames.SEARCH_PLACE_FORM] || {},
    activeItem: state.discover.activeItem
  };
}

const ConnectedMarker = connect(mapStateToProps, { formCache, updateActiveDiscover, fetchPlaceDetails, fetchDirections })(Marker);

ConnectedMarker.defaultProps = {
  popup: false, // only true if enabling popup functionality
  header: null, // popup text
  type: "", // if only true if rendering Incidents onto the map. UPDATE: Must be a string of either "incident" "place" or null/""
  iconName: "home", // if not an incidentMarker, you can specify a custom iconName.
  iconColor: null, // custom icon color if not incident marker
  incidentData: null, // metadata provided from a mapquest incident object
  placeData: null, // metadata provided from a google place object
  lat: null, // required prop to render on map
  lng: null // required prop to render on map
}

export default ConnectedMarker;