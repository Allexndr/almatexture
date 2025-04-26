declare namespace ymaps {
  interface Map {
    geoObjects: GeoObjectCollection;
    setCenter(coordinates: number[], zoom?: number): void;
    setZoom(zoom: number): void;
    destroy(): void;
  }

  interface GeoObjectCollection {
    add(geoObject: GeoObject | GeoObjectCollection): void;
    remove(geoObject: GeoObject | GeoObjectCollection): void;
    removeAll(): void;
    get(index: number): GeoObject;
    getLength(): number;
  }

  interface GeoObject {
    geometry: {
      getCoordinates(): number[];
    };
    properties: {
      get(key: string): any;
    };
    events: {
      add(event: string, callback: () => void): void;
    };
  }

  interface Placemark extends GeoObject {
    geometry: {
      getCoordinates(): number[];
    };
    properties: {
      get(key: string): any;
    };
    events: {
      add(event: string, callback: () => void): void;
    };
  }

  interface Clusterer extends GeoObject {
    add(geoObject: GeoObject): void;
    remove(geoObject: GeoObject): void;
    removeAll(): void;
  }

  interface Route extends GeoObject {
    properties: {
      get(key: string): any;
    };
    getLength(): number;
    getJamsTime(): number;
    getPaths(): Path[];
  }

  interface Path {
    getSegments(): Segment[];
  }

  interface Segment {
    getCoordinates(): number[][];
  }

  interface MapConstructor {
    new (element: string | HTMLElement, state: MapState): Map;
  }

  interface MapState {
    center: number[];
    zoom: number;
    controls?: string[];
  }

  interface PlacemarkConstructor {
    new (coordinates: number[], properties?: PlacemarkProperties, options?: PlacemarkOptions): Placemark;
  }

  interface ClustererConstructor {
    new (options?: ClustererOptions): Clusterer;
  }

  interface ClustererOptions {
    preset?: string;
    groupByCoordinates?: boolean;
    clusterDisableClickZoom?: boolean;
    clusterHideIconOnBalloonOpen?: boolean;
    geoObjectHideIconOnBalloonOpen?: boolean;
  }

  interface PlacemarkProperties {
    iconContent?: string;
    hintContent?: string;
    balloonContent?: string;
  }

  interface PlacemarkOptions {
    preset?: string;
    iconLayout?: string;
    iconImageHref?: string;
    iconImageSize?: number[];
    iconImageOffset?: number[];
    iconColor?: string;
  }

  interface GeocoderResult {
    geoObjects: GeoObjectCollection;
  }

  interface Router {
    route(points: number[][]): Promise<Route>;
  }

  const Map: MapConstructor;
  const Placemark: PlacemarkConstructor;
  const GeoObjectCollection: {
    new (): GeoObjectCollection;
  };
  const Clusterer: ClustererConstructor;
  const Router: {
    new (): Router;
  };

  function ready(): Promise<void>;
  function geocode(query: string): Promise<GeocoderResult>;
}

declare global {
  interface Window {
    ymaps: typeof ymaps;
  }
} 