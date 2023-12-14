

// const usersArray = [
//     {
//       email: "vikramauroville2000@gmail.com",
//     },
//     {
//       email: "user2@example.com",
//     },
//     {
//       email: "user3@example.com",
//     }
//   ];
  
//   // Function to generate a random key
//   function generateRandomKey() {
//     return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
//   }
  
//   // Function to encrypt email using AES encryption
//   function encryptEmail(email, key) {
//     const encryptedEmail = CryptoJS.AES.encrypt(email, key).toString();
//     return encryptedEmail;
//   }
  
//   // Encrypt email for each user in the array
//   const encryptedUsersArray = usersArray.map(user => {
//     const key = generateRandomKey();
//     return {
//       email: encryptEmail(user.email, key),
//       key: key
//     };
//   });

// Function to decrypt email using AES decryption
function decryptEmail(encryptedEmail, key) {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedEmail, key);
    const decryptedEmail = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedEmail;
  }

  function decryptUsers(encryptedUsersArray) {
    const decryptedUsersArray = encryptedUsersArray.map(encryptedUser => {
      const decryptedEmail = decryptEmail(encryptedUser.email, encryptedUser.key);
      return {
        email: decryptedEmail,
        key: encryptedUser.key
      };
    });

    return decryptedUsersArray;
  }

  // Function to check if email is authorized
  function checkAuthorizedEmail(email, decryptedUsersArray) {
    return decryptedUsersArray.some(user => user.email === email);
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