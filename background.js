var all_labels = new Array;
var current_url, current_title;
var google_bookmark_xml = "http://www.google.com/bookmarks/?output=xml&num=100000";
var google_bookmark_add = "http://www.google.com/bookmarks/mark?op=edit&output=popup";
var load_ready = false;
var last_error = "";
var labels_html ="";
var bookmarks_html = "";
var current_label = "";

function LoadBookmark()
{
	console.log('start load bookmark...');
	load_ready = false;
	last_error = "";
	all_labels = new Array;
	$.get(google_bookmark_xml, function(data){
		if (data=="")
			last_error = "Retrieve bookmarks error.";
		else
			ProcessGoogleBookmark(data);
		load_ready = true;
		console.log('load finished.' + last_error);
	});
}
function ProcessGoogleBookmark(bookmarksHtml){
	$(bookmarksHtml).find("bookmark").each(function(){
		var a_bookmark = $(this);
		var labels = a_bookmark.find("label");
		var title = a_bookmark.find("title:first").text();
		var href = a_bookmark.find("url:first").text();
		
		if (labels.length==0){
			AddLabel('[empty]', {title:title, href:href} );
			AddLabel('[ALL]', {title:title, href:href});
		}
		else {
		    var ss = new Array;
			labels.each(function(){
				AddLabel('['+$(this).text()+']', {title:title, href:href});
				ss.push($(this).text());
			});
			AddLabel('[ALL]', {title:title + " <i>["+ ss.join(",")  +"]</i>", href:href});
		}

	});
  all_labels.sort(SortLabel);
	all_labels[all_labels.length-1].bookmarks.sort(SortBookmark);
	labels_html = LabelsHtml();
}

function AddLabel(label, bookmark){
	var lb = null;
	// search if the label exist.
	for (var i=0; i<all_labels.length; i++){
		if (all_labels[i].label == label ){
			lb = all_labels[i];
			break;
		}
	}
	// add new label
	if (lb==null){
		lb = new Object;
		lb.label = label;
		lb.bookmarks = new Array();
		all_labels.push(lb);
	}
	// save bookmark
	lb.bookmarks.push(bookmark);
}
// bookmark label object compare function
function SortLabel(a,b){
	if (a.label == "[empty]" || b.label == "[ALL]" )
		return -1;
	if (a.label == "[ALL]" || b.label == "[empty]" )
		return 1;
	if (a.label > b.label)
		return 1;
	else if (a.label == b.label)
		return 0;
	else
		return -1;
}
// bookmark label object compare function
function SortBookmark(a,b){
	if (a.title > b.title)
		return 1;
	else if (a.title == b.title)
		return 0;
	else
		return -1;
}

function LabelsHtml(){
	var s = new Array;
	for(var i=0; i<all_labels.length; i++){
		s.push( "<div class='f' id='"+ i  +"' onclick='labelClick(this);'>" + all_labels[i].label+"</div>");
	}
	s.push( "<div class='clear'></div>");
	return s.join("");
}

function SetCurrentLabel(labelID){
  var lb = all_labels[labelID];
	var s = new Array;
	s.push("<ul type='disc'>");
	for (var i=0; i<lb.bookmarks.length; i++){
		s.push("<li><a href='"+ lb.bookmarks[i].href +"' target='bookmark'>"+ lb.bookmarks[i].title  +"</a></li>");
	}
	s.push("</ul>");
	current_label = lb.label;
	bookmarks_html = s.join("");
}

$(function(){
	LoadBookmark();
});
