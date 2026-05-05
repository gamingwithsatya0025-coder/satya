import React, { useEffect } from 'react';
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
};

const createCustomIcon = (price, isSelected) => {
  return L.divIcon({
    className: 'bg-transparent border-none', // Removes default Leaflet white square
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

// Component to handle map view updates dynamically
const MapController = ({ selectedCar }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCar) {
      const coords = locationCoords[selectedCar.location.toUpperCase()] || defaultCenter;
      map.flyTo([coords.lat, coords.lng], 14, {
        duration: 1.5
      });
    }
  }, [selectedCar, map]);

  return null;
};

const Map = ({ cars = [], selectedCar, onMarkerClick }) => {
  return (
    <div className='w-full h-full relative z-0 rounded-[2rem] overflow-hidden premium-shadow border border-white/5'>
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={12}
        style={{ width: '100%', height: '100%', backgroundColor: '#0f172a' }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        {/* Using standard OpenStreetMap tiles for a colourful, vibrant map appearance */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapController selectedCar={selectedCar} />

        {cars.map((car) => {
          const coords = locationCoords[car.location.toUpperCase()] || defaultCenter;
          const isSelected = selectedCar?._id === car._id;
          
          return (
            <Marker
              key={car._id}
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
                      className='mt-3 w-full py-2.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95'
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
        })}
      </MapContainer>
      
      {/* Overriding leafet's default white styling to match our glassmorphic premium dark theme */}
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

export default React.memo(Map);
