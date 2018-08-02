import React from 'react'
import {GoogleApiWrapper, Map} from 'google-maps-react'

export class MapContainer extends React.Component {
  render() {
    console.log('rendering container')
    const style = {
      width: '100vw',
      height: '100vh'
    }
    return (
      <Map google={this.props.google} style={style}>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'API_KEY_HERE'
})(MapContainer)
