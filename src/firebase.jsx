import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC8tTBCFuLS2XWG_050fk5GrrvqpNoyHh4",
  authDomain: "myecommerce-cc04b.firebaseapp.com",
  projectId: "myecommerce-cc04b",
  storageBucket: "myecommerce-cc04b.appspot.com",
  messagingSenderId: "694437016324",
  appId: "1:694437016324:web:329a429aaceed5573d9651",
  measurementId: "G-NN9CQ5L7MQ"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, facebookProvider, githubProvider };