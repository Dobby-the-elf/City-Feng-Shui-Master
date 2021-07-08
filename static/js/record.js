$(document).ready(function(){
	$.ajax({
					url:"/get_record",
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
var item_html="<tr><td>{{event_id}}</td><td>{{report_time}}</td><td>{{event_type}}</td><td>{{detail}}</td><td>{{address}}</td><td>{{state}}</td><td>{{update_time}}</td></tr>"
function showlist(data){                              //將清單顯示於頁面
	
	

	//把每個項目做出來
	for(var i=0;i<data.features.length;i++){

		if (data.features[i].state=="誤報"){font_color="#B3001f"}
		else if (data.features[i].state=="資訊不足"){font_color="#B3001f"}
		else if (data.features[i].state=="已處理"){font_color="#2200b3"}
		else {font_color="black"}
		//取代模板位置成資料replace(要取代的,取代成...)
		var current_item_html=
			item_html.replace("{{event_type}}","<font color='black'>"+data.features[i].event_type+"</font>")
						.replace("{{event_id}}","<font color='black'>"+data.features[i].event_id+"</font>")
					 .replace("{{detail}}","<font color='black'>"+data.features[i].detail+"</font>")
					 .replace("{{address}}","<font color='black'>"+data.features[i].address+"</font>")
					 .replace("{{state}}","<font color="+font_color+">"+data.features[i].state+"</font>")
					 .replace("{{report_time}}","<font color='black'>"+data.features[i].report_time+"</font>")
					 .replace("{{update_time}}","<font color='black'>"+data.features[i].update_time+"</font>")
	


		$(record).append(current_item_html);
	
	}
}