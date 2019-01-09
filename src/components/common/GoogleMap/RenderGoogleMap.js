import React from "react";
import GoogleMap from "google-map-react";

import Marker from "./Marker";
import { geolocationUtils } from "../../../utils";

const RenderGoogleMap = (props) => {
  let decodedPolyline = geolocationUtils.decodePolyline(props.markers); // decodes polyline into an array of lat lngs
  const renderPolylines = (map, maps) => {  
    /** Example of rendering geodesic polyline */
    let geodesicPolyline = new maps.Polyline({
      path: decodedPolyline,
      geodesic: true,
      strokeColor: '#00a1e1',
      strokeOpacity: 1.0,
      strokeWeight: 3
    })
    geodesicPolyline.setMap(map)

    /** Example of rendering non geodesic polyline (straight line) */
    let nonGeodesicPolyline = new maps.Polyline({
      path: decodedPolyline,
      geodesic: false,
      strokeColor: '#e4e4e4',
      strokeOpacity: 0.7,
      strokeWeight: 2
    })
    nonGeodesicPolyline.setMap(map)
  }

  return (
    <div style={{height: '50vh', width: '100%'}}>
      <GoogleMap
        bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_KEY }}
        yesIWantToUseGoogleMapApiInternals={true}
        defaultCenter={geolocationUtils.calcCenterWithBounds(props.center)}
        // center={props.center || null}
        defaultZoom={props.zoom || 11}
        onGoogleApiLoaded={({map, maps}) => renderPolylines(map, maps)}
      >
        {/* <Marker text={'DUB'} lat={53.42728} lng={-6.24357} />
        <Marker text={'YYZ'} lat={43.681583} lng={-79.61146} /> */}
        <Marker lat={33.68453230000001} lng={-117.8265414} header={"Irvine"} />
      </GoogleMap>
    </div>
  );  
}

// RenderGoogleMap.defaultProps = {
//   markers: "wuomEfcunU`FmApD}@nCo@nI_BROHGpAWxJaCbT{EjRoETB`FgAlFoA~Bo@xAYJSlA]j@OzA_@vHkBxCu@lGgBbDu@bBYpCWfE]tCWnAKTPxAGh@CbAAtD@jADrD\\~AFrAFnBPb@JPm@He@n@qBJWXk@nCgDn@u@b@k@jC}DDQAMt@}@`EgEtMeN~T{UxGqHzLeNdDwD\\_@`@_@xJeL~BmCpAqAfB_BdCqB|BaBhFeErCmC|@}@`DkD|B}Bx@eAbJuMtKkM|@iAfAmArBsBhB}AzAmAxH_G|HeGnPiMdEyChBiA~F}Cr@YfAo@XMj@UVKn@YjJ{E~LsGzBiAzCoBfEyDNS^e@d@m@pBcD|BuEtBkFlGkQvFsPbCcHPa@pAcDrGqPdAwBxAiCrBuC~BkCbDsCvAiAdAo@tAu@xBcAxBs@pIwBpAa@dAe@`CwAvAmAhBmB`AwAhAwBbAoCr@mClBgH|BmJp@mCP{@DQPo@v@}CpDcNhB}HdDmO~DkQ\\eBjE_Rj@{BbAwCrAgDh@iAjBeDzIoMpUu_@xCgFbNgUzD}GlIiNjEaHTELCVWdDgEb@[d@Uj@MbCYt@Od@Wb@_@`@q@b@u@vBtB|AzAXL`A`AVHfAt@pCfBnIjFdDhBfEhBf@PLBTErGtCfUbKvAx@zAdA|CjCz@|@jAhB`DxFzA`CjB|BrB`Bf@d@`A`AbAjAxBvChFdH`A|Ad@~@`@bAZdANl@\\jBPpBF~A?hAOrOGbHB~CPvBLbA\\bB^rA~@xBt@nAb@n@v@~@|AzAhAhAdGhGnOlOnKjKzApAfDbCtApArCuE`C{DjEeHn@aAnCeEhB_DFI",
//   defaultCenter: {
//     northeast: { lat: 33.8365977, lng: -117.7962931 },
//     southwest: { lat: 33.68453230000001, lng: -117.9142825 }
//   },
//   center: {
//     northeast: { lat: 33.8365977, lng: -117.7962931 },
//     southwest: { lat: 33.68453230000001, lng: -117.9142825 }
//   },
//   zoom: 13
// };

export default RenderGoogleMap;