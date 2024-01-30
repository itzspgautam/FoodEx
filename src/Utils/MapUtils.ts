//Helps to make map region at center if two marker are used
export const calculateTwoMarkerMapRegion = (
  coordinate1: {latitude: number; longitude: number},
  coordinate2: {latitude: number; longitude: number},
  maxDistanceMeters: number,
) => {
  console.log(coordinate1, coordinate2);
  const lat1 = coordinate1.latitude;
  const lon1 = coordinate1.longitude;
  const lat2 = coordinate2.latitude;
  const lon2 = coordinate2.longitude;

  const deg2rad = (angle: number) => angle * (Math.PI / 180);
  const rad2deg = (rad: number) => rad * (180 / Math.PI);

  const R = 6371; // Earth's radius in kilometers

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c * 1000; // Distance in meters

  const latitudeDelta = maxDistanceMeters / 1000 / R; // Convert meters to kilometers
  const longitudeDelta =
    maxDistanceMeters / 1000 / (R * Math.cos(deg2rad((lat1 + lat2) / 2)));

  return {
    latitude: (lat1 + lat2) / 2,
    longitude: (lon1 + lon2) / 2,
    latitudeDelta,
    longitudeDelta,
  };
};

function calculateBezierCurvePoints(
  startPoint: {latitude: number; longitude: number},
  endPoint: {latitude: number; longitude: number},
  controlPoint: any,
  numberOfPoints: number,
) {
  const points = [];
  for (let t = 0; t <= 1; t += 1 / numberOfPoints) {
    const x =
      Math.pow(1 - t, 2) * startPoint.latitude +
      2 * (1 - t) * t * controlPoint.latitude +
      Math.pow(t, 2) * endPoint.latitude;
    const y =
      Math.pow(1 - t, 2) * startPoint.longitude +
      2 * (1 - t) * t * controlPoint.longitude +
      Math.pow(t, 2) * endPoint.longitude;
    points.push({latitude: x, longitude: y});
  }
  return points;
}

// Function to return coordinates for a curved polyline
export const getCurvedPolylineCoordinates = (
  startMarker: {latitude: number; longitude: number},
  endMarker: {latitude: number; longitude: number},
) => {
  // Define control point
  const controlPoint = {
    latitude: (startMarker.latitude + endMarker.latitude) / 2 + 0.005,
    longitude: (startMarker.longitude + endMarker.longitude) / 2,
  };

  // Calculate intermediate points on the Bezier curve
  const curvePoints = calculateBezierCurvePoints(
    startMarker,
    endMarker,
    controlPoint,
    20, // Adjust the number of points for smoother or coarser curve
  );

  // Combine start, curve, and end points
  const coordinates = [startMarker, ...curvePoints, endMarker];

  return coordinates;
};
