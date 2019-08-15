import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB0R58fAP90Ypu1hKMK1vewEYm0xR9CvOE',
  authDomain: 'slack-app-ba08b.firebaseapp.com',
  databaseURL: 'https://slack-app-ba08b.firebaseio.com',
  projectId: 'slack-app-ba08b',
  storageBucket: 'slack-app-ba08b.appspot.com',
  messagingSenderId: '242222815990',
  appId: '1:242222815990:web:0f3cee4044c05f51',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
