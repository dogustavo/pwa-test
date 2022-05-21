const root = document.getElementById('root');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/sw.js')
      .then((res) => console.log('service worker registered'))
      .catch((err) => console.log('service worker not registered', err));
  });

  window.addEventListener('load', getSpaceStationPosition);
}

async function getSpaceStationPosition() {
  const response = await fetch('http://api.open-notify.org/iss-now.json');
  const data = await response.json();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocation, showError);

    function showLocation(location) {
      const source = document.getElementById('position');

      const mapOptions = {
        center: [location.coords.latitude, location.coords.longitude],
        zoom: 3,
      };

      let map = L.map('map', mapOptions);
      let layer = new L.TileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      );

      L.circle([location.coords.latitude, location.coords.longitude], {
        color: 'red',
        fillOpacity: 0.5,
        radius: 100000,
      }).addTo(map);

      L.circle([data?.iss_position.latitude, data?.iss_position.longitude], {
        color: 'blue',
        fillOpacity: 0.5,
        radius: 100000,
      }).addTo(map);

      map.addLayer(layer);

      const position = distance(
        location.coords.latitude,
        location.coords.longitude,
        data?.iss_position.latitude,
        data?.iss_position.longitude,
        'K'
      );

      source.innerHTML = `Você está a ${position}Km da estação espacial ISS`;
    }
  }
}

function showError(err) {
  if (err.PERMISSION_DENIED) {
    alert('Para funcionar é necessário conceder a permissão de localização');
  }
}

function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == 'K') {
      dist = dist * 1.609344;
    }
    if (unit == 'N') {
      dist = dist * 0.8684;
    }
    return dist.toFixed(2);
  }
}
