var grid = [];
var map;
var circlearea;
var area
var area_properties = []
var area_coordinate = []
var sortID = [];
var marker
var first = 0
var sinomarker
var markers = []
var markers1 = []
var markers_list = []
var temp = []
var ID_test
var points_list = {};
var total_number;
var note = 0
mapclick = 0
points_list.list = [];
//---------------------------------------
var radarChart;
var lineChart;
var chartType = 0;//記錄圖表類別
var targetType = 0;//記錄六種類別
let timeline_extend = 0;
let grid_current;
let address_current;
let selected_time = -1;
let marker_lat = 23;
let marker_lng = 120;
let weights = [0, 0, 0, 0, 0, 0]
let radarData = [0.5, 1, 0.5, 1, 0.5, 1]
let chartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

// let chartData = [0.5, 1, 1, 0.5, 1, 0.5, 1]

// document.getElementById('geojson').disabled=true;　
// document.getElementById("latlng").style.height = (document.body.clientHeight - 470) + "px";
// p = document.getElementById("time-slider")
// document.getElementById("time-indicator-container").style.margin = (p.clientwidth) / 14 + "px";

$(document).ready(function () {
	let script = document.createElement('script');
	script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCCYcEhvSf0iUKUyS-ntyEkW7K_uBmHWDY&libraries=visualization,places&callback=initMap&language=zh-TW";
	script.async = true;
	document.head.appendChild(script);

	let before = document.querySelector('#before')
	for (let i = 1000; i < 1011; i++) {
		let frame = document.createElement("div");
		frame.id = String(i)
		frame.className = 'time-frame'
		let dot = document.createElement("div");
		if (i % 3 === 0) {
			dot.style.width = '6px';
			dot.style.height = '6px';
			dot.style.borderRadius = '3px';
		}
		dot.className = 'time-dot'
		frame.appendChild(dot)
		// image.onmouseover = () => { console.log(image.id); }
		before.appendChild(frame)
	}
	let after = document.querySelector('#after')
	for (let i = 1011; i < 1022; i++) {
		let frame = document.createElement("div");
		frame.id = String(i)
		frame.className = 'time-frame'
		let dot = document.createElement("div");
		if (i % 3 === 2) {
			dot.style.width = '6px';
			dot.style.height = '6px';
			dot.style.borderRadius = '3px';
		}
		dot.className = 'time-dot'
		frame.appendChild(dot)
		// image.onmouseover = () => { console.log(image.id); }
		after.appendChild(frame)
	}
	drawRadar();
	// drawChart();

	initListener();

	// document.querySelectorAll('.heart')[0].addEventListener("mouseenter", function (event) {
	// 	// highlight the mouseenter target
	// 	console.log("hover");
	// }, false);

	setTimeout(function () {
		// opensum();
	}, 1000);
});


