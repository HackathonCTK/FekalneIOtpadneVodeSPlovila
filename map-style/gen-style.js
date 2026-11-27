// Generira map-style/style.json (pokreće se samo pri razvoju: node map-style/gen-style.js)
const NAME = ['coalesce', ['get', 'name:hr'], ['get', 'name:latin'], ['get', 'name']];
const F_REG = ['Noto Sans Regular'], F_BOLD = ['Noto Sans Bold'], F_IT = ['Noto Sans Italic'];
const cls = (...c) => ['match', ['get', 'class'], c, true, false];
const roadW = (base, z14, z18) => ['interpolate', ['exponential', 1.5], ['zoom'], 5, base * 0.3, 10, base, 14, z14, 18, z18];
const layers = [
  {id:'background', type:'background', paint:{'background-color':'#F2F1EC'}},
  {id:'landcover-wood', type:'fill', source:'omt', 'source-layer':'landcover', filter:cls('wood','forest'), paint:{'fill-color':'#D3E3C3','fill-opacity':['interpolate',['linear'],['zoom'],5,0.5,12,0.9]}},
  {id:'landcover-grass', type:'fill', source:'omt', 'source-layer':'landcover', filter:cls('grass','scrub','farmland'), paint:{'fill-color':'#E3ECD5','fill-opacity':0.8}},
  {id:'landcover-rock-sand', type:'fill', source:'omt', 'source-layer':'landcover', filter:cls('rock','sand','beach'), paint:{'fill-color':'#EDE6D6','fill-opacity':0.9}},
  {id:'landcover-wetland', type:'fill', source:'omt', 'source-layer':'landcover', filter:cls('wetland'), paint:{'fill-color':'#DCEAE4'}},
  {id:'landuse-residential', type:'fill', source:'omt', 'source-layer':'landuse', filter:cls('residential','suburb','neighbourhood'), paint:{'fill-color':'#E9E5DE','fill-opacity':['interpolate',['linear'],['zoom'],8,0.4,13,1]}},
  {id:'landuse-other', type:'fill', source:'omt', 'source-layer':'landuse', filter:cls('commercial','industrial','retail','railway','quarry','military'), paint:{'fill-color':'#E6E1E6','fill-opacity':0.7}},
  {id:'landuse-green', type:'fill', source:'omt', 'source-layer':'landuse', filter:cls('cemetery','pitch','stadium','playground','park','garden'), paint:{'fill-color':'#DCE9CF'}},
  {id:'park', type:'fill', source:'omt', 'source-layer':'park', paint:{'fill-color':'#D4E6C4','fill-opacity':0.45}},
  {id:'park-outline', type:'line', source:'omt', 'source-layer':'park', minzoom:8, paint:{'line-color':'#9CBF86','line-width':1,'line-dasharray':[3,2],'line-opacity':0.7}},
  {id:'water', type:'fill', source:'omt', 'source-layer':'water', filter:['!=', ['get','brunnel'], 'tunnel'], paint:{'fill-color':'#AAD3E6'}},
  {id:'waterway', type:'line', source:'omt', 'source-layer':'waterway', filter:['!=', ['get','brunnel'], 'tunnel'], paint:{'line-color':'#AAD3E6','line-width':['interpolate',['linear'],['zoom'],8,0.5,14,2,18,6]}},
  {id:'aeroway', type:'line', source:'omt', 'source-layer':'aeroway', minzoom:10, filter:['==',['geometry-type'],'LineString'], paint:{'line-color':'#D4D0CA','line-width':['interpolate',['linear'],['zoom'],10,1,15,12]}},
  {id:'building', type:'fill', source:'omt', 'source-layer':'building', minzoom:13, paint:{'fill-color':'#DED8CF','fill-outline-color':'#CFC7BB','fill-opacity':['interpolate',['linear'],['zoom'],13,0.4,15,1]}},
  {id:'ferry', type:'line', source:'omt', 'source-layer':'transportation', filter:cls('ferry'), paint:{'line-color':'#5B8FB0','line-width':['interpolate',['linear'],['zoom'],6,0.6,12,1.4],'line-dasharray':[4,3],'line-opacity':0.8}},
  {id:'path', type:'line', source:'omt', 'source-layer':'transportation', minzoom:13, filter:cls('path','track'), paint:{'line-color':'#B9A98F','line-width':['interpolate',['linear'],['zoom'],13,0.6,18,2],'line-dasharray':[2,1.5]}},
  {id:'rail', type:'line', source:'omt', 'source-layer':'transportation', minzoom:8, filter:cls('rail','transit'), paint:{'line-color':'#A9A5A0','line-width':['interpolate',['linear'],['zoom'],8,0.6,16,2]}},
  {id:'road-minor-casing', type:'line', source:'omt', 'source-layer':'transportation', minzoom:12, filter:cls('minor','service'), layout:{'line-cap':'round','line-join':'round'}, paint:{'line-color':'#D6D0C5','line-width':roadW(1.2, 6, 20)}},
  {id:'road-major-casing', type:'line', source:'omt', 'source-layer':'transportation', minzoom:7, filter:cls('secondary','tertiary','primary','trunk','motorway'), layout:{'line-cap':'round','line-join':'round'}, paint:{'line-color':['match',['get','class'],['motorway','trunk'],'#D9A35B','#CDBF9F'],'line-width':roadW(2.2, 10, 30)}},
  {id:'road-minor', type:'line', source:'omt', 'source-layer':'transportation', minzoom:12, filter:cls('minor','service'), layout:{'line-cap':'round','line-join':'round'}, paint:{'line-color':'#FFFFFF','line-width':roadW(0.8, 4.5, 17)}},
  {id:'road-major', type:'line', source:'omt', 'source-layer':'transportation', minzoom:6, filter:cls('secondary','tertiary','primary','trunk','motorway'), layout:{'line-cap':'round','line-join':'round'}, paint:{'line-color':['match',['get','class'],['motorway','trunk'],'#F7C98A',['primary'],'#FCE3A6','#FFFFFF'],'line-width':roadW(1.6, 8, 26)}},
  {id:'boundary-state', type:'line', source:'omt', 'source-layer':'boundary', filter:['all',['==',['get','admin_level'],2],['!=',['get','maritime'],1]], paint:{'line-color':'#8E7E9C','line-width':['interpolate',['linear'],['zoom'],4,1,12,2.5],'line-dasharray':[3,1.5]}},
  {id:'boundary-maritime', type:'line', source:'omt', 'source-layer':'boundary', filter:['all',['==',['get','admin_level'],2],['==',['get','maritime'],1]], paint:{'line-color':'#7FA9C2','line-width':1.2,'line-dasharray':[2,2]}},
  {id:'boundary-county', type:'line', source:'omt', 'source-layer':'boundary', minzoom:7, filter:['match',['get','admin_level'],[4,6],true,false], paint:{'line-color':'#B9AFC2','line-width':0.8,'line-dasharray':[2,2]}},
  {id:'water-name', type:'symbol', source:'omt', 'source-layer':'water_name', layout:{'text-field':NAME,'text-font':F_IT,'text-size':['interpolate',['linear'],['zoom'],5,11,12,14],'text-max-width':8,'text-letter-spacing':0.1}, paint:{'text-color':'#3F7393','text-halo-color':'rgba(255,255,255,0.7)','text-halo-width':1}},
  {id:'road-name', type:'symbol', source:'omt', 'source-layer':'transportation_name', minzoom:13, filter:['has','name'], layout:{'symbol-placement':'line','text-field':NAME,'text-font':F_REG,'text-size':['interpolate',['linear'],['zoom'],13,10,18,14],'text-max-angle':30}, paint:{'text-color':'#5B5751','text-halo-color':'#FFFFFF','text-halo-width':1.5}},
  {id:'place-minor', type:'symbol', source:'omt', 'source-layer':'place', minzoom:11, filter:cls('village','hamlet','suburb','neighbourhood','isolated_dwelling','quarter'), layout:{'text-field':NAME,'text-font':F_REG,'text-size':['interpolate',['linear'],['zoom'],11,11,16,14],'text-max-width':8}, paint:{'text-color':'#3C4A52','text-halo-color':'#FFFFFF','text-halo-width':1.5}},
  {id:'place-island', type:'symbol', source:'omt', 'source-layer':'place', minzoom:8, filter:cls('island','islet'), layout:{'text-field':NAME,'text-font':F_IT,'text-size':['interpolate',['linear'],['zoom'],8,11,14,15],'text-max-width':8}, paint:{'text-color':'#4C5A4A','text-halo-color':'rgba(255,255,255,0.8)','text-halo-width':1.5}},
  {id:'place-town', type:'symbol', source:'omt', 'source-layer':'place', minzoom:8, filter:cls('town'), layout:{'text-field':NAME,'text-font':F_REG,'text-size':['interpolate',['linear'],['zoom'],8,11,14,16],'text-max-width':8}, paint:{'text-color':'#26343D','text-halo-color':'#FFFFFF','text-halo-width':1.5}},
  {id:'place-city', type:'symbol', source:'omt', 'source-layer':'place', minzoom:5, filter:cls('city'), layout:{'text-field':NAME,'text-font':F_BOLD,'text-size':['interpolate',['linear'],['zoom'],5,11,12,18],'text-max-width':8}, paint:{'text-color':'#1B2A33','text-halo-color':'#FFFFFF','text-halo-width':1.8}},
  {id:'place-country', type:'symbol', source:'omt', 'source-layer':'place', maxzoom:8, filter:cls('country'), layout:{'text-field':NAME,'text-font':F_BOLD,'text-size':['interpolate',['linear'],['zoom'],3,11,7,15],'text-transform':'uppercase','text-letter-spacing':0.1,'text-max-width':8}, paint:{'text-color':'#6E6A75','text-halo-color':'#FFFFFF','text-halo-width':1.5}}
];
const style = {
  version: 8,
  name: 'Čisto more – lokalna karta',
  sources: { omt: { type: 'vector', url: '{ORIGIN}/tiles.json' } },
  glyphs: '{ORIGIN}/fonts/{fontstack}/{range}.pbf',
  layers
};
require('fs').writeFileSync(require('path').join(__dirname, 'style.json'), JSON.stringify(style, null, 1));
console.log('style.json:', layers.length, 'slojeva');
