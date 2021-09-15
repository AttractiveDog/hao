import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCHhfpLpB3AQFlStMSN42pRrAnYGvrQpUI",
    authDomain: "hao-1234.firebaseapp.com",
    projectId: "hao-1234",
    storageBucket: "hao-1234.appspot.com",
    messagingSenderId: "605131535301",
    appId: "1:605131535301:web:3edf9273b302b2390311ac",
    measurementId: "G-FFWQ7V0MXG"
  })
} else {
  firebase.app() // if already initialized, use that one
}

export const auth = firebase.auth()
export const db = firebase.firestore()
export const storage = firebase.storage()