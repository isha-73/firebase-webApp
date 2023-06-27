// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import {
  getAuth,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import { 
  getFirestore,
   addDoc,
   collection,
   query,
   orderBy,
   onSnapshot,
   doc,
  setDoc,
  where } from 'firebase/firestore';

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
  db = getFirestore();

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
  console.log('pi');
  const ui = new firebaseui.auth.AuthUI(auth);
  startRsvpButton.addEventListener('click', () => {
    console.log('hi');
    ui.start('#firebaseui-auth-container', uiConfig);
  });

  // Listen to the current Auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      startRsvpButton.textContent = 'LOGOUT';
      guestbookContainer.style.display = 'block';
      subscribeGuestbook();
    } else {
      startRsvpButton.textContent = 'RSVP';
      guestbookContainer.style.display = 'none';
      unsubscribeGuestbook();
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
  });


  form.addEventListener('submit', async e => {
    // Prevent the default form redirect
    e.preventDefault();
    // Write a new message to the database collection "guestbook"
    addDoc(collection(db, 'guestbook'), {
      text: input.value,
      timestamp: Date.now(),
      name: auth.currentUser.displayName,
      userId: auth.currentUser.uid
    });
    // clear message input field
    input.value = '';
    // Return false to avoid redirect
    return false;
  });

 // Create query for messages
 const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
 onSnapshot(q, snaps => {
   // Reset page
   guestbook.innerHTML = '';
   // Loop through documents in database
   snaps.forEach(doc => {
     // Create an HTML entry for each document and add it to the chat
     const entry = document.createElement('p');
     entry.textContent = doc.data().name + ': ' + doc.data().text;
     guestbook.appendChild(entry);
   });
 });

 function subscribeGuestbook() {
  const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
  guestbookListener = onSnapshot(q, snaps => {
    // Reset page
    guestbook.innerHTML = '';
    // Loop through documents in database
    snaps.forEach(doc => {
      // Create an HTML entry for each document and add it to the chat
      const entry = document.createElement('p');
      entry.textContent = doc.data().name + ': ' + doc.data().text;
      guestbook.appendChild(entry);
    });
  });
}
function unsubscribeGuestbook() {
  if (guestbookListener != null) {
    guestbookListener();
    guestbookListener = null;
  }
}

rsvpYes.onclick = async () => {
  // Get a reference to the user's document in the attendees collection
  const userRef = doc(db, 'attendees', auth.currentUser.uid);

  // If they RSVP'd yes, save a document with attendi()ng: true
  try {
    await setDoc(userRef, {
      attending: true
    });
  } catch (e) {
    console.error(e);
  }
};
rsvpNo.onclick = async () => {
  // Get a reference to the user's document in the attendees collection
  const userRef = doc(db, 'attendees', auth.currentUser.uid);

  // If they RSVP'd yes, save a document with attending: true
  try {
    await setDoc(userRef, {
      attending: false
    });
  } catch (e) {
    console.error(e);
  }
};



}


main();
