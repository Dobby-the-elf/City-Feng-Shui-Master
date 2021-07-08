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

points_list.list = [];



$(document).ready(function () {
	var burger = $('.pullbtn');             //三條線
	var menu = $('.panel');                 //側欄
	burger.click(function () {                //點擊三條線                           位移為css hover
		document.getElementById("clickme").style.opacity = "0";
		burger.toggleClass('pullbtn_open');
		menu.toggleClass('menu--open');
	});
});

var modal = document.getElementById("modal");
function openModal() {//打開權重設定視窗
	modal.classList.add("display");
	setTimeout(function () {
		modal.classList.add("transition");
	}, 20);//20milliseconds
}
function closeModal() {//關掉權重設定視窗
	modal.classList.remove("transition");
	setTimeout(function () {
		modal.classList.remove("display");
	}, 300);//300milliseconds

}

function save_w() {   //儲存權重
	var err = 0
	id = document.getElementById("user_id1").value
	pw = document.getElementById("password1").value
	pw_again = document.getElementById("password_again1").value
	if (id == "") { err = 1 }
	else if (pw == "") { err = 1 }
	else if (pw_again == "") { err = 1 }
	else if (pw_again != pw) { err = 2 }

	temp = parseFloat(id)
	if ((temp <= 0 || (temp % 1) != 0) || (id.length != 10)) {
		err = 4
	}

	if (err == 0) {
		$.ajax({
			url: "/new_id",
			type: 'post',
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify({ "id": id, "pw": pw }),
			success: function (data) {
				if (data == "success") {
					alert("建立成功")
					closeModal()
				}
				else {
					alert("此號碼已經被註冊")
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
				alert(textStatus);
			},
		});


	}
	else if (err == 1) { alert("請填完所有項目") }
	else if (err == 2) { alert("密碼不一致") }
	else if (err == 4) { alert("請輸入手機號碼") }
}
function cancel_w() {    //離開權重視窗，不存
	closeModal()

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
		data: { "area": $("#SelectArea").val(), "city_grid_ID": city_grid_ID },
		success: function (data) {
			w.location = data;
		}
	});
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