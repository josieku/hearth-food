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
      this.setState({
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
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            radius: measure(refs.map.getBounds().f.b,refs.map.getBounds().b.b, refs.map.getBounds().f.f, refs.map.getBounds().b.f)/5,
          }, () => {
            this.setState({
              circleBounds: refs.circle.getBounds()
            })
          })
        },
        onRadiusChanged: () => {
          this.setState({
            circleBounds: refs.circle.getBounds(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = this.state.circleBounds
          console.log(places[0].geometry.location)
          var places2 = places.filter(place => {
            var dist = measure(place.geometry.location.lat(), place.geometry.location.lng(), this.state.center.lat, this.state.center.lng)
            return (dist < this.state.radius)
          });
          console.log(places2)
          const nextMarkers = places2.map(place => ({
            position: place.geometry.location,
            name: place.name
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
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
          bounds={props.bounds}
          controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
          onPlacesChanged={props.onPlacesChanged}
        >
          <input
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
