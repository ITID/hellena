// JavaScript Document
var PageProp = {};
PageProp.Functions = {};
PageProp.Objects = {};
PageProp.iioc = {};
PageProp.Desktop = {};
PageProp.MenuCategories = {};
PageProp.MenuElements = {};
PageProp.ContextMap = {};
$(function(){

PageProp.Desktop.width = $(window).width();
PageProp.Desktop.height = $(window).height();
PageProp.Desktop.content = PageProp.Desktop.height-40;

console.log("Desktop width: "+PageProp.Desktop.width);
console.log("Desktop height: "+PageProp.Desktop.height);
console.log("Work height: "+PageProp.Desktop.content);

	PageProp.Functions.LoadJSON = function(url) {
		var oRequest = new XMLHttpRequest();
		oRequest.open('GET', url, false);
		oRequest.send(null);
		var tmp = oRequest.responseText
		return JSON.parse(tmp);
	};

//Base type
function obj_template(){
	this.id = null;
	this.type = "obj_template";
	this.title = "Empty Title";	
	
	this.CreateObject = function(id, title){
		if(typeof(id)!==undefined)this.id = id;
		if(typeof(title)!==undefined)this.title = title;	
	}

	this.GetTitle = function(){
		return this.title;	
	}

	this.GetID = function(){
		return this.id;	
	}

	this.GetType = function(){
		return this.type;	
	}

	this.SetID = function(id){
		this.id = id;
	}

	this.SetTitle = function(title){
		this.title = title;
	}
}



//base window class
function hellena_window(){
	obj_template.call(this);
	this.title = "New Window";
	this.type = "std_window";
	this.content_url = "#";
	this.width = 600;
	this.height = 400;
	this.is_opened = true;
	this.is_maximised = false;
	this.taskbar = null;
	this.int_object = null;
	this.constructor = function(){
		
	}
	this.InitialObject = function(title, id, url, width, height, is_opened){
		if(typeof(title)!=="undefined" && title!==null)this.title = title;
		if(typeof(id)!=="undefined" && id!==null)this.id = id;
		if(typeof(url)!=="undefined" && url!==null)this.content_url = url;
		if(typeof(width)!=="undefined" && width!==null)this.width = width;
		if(typeof(height)!=="undefined" && height!==null)this.height = height;
		if(typeof(is_opened)!=="undefined" && is_opened!==null)this.is_opened = is_opened;
		this.CreateObject();
		this.taskbar = new taskbar_window();
		this.taskbar.InitialObject(this.title, this.id);
	}
	this.CreateObject = function(){
		window_code = "<div class='window' data-win_id='"+this.id+"' context>";
		window_code+= "<div class='window_top' data-context='window'>";
		window_code+= "<li class='ui-state-default ui-corner-all buttons' internall_command='close'><span class='ui-icon ui-icon-closethick'></span></li>";
		window_code+= "<li class='ui-state-default ui-corner-all buttons' internall_command='minimize'><span class='ui-icon ui-icon-triangle-1-n'></span></li>";
		window_code+= "<li class='ui-state-default ui-corner-all buttons' internall_command='maximize'><span class='ui-icon ui-icon-extlink'></span></li>";
		window_code+= "<li class='window_title'>"+this.title+"</li></div>";	
		window_code+= "<div class='window_content'></div></div>";
		$("#desktop_content").append(window_code);
		this.int_object = $("div[data-win_id="+this.id+"]");
		$(this.int_object).css('width',this.width);
		$(this.int_object).css('height',this.content);
		$(this.int_object).draggable();
		$(this.int_object).resizable();
		$(this.int_object).addClass("ui-widget-content");
	}
	
	this.HideShow = function(){
		if(this.is_opened){
			$(this.int_object).hide(200);
			this.taskbar.MinMaxObject();
			this.is_opened = false;
		}
		else{
			$(this.int_object).show(200);
			this.taskbar.MinMaxObject();
			this.is_opened = true;
		}
	}

	this.SetPageURL = function(url){
		this.content_url = url;
	}
	
	this.LoadContent = function(){
		$(this.int_object).find(".window_content").load(this.content_url);
	}
	
	this.DoAction = function(command, args){
		switch(command){
			case 'close':{
				this.taskbar.DoAction(command);
				$("div[data-win_id="+this.id+"]").remove();
				delete(PageProp.Objects[this.id]);
				break;
			}
			case 'minimize':{
				this.HideShow();
				break;
			}
			case 'maximize':{
				this.MinMaxWindow();
				break;
			}
			default:{
				break;
			}
		}
	}

	this.MinMaxWindow = function(){
		if(this.is_maximised){
			$(this.int_object).removeClass("window_maximized");
			$(this.int_object).addClass("window_minimized");
			$(this.int_object).css('width',this.width);
			$(this.int_object).css('height',this.height);
			this.is_maximised = false;
		}
		else{
			$(this.int_object).removeClass("window_minimized");
			$(this.int_object).addClass("window_maximized");
			$(this.int_object).css('width',"100%");
			$(this.int_object).css('height',PageProp.Desktop.content);
			this.is_maximised = true;
		}
	}

}

function taskbar_window(){
	obj_template.call(this);
	this.type = "taskbar_window";
	this.is_opened = true;
	this.title = "New Taskbar window";
	this.int_object = null;
	
	this.constructor = function(){
	}
	
	this.InitialObject = function(title, id, is_opened){
		if(typeof(title)!=="undefined")this.title = title;
		if(typeof(id)!=="undefined")this.id = id;
		if(typeof(is_opened)!=="undefined")this.is_opened = is_opened;
		this.CreateObject();

	}
	
	this.CreateObject = function(){
		var dom =  '<div class="taskbar_window active" win_id="'+this.id+'" data-context="taskbar-window">';
		dom+= '<span>'+this.title+'</span></div>';
		$("#sitebar").append(dom);
		this.int_object = $("#sitebar div[win_id="+this.id+"]");
		$(this.int_object).addClass("taskbar_window.active");
	}
	
	this.DoAction = function(command, args){
		switch(command){
			case 'close':{
				$(this.int_object).remove();
				break;
			}
			default:{
				break;
			}
		}
	}
	
	this.MinMaxObject = function(){
		if(this.is_opened){
			$(this.int_object).removeClass("active");
			this.is_opened = false;
		}
		else{
			$(this.int_object).addClass("active");
			this.is_opened = true;
		}
	}


	
}

function menu(){
	this.is_opened = false;
	this.int_object = null;

	this.CreateMenu = function(){
		var dom = '<div id="menu_icon" data-context="menu"><img src="res/menu2.png" class="menu_icon"><div id="menu" class="is_closed"><div id="menu_categories"></div><div id="menu_elements"></div></div></div>';
		$(dom).appendTo("#sitebar");
		this.int_object = $("#menu");
	}

	this.CloseOpenMenu = function(){
		if(this.is_opened){
			$(this.int_object).removeClass("is_opened");
			$(this.int_object).addClass("is_closed");
			this.is_opened = false;
		}
		else{
			$(this.int_object).removeClass("is_closed");
			$(this.int_object).addClass("is_opened");
			this.is_opened = true;
		}
	}

	this.CloseIf = function(){
		$(this.int_object).removeClass("is_opened");
		$(this.int_object).addClass("is_closed");
		this.is_opened = false;

	}
}

PageProp.Functions.GetElemCount = function(obj){
	type = typeof(obj);
//	if(type!="object" || obj==null)return 0;
	i = 0;
	for(x in PageProp.Objects)i++;
	return i;	
}

PageProp.Menu = new menu;
PageProp.Menu.CreateMenu();

function MenuCategory(){
	obj_template.call(this);
	this.id = null;
	this.type = "menu_category";
	this.title = "Empty category";
	this.menu_img = "res/icons/def.png";
	this.menu_command = "open_window";
	this.menu_args = {};

	this.constructor = function(){}

	this.InitialObject = function(id, title, menu_img, menu_command, menu_args){
		this.id = id;
		this.title = title;
		this.menu_img = menu_img;
		this.menu_command = menu_command;
		this.menu_args = menu_args;
		var dom = '<div class="menu_category" data-cat-id="'+this.id+'"><img src="'+this.menu_img+'"><h4>'+this.title+'</h4></div>';
		$(dom).appendTo("#menu_categories");

	}

	this.DoAction = function(){
		switch (this.menu_command){
			case 'open_window':{
				PageProp.Functions.CreateWindow(this.menu_args['title'],this.menu_args['id'],this.menu_args['content_url']);
				break;
			}
			case 'load_submenu':{
//				alert("Try do: ");
				PageProp.Functions.LoadMenuElements(this.id);
				break;
			}
			default:{
				alert("Required unknown command for this type: "+this.menu_command);
				break;
			}
		}
	}
}

PageProp.Functions.LoadMenuElements = function(p_id){
	$("#menu_elements *").remove();
	$.each(PageProp.MenuElements, function(index){
		PageProp.MenuElements[index].ShowIF(p_id);
	})
}

$(document).on("click", ".menu_category", function(){
	var attr = $(this).attr('data-cat-id');
	PageProp.MenuCategories[attr].DoAction();
})


function MenuElement(){
	MenuCategory.call(this);
	this.ParentID = null;

	this.constructor = function(){}
	this.InitialObject = function(parent_id, id, title, menu_img, menu_command, menu_args){
		this.ParentID = parent_id;
		this.id = id;
		this.title = title;
		this.menu_img = menu_img;
		this.menu_command = menu_command;
		this.menu_args = menu_args;
	}

	this.ShowInMenu = function(){
		var dom = '<div class="menu_element" data-elem-id="'+this.id+'"><img src="'+this.menu_img+'" alt="'+this.title+'"></div>';
		$(dom).appendTo("#menu_elements");
	}

	this.ShowIF = function(p_id){
		if(p_id==this.ParentID){
			this.ShowInMenu();
			return true;
		}
		return false;
	}

	this.DoAction = function(){
		switch (this.menu_command){
			case 'open_window':{
				PageProp.Functions.CreateWindow(this.menu_args['title'],this.menu_args['id'],this.menu_args['content_url']);
				PageProp.Objects[this.menu_args['id']].LoadContent();
				break;
			}
			default:{
				alert("Requested unknown command, specify action: "+this.menu_command);
				break;
			}
		}
	}
}
PageProp.Functions.CreateMenuCategory = function(id, title, menu_img, menu_command, menu_args){
	PageProp.MenuCategories[id] = new MenuCategory();
	PageProp.MenuCategories[id].InitialObject(id, title, menu_img, menu_command, menu_args);
}
PageProp.Functions.CreateMenuElement = function(parent_id, id, title, menu_img, menu_command, menu_args){
	PageProp.MenuElements[id] = new MenuElement();
	PageProp.MenuElements[id].InitialObject(parent_id, id, title, menu_img, menu_command, menu_args);
}


PageProp.Functions.CreateWindow = function(title, id, url, width, height, is_opened){
	if(id===null || id==="" || id==="false" || typeof(id)==="undefined")id = PageProp.Functions.GetElemCount()+1;
	if(id in PageProp.Objects)return false;
	PageProp.Objects[id] = new hellena_window;
	PageProp.Objects[id].InitialObject(title, id, url, width, height, is_opened);
	return true;
}

$(document).on("click", ".taskbar_window", function(){
	var attr = $(this).attr("win_id");
	PageProp.Objects[attr].HideShow();
})

$(document).on("mouseover", ".taskbar_window", function(){
	var attr = $(this).attr("win_id");
	$("div[data-win_id="+attr+"]").addClass("box-shadowed");
		$("div[data-win-id="+attr+"]").hide();
})

$(document).on("mouseout", ".taskbar_window", function(){
	var attr = $(this).attr("win_id");
	$("div[data-win_id="+attr+"]").removeClass("box-shadowed");
})

$(document).on("click", ".buttons",function(){
	var command = $(this).attr("internall_command");	
	var id = $(this).closest(".window").attr("data-win_id");
	PageProp.Objects[id].DoAction(command);
})

$(document).on("click", "#menu_icon", function(event){
		var adr = event.target.className;
		if(adr=="menu_icon"){
			PageProp.Menu.CloseOpenMenu();
		}
})

	$(document).on("click", ".window", function(){
		var attr = $(this).attr("data-win_id");
		$(".window").css("z-index",0);
		$("div[data-win_id='"+attr+"']").css("z-index", 5555);
	})

	$(document).on("click", "#menu_icon *", function(event){
//FIXME: Nothing to change
	})

	$(document).on("click",".menu_element", function(){
		var atr = $(this).attr('data-elem-id');
		console.log("Try this: "+atr);
		PageProp.MenuElements[atr].DoAction();
		PageProp.Menu.CloseOpenMenu();
	})

	$(document).on("click", ".window a", function(event){
		event.preventDefault();
		var url = $(this).attr("href");
		var win_id = $(this).closest(".window").attr("data-win_id");
		PageProp.Objects[win_id].SetPageURL(url);
		PageProp.Objects[win_id].LoadContent();
	})

	PageProp.Functions.MinMaxWindow = function(id){
		PageProp.Objects[id].MinMaxWindow();
	}

	$(document).on("dblclick", ".window_top", function(){
		var id = $(this).closest(".window").attr("data-win_id");
		PageProp.Functions.MinMaxWindow(id);
	})

	$(document).on("contextmenu","*[data-context]", function(e){
		e.stopPropagation();
		var cont_type = $(this).attr("data-context");
		var dom = PageProp.ContextMap.GetDOM(cont_type);
		if(dom!==false){
			$(this).append(dom);
		}
		return false;
	})

	$(document).on("click", ".contextMenu li", function(){
		var obj = $(this).closest("div[data-context]");
		var parent_obj = $(this).closest("div[context]");
		var obj_type = $(obj).attr('data-context');
		var int_command = $(this).attr('data-internall-command');
		console.log("Doing "+int_command+" on type "+obj_type);
		switch (obj_type){
			case 'window':{
				var win_id = $(parent_obj).attr('data-win_id');
				PageProp.Objects[win_id].DoAction(int_command);
				break;
			}
			default:{
				alert("Unknow source of context was gated.");
				break;
			}
		}
	})

	function ContextMenu(){
		this.url = "jsons/context.json";
		this.context_map = {};
		this.constructor = function(url){
			if(typeof(url)!="undefined")this.url = url;
			this.context_map = PageProp.Functions.LoadJSON(this.url);
			console.log(this.context_map);
		}
		this.LoadContextMap = function(url){
			if(typeof(url)!="undefined")this.url = url;
			this.context_map = PageProp.Functions.LoadJSON(this.url);
			console.log(this.context_map);
		}

		this.GetDOM = function(c_class){
			if(c_class in this.context_map){
				var str = '<div class="contextMenu">';
				$.each(this.context_map[c_class], function(index, value){
					str+='<li class="context_element" data-internall-command="'+value+'">';
					str+=index+'</li>';
				})
				str+='</div>';
				return str;
			}
			return false;
		}
	}

	$(document).on("click", "*:not(.context_element)", function(e){
		$(".contextMenu").remove();
		console.log("Clicked any where");
	})

	$(document).on("click", "#desktop_content", function(e){
		PageProp.Menu.CloseIf();
	})


	PageProp.ContextMap = new ContextMenu();
	PageProp.ContextMap.LoadContextMap();
	$F = PageProp.Functions;

})

