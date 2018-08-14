
function spotifySdkOnReady() {
//Spotify SDK handling
    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = 'BQBwqm-ZpJ3q9uSa-0h9TwwuZjteSsG_oaW0T-rSYaI3APHtx5wq8kuGA145Iu8srXmwsR46dEJlks5qiyyFHo2Ez2-6RO7oc7Q55lAvacM5BV-Q_tPhekdqu0MdX6C9l6bTnaxgbVyn61uyshfTHiQUBOY_CkBIypMRlQ';
        const player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: cb => { cb(token); }
        });

        //error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        //status updates
        player.addListener('player_state_changed', state => { console.log(state); });

        //Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
        });

        //Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        //connect to the player
        player.connect();
    };
}
$(spotifySdkOnReady);