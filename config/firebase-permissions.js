var admin = require("firebase-admin");
const firebase = require('firebase/app');
require("firebase/auth");

var serviceAccount = require('./pddh-sat-firebase-adminsdk-10sjw-664b8bd688.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



// const firebaseConfig = {
//   apiKey: process.env.APIKEY,
//   authDomain: "pddh-sat.firebaseapp.com",
//   projectId: "pddh-sat",
//   storageBucket: "pddh-sat.appspot.com",
//   messagingSenderId: "1002402961086",
//   appId: "1:1002402961086:web:0f393577c4a573048f70ef",
//   measurementId: "G-9LY8W9CM20"
//   };

  const firebaseConfig = {
    apiKey: "AIzaSyCkxe53B1R4DEhS0owsHsAUuX3WLl_IMjg",
    authDomain: "pddh-sat-edd5e.firebaseapp.com",
    projectId: "pddh-sat-edd5e",
    storageBucket: "pddh-sat-edd5e.appspot.com",
    messagingSenderId: "295618886102",
    appId: "1:295618886102:web:f32df7b811ce0c0c420c77",
    measurementId: "G-SHB3NGEG92"
  };



firebase.initializeApp(firebaseConfig);



const auth = firebase.auth();
module.exports = {
  admin,
  auth
};