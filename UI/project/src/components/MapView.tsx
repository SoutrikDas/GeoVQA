import { MapPin, Globe } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  name: string;
  confidence: number;
}

interface MapViewProps {
  location?: Location;
}

export default function MapView({ location }: MapViewProps) {
  if (!location) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Location will appear here after analysis</p>
        </div>
      </div>
    );
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.1},${location.latitude - 0.1},${location.longitude + 0.1},${location.latitude + 0.1}&layer=mapnik&marker=${location.latitude},${location.longitude}`;

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <h3 className="font-semibold">{location.name}</h3>
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {Math.round(location.confidence * 100)}% confidence
            </span>
          </div>
          <p className="text-sm mt-2 text-blue-100">
            Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
          </p>
        </div>

        <iframe
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          src={mapUrl}
          className="border-0"
        />
      </div>
    </div>
  );
}
