// Generate a single key for encryption and decryption
const encryptionDecryptionKey = "5f8255d66c4146c9001b878015030caad544714710cf7f6e03737c504b57b64c";

// Function to decrypt email using AES decryption
function decryptEmail(encryptedEmail) {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedEmail, encryptionDecryptionKey);
    const decryptedEmail = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedEmail;
  } catch (error) {
    console.error('Error decrypting email:', error);
    return null;
  }
}

function decryptUsers(encryptedUsersArray) {
  try {
    const decryptedUsersArray = encryptedUsersArray.map(encryptedUser => {
      try {
        const decryptedEmail = decryptEmail(encryptedUser.data);
        return {
          person: decryptedEmail,
        };
      } catch (error) {
        console.error('Error decrypting email in user:', error);
        return null; // or handle the error appropriately
      }
    });

    return decryptedUsersArray.filter(user => user !== null);
  } catch (error) {
    console.error('Error decrypting users array:', error);
    return [];
  }
}

// Function to check if the email is authorized
function checkAuthorizedEmail(email, decryptedUsersArray) {
  // Check if the provided email is in the list of authorized emails
  return decryptedUsersArray.some(user => user.person === email);
}

// Function to initiate Google Sign-In
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

function handleSignIn() {
  let accessToken = window.location.hash.substr(1)
    .split('&')[0]
    .split('=')[1];

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

      // Assuming decryptedUsersArray is an array of objects with an 'email' property
      console.log('Decrypted Users Array:', decryptedUsersArray);
      if (checkAuthorizedEmail(encodedEmail, decryptedUsersArray)) {
        // If the user is authorized, remove overlay and display content
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

// Fetch JSON file and decrypt before handling sign-in
fetch('https://raw.githubusercontent.com/just-vicky/Mock-Json/main/MOCK_DATA%20(1).json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Decrypt users and store in a variable
    decryptedUsersArray = decryptUsers(data);
    console.log(decryptedUsersArray);

    // Call handleSignIn after decrypting users
    if (window.location.hash.includes('access_token')) {
      handleSignIn();
    } else {
      // If no access token, show the overlay
      document.getElementById('overlay').style.display = 'block';
    }
  })
  .catch(error => {
    console.error('Error fetching or decrypting data:', error);
  });

  