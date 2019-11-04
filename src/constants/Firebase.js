import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAm3kqrRovatIBaA4C7OR6jwcYivHV-RBE',
  authDomain: 'caroimagecdn.firebaseapp.com',
  databaseURL: 'https://caroimagecdn.firebaseio.com',
  projectId: 'caroimagecdn',
  storageBucket: 'caroimagecdn.appspot.com',
  messagingSenderId: '582545233785',
  appId: '1:582545233785:web:76df7c8b96a710408801a8',
  measurementId: 'G-31GE9FMP6J'
};
firebase.initializeApp(firebaseConfig);

export default firebase;