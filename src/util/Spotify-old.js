let accessToken = '';
const clientId = '1a4f76c2cbc949579ad154e43fdb9ca3';
const redirectUri = 'http://localhost:3000/';

class Spotify {
  async getAccessToken() {
    if (accessToken != '') {
      return accessToken;
    } else {
      const requestString = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;
      return fetch(requestString).then( response => {
          const grantString = window.location.href;
          const accessTokenRegex = '/access_token=([^&]*)/';
          const expirationRegex = '/expires_in=([^&]*)/';
          const accessToken = grantString.match(accessTokenRegex);
          const expiresIn = grantString.match(expirationRegex);
          if ( accessToken && expiresIn ) {
            // this is all wrong, I'm sure (step 80)
            window.location.href = redirectUri;
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
          }
      });
    }
  }
}

export default Spotify;

// from moderator:
getAccessToken() {
  if(accessToken)
    return accessToken;
  else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/))
  {
    accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
    expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

    window.setTimeout(() => accessToken = '', expiresIn*1000);
    window.history.pushState('Access Token', null, '/');

    return accessToken;
  }
  else
  {
    let url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    window.location = url;
  }
}
