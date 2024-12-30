var map;
const api_key = "AIzaSyC2kdFdCnCT51cVbPcbHRgvl7XFwmkPFTw";

// init map for history item
function initMapCoordinates() {
  setTimeout(function(){
    
  id = parseInt(getParameterByName('id'));
  var item = user.history.filter(i => i.id === id);
  var coords = item[0].location.split(',');

  const loc = new google.maps.LatLng(coords[0], coords[1]);
  map = new google.maps.Map(document.getElementById("map"), {
    center: loc,
    zoom: 16,
  });
  const coordInfoWindow = new google.maps.InfoWindow();

  coordInfoWindow.setContent(createInfoWindowContent(loc, map.getZoom()));
  coordInfoWindow.setPosition(loc);
  coordInfoWindow.open(map);
  map.addListener("zoom_changed", () => {
    coordInfoWindow.setContent(createInfoWindowContent(loc, map.getZoom()));
    coordInfoWindow.open(map);
  });
  
  },5000);
}

// init map, requesting current location (for home and catch)
function initMap(){
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // const infoWindow = new google.maps.InfoWindow();
        // infoWindow.setPosition(pos);
        // infoWindow.setContent("<img class='map-fish-avatar' src='assets/img/fish_avatar.png' />");
        // infoWindow.open(map);
        map.setCenter(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      },
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function getLocation(){
  const geocoder = new google.maps.Geocoder();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const infoWindow = new google.maps.InfoWindow();
        infoWindow.setPosition(pos);
        infoWindow.setContent("<img class='map-fish-avatar' src='assets/img/fish_avatar.png' />");
        infoWindow.open(map);
        map.setCenter(pos);

        const svgMarker = {
          path: "M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z",
          fillColor: "black",
          fillOpacity: 0.8,
          strokeWeight:0,
          rotation:0,
          scale:0.1,
          anchor: new google.maps.Point(0,0)
        };

        // new google.maps.Marker({
        //   position: map.getCenter(),
        //   icon: svgMarker,
        //   map: map,
        // });

        $("input#location").val(pos.lat + ","+pos.lng);
        geocoder
          .geocode({ location: pos })
          .then((response) => {
            if (response.results[0]) {
              map.setZoom(17);
              $("input#locationname").val(response.results[0].formatted_address);
            } else {
              window.alert("Keine Informationen zu diesem Standort gefunden.");
            }
          })
          .catch((e) => window.alert("Geocoder failed due to: " + e));
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      },
    );
    

  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function initMapEmpty(){
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
      },
      () => {
        handleLocationError(true,null, map.getCenter());
      },
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, null, map.getCenter());
  }
}


// function initMap() {
//   const chicago = new google.maps.LatLng(41.85, -87.65);
//   const map = new google.maps.Map(document.getElementById("map"), {
//     center: chicago,
//     zoom: 3,
//   });
//   const coordInfoWindow = new google.maps.InfoWindow();

//   coordInfoWindow.setContent(createInfoWindowContent(chicago, map.getZoom()));
//   coordInfoWindow.setPosition(chicago);
//   coordInfoWindow.open(map);
//   map.addListener("zoom_changed", () => {
//     coordInfoWindow.setContent(createInfoWindowContent(chicago, map.getZoom()));
//     coordInfoWindow.open(map);
//   });
// }

const TILE_SIZE = 256;

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map);
}

function createInfoWindowContent(latLng, zoom) {
  const scale = 1 << zoom;
  const worldCoordinate = project(latLng);
  const pixelCoordinate = new google.maps.Point(
    Math.floor(worldCoordinate.x * scale),
    Math.floor(worldCoordinate.y * scale),
  );
  const tileCoordinate = new google.maps.Point(
    Math.floor((worldCoordinate.x * scale) / TILE_SIZE),
    Math.floor((worldCoordinate.y * scale) / TILE_SIZE),
  );
  return [
    "Chicago, IL",
    "LatLng: " + latLng,
    "Zoom level: " + zoom,
    "World Coordinate: " + worldCoordinate,
    "Pixel Coordinate: " + pixelCoordinate,
    "Tile Coordinate: " + tileCoordinate,
  ].join("<br>");
}

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
  let siny = Math.sin((latLng.lat() * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);
  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)),
  );
}

window.initMap = initMap;