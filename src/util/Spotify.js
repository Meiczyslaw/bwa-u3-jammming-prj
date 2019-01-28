let accessToken;
let expiresIn;
const clientId = '1a4f76c2cbc949579ad154e43fdb9ca3';
const redirectUri = 'http://localhost:3000/';

export class Spotify {
  static getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenTest = window.location.href.match(/access_token=([^&]*)/);
    const expireTokenTest = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenTest && expireTokenTest ) {
      accessToken = accessTokenTest[1];
      expiresIn = expireTokenTest[1];

      window.setTimeout( () => accessToken = '', expiresIn * 1000 );
      window.history.pushState( 'Access Token', null, '/' );

      return accessToken;
    } else {
      const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&scope=playlist-modify-public&redirect_uri=${redirectUri}&response_type=token`;
      window.location = url;
    }
  } // getAccessToken

  static async search(searchTerm) {
    const url = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;

    return fetch( url, {
      headers: {
        Authorization:  `Bearer ${Spotify.getAccessToken()}`
      }
    }).then( response => {
      return response.json();
    }).then( jsonResponse => {
      return jsonResponse.tracks.items.map( track => {
        return {
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          id: track.id,
          uri: track.uri
        };
      });
    });
  } // search

  static async savePlaylist(playlistName, trackURIs) {
    if ( !playlistName || trackURIs.length === 0 ) {
      return;
    } else {
      const headers = {
        Authorization:  `Bearer ${Spotify.getAccessToken()}`
      };
      let userID;

      return fetch('https://api.spotify.com/v1/me',
        {
          headers: headers
        }
      ).then( response => {
        return response.json();
      }).then( jsonResponse => {
        userID = jsonResponse.id;
        const url = `https://api.spotify.com/v1/users/${userID}/playlists`;
        const headers = {
          Authorization:  `Bearer ${Spotify.getAccessToken()}`,
          'Content-Type': 'application/json'
        };
        const body = {
          name: playlistName
        };
        return fetch(
          url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
          });
      }).then( response => {
        return response.json();
      }).then( jsonResponse => {
        return jsonResponse.id;
      }).then( playlistID => {
        const url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
        const headers = {
          Authorization:  `Bearer ${Spotify.getAccessToken()}`,
          'Content-Type': 'application/json'
        };
        const body = { uris: trackURIs };
        return fetch(
          url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
      }).then( response => {
        return response.json();
      }).then( jsonResponse => {
        const playlistID = jsonResponse.snapshot_id;
        return playlistID;
      });
    }
  } // savePlaylist
} // class Spotify
