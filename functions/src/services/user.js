const {default: axios} = require("axios");
const {firebase, sheets, spreadsheets} = require("../utils/connect");
const {initializeApp} = require("firebase/app");
const User = require("../model/user");
const {omit} = require("lodash");
const config = require("../config/default");
const {sendPasswordResetEmail, getAuth} = require("firebase/auth");

const createUser = async (input) => {
  try {
    const user = new User(input);
    user.password = new Date().getTime().toString();
    const account = await firebase.auth().createUser({
      displayName: `${user.name} ${user.surname}`,
      email: user.email,
      password: user.password,
      photoURL: user.photoURL,
    });
    // await sendVerifyEmail(input.email, account.uid);
    await firebase.firestore().collection(`users`).doc(account.uid).set( omit(user, `password`, `uid`) );
    return account;
  } catch (e) {
    throw new Error(e);
  }
};

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

const findUser = async (id) => {
  try {
    const account = await firebase.firestore().collection(`users`).doc(id).get();
    if (!account.exists && account) {
      throw new Error(`The user with the specified identifier was not found in our records.`);
    }
    const user = new User(account.data());
    user.created = account.data()?.created.toDate();
    user.updated = account.data()?.updated.toDate();
    user.lastLogin = account.data()?.lastLogin.toDate();
    user.uid = account.id;

    return user;
  } catch (e) {
    throw new Error(e);
  }
};

const fetchUsers = async (platform) => {
  try {
    const users = [];

    if (platform === "dashboard") {
      const results = await firebase.firestore().collection(`users`).where(`status`, `!=`, `deleted`).get();

      results.forEach((u)=>{
        const user = new User(u.data());
        user.uid = u.id;
        user.created = u.createTime.toDate();
        user.updated = u.updateTime.toDate();
        user.lastLogin = u.data().lastLogin.toDate();
        users.push(user);
      });
    } else {
      const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.users, range: "Users!A:ZZ"});
      const header = results.data.values[0];
      const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("User ID")]);

      rows.forEach((row)=>{
        const user = {
          id: row[header.indexOf("User ID")],
          email: row[header.indexOf("Email")],
          name: row[header.indexOf("Name")],
          company: row[header.indexOf("Company")],
          country: row[header.indexOf("Country")],
          role: row[header.indexOf("Role")],
        };
        users.push(user);
      });
    }
    return users;
  } catch (e) {
    throw new Error(e);
  }
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

const validatePassword = async ({email, password})=>{
  try {
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.apiKey}`, {
      email,
      password,
      returnSecureToken: true,
    });
    await firebase.firestore().collection(`users`).doc(response.data.localId).update({
      lastLogin: new Date(),
    });
    const account = await firebase.firestore().collection(`users`).doc(response.data.localId).get();
    const user = account.data();
    user.uid = account.id;
    return user;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  findUser,
  fetchUsers,
  createUser,
  changePassword,
  requestResetPassword,
  validatePassword,
};
