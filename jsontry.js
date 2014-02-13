//Initialize
$(document).ready(function() {
        //alert('function1');
        //document.addEventListener("deviceready", onDeviceReady, false);	
});
// Global variables
var lat, lon, latlon, mylocation;
var proxm, proxkm;
var totaloffers, offermarker;
var zoomlevel, dzoom, bounds, distance;
var zoomlevel2, dzoom2, bounds2, distance2;
var offerlatlon, olat, olon;
var jsonFile="offers.json";
var sortedoffer;
var userName, password;
var workID,password2;
var newItem, myObjectString1, myObjectString2, myObjectString3;
var jsonEmpsFile="employees.json";
var jsonEmpsFileTRY="names.json";
//document.getElementById("errM").style.display = "none";
//var errorMessage = document.getElementById("errM").style.display = "none";
totaloffers=0;
// PhoneGap is loaded and it is now safe to make calls 
//function onDeviceReady() {
////         iOS. BB. Android
//        alert('OnDeviceReady');
        loadScript(10,10000);
//        document.addEventListener("offline", onOffline, false);
//        document.addEventListener("online", onOnline, false);
//		  $.mobile.defaultPageTransition   = 'none';
//		  $.mobile.defaultDialogTransition = 'none';
//		  $.mobile.buttonMarkup.hoverDelay = 0;
//}
//function onOffline() {
//        //When device goes offline, throw an error
//        alert('onOffline');
//        onGetLocationError(4);
//}
//function onOnline() {
//        //When the device is back online, go to index
//        alert('onOnline');
//    $.mobile.changePage("#index");
//}

// Load the Google maps API script with zoom level and desired proximity
function loadScript(zl,pm) {
        //alert('Load Script');
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&v=3&libraries=geometry&callback=initialize&async=2";
  document.head.appendChild(script);
  // Any other stuff you want to do here?
}
// The callback function after loading the script
function initialize() {
        //alert('initialize');
        $.getScript("js/StyledMarker.js");        
        var geoOptions = {'enableHighAccuracy': true, 'timeout': 10000, 'maximumAge':60000};
        navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationError, geoOptions);
        // Any other stuff you want to do here?
}

