var map, markerOrigen, markerDestino, directionsService, directionsDisplay, uberServerToken;
function initMap() {
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 25.657071, lng: -100.366366},
		zoom: 13,
		disableDefaultUI : true
	});

	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer({ markerOptions: { visible: false} });

  directionsDisplay.setMap(map);

	var origenInput = document.getElementById('origen');
	var destinoInput = document.getElementById('destino');

	var routeDetails = document.getElementById('routeDetails');

	routeDetails.innerHTML = "<h2>Ruta</h2>";

	var options = {
	  types: ['(regions)'],
	  componentRestrictions: {country: 'mx'}
	};
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(origenInput);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinoInput);

	map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(routeDetails);
	
	var autocompleteOrigen = new google.maps.places.Autocomplete(origenInput, options);
	autocompleteOrigen.bindTo('bounds', map);

	var autocompleteDestino = new google.maps.places.Autocomplete(destinoInput, options);
	autocompleteDestino.bindTo('bounds', map);

	autocompleteOrigen.addListener('place_changed', function() {

		var place = autocompleteOrigen.getPlace();
		
		console.log(place);

		var location = place && place.geometry && place.geometry.location;
		
		if (location)
			if (!markerOrigen)
				markerOrigen = new google.maps.Marker({
					position: location,
					animation: google.maps.Animation.DROP,
					map: map
				});
			else
				markerOrigen.setPosition(location);

		showRoute();
	});

	autocompleteDestino.addListener('place_changed', function() {
		
		var place = autocompleteDestino.getPlace();
		
		console.log(place);

		var location = place && place.geometry && place.geometry.location;
		
		if (location)
			if (!markerDestino)
				markerDestino = new google.maps.Marker({
					position: location,
					animation: google.maps.Animation.DROP,
					map: map
				});
			else
				markerDestino.setPosition(location);
				
		showRoute();
	});
}

function showRoute() {
  if (!markerDestino || !markerOrigen)
  	return;
  directionsService.route({
    origin: markerOrigen.getPosition(),
    destination: markerDestino.getPosition(),
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      var route = response && response.routes && response.routes[0];
      var leg = route && route.legs && route.legs[0];
      displayRouteInfo(leg);
    } else {
      console.log(status);
    }
  });
}

function displayRouteInfo (leg) {
	if (!leg){
		return;
	}
	var routeDetails = document.getElementById('routeDetails');
	info = "";
	info += "<h4>Ruta</h4>";
	info += "<label class='detail'><b>Distancia</b>"+ " " + leg.distance.text + "</label>";
	info += "<label class='detail'><b>Duración</b>"+ " " + leg.duration.text + "</label>";
	
	routeDetails.innerHTML = info;
}