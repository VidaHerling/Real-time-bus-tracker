//use accessToken on mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoidmlkYTAyMTQiLCJhIjoiY2wwdmM4a2pkMGF5MDNkczJjOWt2eDNkeSJ9.6wpj-du0aa0meKKcq6ADEg';

//create a new map
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-71.09304388, 42.35812913],
  zoom: 12 // starting zoom
});
   
// Request bus data from MBTA
async function getBusLocations(){
  const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
  const response = await fetch(url);
  const json     = await response.json();
  console.log('getBusLocations', json);
  return json.data;
}

function getLocationData(location) {
    let lat = location.attributes.latitude;
    let lng = location.attributes.longitude;
    let busId = location.id;

    return {
        lat, lng, busId
    }
}

// takes in location history parameter for recursion
async function run(locationHistory){
    handleBusMarkers(locationHistory);
    setTimeout(() => {
        // pass in locationHistory for recursion to track values real time
        run(locationHistory)
    }, 10000);
}

// initializing location history
const locationHistory = {};
run(locationHistory);

async function handleBusMarkers(locationHistory){
  // get bus data    
  const locations = await getBusLocations();

  for (let i = 0; i < locations.length; i += 1) {
  //console.log('i', i);

  const location = locations[i];
  const { lat, lng, busId } = getLocationData(location);
  //console.log('locationHistory', locationHistory);

  if (!locationHistory[busId]) {
    //find out if a bus id exists already. If it does not exist, add a new marker for the new bus
    const el = document.createElement('div'); //create a div in index.html
    el.className = "marker"; //assign a className "marker" attribute to the div; in the CSS file, the marker was from a picture
    const newMarker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`Bus Number: ${busId}`)) 
        .addTo(map)

    locationHistory[busId] = newMarker; //save the newMarker object in the locationHistory object

    } else {
    const existingMarker = locationHistory[busId];
    console.log('OLD existingMarker', existingMarker);
    existingMarker.setLngLat([lng, lat]);
    }
  }
}
