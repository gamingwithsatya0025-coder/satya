import React, { useEffect, useState, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultCenter = { lat: 17.6868, lng: 83.2185 };

const locationCoords = {
  'MADDILAPALEM': { lat: 17.7314, lng: 83.3150 },
  'NAD': { lat: 17.7475, lng: 83.2422 },
  'PENDURTHI': { lat: 17.8188, lng: 83.2057 },
  'GAJUWAKA': { lat: 17.6896, lng: 83.2093 },
  'VISAKHAPATNAM': { lat: 17.6868, lng: 83.2185 },
  'MVP COLONY': { lat: 17.7447, lng: 83.3330 },
  'SEETHAMMADHARA': { lat: 17.7400, lng: 83.3100 },
  'DWARAKA NAGAR': { lat: 17.7200, lng: 83.3000 },
  'GANDHIGRAM': { lat: 17.6800, lng: 83.2500 },
  'GOPALAPURAM': { lat: 17.7600, lng: 83.2300 },
  'ASILMETTA': { lat: 17.7200, lng: 83.3000 },
  'DABA GARDENS': { lat: 17.7100, lng: 83.2900 },
  'BHEEMILI': { lat: 17.8900, lng: 83.4500 },
  'BHEEMUNIPATNAM': { lat: 17.8900, lng: 83.4500 },
  'OLD POST OFFICE': { lat: 17.6980, lng: 83.2980 },
  'RUSHIKONDA': { lat: 17.7818, lng: 83.3768 },
  'SAGAR NAGAR': { lat: 17.7620, lng: 83.3510 },
  'BEACH ROAD': { lat: 17.7140, lng: 83.3230 },
  'SIRIPURAM': { lat: 17.7210, lng: 83.3150 },
  'ARILOVA': { lat: 17.7680, lng: 83.3280 },
  'PM PALEM': { lat: 17.7880, lng: 83.3580 },
  'VISALAKSHI NAGAR': { lat: 17.7550, lng: 83.3450 },
};

// Use a unique name for the cache to avoid name collision with the Map component
const geocodingCacheStore = new window.Map();

const getCoordinates = async (location) => {
  const upperLoc = location.toUpperCase();
  if (locationCoords[upperLoc]) return locationCoords[upperLoc];
  if (geocodingCacheStore.has(upperLoc)) return geocodingCacheStore.get(upperLoc);

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ', Visakhapatnam')}`);
    const data = await response.json();
    if (data && data.length > 0) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      geocodingCacheStore.set(upperLoc, coords);
      return coords;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return defaultCenter;
};

const createCustomIcon = (price, isSelected) => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="relative flex items-center justify-center transition-transform duration-300 ${isSelected ? 'scale-125 z-50' : 'scale-100 hover:scale-110'}">
        <div class="absolute inset-0 bg-[#f59e0b] rounded-full blur-md opacity-40 ${isSelected ? 'animate-pulse' : ''}"></div>
        <div class="relative z-10 px-3 py-1.5 rounded-xl border ${isSelected ? 'border-[#f59e0b] bg-[#020617]' : 'border-white/10 bg-[#0f172a]/90'} flex flex-col items-center justify-center backdrop-blur-md" style="box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);">
          <span class="text-white text-xs font-black tracking-wider">₹${price}</span>
        </div>
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-[8px] border-transparent ${isSelected ? 'border-t-[#f59e0b]' : 'border-t-white/10'}"></div>
      </div>
    `,
    iconSize: [60, 40],
    iconAnchor: [30, 40],
    popupAnchor: [0, -42]
  });
};

const MapController = ({ selectedCar }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCar) {
      getCoordinates(selectedCar.location).then(coords => {
          map.flyTo([coords.lat, coords.lng], 14, {
            duration: 1.5
          });
      });
    }
  }, [selectedCar, map]);

  return null;
};

const SmartMarker = ({ car, selectedCar, onMarkerClick }) => {
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getCoordinates(car.location).then(c => {
            if (isMounted) setCoords(c);
        });
        return () => { isMounted = false; };
    }, [car.location]);

    if (!coords) return null;

    const isSelected = selectedCar?._id === car._id;

    return (
        <Marker
            position={[coords.lat, coords.lng]}
            icon={createCustomIcon(car.pricePerDay, isSelected)}
            eventHandlers={{
                click: () => {
                    if (onMarkerClick) onMarkerClick(car);
                },
            }}
        >
            <Popup className="glass-popup" autoPanPadding={[20, 20]}>
                <div className='flex flex-col gap-3 min-w-[200px] text-white'>
                    <img src={car.images && car.images.length > 0 ? car.images[0] : car.image} alt={car.model} className='w-full h-28 object-cover rounded-xl shadow-lg' />
                    <div>
                        <h3 className='font-black text-sm uppercase tracking-tighter text-white m-0'>{car.brand} {car.model}</h3>
                        <p className='text-[10px] font-bold text-white/50 uppercase tracking-widest m-0 mt-1'>{car.location}</p>
                        <p className='text-primary font-black text-sm mt-2 m-0'>₹{car.pricePerDay}/day</p>
                        <button
                            className='mt-3 w-full py-2.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 cursor-pointer'
                            onClick={(e) => {
                                e.stopPropagation();
                                if (car._id) {
                                    window.location.href = `/car-details/${car._id}`;
                                }
                            }}
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};

const MapComponent = ({ cars = [], selectedCar, onMarkerClick }) => {
  return (
    <div className='w-full h-full relative z-0 rounded-[2rem] overflow-hidden premium-shadow border border-white/5'>
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={12}
        style={{ width: '100%', height: '100%', backgroundColor: '#0f172a' }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapController selectedCar={selectedCar} />

        {cars.map((car) => (
            <SmartMarker 
                key={car._id} 
                car={car} 
                selectedCar={selectedCar} 
                onMarkerClick={onMarkerClick} 
            />
        ))}
      </MapContainer>
      
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(9, 9, 11, 0.85) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1.25rem !important;
          padding: 8px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        .leaflet-popup-tip {
          background: rgba(9, 9, 11, 0.85) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(20px) !important;
        }
        .leaflet-popup-content {
          margin: 8px !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: rgba(255,255,255,0.5) !important;
          top: 14px !important;
          right: 14px !important;
          font-weight: black !important;
          transition: color 0.3s ease;
        }
        .leaflet-container a.leaflet-popup-close-button:hover {
          color: white !important;
        }
        .leaflet-control-container .leaflet-routing-container-hide {
            display: none;
        }
      `}</style>
    </div>
  );
};

export default memo(MapComponent);
