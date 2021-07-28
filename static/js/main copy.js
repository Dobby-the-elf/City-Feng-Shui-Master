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
let weights = [0, 0, 0, 0, 0, 0]

// Case 1: 建立簡單的通知
var notifyConfig = {
	body: "\\ ^o^ /",
	icon: "https://cythilya.github.io/public/favicon.ico"
}

function createNotify() {
	/*if (!("Notification" in window)) { // 檢查瀏覽器是否支援通知
	  console.log("This browser does not support notification");
	} else if (Notification.permission === "granted") { // 使用者已同意通知
	  var notification = new Notification(
		"Thanks for granting this permission.", notifyConfig
	  );
	} else if (Notification.permission !== "denied")*/
	{
		// 通知權限為 default (未要求) or undefined (老舊瀏覽器的未知狀態)，向使用者要求權限
		Notification.requestPermission(function (permission) {
			if (permission === "granted") {
				console.log("")
			}
		});
	}
}

// Case 2: 加上標籤
function notifyMe() {
	createNotify()
	sendNotify({
		title: '訂閱區域風險通知',
		body: '你的訂閱區域:訂閱區域1 有安全風險，請查看',
		icon: "https://cythilya.github.io/public/favicon.ico",
		url: 'http://127.0.0.1:8080/lndex'
	});
}

function sendNotify(msg) {
	var notify = new Notification(msg.title, {
		icon: msg.icon,
		body: msg.body,
		tag: msg.tag,
	});

	if (msg.url) {
		notify.onclick = function (e) { // Case 3: 綁定 click 事件
			e.preventDefault();
			window.open(msg.url);
		}
	}
}






// document.getElementById('geojson').disabled=true;　
// document.getElementById("latlng").style.height = (document.body.clientHeight - 470) + "px";
// p = document.getElementById("time-slider")
// document.getElementById("time-indicator-container").style.margin = (p.clientwidth) / 14 + "px";

