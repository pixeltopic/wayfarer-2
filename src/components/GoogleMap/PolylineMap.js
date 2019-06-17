import React, { Component } from "react";
import GoogleMap from "google-map-react";
import { connect } from "react-redux";

import Marker from "./Marker";
import { geolocationUtils } from "../../utils";

class PolylineMap extends Component {

  state = { currentPolyline: this.props.polyline };

  static getDerivedStateFromProps(props, state) {
    if (props.polyline !== state.polyline) {
      return { currentPolyline: props.polyline };
    }
    return null;
  }
  
  renderPolylines = (map, maps) => {  
    const decodedPolyline = geolocationUtils.decodePolyline(this.state.currentPolyline); // decodes polyline into an array of lat lngs
    /** Example of rendering geodesic polyline */
    let geodesicPolyline = new maps.Polyline({
      path: decodedPolyline,
      geodesic: true,
      strokeColor: '#00a1e1',
      strokeOpacity: 1.0,
      strokeWeight: 3
    })
    geodesicPolyline.setMap(map);

    /** Example of rendering non geodesic polyline (straight line) */
    let nonGeodesicPolyline = new maps.Polyline({
      path: decodedPolyline,
      geodesic: false,
      strokeColor: '#e4e4e4',
      strokeOpacity: 0.7,
      strokeWeight: 2
    })
    nonGeodesicPolyline.setMap(map);
  }
  render() {
    console.log("Map rerendered");
    if (!this.state.currentPolyline && !this.props.center) {
      return null;
    } 
    const decodedPolyline = geolocationUtils.decodePolyline(this.state.currentPolyline);
    return (
      <div style={{height: '50vh', width: '100%'}}>
        <GoogleMap
          key={this.state.currentPolyline} // forces a re-render of the component when the polyline changes
          bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_KEY }}
          yesIWantToUseGoogleMapApiInternals={true}
          defaultCenter={geolocationUtils.calcCenterWithBounds(this.props.center)}
          defaultZoom={this.props.zoom || 11}
          onGoogleApiLoaded={({map, maps}) => this.renderPolylines(map, maps)}
        >
          <Marker 
            iconColor="teal" 
            iconName="home"
            popup
            header={this.props.origin}
            lat={decodedPolyline[0].lat} 
            lng={decodedPolyline[0].lng}
          />
          <Marker 
            iconColor="teal" 
            iconName="flag checkered" 
            popup
            header={this.props.destination}
            lat={decodedPolyline[decodedPolyline.length-1].lat} 
            lng={decodedPolyline[decodedPolyline.length-1].lng}
          />
          {this.props.children}
        </GoogleMap>
      </div>
    );  
  }
}

// RenderGoogleMap.defaultProps = {
//   polyline: "wuomEfcunU`FmApD}@nCo@nI_BROHGpAWxJaCbT{EjRoETB`FgAlFoA~Bo@xAYJSlA]j@OzA_@vHkBxCu@lGgBbDu@bBYpCWfE]tCWnAKTPxAGh@CbAAtD@jADrD\\~AFrAFnBPb@JPm@He@n@qBJWXk@nCgDn@u@b@k@jC}DDQAMt@}@`EgEtMeN~T{UxGqHzLeNdDwD\\_@`@_@xJeL~BmCpAqAfB_BdCqB|BaBhFeErCmC|@}@`DkD|B}Bx@eAbJuMtKkM|@iAfAmArBsBhB}AzAmAxH_G|HeGnPiMdEyChBiA~F}Cr@YfAo@XMj@UVKn@YjJ{E~LsGzBiAzCoBfEyDNS^e@d@m@pBcD|BuEtBkFlGkQvFsPbCcHPa@pAcDrGqPdAwBxAiCrBuC~BkCbDsCvAiAdAo@tAu@xBcAxBs@pIwBpAa@dAe@`CwAvAmAhBmB`AwAhAwBbAoCr@mClBgH|BmJp@mCP{@DQPo@v@}CpDcNhB}HdDmO~DkQ\\eBjE_Rj@{BbAwCrAgDh@iAjBeDzIoMpUu_@xCgFbNgUzD}GlIiNjEaHTELCVWdDgEb@[d@Uj@MbCYt@Od@Wb@_@`@q@b@u@vBtB|AzAXL`A`AVHfAt@pCfBnIjFdDhBfEhBf@PLBTErGtCfUbKvAx@zAdA|CjCz@|@jAhB`DxFzA`CjB|BrB`Bf@d@`A`AbAjAxBvChFdH`A|Ad@~@`@bAZdANl@\\jBPpBF~A?hAOrOGbHB~CPvBLbA\\bB^rA~@xBt@nAb@n@v@~@|AzAhAhAdGhGnOlOnKjKzApAfDbCtApArCuE`C{DjEeHn@aAnCeEhB_DFI",
//   center: {
//     northeast: { lat: 33.8365977, lng: -117.7962931 },
//     southwest: { lat: 33.68453230000001, lng: -117.9142825 }
//   },
//   zoom: 13
// };
const mapStateToProps = state => {
  return { origin: state.maps.origin, destination: state.maps.destination };
}

export default connect(mapStateToProps)(PolylineMap);