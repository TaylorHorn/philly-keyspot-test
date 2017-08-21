import React, { Component } from 'react';
import $ from 'jquery';
import './index.css';
const google = window.google;

class App extends Component {

  initialize() {
    var self = this;
    $.get(
      'https://www.opendataphilly.org/dataset/71cf84e5-c6df-44d6-91ef-63f9b880e98e/resource/40daf627-b8c4-43b0-8d73-3cb8f9ccae15/download/keyspotlocationdata.geojson',
      function(res){
        self.setState(res, self.initMap.bind(self));
      }
    );
  }

  populateToolbar() {
    var keyspots = this.state.features;
    var toolbar = document.getElementById("toolbar");
    for (var i = 0; i < keyspots.length; i++) {
      var keyspotBoxId = "keyspot-" + i;
      if (this.state.features[i].properties.Street === "") {
        var address = "<i>Mobile Keyspot</i>";
      } else {
        address = this.state.features[i].properties.Street + ', ' + this.state.features[i].properties.City + " " + this.state.features[i].properties['Postal Code'];
      }

      var keyspotBox = toolbar.appendChild(document.createElement("div"));
      keyspotBox.setAttribute("class", "keyspot-box");
      keyspotBox.setAttribute("id", keyspotBoxId);
      keyspotBox.addEventListener('click', function(e) {

      })

      var locationName = document.getElementById(keyspotBoxId).appendChild(document.createElement("div"));
      locationName.setAttribute("class", "title");
      locationName.innerHTML = this.state.features[i].properties.Name;

      var streetAddress = document.getElementById(keyspotBoxId).appendChild(document.createElement("div"));
      streetAddress.setAttribute("class", "address");
      streetAddress.innerHTML = '<b>Address: </b>' + address;
    }
  }

  initMap() {
    this.populateToolbar();
    var map = new google.maps.Map(document.getElementById('map-box'), {
      zoom: 13,
      center: {lat: 39.9526, lng: -75.1652}
    });

    var keyspots = this.state.features;
    var infowindows = []
    for (var i = 0; i < keyspots.length; i++) {
      var keyspot = this.state.features[i];
      var myLatLng = {lat: keyspot.geometry.coordinates[1], lng: keyspot.geometry.coordinates[0]};

      var phone = keyspots[i].properties['PHONE NUMBER'];
        if (phone === ""){
          phone = "<i>No Phone Number</i>";
        }

      var contentString = '<h3>'+keyspots[i].properties.Name+'</h3>'+
                          '<p><b>Address: </b>'+keyspots[i].properties.Street+ ", " + keyspots[i].properties.City+ " " + keyspots[i].properties['Postal Code']+'</p>'+
                          '<p><b>Phone: </b>'+phone+'</p>';

      var infowindow = new google.maps.InfoWindow({
         content: contentString
       });
      infowindows.push(infowindow);

      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: keyspots[i].properties.Name
      });
      this.state.features[i]['marker'] = marker
      console.log(this.state.features)
      this.infoWindowHandler(map, marker, infowindow, infowindows, i);
    }
  }

  infoWindowHandler(map, marker, infowindow, infowindows, keyspotIndex) {
    marker.addListener('click', function() {
      for (var iwIndex = 0; iwIndex < infowindows.length; iwIndex++) {
       infowindows[iwIndex].close();
      }
      infowindow.open(map, marker);
      var id = "#keyspot-"+keyspotIndex;
      var container = $('#toolbar'),
      scrollTo = $(id);
      container.animate({
        scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
      });
      $(".keyspot-box").css("background-color", "#f9f9f9");
      $(id).css("background-color", "#dedede");
    });
  }

  render() {

    return (

      <div className="App">

        <div className="header">
          <img alt="logo" className="logo" src="https://beta.phila.gov/wp-content/themes/phila.gov-theme/img/city-of-philadelphia-logo.svg"></img>
        </div>

        <div className="toolbar" id="toolbar">
        </div>

        <div className="map-parent">
          <div id="map-box"></div>
        </div>

      </div>

    );
  }
  componentDidMount() {
    this.initialize();
  }
}

export default App;
