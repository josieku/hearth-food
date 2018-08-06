const _ = require("lodash");
import React from 'react';
import ReactDOM from 'react-dom'
import {geolocated} from 'react-geolocated';
const { compose, withProps, lifecycle, defaultProps } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
import SearchBox from "react-google-maps/lib/components/places/SearchBox"
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
import { Circle } from "react-google-maps";

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
    containerElement: <div style={{ height: `100%`, width: '50%', position: 'absolute', right: '0' }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentDidMount() {
      var self = this
      geo.getCurrentPosition(function(position) {
        if (position) {
          self.setState({
            center: {lat: position.coords.latitude, lng: position.coords.longitude}
          })
        } else {
          console.log('boo')
        }
      })
    },
    componentWillMount() {
      const refs = {}
      var places;
      var foo;
      var self = this;
      self.setState(foo = {
        bounds: null,
        circleBounds: null,
        center: {lat: 0, lng: 0},
        radius: 1000,
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onCircleMounted: ref => {
          refs.circle = ref;
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          debugger;
          places = refs.searchBox.getPlaces()
          if (places) {
            var bounds = self.state.circleBounds
            console.log(places, bounds)
            var places2 = places.filter(place => {
              var dist = measure(place.geometry.location.lat(), place.geometry.location.lng(), self.state.center.lat, self.state.center.lng)
              return (dist < self.state.radius)
            });
            const nextMarkers = places2.map(place => ({
              position: place.geometry.location,
              name: place.name
            }));
            const nextCenter = _.get(nextMarkers, '0.position', self.state.center);

            self.setState({
              markers: nextMarkers,
            });
          }
          // refs.map.fitBounds(bounds);
        },
        onBoundsChanged: () => {
          self.setState({
            bounds: refs.map.getBounds(),
            radius: measure(refs.map.getBounds().f.b,refs.map.getBounds().b.b, refs.map.getBounds().f.f, refs.map.getBounds().b.f)/5,
          }, () => {
            self.setState({
              circleBounds: refs.circle.getBounds()
            }, () => {
              debugger;
              if (refs.searchBox) {
                setTimeout(() => {
                  foo.onPlacesChanged()
                }, 2000)
              }
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
          })
        },
        onRadiusChanged: () => {
          self.setState({
            circleBounds: refs.circle.getBounds(),
          })
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
  )((props) => {
    return (
      <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={15}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
      >
        <MarkerWithLabel
          position={props.center}
          labelAnchor={new window.google.maps.Point(0, 0)}
          labelStyle={{backgroundColor: "purple", fontSize: "28px", padding: "16px"}}
        >
          <div>You!</div>
        </MarkerWithLabel>
        <Circle
          ref={props.onCircleMounted}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
          }}
          center={props.center}
          radius={props.radius}
        >
        </Circle>
        <SearchBox
          ref={props.onSearchBoxMounted}
          bounds={props.circleBounds}
          controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
          onPlacesChanged={props.onPlacesChanged}
        >
          <input
            id="search"
            type="text"
            placeholder="Customized your placeholder"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              marginTop: `27px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
            }}
          />
        </SearchBox>
        {props.markers.map((marker, index) =>
          <MarkerWithLabel
            key={index}
            position={marker.position}
            labelAnchor={new window.google.maps.Point(0, 0)}
            labelStyle={{backgroundColor: "orange", fontSize: "18px", padding: "16px"}}
          >
            <div>{marker.name}</div>
          </MarkerWithLabel>
        )}
      </GoogleMap>
    )
  });

export default MapWithLocation
