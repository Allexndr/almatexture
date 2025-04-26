import { YMaps, Map as YMap, Placemark } from '@pbe/react-yandex-maps';

interface MapProps {
  center: [number, number];
  zoom: number;
  markers: Array<{
    coordinates: [number, number];
    title: string;
    description: string;
  }>;
}

export default function Map({ center, zoom, markers }: MapProps) {
  return (
    <YMaps
      query={{
        apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
        lang: 'ru_RU',
      }}
    >
      <YMap
        defaultState={{
          center,
          zoom,
          controls: ['zoomControl', 'fullscreenControl'],
        }}
        width="100%"
        height="400px"
      >
        {markers.map((marker, index) => (
          <Placemark
            key={index}
            geometry={marker.coordinates}
            properties={{
              balloonContentHeader: marker.title,
              balloonContentBody: marker.description,
            }}
            options={{
              preset: 'islands#blueIcon',
            }}
          />
        ))}
      </YMap>
    </YMaps>
  );
} 