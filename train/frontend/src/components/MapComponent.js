import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './MapComponent.css';
import io from 'socket.io-client';
import L from 'leaflet';

function MapComponent() {
    const [markers, setMarkers] = useState({});
    const position = [62.173276, 14.942265];
    const mapRef = useRef(null);

    useEffect(() => {
        const socket = io(`http://localhost:6060`);

        socket.on("message", (data) => {
            setMarkers((prevMarkers) => ({
                ...prevMarkers,
                [data.trainnumber]: {
                    position: data.position,
                    trainnumber: data.trainnumber,
                },
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapRef.current.removeLayer(layer);
                }
            });

            for (const trains in markers) {
                if (markers.hasOwnProperty(trains)) {
                    const markerData = markers[trains];
                    const marker = L.marker(markerData.position).bindPopup(markerData.trainnumber);
                    mapRef.current.addLayer(marker);
                }
            }
        }
    }, [markers]);

    return (
        <div id="map">
            <MapContainer center={position} zoom={5} ref={mapRef}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}

export default MapComponent;
