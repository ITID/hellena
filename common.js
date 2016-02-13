// JavaScript Document
$(document).ready(function(e) {
    

PageProp = {};
PageProp.Desktop = {};
PageProp.Windows = {};	
PageProp.Functions = {};
PageProp.Taskbar_windows = {};
PageProp.int_iron_case = {};
iioc = PageProp.int_iron_case;
PageProp.Desktop.width = $(document).width();
PageProp.Desktop.height = $(document).height();
PageProp.Desktop.work_height = PageProp.Desktop.height-80;
$("#desktop_content").css('height',(PageProp.Desktop.height-80));

/*
 * Class Wndow and his methods
 * Autor: Rafik ushanian
 */
function Window(){
	this.width = 600;
	this.height = 400;
	this.title = "Empty Window";
	this.content = "#";
	this.win_id = "";
	this.is_maximized = false;
}

Window.prototype.SetWindowParametres = function(width, height){
	this.width = width;
	this.height = height;
}

Window.prototype.SetTitle = function(title){
	this.title = title;
}

Window.prototype.CreateWindow = function(win_id, title, content, width, height){
	this.win_id = win_id;
	this.title = title;
	this.content = content;
	this.width = width;
	this.height = height;
	window_code = "<div class='window' win_id='"+win_id+"'>";
	window_code+= "<div class='window_top'>";
	window_code+= "<li class='ui-state-default ui-corner-all buttons' internall_command='close'><span class='ui-icon ui-icon-closethick'></span></li>";
	window_code+= "<li class='ui-state-default ui-corner-all buttons' internall_command='minimize'><span class='ui-icon ui-icon-triangle-1-n'></span></li>";
	window_code+= "<li class='ui-state-default ui-corner-all buttons' internall_command='maximize'><span class='ui-icon ui-icon-extlink'></span></li>";
	window_code+= "<li class='window_title'>"+title+"</li></div>";	
	window_code+= "<div class='winow_content'></div></div>";
	$("#desktop_content").append(window_code);
	$("div[win_id="+win_id+"]").draggable();
	$("div[win_id="+win_id+"]").resizable();
	$("div[win_id="+win_id+"]").addClass("ui-widget-content");
	PageProp.Functions.CreateTaskbarWindow(win_id, title);
}

Window.prototype.Maximize = function(){
	if(this.ChangeMaximizedStatus()){
		$(".window[win_id="+this.win_id+"]").removeClass("window_minimized");
		$(".window[win_id="+this.win_id+"]").css('height',PageProp.Desktop.work_height);
		$(".window[win_id="+this.win_id+"]").addClass("window_maximized");
		
	}
	else{
		$(".window[win_id="+this.win_id+"]").removeClass("window_maximized");
		$(".window[win_id="+this.win_id+"]").addClass("window_minimized");
	}
}

Window.prototype.IsMaximized = function(){
	return this.is_maximized;
}

Window.prototype.ChangeMaximizedStatus = function(){
	if(this.is_maximized)this.is_maximized = false;
	else this.is_maximized = true;
	return this.is_maximized;
}

PageProp.Functions.CreateWindow = function(win_id, title, content, width, height){
	PageProp.Windows[win_id] = new Window();
	PageProp.Windows[win_id].CreateWindow(win_id, title, content, width, height);
}

PageProp.Functions.CloseWindow = function(win_id){
	delete(PageProp.Windows[win_id]);
	delete(PageProp.Taskbar_windows[win_id]);
	console.log("try to close window: "+win_id);
	$("div[win_id="+win_id+"]").hide(300);;
	
}

/*
 * End of Window dclaration
 * Declare jquery handlers of Window
 */
PageProp.Functions.DoCommand = function(command, win_id){
	switch(command){
		case 'close':{
			PageProp.Functions.CloseWindow(win_id);
			break;
		}
		case 'minimize':{
			PageProp.Functions.OpenHideWindow(win_id);
			break;
		}
		case 'maximize':{
			PageProp.Windows[win_id].Maximize();
			break;
		}
		default:{
			break;
		}
	}
}

$(".window").draggable();
$(".window").resizable();
$(".window").addClass("ui-widget-content");

/*
 * End of Window
 * Class taskbar_window for minimizing & maximizing windows
 */	
 
function taskbar_window(){
	this.title = "Empty taskbar window";
	this.win_id = null;	
	this.is_opened = true; 
}
 
taskbar_window.prototype.GetTitle = function(){ return this.title; }
taskbar_window.prototype.GetWinID = function(){ return this.win_id; } 
taskbar_window.prototype.SetArguments = function(win_id, title){ 
	this.win_id = win_id;
	this.title = title;
}

taskbar_window.prototype.CreateObject = function(win_id, title){
	this.win_id = win_id;
	this.title = title;
	var dom =  '<div class="taskbar_window" win_id="'+win_id+'">';
		dom+= '<span>'+title+'</span></div>';
	return dom;	
}

taskbar_window.prototype.OpenHideWindow = function(){
	if(this.is_opened){
		//hide window
		this.is_opened = false;
		$("#desktop_content .window[win_id="+this.win_id+"]").hide(300);
		$("#sitebar .taskbar_window[win_id="+this.win_id+"]").removeClass("active");
	}
	else{
		//show window
		this.is_opened = true;
		$("#desktop_content .window[win_id="+this.win_id+"]").show(300);
		$("#sitebar .taskbar_window[win_id="+this.win_id+"]").addClass("active");
	}
}
PageProp.Functions.CreateTaskbarWindow = function(win_id, title){
	PageProp.Taskbar_windows[win_id] = new taskbar_window();
	var res = PageProp.Taskbar_windows[win_id].CreateObject(win_id, title);
	$("#sitebar").append(res);
	$("#sitebar div[win_id="+win_id+"]").addClass("taskbar_window.active");

}


PageProp.Functions.OpenHideWindow = function(win_id){
	PageProp.Taskbar_windows[win_id].OpenHideWindow(win_id);	
}

 // ----
$(document).on("click", "*[internall_command]",function(){
	var command = $(this).attr('internall_command');
	var win_id = $(this).parent(this).parent(this).attr('win_id');	
	PageProp.Functions.DoCommand(command, win_id);
});

$(document).on("click", ".taskbar_window", function(){
	win_id = $(this).attr('win_id');
	PageProp.Functions.OpenHideWindow(win_id);
		
});

$(document).on("click", ".window .window_top", function(){
	console.log("Change z-index on window");
	$(".window").css('z-index',500);
	$(this).parent().css('z-index',9998);
		
});

/*
 * Class menu
 */
 
 function menu(){
	this.is_opened = false;
	
 }
 
menu.prototype.CreateMenu = function(){
	var dom = '<div id="menu_icon"><img src="res/menu.png" class="menu_icon"><div id="menu" class="is_closed"></div></div>';
	$(dom).appendTo("#sitebar");
        	 
}

menu.prototype.CloseOpenMenu = function(){
	if(this.is_opened){
		this.is_opened = false;
		$("#menu").removeClass("is_opened");
		$("#menu").addClass("is_closed");
	}
	else{
		this.is_opened = true;
		$("#menu").removeClass("is_closed");
		$("#menu").addClass("is_opened");
	}
}

menu.prototype.CloseMenu = function(){
	this.is_opened = false;
	$("#menu").removeClass("is_opened");
	$("#menu").addClass("is_closed");
}

$(document).on("click", "#menu_icon", function(){
	PageProp.Menu.CloseOpenMenu();	
});


/*
 * Any global functions to use in syste,
 */
 PageProp.Functions.ReceiveDatas = function(int_id){
	 console.log(iioc[int_id]);
	 console.log(iioc[int_id]['com']);
 }
 
 PageProp.Functions.SendQuery = function(int_id, qu_url, argv){
	 var PrepArgv = argv;
//	 console.log("Send arguments: "+PrepArgv);
	 $.ajax({
		method:"POST",
 		url:qu_url,
		data:PrepArgv,
		success:function(ret){
//			console.log("Receivied as first step: "+ret);
			iioc[int_id] = JSON.parse(ret);
			PageProp.Functions.ReceiveDatas(int_id);
		}
	 }).fail(function(){
		console.log("There are some error");	 
	 });
 }


PageProp.Menu = new menu();
PageProp.Menu.CreateMenu();

$F = PageProp.Functions;

});