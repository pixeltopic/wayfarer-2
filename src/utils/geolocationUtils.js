import { getCenter, useDecimal } from "geolib";

const decodePolyline = (encoded) => {
  // credits: https://gist.github.com/ismaels/6636986
  // array that holds all lat lng pairs decoded from the polyline.
  let points=[];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;
  while (index < len) {
      let b, shift = 0, result = 0;
      do {
          b = encoded.charAt(index++).charCodeAt(0) - 63;//finds ascii and substract it by 63
          result |= (b & 0x1f) << shift;
          shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
          b = encoded.charAt(index++).charCodeAt(0) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      points.push({lat:( lat / 1E5),lng:( lng / 1E5)})  
  }
  return points
}

const calcCenterWithBounds = (bounds) => {
  // given a route's bounds from the `maps` redux state, return center of bounding box.
  const center = getCenter(
      {
          northeast: { latitude: bounds.northeast.lat, longitude: bounds.northeast.lng }, 
          southwest: { latitude: bounds.southwest.lat, longitude: bounds.southwest.lng }
      });
  return {lat: useDecimal(center.latitude), lng: useDecimal(center.longitude)};
}

export default { calcCenterWithBounds, decodePolyline };