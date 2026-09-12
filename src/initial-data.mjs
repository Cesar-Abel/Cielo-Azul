export const agency={name:'CieloAzul',phone:'+524448328282',whatsapp:'524448328282',email:'reservaciones@cieloazulagenciadeviajes.com',address:'Av. Salvador Nava Martínez 2532, Himno Nacional 3a Sección, San Luis Potosí, S.L.P.',source:'https://www.cieloazulagenciadeviajes.com/',checked:'2026-09-11'};
export const destinations=[
 {id:'puerto-vallarta',name:'Puerto Vallarta',image:'vallarta',alt:'Muelle de Los Muertos en Puerto Vallarta al atardecer',intro:'Un atardecer frente al Pacífico.',description:'Explora las salidas publicadas a Puerto Vallarta y compara hoteles, fechas y transporte.'},
 {id:'riviera-nayarit',name:'Riviera Nayarit',image:'nayarit',alt:'Vista aérea de la costa y las playas de Riviera Nayarit',intro:'El Pacífico a tu ritmo.',description:'Encuentra opciones de hotel y transporte para tu siguiente viaje a Riviera Nayarit.'},
 {id:'mazatlan',name:'Mazatlán',image:'mazatlan',alt:'Vista de la costa de Mazatlán y sus edificios al atardecer',intro:'Días de mar y atardeceres.',description:'Compara las salidas publicadas a Mazatlán y solicita los detalles de la opción que prefieras.'},
 {id:'cancun',name:'Cancún',image:'cancun',alt:'Mar turquesa junto a la zona hotelera de Cancún',intro:'Tu próxima pausa, en el Caribe.',description:'Consulta una opción de viaje aéreo a Cancún y confirma disponibilidad con la agencia.'}
];
const rows=[
 ['krystal-vallarta-septiembre-2026','puerto-vallarta','Krystal Vallarta','2026-09-17','2026-09-20',7670,'bus'],
 ['riu-flamingos-septiembre-2026','riviera-nayarit','Riu Flamingos','2026-09-17','2026-09-20',10000,'bus'],
 ['decameron-complex-septiembre-2026','riviera-nayarit','Decameron Complex','2026-09-17','2026-09-20',7880,'bus'],
 ['villa-varadero-septiembre-2026','puerto-vallarta','Villa Varadero','2026-09-17','2026-09-20',6965,'bus'],
 ['oceano-palace-octubre-2026','mazatlan','Oceano Palace','2026-10-02','2026-10-05',7900,'bus'],
 ['crown-paradise-golden-octubre-2026','puerto-vallarta','Crown Paradise Golden','2026-10-22','2026-10-25',12989,'air'],
 ['oceano-palace-marzo-2027','mazatlan','Oceano Palace','2027-03-18','2027-03-21',6999,'bus'],
 ['grand-decameron-mayo-2027','riviera-nayarit','Grand Decameron Complex','2027-05-13','2027-05-16',7490,'bus'],
 ['riu-dunamar-junio-2027','cancun','Riu Dunamar','2027-06-10','2027-06-13',15870,'air'],
 ['grand-palladium-julio-2027','riviera-nayarit','Grand Palladium','2027-07-08','2027-07-11',8990,'bus']
];
export const trips=rows.map(([id,destination,hotel,start,end,price,transport])=>({id,destination,hotel,start,end,price,transport,type:transport==='air'?'Todo incluido aéreo':'Todo incluido terrestre',nights:Math.round((Date.parse(end)-Date.parse(start))/86400000),origin:'San Luis Potosí',priceBasis:['oceano-palace-marzo-2027','grand-decameron-mayo-2027'].includes(id)?'Por adulto':null,occupancy:['oceano-palace-marzo-2027','grand-decameron-mayo-2027'].includes(id)?'Doble (dos adultos)':null,taxes:null,itinerary:null,exclusions:null,conditions:null,source:agency.source,checked:agency.checked,includes:['Hospedaje en '+hotel,'Plan todo incluido (alcance por confirmar)',transport==='air'?'Vuelo redondo desde San Luis Potosí':'Transporte redondo en autobús desde San Luis Potosí',...(transport==='air'?['Traslados aeropuerto–hotel–aeropuerto']:[]),...(['grand-palladium-julio-2027','oceano-palace-marzo-2027','grand-decameron-mayo-2027','krystal-vallarta-septiembre-2026'].includes(id)?['Desayuno a la llegada']:[])]}));
