// "use client"

// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

// interface MapProps {
//   yourLocation: { latitude: number; longitude: number } | null
//   partnerLocation: { latitude: number; longitude: number } | null
// }

// const containerStyle = {
//   width: "100%",
//   height: "400px",
// }

// // Center the map between both points if available
// function getMapCenter(yourLocation: MapProps["yourLocation"], partnerLocation: MapProps["partnerLocation"]) {
//   if (yourLocation && partnerLocation) {
//     return {
//       lat: (yourLocation.latitude + partnerLocation.latitude) / 2,
//       lng: (yourLocation.longitude + partnerLocation.longitude) / 2,
//     }
//   }
//   return yourLocation
//     ? { lat: yourLocation.latitude, lng: yourLocation.longitude }
//     : { lat: 43.6532, lng: -79.3832 } // default (Toronto)
// }

// export default function Map({ yourLocation, partnerLocation }: MapProps) {
//   const center = getMapCenter(yourLocation, partnerLocation)

//   return (
//     <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={14}
//       >
//         {/* Your location: use default marker */}
//         {yourLocation && (
//           <Marker
//             position={{
//               lat: yourLocation.latitude,
//               lng: yourLocation.longitude,
//             }}
//             // label="You"
//           />
//         )}

//         {/* Partner location: use heart-shaped icon */}
//         {partnerLocation && (
//           <Marker
//             position={{
//               lat: partnerLocation.latitude,
//               lng: partnerLocation.longitude,
//             }}
//             // label="❤️"
//             icon={{
//               url: "https://cdn-icons-png.flaticon.com/512/833/833472.png", // heart icon
//               scaledSize: new window.google.maps.Size(32, 32),
//             }}
//           />
//         )}
//       </GoogleMap>
//     </LoadScript>
//   )
// }

"use client"

import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api"

interface MapProps {
  yourLocation: { latitude: number; longitude: number } | null
  partnerLocation: { latitude: number; longitude: number } | null
}

const containerStyle = {
  width: "100%",
  height: "400px",
}

function getMapCenter(yourLocation: MapProps["yourLocation"], partnerLocation: MapProps["partnerLocation"]) {
  if (yourLocation && partnerLocation) {
    return {
      lat: (yourLocation.latitude + partnerLocation.latitude) / 2,
      lng: (yourLocation.longitude + partnerLocation.longitude) / 2,
    }
  }
  return yourLocation
    ? { lat: yourLocation.latitude, lng: yourLocation.longitude }
    : { lat: 43.6532, lng: -79.3832 } // default (Toronto)
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Earth's radius in km
  const toRad = (x: number) => (x * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function Map({ yourLocation, partnerLocation }: MapProps) {
  const center = getMapCenter(yourLocation, partnerLocation)

  const path =
    yourLocation && partnerLocation
      ? [
          { lat: yourLocation.latitude, lng: yourLocation.longitude },
          { lat: partnerLocation.latitude, lng: partnerLocation.longitude },
        ]
      : []

  const distance =
    yourLocation && partnerLocation
      ? haversineDistance(
          yourLocation.latitude,
          yourLocation.longitude,
          partnerLocation.latitude,
          partnerLocation.longitude
        ).toFixed(2)
      : null

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        {/* Your location marker */}
        {yourLocation && (
          <Marker
            position={{
              lat: yourLocation.latitude,
              lng: yourLocation.longitude,
            }}
            // label="You"
          />
        )}

        {/* Partner location marker */}
        {partnerLocation && (
          <Marker
            position={{
              lat: partnerLocation.latitude,
              lng: partnerLocation.longitude,
            }}
            // label="❤️"
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/833/833472.png",
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        )}

        {/* Line between you and partner */}
        {path.length === 2 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#FF69B4",
              strokeOpacity: 0.9,
              strokeWeight: 3,
            }}
          />
        )}

        {/* Distance display */}
        {distance && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Distance: {distance} km
          </div>
        )}
      </GoogleMap>
    </LoadScript>
  )
}