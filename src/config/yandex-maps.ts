export const YANDEX_MAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '';

export const defaultMapState = {
  center: [43.238949, 76.889709], // Координаты центра Алматы
  zoom: 12,
  controls: ['zoomControl', 'fullscreenControl']
};

export const mapOptions = {
  suppressMapOpenBlock: true,
  yandexMapDisablePoiInteractivity: true
}; 