function onGetLocationSuccess(position) {
        //alert('on get location success');
        lat=position.coords.latitude;
        lon=position.coords.longitude;
        latlon=new google.maps.LatLng(lat, lon);
        mapholder=document.getElementById('mapholder');
        mapholder.style.height='200px';
        mapholder.style.width=window.innerWidth;
        bounds = new google.maps.LatLngBounds(); // Required for zoom level and center
        var myOptions={
        zoom:zoomlevel,
        center:latlon,
        mapTypeControl:false,
        navigationControlOptions:{style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId:google.maps.MapTypeId.ROADMAP,
        };
        //alert(zoomlevel);
        google.maps.visualRefresh = true;
        map=new google.maps.Map(document.getElementById("mapholder"),myOptions);
        var marker=new google.maps.Marker({
          position:latlon,
          map:map,
          title:"My Location!"
          });
        mylocation = lat+","+lon;
        bounds.extend(latlon);
        map.fitBounds(bounds);
        proxm = 10000;
        // Now ready to get the stores
        getOffers(mylocation,proxm);
} // End onGetLocationSuccess
  
function getOffers(ml,pm)
{
        //alert('get offers');
        //function sortByDistance(a,b){
//                alert('sort by distance');
//                var aofferlatlon=new google.maps.LatLng(a.location.latitude, a.location.longitude);
//                var bofferlatlon=new google.maps.LatLng(b.location.latitude, b.location.longitude);
//                var adistance = (google.maps.geometry.spherical.computeDistanceBetween (aofferlatlon, latlon)/1000).toFixed(1);
//                var bdistance = (google.maps.geometry.spherical.computeDistanceBetween (bofferlatlon, latlon)/1000).toFixed(1);
//                return parseFloat(adistance,2) > parseFloat(bdistance,2) ? 1 : -1;
//        };
//alert('before loaded');
        // Load the JSON
        $.getJSON(jsonEmpsFile, function(data) {
                //alert('Im loaded');
                $.each(data.offer,function(index,value){ 
                renderOffer(pm, index+1,value.name, value.location.Latitude, value.location.Longitude, value.description);
                });
                // Done with offer, update message
                updateAll();
        });                
}
/*      Function: renderOffer
        updates the map and list for every result within range
        Args: offer info*/

function renderOffer(prox,label,name,olat,olon,desc) {
        var offerlatlon=new google.maps.LatLng(olat, olon);
        distance = (google.maps.geometry.spherical.computeDistanceBetween (offerlatlon, latlon)/1000).toFixed(1);
        // Process only if within requested distance
        totaloffers++;
                // Extend the map to fit 
                bounds.extend(offerlatlon);
                map.fitBounds(bounds);
                // Update map with markers (requires StyledMarker.js)         
                offermarker = new StyledMarker({
                        styleIcon:new StyledIcon(StyledIconTypes.MARKER,
                        {color:"FFFF66",text:label.toString()}),
                        position:offerlatlon,
                        map:map});
$("#list").append('<li id="'+label+'"><a href="#offerdetails" id="'+label+'"><span dir="rtl">'+name+' ('+distance+'KM)</span></a></li>');
//$("#list").listview("refresh");                
                if(parseFloat(distance,2)<=parseFloat(prox/1000,2)) {
                //alert('yay we passed the if');
                $("#listH").append('<li id="'+label+'"><a href="#offerdetails"id="'+label+'">'+name+'</a></li>');
        } // End if        
        //$('#listH').listview('refresh');
$("#listH").listview("refresh");
$("#totaloffers").html(totaloffers);

} 

function ReadytoUse(label,name,olat,olon,desc,dur){
        
				  $("#oneoffermap").empty();
				  mapholder=document.getElementById('oneoffermap');
				  mapholder.style.height='200px';
				  mapholder.style.width=window.innerWidth;
				  bounds2 = new google.maps.LatLngBounds(); // Required for zoom level and center
				  var myOptions={
				  zoom:1,
				  center:latlon,
				  mapTypeControl:false,
				  navigationControlOptions:{style: google.maps.NavigationControlStyle.SMALL},
				  mapTypeId:google.maps.MapTypeId.ROADMAP,
				  };
				  //alert(zoomlevel);
				  google.maps.visualRefresh = true;
				  map2=new google.maps.Map(document.getElementById("oneoffermap"),myOptions);
				  google.maps.event.trigger(map2, 'resize');
				  
				  console.log('I resized');
				  var marker=new google.maps.Marker({
					position:latlon,
					map:map2,
					title:"My Location!"
					});
						  var offerlatlon2=new google.maps.LatLng(olat, olon);
						  distance2 = (google.maps.geometry.spherical.computeDistanceBetween (offerlatlon2, latlon)/1000).toFixed(1);
						  bounds2.extend(offerlatlon2);
						  map2.fitBounds(bounds2);
						  //alert('before updating maps with markers');
						  // Update map with markers (requires StyledMarker.js)         
						  //var label=index+1;
						  offermarker = new StyledMarker({
								  styleIcon:new StyledIcon(StyledIconTypes.MARKER,
								  {color:"FFFF66",text:label.toString()}),
								  position:offerlatlon2,
								  map:map2});
								  google.maps.event.trigger(map2, 'resize');
								  
						  $("#offerdetailsD").empty();
						  //$("#offerdetailsD").append('<li><h3>العرض</h3><span dir="rtl">'+value.name+'</span><h3>مدة العرض</h3><li>'+value.duration+'</li><h3>تفاصيل العرض</h3><li>'+value.description+'</li></li>');
						  $("#offerdetailsD").append(
						  '<li><span class="spanRight" dir="rtl">'
						  +'<h2 class="textsize">'+name+'</strong></h2>'
						  +'</span></li>'
						  
						  +'<li><span class="spanRight" dir="rtl">'
						  +'تفاصيل العرض: '
						  +'<br />'+desc
						  +'</span></li>'
						  
						  +'<li><span class="spanRight" dir="rtl">'
						  +'مدة العرض: '+dur
						  +'</span></li>'
						  
						  );
						  $("#offerdetailsD").listview().listview("refresh");
						  //$( myTable ).table().table("refresh");
			
         
}
$('#listH').delegate('li', 'click', function() {
 var Oid= this.id;
 if (Oid)
 {
	  $.getJSON(jsonFile, function(data) {
                $.each(data.offer,function(index,value){ 
                if(Oid == value.offerid)
                {
					ReadytoUse(index+1,value.name, value.location.Latitude, value.location.Longitude, value.description, value.duration);
					}
			});
		});
 }
});
 
$('#list').delegate('li', 'click', function() {
var Oid= this.id;
if (Oid)
{
	  $.getJSON(jsonFile, function(data) {
                $.each(data.offer,function(index,value){ 
                if(Oid == value.offerid)
                {
					ReadytoUse(index+1,value.name, value.location.Latitude, value.location.Longitude, value.description, value.duration);
					}
			});
		});
   }
});




function onGetLocationError(error)
{
        //alert('ongetlocation');
        $("#errorholder").show();
        $("#mapholder").hide();
        var x=document.getElementById("errormsg");
        switch(error.code) 
        {
                case 1:
                  x.innerHTML="User denied the request for Geolocation."
                  break;
                case 2:
                  x.innerHTML="Location information is unavailable."
                  break;
                case 3:
                  x.innerHTML="The request to get user location timed out."
                  break;
                default:
                  x.innerHTML="An unknown error occurred."
                  break;
        } // End switch
} // End onGetLocationError
/* ================================================= 
   ================ Events Section ================= 
   ================================================= 
*/
$('#goback').on('tap', function ()  {
        if ($("#detailslist li.oneitem").length) {$('#detailslist li.oneitem').remove();}
        $("#detailslist").listview('refresh');
        $.mobile.changePage("#results");
        e.stopPropagation();
    e.preventDefault();

});


$('#options').delegate('.option', 'tap', function ()  {
        connectionStatus = navigator.onLine ? 'online' : 'offline';
        if(connectionStatus=='offline')
        {
                onGetLocationError(4);
        }
        else
        {
                if($(this).attr('id')=="reload")
                {
                        loadScript(12,10000);
                        //location.reload();
                } else if($(this).attr('id')=="get20") 
                {
                        loadScript(11,20000);
                }
                else if($(this).attr('id')=="get50") 
                {
                        loadScript(10,50000);
                }
                else if($(this).attr('id')=="getall") 
                {
                        loadScript(9,500000);
                }
                $("#errorholder").hide();
                $("#mapholder").show();
        } // End else network
});

$(document).on("pageshow", "#offers", function( event ) {
		google.maps.event.trigger(map, "resize");
        bounds.extend(latlon);
        map.fitBounds(bounds);
    }
);
$(document).on("pageshow", "#offerdetails", function( event ) {
		google.maps.event.trigger(map2, "resize");
		map2.fitBounds(bounds2);
		map2.setZoom(16);   

    }
);


function FormSubmit(){
            //collect userName and password entered by users
            userName = $("#un").val();
            password = $("#pw").val();
            //call the authenticate function
			authenticate();
}
	
//function authenticate() { 
//alert('authenticate');
//   $.getJSON(jsonEmpsFile, function(data) {
//	    document.getElementById("errM").style.display = "none";
//	   NotEqual=true;
//	   alert(data.Employees.workID);
//		alert('json');
//		//console.log(data);
//		  $.each(data.Employees,function(index,value){ 
//		  //NotEqual=true;
//			 if((userName==value.workID)&&(password==value.Password))
//			  {
//				  //var Wid=value.workID;				  
//			  	  NotEqual = false;
//				  $.mobile.changePage("#profile");
//			  }
//			  });	 
//		  if (NotEqual==true)
//			 {
//				//document.getElementById("errM").style.display = 'inline';
//				//('errM').innerHTML = 'Try message 1 again...';
//				//errM.innerHTML="Error: " + errorMessage + ".";
//				//errorMessage='رقم بطاقة العمل أو كلمة المرور غير صحيحة';
//				//$("#errM").append('رقم بطاقة العمل أو كلمة المرور غير صحيحة');
//				$.mobile.changePage("#login");
//				alert('رقم بطاقة العمل أو كلمة المرور غير صحيحة');
//			 }
//	}); 
//}