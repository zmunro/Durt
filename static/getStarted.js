// location
var myLat = 0;
var myLng = 0;
var map;
var marker;
var name;
var plantList = [];

function initMap() {
	var me = new google.maps.LatLng(myLat, myLng);
	var mapOptions = {
		center: me,
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser. What a shame!");
	}
}

function renderMap() {
	me = new google.maps.LatLng(myLat, myLng);
	map.panTo(me);

	var me_image = '../static/imgs/me.png';
	marker = new google.maps.Marker( {
		animation: google.maps.Animation.DROP,
		position: me,
		icon: me_image,
	});
	marker.setMap(map);
}

// windowStarted
$(document).ready(function() {
	$("#addPlant").click(function() {
		var plant = $("#enterPlant").val();
		plant = plant.toUpperCase();
		currentPlants = document.getElementById("panel").textContent.split("\n");
		if (currentPlants.indexOf(plant) != -1) {
			addPlant(plant);
		}
		else {
			window.alert("Plant not recognized! Click below to see what plants we support.");
		}
	});
});

// toggle
$(document).ready(function() {
	$("#flip").click(function() {
		$("#panel").slideToggle("slow");
	});
});

function createUser() {
	var plants = document.getElementById("userPlants").textContent.split(",");
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; // January is 0
	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd
	} 
	if(mm < 10) {
		mm = '0' + mm
	} 
	today = mm + '/' + dd + '/' + yyyy;
	var plantTuples = [];
	for (i = 0; i < plants.length - 1; i++) {
		var plant = {"plant":plants[i], "date":today};
		plantTuples.push(plant);
	}
	var myLat;
	var myLng;
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			user = { first: "",
				last: "",
				_id: "",
				plants: plantTuples,
				lat: myLat,
				lng: myLng,
				email: "-1"
			};
			getUserInfo(user);
		});
	}
	else {
		user = { first: "",
			last: "",
			_id: "",
			plants: plantTuples,
			lat: "-1",
			lng: "-1",
			email: "-1"
		};
		getUserInfo(user);
	}
}

function getPlants() {
	var request = new XMLHttpRequest();
	var url = "https://durt2.herokuapp.com/getPlants";
	request.open("GET", url, false);
	request.send();
	info = JSON.parse(request.responseText);
	panel = "<p>";
	for (i = 0; i < info.length; i++) {
		plant = info[i].plantName;
		panel += plant.toUpperCase();
		if (i < info.length - 1) {
			panel += "\n</br>";
		}
	}
	panel += "</p>";
	document.getElementById("panel").innerHTML = panel;
}
getPlants();

function postUser(user) {
	var request = new XMLHttpRequest();
	var url = "https://durt2.herokuapp.com/addUser";
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/json");
	answer = request.send(JSON.stringify(user));
	window.location.href = "/manageGarden";
}

function addPlant(plant) {
	document.getElementById("userPlants").innerHTML += plant + ",";
}
