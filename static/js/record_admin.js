get_event_id=[]
$(document).ready(function(){
	$.ajax({
					url:"/get_record_admin",
					success:function(data){
								
							showlist(data)	
								
							
								
								},

					error: function(XMLHttpRequest, textStatus, errorThrown) {
								alert(XMLHttpRequest.status);
								alert(XMLHttpRequest.readyState);
								alert(textStatus);
								alert(XMLHttpRequest.responseText);
							}
				});
});



//刪除並重新產生清單中所有項目
var item_html="<tr><td>{{event_id}}</td><td>{{report_time}}</td><td>{{event_type}}</td><td>{{detail}}</td><td>{{address}}</td><td>{{reporter}}</td><td>{{update_time}}</td><td><select name='stateselect_{{event_id}}' id='Selectstate_{{event_id}}'><option value='處理中' selected>處理中</option><option value='已處理'>已處理</option><option value='誤報'>誤報</option><option value='資訊不足'>資訊不足</option></select></td></tr>"
function showlist(data){                              //將清單顯示於頁面
	
	

	//把每個項目做出來
	for(var i=0;i<data.features.length;i++){

		get_event_id.push(data.features[i].event_id)
		//取代模板位置成資料replace(要取代的,取代成...)
		var current_item_html=
			item_html.replace("{{event_type}}","<font color='black'>"+data.features[i].event_type+"</font>")
			.replace("{{event_id}}","<font color='black'>"+data.features[i].event_id+"</font>")
			.replace("{{event_id}}",data.features[i].event_id)
			.replace("{{event_id}}",data.features[i].event_id)
					 .replace("{{detail}}","<font color='black'>"+data.features[i].detail+"</font>")
					 .replace("{{address}}","<font color='black'>"+data.features[i].address+"</font>")
					 .replace("{{reporter}}","<font color='black'>"+data.features[i].reporter+"</font>")
					 .replace("{{report_time}}","<font color='black'>"+data.features[i].report_time+"</font>")
					 .replace("{{update_time}}","<font color='black'>"+data.features[i].update_time+"</font>")
					.replace("{{update_time}}","<font color='black'>"+data.features[i].update_time+"</font>")


		$(record).append(current_item_html);
	
	}
	if (data.features.length!=0){
	$(record).append('<button class="button" id="save_w" onclick="save()">儲存</button>');
	$(record).append('<button class="button" id="cancel_w" onclick="cancel()">取消</button>');
	}
						
}

function save(){ 
	var update_已處理 = []
	var update_誤報 = []
	var update_錯誤 = []
	for(var i=0;i<get_event_id.length;i++){
		
		div="#Selectstate_"+String(get_event_id[i])
		state_update=$(div).val()
		id_update=String(get_event_id[i])
		if (state_update=="已處理"){update_已處理.push(id_update)}
		else if  (state_update=="資訊不足"){update_錯誤.push(id_update)}
		else if  (state_update=="誤報"){update_誤報.push(id_update)}
	}
	$.ajax({
			url:"/save_update",
			type:'post',
			contentType: "application/json; charset=utf-8",
			data:JSON.stringify({"update_錯誤": update_錯誤,"update_誤報":update_誤報,"update_已處理":update_已處理}),
			success:function(data){
				alert("更改成功")
				window.location.reload();
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
						alert(XMLHttpRequest.status);
						alert(XMLHttpRequest.readyState);
						alert(textStatus);
					},
		});
}
function cancel(){ 
	window.location.reload();
}

