const _ = require("lodash");
import React from 'react';
import ReactDOM from 'react-dom'
import {geolocated} from 'react-geolocated';
const { compose, withProps, lifecycle, defaultProps} = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
import SearchBox from "react-google-maps/lib/components/places/SearchBox"
const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");

// var coords = geolocated({
//   positionOptions: {
//     enableHighAccuracy: false,
//   },
// })

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
      console.log(this)
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
        center: {lat: 0, lng: 0},
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new window.google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
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
          <div>This is you!</div>
        </MarkerWithLabel>
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
            labelStyle={{backgroundColor: "yellow", fontSize: "32px", padding: "16px"}}
          >
            <div>Hello There!</div>
          </MarkerWithLabel>
        )}
      </GoogleMap>
    )
  });

export default MapWithLocation
