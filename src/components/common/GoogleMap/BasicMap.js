import React, { Component } from "react";
import GoogleMap from "google-map-react";

class BasicMap extends Component {

  state = { center: this.props.center };

  static getDerivedStateFromProps(props, state) {
    if (props.center.lat !== state.center.lat && props.center.lng !== state.center.lng) {
      return { center: props.center };
    }
    return null;
  }

  render() {
    console.log("Map rerendered");
    if (!this.state.center) {
      return null;
    } 

    return (
      <div style={{height: '50vh', width: '100%'}}>
        <GoogleMap
          key={this.state.center.lat * this.state.center.lng} // forces a re-render of the component when the polyline changes
          bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_KEY }}
          yesIWantToUseGoogleMapApiInternals={true}
          defaultCenter={this.state.center}
          defaultZoom={this.props.zoom || 11}
        >
          {this.props.children}
        </GoogleMap>
      </div>
    );  
  }
}

export default BasicMap;