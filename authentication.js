
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.0/firebase-app.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDU2y-QOTc9GsPO4JP-ahEWJivXIIPpas0",
    authDomain: "tpf-pk-193bb.firebaseapp.com",
    projectId: "tpf-pk-193bb",
    storageBucket: "tpf-pk-193bb.firebasestorage.app",
    messagingSenderId: "948644688392",
    appId: "1:948644688392:web:b10ae4469805515fa6d7bd"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const signInButton = document.querySelector("#signInButton");
 const signOutButton = document.querySelector("#signOutButton");

 const userSignIn = async () => {
    signInWithPopup(auth, provider).then((result) => {
        const user = result.user;
        console.log(user);
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
 }

 const userSignOut = async () => {
    signOut(auth).then(() => {
        alert("You have been signed out!")
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
 }

 onAuthStateChanged(auth, (user) => {
    if (user) {
        alert("You are authenticated with Google");
        console.log(user);

        if (user && user.displayName && user.email) {
            // Split full name into first and last name (naive method)
            const nameParts = user.displayName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
    
            // Fill the form inputs
            document.getElementById('firstName').value = firstName;
            document.getElementById('lastName').value = lastName;
            document.getElementById('exampleInputEmail1').value = user.email;
    }
 }})

 
 signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);
