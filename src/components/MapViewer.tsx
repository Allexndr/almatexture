import { useEffect, useRef, useState } from 'react';

interface MapViewerProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    coordinates: [number, number];
    title: string;
    description?: string;
  }>;
  onMarkerClick?: (id: string) => void;
  className?: string;
  enableSearch?: boolean;
  enableClustering?: boolean;
  enableRouting?: boolean;
  routePoints?: Array<{
    id: string;
    coordinates: [number, number];
  }>;
}

export default function MapViewer({
  center,
  zoom = 12,
  markers = [],
  onMarkerClick,
  className,
  enableSearch = true,
  enableClustering = true,
  enableRouting = false,
  routePoints = [],
}: MapViewerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<ymaps.Map | null>(null);
  const [markerCollection, setMarkerCollection] = useState<ymaps.GeoObjectCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [route, setRoute] = useState<ymaps.Route | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        if (!window.ymaps) {
          throw new Error('Yandex Maps API не загружен');
        }

        await window.ymaps.ready();

        const element = mapRef.current;
        if (!element) {
          throw new Error('Элемент карты не найден');
        }

        const newMap = new window.ymaps.Map(element, {
          center,
          zoom,
          controls: [
            'zoomControl',
            'fullscreenControl',
            'geolocationControl',
            ...(enableSearch ? ['searchControl'] : []),
          ],
        });

        const newMarkerCollection = new window.ymaps.GeoObjectCollection();
        newMap.geoObjects.add(newMarkerCollection);

        if (enableClustering) {
          const clusterer = new window.ymaps.Clusterer({
            preset: 'islands#violetClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
          });

          newMap.geoObjects.add(clusterer);
        }

        setMarkerCollection(newMarkerCollection);
        setMap(newMap);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки Яндекс Карт:', error);
        setError(error instanceof Error ? error.message : 'Произошла ошибка при загрузке карты');
        setIsLoading(false);
      }
    };

    loadMap();

    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, [center, zoom, enableSearch, enableClustering]);

  useEffect(() => {
    if (!map || !markerCollection) return;

    markerCollection.removeAll();

    markers.forEach((marker) => {
      const placemark = new window.ymaps.Placemark(
        marker.coordinates,
        {
          balloonContent: `
            <div class="p-2">
              <h3 class="font-display font-bold text-lg">${marker.title}</h3>
              ${marker.description ? `<p class="mt-1">${marker.description}</p>` : ''}
            </div>
          `,
        },
        {
          preset: 'islands#violetDotIcon',
          iconColor: '#7351f5',
        }
      );

      placemark.events.add('click', () => {
        if (onMarkerClick) {
          onMarkerClick(marker.id);
        }
      });

      markerCollection.add(placemark);
    });
  }, [markers, map, markerCollection, onMarkerClick]);

  useEffect(() => {
    if (!map || !enableRouting || routePoints.length < 2) return;

    const buildRoute = async () => {
      try {
        const router = new window.ymaps.Router();
        const points = routePoints.map(point => point.coordinates);
        
        const newRoute = await router.route(points);
        setRoute(newRoute);

        if (route) {
          map.geoObjects.remove(route);
        }

        map.geoObjects.add(newRoute);
      } catch (error) {
        console.error('Ошибка построения маршрута:', error);
      }
    };

    buildRoute();

    return () => {
      if (route) {
        map.geoObjects.remove(route);
      }
    };
  }, [map, enableRouting, routePoints]);

  const handleSearch = async () => {
    if (!map || !searchQuery) return;

    try {
      const geocoder = await window.ymaps.geocode(searchQuery);
      const firstGeoObject = geocoder.geoObjects.get(0);
      
      if (firstGeoObject) {
        const coordinates = firstGeoObject.geometry.getCoordinates();
        map.setCenter(coordinates, 15);
      }
    } catch (error) {
      console.error('Ошибка поиска:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className || ''}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className || ''}`}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      {enableSearch && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск места..."
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            Найти
          </button>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full"
      />
    </div>
  );
} 