var userID;
var myLat = 0;
var myLng = 0;
var name = "";

window.fbAsyncInit = function() {
	FB.init( {
		appId: '1521184151311475',
		cookie: true,
		xfbml: true,
		version: 'v2.11'
	});
	renderGarden();
};

function renderGarden() {
	FB.getLoginStatus(function(response) {
		userID = response.authResponse.userID;
		var request = new XMLHttpRequest();
		var url = "https://durt2.herokuapp.com/getUser";
		request.open("POST", url, true);
		request.setRequestHeader("Content-type", "application/json");
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				rawData = request.responseText;
				info = JSON.parse(rawData);
				for (i = 1; i <= info.plants.length; i++) {
                	document.getElementById("plant" + i).textContent = info.plants[i - 1].plant;
                	document.getElementById("date" + i).textContent = info.plants[i - 1].date;
				}
				for(i = 1; i <= info.plants.length; i++) {
					dtmFunc(info.plants[i - 1].plant,info.plants[i - 1].date, i);
				}
				myLat = info.lat;
				myLng = info.lng;
				getWeather();
			}
		}
		request.send(JSON.stringify({"_id":userID}));
	});	
};

function dtmFunc(plantName, plantDate, i) {
	var request = new XMLHttpRequest();
    var url = "https://durt2.herokuapp.com/plantInfo";
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            rawData = request.responseText;
            info = JSON.parse(rawData);
            garbage = info.split("u");
            index = 0;
            for (j = 0; j < garbage.length; j++) {
            	if (garbage[j].indexOf("DTM") != -1) {
            		index = j + 1;
            		break;
            	}
            }
            days = daysToHarvest(garbage[index],plantDate);
            document.getElementById("DTM" + i).textContent = days;
            if (days < 10) {
            	document.getElementById("DTM" + i).style.color = "green";
            	document.getElementById("DTM" + i).style.fontWeight = "bold";
            }
            else if (days < 30) {
            	document.getElementById("DTM" + i).style.color = "orange";
            }
        }
    }
    plantName = plantName.charAt(0).toUpperCase() + plantName.slice(1).toLowerCase();
    request.send(JSON.stringify({"plant":plantName}));
}

function getWeather() {
	$.getJSON("https://api.openweathermap.org/data/2.5/weather?lat=" + myLat + "&lon=" + myLng + "&APPID=aa73e7cb7afed79c49b43f98e7f998df",function(json){
		$("#weather").html("Current weather: " + json.weather[0].description + "<br> Current temperature: " + ((json.main.temp*(9/5)) - 459.67).toFixed(2) + "&deg;F");
		if((((json.main.temp*(9/5)) - 459.67).toFixed(2)) < 38) {
			window.alert("FROST WARNING: Move plants inside if possible.");
		}
		if((((json.main.temp*(9/5)) - 459.67).toFixed(2)) > 85) {
			window.alert("HEAT WARNING: It's a hot one! Don't forget to water.");
		}
		if ((json.weather[0].description == "light rain") || (json.weather[0].description == "rain") || (json.weather[0].description == "heavy rain")){
			$("#weatherIcon").prepend('<img id="weather" src="../static/imgs/rain.png" />');
		}
		else if ((json.weather[0].description == "light snow") || (json.weather[0].description == "snow") || (json.weather[0].description == "heavy snow")) {
			$("#weatherIcon").prepend('<img id="weather" src="../static/imgs/snow.png" />');
		}
		else if (json.weather[0].description == "clear sky") {
			$("#weatherIcon").prepend('<img id="weather" src="../static/imgs/sun.png" />');
		}
		else {
			$("#weatherIcon").prepend('<img id="weather" src="../static/imgs/cloud.png" />');
		}
	});
}

function daysToHarvest(DTM, plantedDate) {
	//plantTime = get the time from the tuple in the database
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; // January is 0!
	var yyyy = today.getFullYear();
	if(dd < 10) {
		dd = '0' + dd
	}
	if(mm < 10) {
		mm = '0' + mm
	}
	today = mm + '/' + dd + '/' + yyyy;
	var diff =  Math.floor(( Date.parse(today) - Date.parse(plantedDate) ) / 86400000); 
	DTM = DTM.replace("\'","");
	result = parseInt(DTM) - diff;
	return result;
}

// windowGarden
$(document).ready(function() {
	$("#add").click(function() {
		var plant = $("#plants").val();
		plants = getPlants();
		plant = plant.toUpperCase();
		if (plants.indexOf(plant) != -1) {
			addMorePlant(plant);
			window.alert("Plant added!");
			location.reload();
		}
		else {
			window.alert("Plant not recognized! Try again");
		}
	});
});

function getPlants() {
	var request = new XMLHttpRequest();
	var url = "https://durt2.herokuapp.com/getPlants";
	request.open("GET", url, false);
	request.send();
	info = JSON.parse(request.responseText);
	plants = []
	for (i = 0; i < info.length; i++) {
		plant = info[i].plantName;
		plants.push(plant.toUpperCase());
	}
	return plants;
}

function addMorePlant(newPlant) {
	var request = new XMLHttpRequest();
	var url = "https://durt2.herokuapp.com/addPlant";
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/json");

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; // January is 0
	var yyyy = today.getFullYear();
	if(dd < 10) {
		dd = '0' + dd
	} 
	if(mm < 10) {
		mm = '0'+ mm
	} 
	today = mm + '/' + dd + '/' + yyyy;
	var plantInfo = {
		plant: newPlant,
		date: today
	};
	var params = JSON.stringify({id:userID, plant: plantInfo});
	request.send(params);
}
