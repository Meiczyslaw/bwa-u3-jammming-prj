import React, { Component } from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults : [],
      playlistName : 'New Playlist',
      playlistTracks : [],
      searchTerm: ''
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  } // constructor

  addTrack(track) {
    const trackFound = this.state.playlistTracks.find( playlistTrack => playlistTrack.id === track.id)
    if ( trackFound === undefined ) {
      this.state.playlistTracks.push(track);
      this.setState({playlistTracks: this.state.playlistTracks});
    }
  } // addTrack

  removeTrack(track) {
    const newTrackList = this.state.playlistTracks.filter(
      playlistTrack => playlistTrack.id !== track.id
    );
    this.setState({playlistTracks: newTrackList});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map( track => track.uri );
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then( playlistID => {
      this.setState({ playlistName: 'New Playlist', playlistTracks:[] });
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then( tracksFound => {
      if (tracksFound) {
        this.setState({searchResults: tracksFound});
      }
    });
  }

  componentDidMount() {
    Spotify.getAccessToken();
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  } // render
} // class App

export default App;
