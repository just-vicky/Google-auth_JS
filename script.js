let emailList = ['vikramauroville2000@gmail.com', 'anotherauthorized@example.com'];

function signInWithGoogle() {
    let clientId = '694571191095-vabs5hp6qsui4rmc8ook40u3rku8r7he.apps.googleusercontent.com';
    let redirectUri = encodeURIComponent(window.location.origin);

    let authUrl = 'https://accounts.google.com/o/oauth2/auth' +
        '?response_type=token' +
        '&client_id=' + encodeURIComponent(clientId) +
        '&redirect_uri=' + redirectUri +
        '&scope=email profile' +
        '&prompt=select_account';

    window.location.href = authUrl;
}

function checkAuthorizedEmail(email) {
    return emailList.includes(email);
}

function handleSignIn() {
    let accessToken = window.location.hash.substr(1)
        .split('&')[0]
        .split('=')[1];

    console.log(accessToken)

    // Fetch user info using the access token
    fetch('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + accessToken)
        .then(response => {
            if (!response.ok) {
                throw new Error('Unauthorized');
            }
            return response.json();
        })
        .then(data => {
            // Log the entire response JSON in the console
            console.log('Google API Response:', data);

            let encodedEmail = data.email;

            // Display the encoded email (you can modify this part as needed)
            alert("Encoded Email: " + encodedEmail);

            if (checkAuthorizedEmail(encodedEmail)) {
                // User is authorized, remove overlay and display content
                document.getElementById('overlay').style.display = 'none';
                document.getElementById('content').style.display = 'block';
                alert("User has been authorized");
            } else {
                alert('Unauthorized email address.');
                // If unauthorized, redirect back to the sign-in page
                window.location.href = window.location.origin;
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
            // If an error occurs, redirect back to the sign-in page
            window.location.href = window.location.origin;
        });
}


if (window.location.hash.includes('access_token')) {
    handleSignIn();
} else {
    // If no access token, show the overlay
    document.getElementById('overlay').style.display = 'block';
}