function initListener() {
	//----------------- for extend timeline --------------------------
	document.querySelector('#timeline-extend').addEventListener('click', (e) => {
		// console.log(e.target);
		id_check = (e.target.id || e.target.parentNode.id) % 1000
		if (id_check >= 0 && id_check < 22) {
			// console.log(typeof e.target.id == "object");
			// console.log(typeof e.target.id == "string");
			// console.log(e.target.id !== "");
			console.log(id_check);
			selected_time = id_check;
			document.querySelectorAll('.time-frame').forEach((frame, idx) => {
				frame.childNodes[0].style.backgroundColor = '#d2d4d6'
			})
			// if (e.target.id % 1000 >= 0 && e.target.id % 1000 < 22 && typeof (e.target.id) !== "") {
			document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.backgroundColor = '#6598FD';
		}
	})
	document.querySelectorAll('.time-frame').forEach((time_frame) => {
		time_frame.addEventListener('mouseenter', (e) => {
			// document.querySelectorAll('.time-frame').forEach((frame, idx) => {
			// 	if (idx !== selected_time) frame.childNodes[0].style.backgroundColor = '#d2d4d6'
			// })
			id_check = (e.target.id || e.target.parentNode.id) % 1000
			if (id_check >= 0 && id_check < 22 && id_check !== selected_time) {
				document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.backgroundColor = '#A7A9AB';
				document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.width = '10px';
				document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.height = '10px';
				document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.borderRadius = '5px';

			}
			if (selected_time !== -1) {
				document.querySelectorAll('.time-frame')[selected_time].childNodes[0].style.backgroundColor = '#6598FD';
			}
		});
		time_frame.addEventListener('mouseleave', (e) => {
			id_check = (e.target.id || e.target.parentNode.id) % 1000
			if (id_check >= 0 && id_check < 22 && id_check !== selected_time) {
				document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.backgroundColor = '#d2d4d6';
				if ((id_check + parseInt(id_check / 11)) % 3 === 2) {
					document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.width = '6px';
					document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.height = '6px';
					document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.borderRadius = '3px';
				}
				else {
					document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.height = '4px';
					document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.width = '4px';
					document.querySelectorAll('.time-frame')[id_check].childNodes[0].style.borderRadius = '2px';
				}
			}
		})
	})

	// document.querySelector('#timeline').addEventListener('click', () => {

	// 	if (timeline_extend === 0) {
	// 		timeline_extend = 1;
	// 		document.querySelector('#timeline').src = '';
	// 		document.querySelector('#timeline').style.height = '53vh';

	// 	}
	// 	else {
	// 		timeline_extend = 0;
	// 	}
	// })

	//----------------- for analysis types --------------------------
	document.querySelectorAll('.type').forEach((type) => {
		type.addEventListener('click', () => {
			console.log(type.id % 60);
			document.querySelectorAll('.type').forEach((typeInner) => {
				typeInner.style.backgroundColor = '#fff';
			})
			type.style.backgroundColor = '#eee';
			targetType = type.id % 60;
			getChartData();
		})
	})
	//--------------------- for weights -----------------------------
	document.querySelector('#weightSelect').style.opacity = '0'
	document.querySelectorAll('.weight').forEach((weight, i) => {
		for (let j = 0; j < 5; j++) {
			let image = document.createElement("img");
			image.id = String(i) + String(j)
			image.className = 'heart'
			image.src = `../static/figma/heart-line.svg`;
			image.style.marginLeft = "2%";
			image.style.width = "20px";
			image.style.height = "2.5vh";
			// image.onmouseover = () => { console.log(image.id); }
			weight.appendChild(image)
		}
	})
	document.querySelector('#weightSelect').addEventListener('click', (e) => {
		try {
			if (e.target.src.includes("/static/figma/heart")) {
				// e.target.src = "../static/figma/heart-solid.svg"
				// console.log(e.target.id % 10);
				weights[parseInt(e.target.id / 10)] = 1 + e.target.id % 10
				console.log(parseInt(e.target.id / 10));
				console.log(weights);
				for (let i = 0; i < 5; i++) {
					// console.log(e.target.parentNode.childNodes[i + 1]);
					if (i <= e.target.id % 10) {
						e.target.parentNode.childNodes[i + 1].src = "../static/figma/heart-solid.svg";
					}
					else {
						e.target.parentNode.childNodes[i + 1].src = "../static/figma/heart-line.svg";
					}
				}
			}
		}
		catch { }
	})
	document.querySelectorAll('.heart').forEach((heart) => {
		heart.addEventListener("mouseenter", (e) => {
			try {
				if (e.target.src.includes("/static/figma/heart")) {
					for (let i = 0; i < 5; i++) {
						// console.log(e.target.parentNode.childNodes[i + 1]);
						if (i <= e.target.id % 10) {
							e.target.parentNode.childNodes[i + 1].src = "../static/figma/heart-empty.svg";
						}
						else {
							e.target.parentNode.childNodes[i + 1].src = "../static/figma/heart-line.svg";
						}
					}
				}
			}
			catch { }
		})
	})
	document.querySelectorAll('.weight').forEach((heart) => {
		heart.addEventListener("mouseleave", (e) => {
			// console.log("leave");
			console.log(e.target);
			// console.log(e.target.childNodes[1 + weights[parseInt(e.target.id % 100)]], 999);
			// e.target.childNodes[weights[parseInt(e.target.id / 100)]].click();
			// console.log(e.target.id % 10);
			for (let i = 0; i < 5; i++) {
				if (i < weights[parseInt(e.target.id % 100)]) {
					e.target.childNodes[i + 1].src = "../static/figma/heart-solid.svg";
				}
				else {
					e.target.childNodes[i + 1].src = "../static/figma/heart-line.svg";
				}
			}
		})
	})
}