$(document).ready(function () {
	var burger = $('.pullbtn');             //三條線
	var menu = $('.panel');                 //側欄
	burger.click(function () {                //點擊三條線                           位移為css hover
		document.getElementById("clickme").style.opacity = "0";
		burger.toggleClass('pullbtn_open');
		menu.toggleClass('menu--open');
	});
	let script = document.createElement('script');
	script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCCYcEhvSf0iUKUyS-ntyEkW7K_uBmHWDY&libraries=visualization,places&callback=initMap";
	script.async = true;
	document.head.appendChild(script);
	// document.querySelector('#weightSelect').style.opacity = '0'
	// document.querySelectorAll('.weight').forEach((weight, i) => {
	// 	for (let j = 0; j < 5; j++) {
	// 		let image = document.createElement("img");
	// 		image.id = String(i) + String(j)
	// 		image.className = 'heart'
	// 		image.src = `../../static/figma/heart-line.svg`;
	// 		image.style.marginLeft = "2%";
	// 		image.style.width = "20px";
	// 		image.style.height = "2.5vh";
	// 		// image.onmouseover = () => { console.log(image.id); }
	// 		weight.appendChild(image)
	// 	}
	// })
	// document.querySelector('#weightSelect').addEventListener('click', (e) => {
	// 	try {
	// 		if (e.target.src.includes("/static/figma/heart")) {
	// 			// e.target.src = "../../static/figma/heart-solid.svg"
	// 			// console.log(e.target.id % 10);
	// 			weights[parseInt(e.target.id / 10)] = 1 + e.target.id % 10
	// 			console.log(parseInt(e.target.id / 10));
	// 			console.log(weights);
	// 			for (let i = 0; i < 5; i++) {
	// 				// console.log(e.target.parentNode.childNodes[i + 1]);
	// 				if (i <= e.target.id % 10) {
	// 					e.target.parentNode.childNodes[i + 1].src = "../../static/figma/heart-solid.svg";
	// 				}
	// 				else {
	// 					e.target.parentNode.childNodes[i + 1].src = "../../static/figma/heart-line.svg";
	// 				}
	// 			}
	// 		}
	// 	}
	// 	catch { }
	// })
	// document.querySelectorAll('.heart').forEach((heart) => {
	// 	heart.addEventListener("mouseenter", (e) => {
	// 		try {
	// 			if (e.target.src.includes("/static/figma/heart")) {
	// 				for (let i = 0; i < 5; i++) {
	// 					// console.log(e.target.parentNode.childNodes[i + 1]);
	// 					if (i <= e.target.id % 10) {
	// 						e.target.parentNode.childNodes[i + 1].src = "../../static/figma/heart-empty.svg";
	// 					}
	// 					else {
	// 						e.target.parentNode.childNodes[i + 1].src = "../../static/figma/heart-line.svg";
	// 					}
	// 				}
	// 			}
	// 		}
	// 		catch { }
	// 	})
	// })
	// // document.querySelectorAll('.heart').forEach((heart) => {
	// // 	heart.addEventListener("mouseleave", (e) => {
	// // 		// console.log("hover");
	// // 		// console.log(e.target);
	// // 		// console.log(e.target.id % 10);
	// // 		for (let i = 0; i < 5; i++) {
	// // 			// console.log(e.target.parentNode.childNodes[i + 1]);
	// // 			if (i < weights[parseInt(e.target.id % 100)]) {
	// // 				e.target.parentNode.childNodes[i + 1].src = "../../static/figma/heart-solid.svg";
	// // 			}
	// // 			else {
	// // 				e.target.parentNode.childNodes[i + 1].src = "../../static/figma/heart-line.svg";
	// // 			}
	// // 		}
	// // 	})
	// // })
	// document.querySelectorAll('.weight').forEach((heart) => {
	// 	heart.addEventListener("mouseleave", (e) => {
	// 		// console.log("leave");
	// 		console.log(e.target);
	// 		// console.log(e.target.childNodes[1 + weights[parseInt(e.target.id % 100)]], 999);
	// 		// e.target.childNodes[weights[parseInt(e.target.id / 100)]].click();
	// 		// console.log(e.target.id % 10);
	// 		for (let i = 0; i < 5; i++) {
	// 			if (i < weights[parseInt(e.target.id % 100)]) {
	// 				e.target.childNodes[i + 1].src = "../../static/figma/heart-solid.svg";
	// 			}
	// 			else {
	// 				e.target.childNodes[i + 1].src = "../../static/figma/heart-line.svg";
	// 			}
	// 		}
	// 	})
	// })

	// document.querySelectorAll('.heart')[0].addEventListener("mouseenter", function (event) {
	// 	// highlight the mouseenter target
	// 	console.log("hover");
	// }, false);

	menu.toggleClass('menu--open');
	// document.querySelector('#map:nth-child(3)').childNodes[1].style.opacity = "0.2";
	if (note == 0) {
		setTimeout(function () {
			// document.querySelector('#map').childNodes[1].style.opacity = "0";
			// opensum();
		}, 3000);
	}
	else {
		setTimeout(function () {
			// opensum();
		}, 1000);
	}

});

// var modal = document.getElementById("modal");
// function openModal() {//打開權重設定視窗
// 	modal.classList.add("display");
// 	setTimeout(function () {
// 		modal.classList.add("transition");
// 	}, 20);//20milliseconds
// }
// function closeModal() {//關掉權重設定視窗
// 	modal.classList.remove("transition");
// 	document.getElementById("container").innerHTML = ""
// 	document.getElementById("ms").innerHTML = ""
// 	document.getElementById("ms").innerHTML = '<div id="container" class="example-container"></div><button class="modalbtn" id="closebtn" onclick="closeModal()">&#10006</button>'
// 	setTimeout(function () {
// 		modal.classList.remove("display");
// 	}, 300);//300milliseconds

