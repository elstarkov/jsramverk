import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './MapComponent.css';
import io from 'socket.io-client';
import L from 'leaflet';
import { apiUrl } from '../api';

function MapComponent() {
    const [markers, setMarkers] = useState({});
    const mapRef = useRef(null);

    useEffect(() => {
        const socket = io(`${apiUrl}`);

        socket.on('message', (data) => {
            setMarkers((prevMarkers) => ({
                ...prevMarkers,
                [data.trainnumber]: {
                    position: data.position,
                    trainnumber: data.trainnumber
                }
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
                if (trains in markers) {
                    const markerData = markers[trains];
                    const marker = L.marker(markerData.position).bindPopup(markerData.trainnumber);
                    mapRef.current.addLayer(marker);
                }
            }
        }
    }, [markers]);

    return (
        <div data-testid="MapCon" id="map">
            <MapContainer center={[62.173276, 14.942265]} zoom={5} ref={mapRef}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}

export default MapComponent;
