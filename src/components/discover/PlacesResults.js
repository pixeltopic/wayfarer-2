import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Card } from "semantic-ui-react";

import BasicMap from "../common/GoogleMap/BasicMap";
import Marker from "../common/GoogleMap/Marker";

class PlacesResults extends Component {

  renderPlacesAsCards = () => {
    const style = { width: "45%" };

    const cards = this.props.places.map((place, key) => {
      return (
        <Card key={key} style={style}>
          <Card.Content>
            <Card.Header>{place.name}</Card.Header>
            <Card.Meta>Rating: {place.rating}</Card.Meta>
            <Card.Description>{place.vicinity}</Card.Description>
          </Card.Content>
        </Card>
      );
    });

    return cards;
  }

  placesAsMarkers = () => {
    const markers = this.props.places.map((place, key) => {
      const { lat, lng } = place.geometry.location;
      return <Marker key={key} popup type="place" iconName="map marker alternate" lat={lat} lng={lng} placeData={place} />
    });
    markers.push(<Marker key={-1} iconName="home" iconColor="teal" lat={this.props.center.lat} lng={this.props.center.lng}/>);
    return markers;
  }


  render() {
    return (
      <Segment>
        <BasicMap center={this.props.center}>
          
          { this.props.center && this.placesAsMarkers()}
          
        </BasicMap>
        <Card.Group>
          {this.renderPlacesAsCards()}
        </Card.Group>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => {
  return { places: state.places.results, center: state.places.center };
}

export default connect(mapStateToProps)(PlacesResults);