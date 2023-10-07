import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import PropTypes from 'prop-types';
import './MapComponent.css';
import L from 'leaflet';

function MapComponent(props) {
    const mapRef = useRef(null);
    const markers = props.data;

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapRef.current.removeLayer(layer);
                }
            });

            for (const trains in markers) {
                if (Object.prototype.hasOwnProperty.call(markers, trains)) {
                    const markerData = markers[trains];
                    const marker = L.marker(markerData.position, {
                        value: markerData.trainnumber
                    })
                        .bindPopup(markerData.trainnumber)
                        .on('click', (e) => {
                            props.handleFilter(e.target.options.value);
                        })
                        .on('mouseover', function () {
                            this.openPopup();
                        })
                        .on('mouseout', function () {
                            this.closePopup();
                        });
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

MapComponent.propTypes = {
    data: PropTypes.object.isRequired,
    handleFilter: PropTypes.func
};

export default MapComponent;