function initMap() {                                            //map
	geocoder = new google.maps.Geocoder();

	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 23.037850, lng: 120.239751 },
		// center: { lat: lat, lng: lng },
		zoom: 11,
		streetViewControl: false,
		zoomControl: false,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM,
		},
		mapTypeControl: false,
	});

	// var myMarker = new google.maps.Marker({
	// 	map: map,
	// 	animation: google.maps.Animation.DROP,
	// 	position: { lat: 23.037850, lng: 120.239751 }
	// });
	// addYourLocationButton(map, myMarker);

	navigator.geolocation.getCurrentPosition(function (position) {
		lat = position.coords.latitude;
		lng = position.coords.longitude;
		map.setZoom(15)
		map.panTo({ lat: lat, lng: lng })
		addMarker({ lat: lat, lng: lng }, map);
	});

	map.addListener("bounds_changed", () => {
		searchBox.setBounds(map.getBounds());
	});

	const input = document.getElementById('pac-input')
	const searchBox = new google.maps.places.SearchBox(input);
	const input2 = document.getElementById('pac-input-simulate')
	const searchBox2 = new google.maps.places.SearchBox(input2);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input2);

	searchBox2.addListener("places_changed", () => {
		const places = searchBox2.getPlaces();
		// console.log(place[0].formatted_address);
		address_current = places[0].formatted_address.substr(5).replace('台灣', '').replace('ed Road,', '').replace(/\b[7]{1}[0-9]{2}\b/i, '');
		document.querySelector('#position-address-2').innerText = address_current + ' 附近';
		// document.querySelector('#position-address-2').innerText = place + ' 附近';
	})

	searchBox.addListener("places_changed", () => {
		const places = searchBox.getPlaces();
		// console.log(places[0].geometry.location.lat(), places[0].geometry.location.lng());
		if (places.length == 0) return;
		marker_lat = places[0].geometry.location.lat();
		marker_lng = places[0].geometry.location.lng();

		map.panTo({ lat: marker_lat, lng: marker_lng }, map);

		markers.forEach((marker) => { marker.setMap(null); });
		markers = [];

		// For each place, get the icon, name and location.
		const bounds = new google.maps.LatLngBounds();
		places.forEach((place) => {
			if (!place.geometry || !place.geometry.location) {
				console.log("Returned place contains no geometry");
				return;
			}
			// const icon = {
			// 	url: place.icon,
			// 	size: new google.maps.Size(71, 71),
			// 	origin: new google.maps.Point(0, 0),
			// 	anchor: new google.maps.Point(17, 34),
			// 	scaledSize: new google.maps.Size(25, 25),
			// };
			markers.push(
				new google.maps.Marker({
					map,
					// icon,
					title: place.name,
					position: place.geometry.location,
				})
			);

			// if (place.geometry.viewport) {
			// 	bounds.union(place.geometry.viewport);
			// } else {
			// 	bounds.extend(place.geometry.location);
			// }
		});
		// map.fitBounds(bounds);
	});

	infowindow_grid = new google.maps.InfoWindow()
	map.data.addListener('mouseover', function (event) {
		grid_current = event.feature.i.ID
		// deleteMarkers()
		lat = event.feature.i.center.lat;
		lng = event.feature.i.center.lng;
		// console.log(event.feature.i);

		// get the address
		input2.value = String(lat) + ", " + String(lng)
		google.maps.event.trigger(input2, 'focus', {});
		google.maps.event.trigger(input2, 'keydown', { keyCode: 13 });
		document.querySelector('#position-latlng-2').innerText = String(lat).substr(0, 6) + ", " + String(lng).substr(0, 7);
		infowindow_grid.close()
		map.data.revertStyle();

		setTimeout(function () {
			// console.log("lat:" + String(lat) + ", " + "lng:" + String(lng))
			infowindow_grid.setPosition({ lat: lat + 0.0025, lng: lng });//設在中間會擋住 pin
			city_grid_ID = event.feature.i.ID
			let distance = Math.pow((lat - marker_lat), 2) + Math.pow((lng - marker_lng), 2);
			distance = Math.pow(distance, 0.5) * 110
			infowindow_grid.setContent("(" + String(lat).substr(0, 7) + ", " + String(lng).substr(0, 8) + ")<br>" + "ID: " + event.feature.i.ID + "&emsp;" + "All_id: " + event.feature.i.All_id + "<br>" + address_current + "<br>距標記處" + String(distance).substr(0, 4) + "km")
			infowindow_grid.open(map)
		}, 500);
	});
	map.data.addListener('click', function (event) {
		document.querySelector("#info").style.opacity = 1;
		grid_current = event.feature.i.ID
		// deleteMarkers()
		lat = event.feature.i.center.lat;
		lng = event.feature.i.center.lng;
		// console.log(event.feature.i);

		// get the address
		input2.value = String(lat) + ", " + String(lng)
		google.maps.event.trigger(input2, 'focus', {});
		google.maps.event.trigger(input2, 'keydown', { keyCode: 13 });
		document.querySelector('#position-latlng-2').innerText = String(lat).substr(0, 6) + ", " + String(lng).substr(0, 7);

		map.panTo({ lat: lat, lng: lng }, map);
		document.getElementById('map').style.background = " #484848;"
		if (true) {
			console.log(event.feature);
			map.data.overrideStyle(event.feature, { fillColor: "#555555", fillOpacity: 1 });
			setTimeout(function () {
				map.data.revertStyle();
			}, 500);
		}
		if (chartType === 0) {
			getRadarData();
		} else {
			getChartData();
		}
	});
	map.addListener('click', function (event) {
		closeWeights();
		// addMarker(event.latLng, map);
		// placeMarkerAndPanTo2(event.latLng, map);
	});
}
function addMarker(location, map) {
	// Add the marker at the clicked location, and add the next-available label
	// from the array of alphabetical characters.
	let marker = new google.maps.Marker({
		position: location,
		// label: labels[labelIndex++ % labels.length],
		map: map,
	});
	markers.push(marker);
}
function deleteMarkers() {
	markers.forEach(function (e) {
		e.setMap(null);
	});
	markers = [];
}

