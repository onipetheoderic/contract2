
	
function initMap() { 
var locationsN = [
  ['Ojuelegba', 9.0710, 8.6553, 4],
  ['Victoria Island', 9.0610, 8.6753, 5],
  ['Ikoyi', 9.0410, 8.6253, 3],
  ['Lawanson', 9.0710, 8.6363, 2],
  ['Aguda', 9.0510, 8.6453, 1]
];
       //9.0820° N, 8.6753° E
       var map2 = new google.maps.Map(document.getElementById('map2'), {
        zoom: 10,//6.5244° N, 3.3792° E
        center: new google.maps.LatLng(9.0820, 8.6753),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var infowindow = new google.maps.InfoWindow();

      var marker, i;
  
      for (i = 0; i < locationsN.length; i++) {  
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locationsN[i][1], locationsN[i][2]),
          map: map2
        });
  
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(locationsN[i][0]);
            infowindow.open(map, marker);
          }
        })(marker, i));
      }



		

		
      var locations = [
        ['Ojuelegba', 6.5111, 3.3666, 4],
        ['Victoria Island', 6.4281, 3.4219, 5],
        ['Ikoyi', 6.4589, 3.4246, 3],
        ['Lawanson', 6.4894, 3.4250, 2],
        ['Aguda', 6.5200, 3.3414, 1]
      ];
              var mapElement = new google.maps.Map(document.getElementById('googleMap'), {
                zoom: 11,//6.5244° N, 3.3792° E
                center: new google.maps.LatLng(6.5244, 3.3792),
                mapTypeId: google.maps.MapTypeId.ROADMAP
              });
      
              var infowindow = new google.maps.InfoWindow();
      
              var marker, i;
          
              for (i = 0; i < locations.length; i++) {  
                marker = new google.maps.Marker({
                  position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                  map: mapElement
                });
          
                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                  return function() {
                    infowindow.setContent(locations[i][0]);
                    infowindow.open(map, marker);
                  }
                })(marker, i));
              }
      
      
			
			
			
			
		
		
		
        var myLatlng = {lat: -25.363, lng: 131.044};
        var kwara = {lat: 8.4543, lng: 4.5811};
        var kwara2 = {lat: 8.4540, lng: 4.5810};

//6.5111° N, 3.3666° E
//6.4281° N, 3.4219° E
//6.4549° N, 3.4246° E
//6.4994° N, 3.3250° E
var locations = [
  ['Ojuelegba', 6.5111, 3.3666, 4],
  ['Victoria Island', 6.4281, 3.4219, 5],
  ['Ikoyi', 6.4549, 3.4246, 3],
  ['Lawanson', 6.4994, 3.3250, 2],
  ['Aguda', 6.4900, 3.3414, 1]
];
        var map6 = new google.maps.Map(document.getElementById('map86'), {
          zoom: 11,//6.5244° N, 3.3792° E
          center: new google.maps.LatLng(6.5244, 3.3792),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow = new google.maps.InfoWindow();

        var marker, i;
    
        for (i = 0; i < locations.length; i++) {  
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map6
          });
    
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(locations[i][0]);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }




        
		
        var map7 = new google.maps.Map(document.getElementById('map7'), {
          zoom: 11,
          center: {lat: 9.0552, lng: 7.4896}
        });
//9.0552° N, 7.4896
        var locations = [
          ['Kuje', 8.8764, 7.2437, 4],
          ['Gwagwalada', 8.9508, 7.0767, 5],
          ['Gwarinpa', 9.1099, 7.4042, 3],
          ['Jabi', 9.0764, 7.4254, 2],
          ['Cedi Plaza', 9.0552, 7.4896, 1]
        ];
              
        
                var infowindow = new google.maps.InfoWindow();
        
                var marker, i;
            
                for (i = 0; i < locations.length; i++) {  
                  marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                    map: map7
                  });
            
                  google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                      infowindow.setContent(locations[i][0]);
                      infowindow.open(map, marker);
                    }
                  })(marker, i));
                }
        
        
		
      }
	  
     
 

