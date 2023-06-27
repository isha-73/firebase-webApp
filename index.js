// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import { getAuth, EmailAuthProvider, signOut,
  onAuthStateChanged } from 'firebase/auth';
import {} from 'firebase/firestore';

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

let rsvpListener = null;
let guestbookListener = null;

let db, auth;

async function main() {
  // Add Firebase project configuration object here

  const firebaseConfig = {
    apiKey: 'AIzaSyCWixkD9xPEpoUeWYrohIFpqBuxjydfa8g',
    authDomain: 'fir-web-codelab-2b370.firebaseapp.com',
    projectId: 'fir-web-codelab-2b370',
    storageBucket: 'fir-web-codelab-2b370.appspot.com',
    messagingSenderId: '827142843063',
    appId: '1:827142843063:web:e8b10073d12a041bc33b32',
  };

  initializeApp(firebaseConfig);
  auth = getAuth();

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };
console.log("pi")
  const ui = new firebaseui.auth.AuthUI(auth);
  startRsvpButton.addEventListener("click",
  () => {
    console.log("hi")
       ui.start("#firebaseui-auth-container", uiConfig);
 });

 // Listen to the current Auth state
 onAuthStateChanged(auth, user => {
  if (user) {
    startRsvpButton.textContent = 'LOGOUT';
  } else {
    startRsvpButton.textContent = 'RSVP';
  }
});
// Called when the user clicks the RSVP button
startRsvpButton.addEventListener('click', () => {
  if (auth.currentUser) {
    // User is signed in; allows user to sign out
    signOut(auth);
  } else {
    // No user is signed in; allows user to sign in
    ui.start('#firebaseui-auth-container', uiConfig);
  }
  })

}
main();