function getRadarData() {
	$.ajax({
		url: "/get_radar_data",
		data: {
			"grid_id": grid_current
		},
		success: function (data) {
			// console.log(data.eventData);
			arr = data.eventData
			radarData.forEach((dat, idx) => { radarData[idx] = arr[3 + idx] })
			// console.log('new radar data: ', radarData)
			drawRadar();
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert(XMLHttpRequest.status + '\n' + XMLHttpRequest.readyState + '\n' + textStatus + '\n' + XMLHttpRequest.responseText);
		}
	});
};


function getChartData() {
	$.ajax({
		url: "/get_chart_data",
		data: {
			"grid_id": grid_current,
			"chart_type": targetType
		},
		success: function (data) {
			console.log(data.eventData);
			arr = data.eventData
			chartData.forEach((dat, idx) => { chartData[idx] = arr[idx] })
			drawChart();
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert(XMLHttpRequest.status + '\n' + XMLHttpRequest.readyState + '\n' + textStatus + '\n' + XMLHttpRequest.responseText);
		}
	});
};

function goPredict() {                                //預測
	a = 0
	if (a == 1) { alert("請選擇區域選取方式"); return; }
	cleanmap();
	if (a == 0) {                                        //依城市
		console.log('chosen weight is', weights);

		$.ajax({
			url: "/get_grid",
			data: {
				// "mydata": $("#selectWeight").val(),
				"myweights": JSON.stringify(weights)
			},
			success: function (data) {
				$('#loading').hide();
				area_properties.length = 0
				for (var i = 0; i < data.features.length; i++) {
					map.data.addGeoJson(data.features[i]);
					area_properties.push(data.features[i].properties)
				};
				total_number = area_properties.length
				var bounds = new google.maps.LatLngBounds();
				map.data.forEach(function (feature) {
					feature.getGeometry().forEachLatLng(function (latlng) {
						bounds.extend(latlng);
					});
				});
				map.fitBounds(bounds);
				map.data.setStyle({ visible: true });

				map.data.addListener('mouseover', function (event) {
					map.data.revertStyle();
					map.data.overrideStyle(event.feature, { strokeWeight: 5, strokeOpacity: 1 });
				});

				map.data.addListener('mouseout', function (event) {
					map.data.revertStyle();
				});

				clearL();
				var number_count = 0
				var last_v = 4
				for (var h = 0; h < area_properties.length; h++) {
					if (area_properties[h].fill[0] == "#930509") {
						points_list.list.push(
							{
								latlng: "ID:" + area_properties[h].ID,
								latlng1: "位置:" + area_properties[h].area3,
								points: area_properties[h]
							})
					}

				}

				// showlist("#latlng");
				if (first == 0) {
					// document.getElementById('geojson').disabled=false;　// 變更顯示分色圖按鈕為可用
					first = 1;
				}
				else {
					//document.getElementById('geojson').disabled=false;　// 變更欄位為可用
				}
				map.data.setStyle(function (feature) {
					if (feature.getProperty('fill')[0] == "#EEEEEE") { opac = 0 }
					else { opac = 0.6 }
					return {
						fillColor: feature.getProperty('fill')[0],
						fillOpacity: opac,
						strokeWeight: 0.2,
					};
				});
				// document.getElementById('time-slider').value = 0;

			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert(XMLHttpRequest.status + '\n' + XMLHttpRequest.readyState + '\n' + textStatus + '\n' + XMLHttpRequest.responseText);
				// alert(XMLHttpRequest.readyState);
				// alert(textStatus);
				// alert(XMLHttpRequest.responseText);
			}
		});
		// }
		// else {
		// 	alert("請選擇地區")
		// }
	}
};