// }



function initMap() {                                            //map
	geocoder = new google.maps.Geocoder();

	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 23.037850, lng: 120.239751 },
		// center: { lat: lat, lng: lng },
		zoom: 11,
		streetViewControl: false,
		zoomControl: true
	});

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
	// map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

	searchBox.addListener("places_changed", () => {
		const places = searchBox.getPlaces();
		console.log(places);
		if (places.length == 0) return;
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

			if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
	});

	infowindow_grid = new google.maps.InfoWindow()
	map.data.addListener('click', function (event) {
		deleteMarkers()
		lat = event.feature.i.center.lat;
		lng = event.feature.i.center.lng;
		console.log(event.feature.i);
		addMarker({ lat: lat - 0.002, lng: lng }, map);
		map.panTo({ lat: lat, lng: lng }, map);
		document.getElementById('map').style.background = " #484848;"
		if (true) {
			map.data.overrideStyle(event.feature, { fillColor: "#555555", fillOpacity: 1 });
			setTimeout(function () {
				map.data.revertStyle();
			}, 100);
			console.log("lat:" + String(lat) + ", " + "lng:" + String(lng))
			console.log(event.feature);
			infowindow_grid.setPosition({ lat: lat + 0.002, lng: lng });//設在中間會擋住 pin
			city_grid_ID = event.feature.i.ID
			if (selector == 1) {
				infowindow_grid.setContent("lat:" + String(lat).substr(0, 6) + "<br>" + "lng:" + String(lng).substr(0, 7) + "<br>" + "ID:" + event.feature.i.ID + "&emsp;" + "All_id:" + event.feature.i.All_id + "<br>位置:" + event.feature.i.area3)
				infowindow_grid.open(map)
			}
			else {
				placeMarkerAndPanTo(event.latLng, map);
			}
		}
	});
	map.addListener('click', function (event) {
		addMarker(event.latLng, map);
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




function opensum() {
	if (mapclick == 0) {
		openModal()
		score = [getRandom(50, 90), getRandom(50, 90), getRandom(50, 90), getRandom(50, 90), getRandom(50, 90)]
		i = score.indexOf(Math.min(...score));
		if (i == 0) { atten = "空氣品質" }
		else if (i == 1) { atten = "治安" }
		else if (i == 2) { atten = "生活機能" }
		else if (i == 3) { atten = "道路安全" }
		else if (i == 4) { atten = "天氣" }

		if (mapclick == 0) {
			document.getElementById("ms").innerHTML += '<font color="#000000">您現在位於</font><font color="#3b3bff">台南市安平區建平里</font>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<font color="#000000">需多加注意</font><font color="#3b3bff">' + atten + "</font>"
		}
		else {
			var geocoder = new google.maps.Geocoder();

			// google.maps.LatLng 物件
			var coord = new google.maps.LatLng(lat, lng);

			// 傳入 latLng 資訊至 geocoder.geocode
			geocoder.geocode({ 'latLng': coord }, function (results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					// 如果有資料就會回傳
					if (results) {
						document.getElementById("ms").innerHTML += '<font color="#000000">您現在位於</font><font color="#3b3bff">' + results[0].formatted_address.split('區', 2)[0] + '區</font>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<font color="#000000">需多加注意</font><font color="#3b3bff">' + atten + "</font>"
					}
				}
				// 經緯度資訊錯誤
				else {
					alert("Reverse Geocoding failed because: " + status);
				}
			});
		}

		var chart = new dvxCharts.Chart({
			axes: [
				{
					type: 'categoryAngle',
					categories: ['空氣品質', '治安', '生活機能', '道路安全', '天氣']
				},
				{
					type: 'linearRadius',
					renderStyle: 'polygon',
					majorTickMarks: {
						visible: true
					}
				}
			],
			series: [
				{
					title: ' ',
					class: 'mySeries1',
					type: 'radarArea',
					data: score
				},
				{
					title: ' ',
					class: 'mySeries2',
					type: 'radarArea',
					data: [30, 100, 30, 100, 30]
				}
			]
		});
		chart.write('container');

	}
	else if (mapclick == 1) {
		$.ajax({
			url: '/get_sum',
			data: { "lat": lat, "lng": lng, "t": $("#time4").val() },
			success: function (data) {
				score = [data.a, data.b, data.c, data.d, data.e]
				openModal()

				i = score.indexOf(Math.min(...score));
				if (i == 0) { atten = "空氣品質" }
				else if (i == 1) { atten = "治安" }
				else if (i == 2) { atten = "生活機能" }
				else if (i == 3) { atten = "道路安全" }
				else if (i == 4) { atten = "天氣" }

				if (mapclick == 0) {
					document.getElementById("ms").innerHTML += '<font color="#000000">您現在位於</font><font color="#3b3bff">台南市安平區建平里</font>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<font color="#000000">需多加注意</font><font color="#3b3bff">' + atten + "</font>"
				}
				else {
					var geocoder = new google.maps.Geocoder();

					// google.maps.LatLng 物件
					var coord = new google.maps.LatLng(lat, lng);

					// 傳入 latLng 資訊至 geocoder.geocode
					geocoder.geocode({ 'latLng': coord }, function (results, status) {
						if (status === google.maps.GeocoderStatus.OK) {
							// 如果有資料就會回傳
							if (results) {
								document.getElementById("ms").innerHTML += '<font color="#000000">您現在位於</font><font color="#3b3bff">' + results[0].formatted_address.split('區', 2)[0] + '區</font>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<font color="#000000">需多加注意</font><font color="#3b3bff">' + atten + "</font>"
							}
						}
						// 經緯度資訊錯誤
						else {
							alert("Reverse Geocoding failed because: " + status);
						}
					});
				}

				var chart = new dvxCharts.Chart({
					axes: [
						{
							type: 'categoryAngle',
							categories: ['空氣品質', '治安', '生活機能', '道路安全', '天氣']
						},
						{
							type: 'linearRadius',
							renderStyle: 'polygon',
							majorTickMarks: {
								visible: true
							}
						}
					],
					series: [
						{
							title: ' ',
							class: 'mySeries1',
							type: 'radarArea',
							data: score
						},
						{
							title: ' ',
							class: 'mySeries2',
							type: 'radarArea',
							data: [30, 100, 30, 100, 30]
						}
					]
				});
				chart.write('container');
			}
		});

	}

}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

function opensubrecord() {
	sss = '<table border="1" id="record"><tr><td><font color="#5d0017">名稱</font></td>	<td><font color="#5d0017">訂閱時間</font></td><td><font color="#5d0017">通知時間</font></td><td><font color="#5d0017">訂閱區域</font></td>　<td></td><td></td></tr><tr><td><font color="#000000">我的訂閱1</font></td>	<td><font color="#000000">星期一 17~19</font></td><td><font color="#000000">30分鐘前</font></td>　<td><button class="button" id="subsrea" >詳細</button></td><td><button class="button" id="set" >修改</button></td><td><button class="button" id="del" >刪除</button></td></tr></table> '
	document.getElementById("container").innerHTML = sss
	openModal()
}





function save_w() {   //儲存權重
	var err = 0
	if (document.getElementById("event").value == "") { err = 1 }
	if (mapclick == 2) { if (document.getElementById("address").value == "") { err = 1 } }

	var addr = ""
	if (err == 0) {
		if (mapclick == 2) { addr = document.getElementById("address").value }
		else if (mapclick == 1) { addr = lat + "," + lng }
		else { addr = "22.991915,120.184974" }
		console.log(addr)
		$.ajax({
			url: "/report",
			type: 'post',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify({ "type": $("#Selecttype").val(), "detail": document.getElementById("event").value, "address": addr }),
			success: function (data) {
				document.getElementById("event").value = ""
				document.getElementById("address").value = ""
				alert("回報成功，等待處理中")

			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert(XMLHttpRequest.status + '\n' + XMLHttpRequest.readyState + '\n' + textStatus);
				// alert(XMLHttpRequest.readyState);
				// alert(textStatus);
			},
		});
		closeModal()
		cleanradio()
	}
	else { alert("請填完所有項目") }
}
function cancel_w() {    //離開權重視窗，不存
	document.getElementById('address').value = "";
	cleanradio()
	document.getElementById("test").value = ""
}


function cancel_s() {    //離開權重視窗，不存
	cleanmap()
	setTimeout(function () {
		//your code to be executed after 1 second
		details.forEach((detail) => {
			detail.removeAttribute("open");
		});

	}, 100);
}

var slider = document.getElementById("slider");
var outerSlider = document.getElementById("outer-slider");
var selector = 1;
function togglemove() {//選遷移分行推薦
	clearL();//clearD();
	//del();
	//directionsDisplay.setMap(map);
	cleanmap();
	outerSlider.style.transform = "translate(-50%,0)";
	document.getElementById("newmode").classList.remove("selected");
	document.getElementById("movemode").classList.add("selected");
	selector = 0;
	mapclick = 0
	details.forEach((detail) => {
		detail.removeAttribute("open");
	});
}
function togglenew() {//選地區評分
	//del();
	cleanmap();
	outerSlider.style.transform = "translate(0,0)";
	document.getElementById("newmode").classList.add("selected");
	document.getElementById("movemode").classList.remove("selected");
	selector = 1;
	document.getElementById("latlng").style.height = (document.body.clientHeight - 470) + "px";
	mapclick = 0
}


$body = $("body");                     //ajax 的 loading gif
$(document).on({
	ajaxStart: function () { $body.addClass("loading"); },
	ajaxStop: function () { $body.removeClass("loading"); }
});


/* register handler for event 'changed' of time slider */
$(document).on('input', '#time-slider', function () {
	let value = $('#time-slider').val();

	//let sections = fakeData[parseInt(value/10)];
	color = ["#EEEEEE", "#930509", "#d93e41", "#ec513f", "#ef5e0e", "#f7a413", "#f3fb19"]

	map.data.setStyle(function (feature) {
		if (feature.getProperty('fill')[value] == "#EEEEEE") { opac = 0 }
		else { opac = 0.6 }
		return {
			fillColor: feature.getProperty('fill')[value],
			fillOpacity: opac,
			strokeWeight: 0.2,
		};
	});
	if (typeof marker !== 'undefined') {                                     //分行清單點選後出現的MARK
		marker.setMap(null)
	}
	clearL();

	for (var h = 0; h < area_properties.length; h++) {
		if (area_properties[h].fill[value] == "#930509") {
			points_list.list.push(
				{
					latlng: "ID:" + area_properties[h].ID,
					latlng1: "位置:" + area_properties[h].area3,
					points: area_properties[h]
				})
		}
	}
	showlist("#latlng");
});

const details = document.querySelectorAll("details");

// Add the onclick listeners.
details.forEach((targetDetail) => {
	targetDetail.addEventListener("click", () => {
		console.log(targetDetail.getAttribute("open"))
		if (targetDetail.getAttribute("open") == null) {
			$.ajax({
				url: "/get_grid1",
				success: function (data) {
					var side = []
					area_properties.length = 0
					area_coordinate.length = 0
					for (var i = 0; i < data.features.length; i++) {
						if (data.features[i].properties.side == 1) {
							side.push(data.features[i].properties.center);
							map.data.addGeoJson(data.features[i]);
						}
						area_properties.push(data.features[i].properties)
						area_coordinate.push(data.features[i].geometry.coordinates)
					};

					var bounds = new google.maps.LatLngBounds();
					map.data.forEach(function (feature) {
						feature.getGeometry().forEachLatLng(function (latlng) {
							bounds.extend(latlng);
						});
					});
					map.fitBounds(bounds);
					map.data.setStyle({ visible: true });
					map.data.setStyle(function (feature) {
						return {
							fillColor: feature.getProperty('fill'),
							fillOpacity: feature.getProperty('fill-opacity'),
							strokeWeight: 0,
						};
					});
					circle()

				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					alert(XMLHttpRequest.status + '\n' + XMLHttpRequest.readyState + '\n' + textStatus + '\n' + XMLHttpRequest.responseText);
					// alert(XMLHttpRequest.status);
					// alert(XMLHttpRequest.readyState);
					// alert(textStatus);
					// alert(XMLHttpRequest.responseText);
				},
			});
		}


	});

});



function circlesearch() {                               //圈選方塊預測 PS:因為本來是圓形所以命名都是circle
	clearL();
	document.getElementById("latlng").innerHTML = "";
	map.data.forEach(function (feature) {
		map.data.remove(feature);
	});
	if (typeof marker !== 'undefined') {
		marker.setMap(null)
	}
	if (first == 1) {
		//document.querySelector('#geojson').innerHTML = "關閉分色圖";
		//document.getElementById('geojson').disabled=true;
	}
	if (markers != null) {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers = [];
	}

	var cover = new Array();
	var short_ID = 0;
	var short_score;
	var score_av = 0;
	c = circlearea.getBounds();
	rac_bottomlat = c.getSouthWest().lat()
	rac_uplat = c.getNorthEast().lat()
	rac_leftlng = c.getSouthWest().lng()
	rac_rightlng = c.getNorthEast().lng()

	for (var i = 0; i < area_coordinate.length; i++) {                      //找出與圈選方塊有重疊之GRID
		for (k = 0; k < 4; k++) {
			grid_lng = area_coordinate[i][0][k][0]
			grid_lat = area_coordinate[i][0][k][1]
			if ((rac_leftlng <= grid_lng && grid_lng <= rac_rightlng) && (rac_bottomlat <= grid_lat && grid_lat <= rac_uplat)) {
				cover.push(area_properties[i].All_id)

				break
			}
		}

	}
	total_number = cover.length
	if (cover.length == 0) { alert("範圍中無grid存在") }
	console.log(cover)
	cleanmap()
	setTimeout(function () {
		//your code to be executed after 1 second
		details.forEach((detail) => {
			detail.removeAttribute("open");
		});
		alert("儲存成功")
	}, 100);
}




var rad = document.getElementsByName("select_mode");    //點擊radio

for (var i = 0; i < rad.length; i++) {
	rad[i].addEventListener('click', function () {
		if (this.value == 'mapclick') {
			cleanmap()
			mapclick = 1
		}
		else if (this.value == 'enteraddr') {
			cleanmap()
			mapclick = 2
		}
		else {
			cleanmap()
			mapclick = 0
		}
		if (this.value == 'now') {
			marker = new google.maps.Marker({
				position: { lat: 22.991915, lng: 120.184974 },
				map: map,
				icon: {
					url: 'https://img.icons8.com/plasticine/2x/street-view.png',
					scaledSize: new google.maps.Size(60, 60)
				}

			});
			map.setZoom(15);
			map.panTo({ lat: 22.991915, lng: 120.184974 })
		}

		document.getElementById('address').value = "";
	})
}





var rad1 = document.getElementsByName("select_mode1");    //點擊radio

for (var i = 0; i < rad1.length; i++) {
	rad1[i].addEventListener('click', function () {
		if (this.value == 'mapclick') {
			cleanmap()
			mapclick = 1
		}
		else {
			cleanmap()
			mapclick = 0
		}
		if (this.value == 'now') {
			marker = new google.maps.Marker({
				position: { lat: 22.991915, lng: 120.184974 },
				map: map,
				icon: {
					url: 'https://img.icons8.com/plasticine/2x/street-view.png',
					scaledSize: new google.maps.Size(60, 60)
				}
			});
			map.setZoom(15);
			map.panTo({ lat: 22.991915, lng: 120.184974 })
		}
		document.getElementById('address').value = "";
	})
}



function selectWeight() {                                //預測
	a = 0
	if (a == 1) { alert("請選擇區域選取方式"); return; }
	cleanmap();
	if (a == 0) {                                        //依城市
		// if ($("#selectWeight").val() != null) {
		let weightData = [];
		weightData.push($("#weight1").val());
		weightData.push($("#weight2").val());
		weightData.push($("#weight3").val());
		weightData.push($("#weight4").val());
		weightData.push($("#weight5").val());
		weightData.push($("#weight6").val());
		console.log('chosen weight is', weightData);

		$.ajax({
			url: "/get_grid",
			data: {
				"mydata": $("#selectWeight").val(),
				"myweights": JSON.stringify(weightData)
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

				showlist("#latlng");
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
				document.getElementById('time-slider').value = 0;

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






//定義元素用的html模板，{{名稱}}代表要套入的地方
var item_html = "<ul id={{id}} class='points'><div class='latlng'>{{latlng}}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div><div id={{del_id}} data-delid={{del_item_id}} class='del_btn'>?</div><br><div class='latlng'>{{latlng1}}</ul>";
//刪除並重新產生清單中所有項目
function showlist(id_name) {                              //將清單顯示於頁面
	if (id_name == "#latlng2") {
		$(id_name).html("");
		$(id_name).append(current_item_html)
	}
	else { $(id_name).html(""); }
	//把每個項目做出來
	for (var i = 0; i < points_list.list.length; i++) {
		var item = points_list.list[i];
		var item_id = "point_" + i;
		var del_item_id = "del_" + i;

		//取代模板位置成資料replace(要取代的,取代成...)
		var current_item_html =
			item_html.replace("{{id}}", i + 1)
				.replace("{{latlng}}", item.latlng)
				.replace("{{latlng1}}", item.latlng1)
				.replace("{{del_id}}", del_item_id)
				.replace("{{del_item_id}}", i);

		$(id_name).append(current_item_html);
		$("#" + del_item_id).click(function () {                                   //點擊清單後按鈕
			//remove_item(parseInt($(this).attr("data-delid")));
			//del();
			if (typeof marker !== 'undefined') {
				marker.setMap(null)
			}
			var a = -1
			var TheID = points_list.list[$(this).attr("data-delid")].points.ID
			var Thenumber = parseInt($(this).attr("data-delid")) + 1
			map.setCenter(points_list.list[$(this).attr("data-delid")].points.center);
			map.setZoom(14);
			marker = new google.maps.Marker({
				position: points_list.list[$(this).attr("data-delid")].points.center,
				map: map,
				//label:Thenumber.toString()
			});

		});
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







function cleanmap() {
	clearL();
	if (marker != null) {
		marker.setMap(null)
	}
	document.getElementById("latlng").innerHTML = "";                      //清除評分清單
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
function cleanradio() {                                     //重製radio button
	var optobj = document.getElementsByName("select_mode");
	for (i = 0; i < optobj.length; i++) {
		optobj.item(i).checked = false;
	}
	cleanmap()
}


function placeMarkerAndPanTo2(latLng, map) {
	marker = new google.maps.Marker({
		position: latLng,
		map: map
	});
	map.panTo(latLng);
	var point = latLng;
	lat = latLng.lat();
	lng = latLng.lng();
	// document.getElementById('address').value=lat+","+lng;
}


function clearL() {
	if (points_list.list != null) {
		points_list.list.length = 0;
	}
}


function get_f(ID) {                                   //查看外部資料
	var w = window.open('');
	$.ajax({
		url: '/new',
		data: { "area": $("#selectWeight").val(), "city_grid_ID": city_grid_ID },
		success: function (data) {
			w.location = data;
		}
	});
}


function cleanradio() {                                     //重製radio button
	var optobj = document.getElementsByName("select_mode");
	for (i = 0; i < optobj.length; i++) {
		optobj.item(i).checked = false;
	}
	cleanmap()
}

function openPostWindow(url, data, name)             //以POST開啟新分頁
{
	var tempForm = document.createElement("form");
	tempForm.id = "tempForm1";
	tempForm.method = "post";
	tempForm.action = url;
	tempForm.target = name;    // _blank - URL加载到一个新的窗口

	var hideInput = document.createElement("input");
	hideInput.type = "hidden";
	hideInput.name = "content";
	hideInput.value = data;
	tempForm.appendChild(hideInput);
	// 可以传多个参数
	/* var nextHideInput = document.createElement("input");
	nextHideInput.type = "hidden";
	nextHideInput.name = "content";
	nextHideInput.value = data;
	tempForm.appendChild(nextHideInput); */
	if (document.all) {    // 兼容不同浏览器
		tempForm.attachEvent("onsubmit", function () { });        //IE
	} else {
		tempForm.addEventListener("submit", function () { }, false);    //firefox
	}
	document.body.appendChild(tempForm);
	if (document.all) {    // 兼容不同浏览器
		tempForm.fireEvent("onsubmit");
	} else {
		tempForm.dispatchEvent(new Event("submit"));
	}
	tempForm.submit();
	document.body.removeChild(tempForm);
}



function circle() {                     //產生圈選方塊 PS:因為本來是圓形所以命名都是circle
	if (circlearea) {
		circlearea.setMap(null);
	}
	var zoomLevel = map.getZoom();
	var zoomList = [{
		text: "10000KM",
		value: 10000 * 1000
	}, {
		text: "5000KM",
		value: 5000 * 1000
	}, {
		text: "2000KM",
		value: 2000 * 1000
	}, {
		text: "1000KM",
		value: 1000 * 1000
	}, {
		text: "500KM",
		value: 500 * 1000
	}, {
		text: "200KM",
		value: 200 * 1000
	}, {
		text: "200KM",
		value: 200 * 1000
	}, {
		text: "100KM",
		value: 100 * 1000
	}, {
		text: "50KM",
		value: 50 * 1000
	}, {
		text: "20KM",
		value: 20 * 1000
	}, {
		text: "10KM",
		value: 10 * 1000
	}, {
		text: "5KM",
		value: 5000
	}, {
		text: "2KM",
		value: 2000
	}, {
		text: "1KM",
		value: 1000
	}, {
		text: "500m",
		value: 500
	}, {
		text: "200m",
		value: 200
	}, {
		text: "200m",
		value: 200
	}, {
		text: "100m",
		value: 100
	}, {
		text: "50m",
		value: 50
	}, {
		text: "20m",
		value: 20
	}, {
		text: "10m",
		value: 10
	}, {
		text: "5m",
		value: 5
	}, {
		text: "2m",
		value: 2
	}, {
		text: "1m",
		value: 1
	}, {
		text: "1m",
		value: 1
	}, {
		text: "1m",
		value: 1
	}, {
		text: "1m",
		value: 1
	}];
	circlearea = new google.maps.Rectangle({
		center: map.getCenter(),
		map: map,
		bounds: {
			north: map.getCenter().lat() + zoomList[zoomLevel].value / 111000,
			south: map.getCenter().lat() - zoomList[zoomLevel].value / 111000,
			east: map.getCenter().lng() + zoomList[zoomLevel].value / 111000,
			west: map.getCenter().lng() - zoomList[zoomLevel].value / 111000
		},
		fillColor: '#FF6600',
		fillOpacity: 0.3,
		strokeColor: "#FF0000",
		strokeWeight: 0,
		editable: true,
		draggable: true
	});
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

function openWeights() {
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
