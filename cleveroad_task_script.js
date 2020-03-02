var iisLocation; // Array with latitude and longtitude
var latitude;
var longitude;

var d = new Date();
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var isscrew = 0; // Amount of crew people
var updateTime = 10; // update info every 10 sec

function getISSLocation() {

	// 1. Создаём новый объект XMLHttpRequest
	var xhr = new XMLHttpRequest();

	// 2. Конфигурируем его: GET-запрос на URL
	xhr.open('GET', 'http://api.open-notify.org/iss-now.json', false);
	xhr.send();

	// 3. Парсим полученные данные
	latitude = parseFloat(JSON.parse(xhr.responseText)["iss_position"].latitude);
	longitude = parseFloat(JSON.parse(xhr.responseText)["iss_position"].longitude);

};

function getISSCrew() {
	// 1. Создаём новый объект XMLHttpRequest
	var xhr = new XMLHttpRequest();

	// 2. Конфигурируем его: GET-запрос на URL
	xhr.open('GET', 'http://api.open-notify.org/astros.json', false);
	xhr.send();

	// 3. Парсим полученные данные
	var data = JSON.parse(xhr.responseText).people;
	for (person in data) { // Цикл заполняет левую колонку (nav) блоками информации об текущем экипаже IIS
		if (data[person].craft = "ISS"){
			console.log(data[person].name);

			// var target = document.getElementsByClassName('crew-list'); //
			var target = document.querySelector(".crew-list"); // Получаем нужный элемент в DOM

			var p = document.createElement('p'); // Имя
			p.innerHTML = data[person].name;
			p.className = 'crew-info';

			var img = document.createElement('img'); // Изображение
			img.src = 'Kitty.png';
			img.className = "crew-icon";

			var div = document.createElement('div'); // Общий контейнер
			div.className = 'crew-container';
			div.appendChild(img);
			div.appendChild(p);

			var fragment = document.createDocumentFragment();
			fragment.appendChild(div);

			target.appendChild(fragment); // Вкладываем новый элемент списка

			isscrew++; // Считаем количество экипажа на IIS
		};
	};
};

// Подключаем гугло-мапу.
function initMap() {

	iisLocation = {lat: latitude, lng: longitude};

	map = new google.maps.Map(document.getElementById('map'), { // global varriable
		zoom: 4,
		center: iisLocation
	});

	marker = new google.maps.Marker({ // global varriable
		position: iisLocation,
		map: map,
		title: 'Hello World!'
	});
};

// Для актуализации позиции маркера на карте
function updateMap(map, marker){

	getISSLocation();
	iisLocation = {lat: latitude, lng: longitude};

	map.setCenter(iisLocation);
	marker.setPosition(iisLocation);
};

getISSLocation(); // Если запихнуть эту часть кода в onload, то карта ломается из-за своей ассинхронной природы

function getFixedMinutes() // Чтобы избежать всяких 20:2, т.к. значения от getUTCMinutes() находятся в диапазоне 0-59
{
	if (d.getUTCMinutes() < 10)
	{
		return "0" + d.getUTCMinutes();
	} else {
		return d.getUTCMinutes();
	}
}

function updateInfo(){
	document.getElementById("IISCords").innerHTML = "Longtitude: " + longitude +", Latitude: " + latitude; // Отображаем координаты
	document.getElementById("utcTime").innerHTML = "Current UTC time: " + d.getUTCHours() + ":" + getFixedMinutes(); // Текущее UTC время
	document.getElementById("dayMonthYear").innerHTML = days[d.getUTCDay()] + ", " + d.getUTCDate() + " " + months[d.getUTCMonth()] + " " + d.getUTCFullYear(); // Год
};

window.onload = function (){

	getISSCrew();
	document.getElementById("iisCrewAmount").innerHTML = "Total amount: " + isscrew + " people on ISS"; // Отображаем кол-во экипажа на ISS

	updateInfo();

	setInterval( () => {
			if (updateTime > 0) {
				updateTime--;
			} else {

				updateTime = 10;

				updateMap(map, marker) // Раз в N-ое время обновляет позицию IIS на карте
				updateInfo();

			}
			document.getElementById("h2MapText").innerHTML = "Map. Next Update: " + updateTime;
		}, 1000);
};