function clearL() {
	if (points_list.list != null) {
		points_list.list.length = 0;
	}
}

function cleanmap() {
	clearL();
	if (marker != null) {
		marker.setMap(null)
	}
	// document.getElementById("latlng").innerHTML = "";                      //清除評分清單
	map.data.forEach(function (feature) {                                   //方格清除
		map.data.remove(feature);
	});
	if (typeof marker !== 'undefined') {                                     //分行清單點選後出現的MARK
		marker.setMap(null)
	}
	if (first == 1) {
		// document.querySelector('#geojson').innerHTML = "關閉分色圖";
		// document.getElementById('geojson').disabled=true;
	}

	if (markers != null) {                                                     //清空分行MARK
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers = [];
	}
	if (markers1 != null) {                                                   //清除壞分行MARK
		for (var i = 0; i < markers1.length; i++) {
			markers1[i].setMap(null);
		}
		markers1 = [];
	}
	if (markers_list != null) {
		for (var i = 0; i < markers_list.length; i++) {
			markers_list[i].setMap(null);
		}
		markers_list = [];
	}

	if (circlearea) {                                                     //清除選取範圍方塊
		circlearea.setMap(null);
	}
	if (typeof infowindow_grid != 'undefined') {
		infowindow_grid.close()
	}
	if (typeof infowindow_bad != 'undefined') {
		infowindow_bad.close()
	}
	if (typeof infowindow_sino != 'undefined') {
		infowindow_sino.close()
	}
	if (typeof gridarea != 'undefined') {
		gridarea.setMap(null);
	}
}

function geojsoncolor() {                                                 //顯示or取消分色圖
	if (document.querySelector('#geojson').innerHTML == "顯示分色圖") {
		map.data.setStyle({ visible: true });
		map.data.setStyle(function (feature) {
			if (feature.getProperty('fill')[$('#time-slider').val()] == "#EEEEEE") { opac = 0 }
			else { opac = 0.6 }
			return {
				fillColor: feature.getProperty('fill')[$('#time-slider').val()],
				fillOpacity: opac,
				strokeWeight: 0.2
			};
		});
		document.querySelector('#geojson').innerHTML = "關閉分色圖";


	}
	else {
		document.querySelector('#geojson').innerHTML = "顯示分色圖";
		//map.data.setStyle({visible: false});
		map.data.setStyle(function (feature) {
			return {
				fillOpacity: 0,
				strokeWeight: 0.2,
			};
		});

	}
}

function drawRadar() {
	document.querySelectorAll('.type').forEach((type) => {
		type.style.opacity = 0;
	})
	if (radarChart) {
		radarChart.update();
		return;
	}
	const data = {
		labels: [
			'價格',
			'人口',
			'機能',
			'安全',
			'交通',
			'環境'
		],
		datasets: [{
			label: 'My First Dataset',
			data: radarData,
			fill: true,
			borderWidth: 0,
			backgroundColor: 'rgba(161, 196, 253,0.68)',
			borderColor: 'rgb(161, 196, 253)',
			pointBackgroundColor: 'rgba(161, 196, 253,0)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgb(161, 196, 253)',
		}]
	};
	const config = {
		type: 'radar',
		data: data,
		options: {
			elements: {
				line: {
					borderWidth: 3
				},
			},
			scales: {
				r: {
					suggestedMin: 0,
					suggestedMax: 1,
					ticks: {
						display: false,
						stepSize: 0.25,
					},
					angleLines: {
						color: '#ccc'
					},
				},
			},
			plugins: {
				legend: {
					display: false,
				}
			}
		},
	};
	radarChart = new Chart(
		document.getElementById('radar'),
		config
	);
}

