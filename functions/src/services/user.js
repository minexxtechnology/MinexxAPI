const {default: axios} = require("axios");
const {firebase} = require("../utils/connect");
const {initializeApp} = require("firebase/app");
const {sendPasswordResetEmail, getAuth} = require("firebase/auth");

const requestResetPassword = async (email) => {
  const app = initializeApp({
    apiKey: "AIzaSyBzKvTjARj6zl98DO9cH62cXlVMSqTMWYM",
    authDomain: "minexx-dashboard.firebaseapp.com",
    projectId: "minexx-dashboard",
    storageBucket: "minexx-dashboard.appspot.com",
    messagingSenderId: "426415920655",
    appId: "1:426415920655:web:28572a8825a64f84e4f57a",
    measurementId: "G-J1LGD1J95F",
  });
  await sendPasswordResetEmail(getAuth(app), email);
  return true;
};

const changePassword = async (email, password, cpassword) => {
  try {
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBzKvTjARj6zl98DO9cH62cXlVMSqTMWYM`, {
      email,
      password,
      returnSecureToken: true,
    });

    const user = await firebase.auth().updateUser(response.response.localId, {
      password: cpassword,
    });

    return user;
  } catch (err) {
    throw new Error(`The current password you provided is not correct, please check and try again.`);
  }
};

module.exports = {
  changePassword,
  requestResetPassword,
};
