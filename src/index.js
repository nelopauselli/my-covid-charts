import plotter from './plotter'
import { colors } from './util';

var color = 0;
var countries = [
    { name: 'Argentina', geoId: 'AR', color: colors(color++) },
    { name: 'Brazil', geoId: 'BR', color: colors(color++) },
    { name: 'Chile', geoId: 'CL', color: colors(color++) },
    { name: 'Ecuador', geoId: 'EC', color: colors(color++) },
    { name: 'Colombia', geoId: 'CO', color: colors(color++) },
    { name: 'Uruguay', geoId: 'UY', color: colors(color++) },
    { name: 'Perú', geoId: 'PE', color: colors(color++) },
    { name: 'Paraguay', geoId: 'PY', color: colors(color++) },
    { name: 'Estados Unidos', geoId: 'US', color: colors(color++) },
    { name: 'España', geoId: 'ES', color: colors(color++) },
    { name: 'Alemania', geoId: 'DE', color: colors(color++) },
    { name: 'Italia', geoId: 'IT', color: colors(color++) },
    { name: 'Francia', geoId: 'FR', color: colors(color++) },
    { name: 'China', geoId: 'CN', color: colors(color++) },
    { name: 'Korea del Sur', geoId: 'KR', color: colors(color++) },
];

plotter(countries);