function drawChart() {
	document.querySelectorAll('.type').forEach((type) => {
		type.style.opacity = 1;
	})
	if (lineChart) {
		lineChart.update();
		return;
	}
	const data = {
		labels: ['-12', '', '', '-9', '', '', '-6', '', '', '-3', '', '', '0', '', '', '+3', '', '', '+6', '', '', '+9', '', '', '+12'],
		datasets: [{
			label: 'My First Dataset',
			data: chartData,
			fill: false,
			borderWidth: 3,
			borderColor: 'rgba(171, 167, 249, 0.99)',
			tension: 0.1
		}]
	};
	const config = {
		type: 'line',
		data: data,
		options: {
			elements: {
				line: {
					borderWidth: 3
				}
			},
			scales: {
				// xAxes: {
				// 	title: {
				// 		display: true,
				// 		align: 'end',
				// 		text: 'time',
				// 		font: {
				// 			size: 12
				// 		}
				// 	}
				// },
				// yAxes: {
				// 	title: {
				// 		display: true,
				// 		align: 'end',
				// 		text: '人口',
				// 		font: {
				// 			size: 12
				// 		},
				// 	}
				// },
				y: {
					type: 'linear',
					grace: '50%',
					beginAtZero: true
				}
				// y: {
				// 	max: 100,
				// 	min: 0,
				// 	ticks: {
				// 		stepSize: 20
				// 	}
				// }
			},
			plugins: {
				legend: {
					display: false,
				}
			}
		},
	};
	lineChart = new Chart(
		document.getElementById('line-chart'),
		config
	);
}

function minus(e) {
	e.preventDefault();
	// console.log(e.target.parentNode.childNodes[3].value);
	e.target.parentNode.childNodes[3].value = -1 + parseInt(e.target.parentNode.childNodes[3].value);
	e.target.parentNode.childNodes[7].innerText = -1 + parseInt(e.target.parentNode.childNodes[7].innerText);
	e.target.parentNode.childNodes[7].innerText = e.target.parentNode.childNodes[3].value;
}

function add(e) {
	e.preventDefault();
	// console.log(e.target.parentNode.childNodes[3].value);
	e.target.parentNode.childNodes[3].value = 1 + parseInt(e.target.parentNode.childNodes[3].value);
	e.target.parentNode.childNodes[4].innerText = 1 + parseInt(e.target.parentNode.childNodes[4].innerText);
	e.target.parentNode.childNodes[7].innerText = e.target.parentNode.childNodes[3].value;
}

function changeWeight(e) {
	e.target.parentNode.childNodes[7].innerText = e.target.parentNode.childNodes[3].value;
	// console.log(e.target.parentNode.childNodes[7].innerText)
}

function toggleWeights() {
	// console.log(document.querySelectorAll('.weight'));
	// console.log(document.querySelector('#weightSelect').style.display);
	if (document.querySelector('#weightSelect').style.height == '25vh') {
		document.querySelector('#weightSelect').style.height = '0'
		document.querySelector('#weightSelect').style.opacity = '0'
		document.querySelector('#weightSelect').style.transition = 'all 0.25s ease-out';
	}
	else {
		document.querySelector('#weightSelect').style.height = '25vh'
		document.querySelector('#weightSelect').style.opacity = '1'
		document.querySelector('#weightSelect').style.transition = 'all 0.35s ease-in;';
	}
}

function closeWeights() {
	// console.log(document.querySelectorAll('.weight'));
	// console.log(document.querySelector('#weightSelect').style.display);
	if (document.querySelector('#weightSelect').style.height == '25vh') {
		document.querySelector('#weightSelect').style.height = '0'
		document.querySelector('#weightSelect').style.opacity = '0'
		document.querySelector('#weightSelect').style.transition = 'all 0.25s ease-out';
	}
}

function toggleCharts() {
	if (document.querySelector('#analysis-image img').src.includes("/static/figma/analysis1")) {
		chartType = 1;
		document.querySelector('#analysis-image img').src = `../static/figma/analysis2.svg`;
		document.querySelector('#radar-container').style.opacity = '0'
		document.querySelector('#line-chart-container').style.opacity = '1'
		drawChart();
	}
	else {
		chartType = 0;
		document.querySelector('#analysis-image img').src = `../static/figma/analysis1.svg`;
		document.querySelector('#line-chart-container').style.opacity = '0'
		document.querySelector('#radar-container').style.opacity = '1'
		drawRadar();
	}
}