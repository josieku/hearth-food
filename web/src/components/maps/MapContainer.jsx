const _ = require("lodash");
import React from 'react';
import ReactDOM from 'react-dom'
import {geolocated} from 'react-geolocated';
const { compose, withProps, lifecycle, defaultProps, withStateHandlers, withHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} = require("react-google-maps");
import SearchBox from "react-google-maps/lib/components/places/SearchBox"
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
import { Circle } from "react-google-maps";
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}

var geo = window.navigator.geolocation

var MapWithLocation = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDM7lCbSzaudr_c9xSve0RiF7Zl5UX2rac&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: '500px'}} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withStateHandlers(() => ({
    isOpen: false,
  }), {
    onToggleOpen: ({ isOpen }) => () => ({
      isOpen: !isOpen,
    })
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
      console.log(`Current clicked markers length: ${clickedMarkers.length}`)
      console.log(clickedMarkers)
    },
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}
      var foo;
      var self = this;
      self.setState(foo = {
        bounds: null,
        center: {lat: 0, lng: 0},
        markers: {},
        onMapMounted: ref => {
          refs.map = ref;
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          // refs.map.fitBounds(bounds);
          var places = self.props.places
          var listings = {}
          console.log(places)
          if (places) {
            places.forEach(meal => {
              if (listings[meal.chef._id]) {
                console.log('hello')
                var arr = listings[meal.chef._id].concat({
                  position: meal.chef.location,
                  price: meal.price,
                  rating: meal.reviews.length > 4 ? meal.overallRating : 'Not Available',
                  name: meal.title,
                })
                listings[meal.chef._id] = arr
              } else {
                console.log('goodbye')
                listings[meal.chef._id] = [{
                  position: meal.chef.location,
                  price: meal.price,
                  rating: meal.reviews.length > 4 ? meal.overallRating : 'Not Available',
                  name: meal.title,
                }]
              }
            })
            console.log(listings)
          }
          if (places) {
            const nextMarkers = places.map(place => ({
              position: place.chef.location,
              price: place.price,
              rating: place.overallRating,
              name: place.title,
              distance: measure(place.chef.location.lat, place.chef.location.lng, self.props.location.lat, self.props.location.lng)
            }));
            const nextCenter = _.get(nextMarkers, '0.position', self.state.center);
            self.setState({
              markers: listings,
            });
          }
        },
        onBoundsChanged: () => {
          self.setState({
            bounds: refs.map.getBounds(),
          }, () => {
              foo.onPlacesChanged()
              self.props.sendBounds(self.state.bounds)
              console.log(self.state.bounds)
              // if (refs.searchBox) {
              //   var input = document.getElementById('search')
              //   window.google.maps.event.trigger( input, 'focus')
              //   // window.google.maps.event.trigger( input, 'keydown', {keyCode:13})
              //   // var itemsloaded = window.google.maps.event
              //   // itemsloaded.addDomListener(document.body,
              //   //   'SearchTrigger',
              //   //   function(e){
              //   //     if(e.target.className==='search'){
              //   //       //remove the listener
              //   //       window.google.maps.event.removeListener(itemsloaded);
              //   //       //trigger the events
              //   //       window.google.maps.event.trigger( input, 'focus')
              //   //       window.google.maps.event.trigger( input, 'keydown', {keyCode:13})
              //   //     }
              //   //   });
              //   // itemsloaded.trigger(input, 'SearchTrigger')
            }
          )
        },
        showInfo: (a) => {
          console.log('setting info state')
          this.setState({showInfoIndex: a })
        }
      })
    },
  }),
  withScriptjs,
  withGoogleMap
  )((props) => {
    console.log(window.google.maps)
    var image = {
      url: 'https://static.thenounproject.com/png/5024-200.png',
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(17, 34),
      scaledSize: new window.google.maps.Size(50, 50)
    };
    return (
      <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={14}
        center={props.location}
        onBoundsChanged={props.onBoundsChanged}
      >
        <Marker
          key={0}
          position={props.location}
          onClick={()=>{props.showInfo(0)}}
          icon={image}
        >
          {(props.showInfoIndex === 0) &&
            <InfoWindow onCloseClick={props.onToggleOpen}>
              <div style={{fontWeight: 'bold'}}>
                This is you!
              </div>
            </InfoWindow>}
        </Marker>
        <MarkerClusterer
          onClick={props.onMarkerClustererClick}
          averageCenter
          enableRetinaIcons
          gridSize={60}
        >
          {_.map(props.markers, (markers, index) => {
            console.log(markers)
            return (
              <Marker
                key={index + 1}
                position={markers[0].position}
                onClick={()=>{props.showInfo(index + 1)}}
              >
                {(props.showInfoIndex === index + 1) &&
                  <InfoWindow onCloseClick={props.onToggleOpen}>
                    <div>
                      {markers.map(marker => {
                        console.log(marker)
                        return(
                          <div>
                            <span style={{fontWeight: 'bold'}}>{marker.name}</span> <br />
                            ${marker.price} <br />
                            Rating: {marker.rating}
                          </div>
                        )
                      })}
                    </div>
                  </InfoWindow>}
              </Marker>
            )
          })}
        </MarkerClusterer>
      </GoogleMap>
    )
  });

export default MapWithLocation
