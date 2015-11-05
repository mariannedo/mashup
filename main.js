var ShowShows = { 
    init: function() { 
        $('#LocationForm').on('submit', function(e) { 
            e.preventDefault(); 

            ShowShows.getShows($('#EventLocation').val());
        }); 
    }, 

    getShows: function(location) { 


        $.ajax({
            url: "http://api.bandsintown.com/events/search.json?location=" + location + "&radius=10&page=1&per_page=10&app_id=Marianne_JS_APP",
            dataType: "jsonp", 

        }).done(function(events) {
            ShowShows.mapCenter = ShowShows.calcMapCenter(events); 
            ShowShows.initMap(); 

            events.forEach(function(event) { 
                ShowShows.createHtml(event);  
            }); 

        });
    }, 

    createHtml: function(event) { 
        var htmlBlock = '<div class="map-block"><b>'; 

        for(var i = 0; i < event.artists.length; i++) { 
            htmlBlock += event.artists[i].name + '<br/>'; 
        }

        htmlBlock += '</b>' + event.venue.name + '<br/>'; 

        htmlBlock += new Date(event.datetime) + '<br/>'; 

        htmlBlock += '<a href="' + event.url + '" target="_blank">more details</a>';

        htmlBlock += '</div>'; 

        ShowShows.addMapMarker(htmlBlock, event.venue); 
    }, 

    addMapMarker: function(htmlBlock, venue) { 
        var newLoc = {
            lat: venue.latitude, 
            lng: venue.longitude
        };

        var marker = new google.maps.Marker({
            position: newLoc,
            map: ShowShows.map,
            title: venue.name
        });

        marker.addListener('click', function() {
            if(ShowShows.infowindow) { 
                ShowShows.infowindow.close(); 
            }

            ShowShows.infowindow = new google.maps.InfoWindow({
                content: htmlBlock
            });
            ShowShows.infowindow.open(ShowShows.map, marker);
        });
    },

    calcMapCenter: function(events) { 
        var venueLat  = 0, 
            venueLong = 0,
            locationObj = {}; 

        events.forEach(function(event) { 
            venueLat += event.venue.latitude; 
            venueLong += event.venue.longitude; 
        }); 

        venueLat = venueLat/events.length; 
        venueLong = venueLong/events.length; 

        locationObj.lat = venueLat; 
        locationObj.lng = venueLong; 

        return locationObj; 
    }, 

    infoWindow: null, 

    initMap: function() { 
        ShowShows.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: ShowShows.mapCenter
        });
    }
};


$(document).ready(function() { 
    ShowShows.init(); 
}); 
