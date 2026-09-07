import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC5l7gQ1ooB-HLJgveOrEklgpjhrKNIKWo',
  authDomain: 'cifra-nasa.firebaseapp.com',
  projectId: 'cifra-nasa',
  storageBucket: 'cifra-nasa.firebasestorage.app',
  messagingSenderId: '843530351902',
  appId: '1:843530351902:web:a54db61477a4b0c666050f',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
