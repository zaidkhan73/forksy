import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet-routing-machine";

function Routing({ from, to }) {
  const map = useMap();

 React.useEffect(() => {
  if (!map) return;

  const routingControl = L.Routing.control({
    waypoints: [
      L.latLng(from[0], from[1]),
      L.latLng(to[0], to[1])
    ],
    routeWhileDragging: false,
    lineOptions: {
      styles: [{ color: "blue", weight: 4 }]
    },
    createMarker: () => null,  
    show: false,               
    addWaypoints: false,       
  }).addTo(map);

  // Cleanup on unmount
  return () => map.removeControl(routingControl);

}, [map, from, to]);


  
}

const deliveryBoyIcon = L.icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [-3, -76],
});
const customerIcon = L.icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [-3, -76],
});

function DeliveryBoyTracking({ data }) {
  const deliveryBotLat = data.deliveryBoyLocation.lat;
  const deliveryBotLon = data.deliveryBoyLocation.lon;
  const customerLat = data.customerLocation.lat;
  const customerLon = data.customerLocation.lon;

  const path = [
    [deliveryBotLat, deliveryBotLon],
    [customerLat, customerLon],
  ];

  const center = [deliveryBotLat, deliveryBotLon];

  return (
    <div className="w-full bg-gradient-to-r from-white to-neutral-50 border border-neutral-200  h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer
        zoom={15}
        className="w-full h-full"
        center={center}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={path[0]} icon={deliveryBoyIcon}>
          <Popup>Delivery Boy</Popup>

        </Marker>
        <Marker position={path[1]} icon={customerIcon}>
          <Popup>Customer</Popup>
        </Marker>
       
        <Routing from={path[0]} to={path[1]} />
          {/* <Popup>Delivery Location: {mapAddress}</Popup> */}
      </MapContainer>
    </div>
  );
}

export default DeliveryBoyTracking;
