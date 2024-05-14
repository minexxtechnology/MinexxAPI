const {firebase} = require("../utils/connect");

const success = (endpoint, message, user, ip)=>{
  console.info(`${endpoint}: ${message}`);
  firebase.firestore().collection("logs").add({
    time: new Date(),
    ip: ip || null,
    user,
    endpoint,
    message,
    type: "success",
  });
};

const error = (endpoint, message, user, ip)=>{
  console.error(`${endpoint}: ${message}`);
  firebase.firestore().collection("logs").add({
    time: new Date(),
    ip: ip || null,
    user,
    endpoint,
    message,
    type: "error",
  });
};

const warn = (endpoint, message, user, ip)=>{
  console.warn(`${endpoint}: ${message}`);
  firebase.firestore().collection("logs").add({
    time: new Date(),
    ip: ip || null,
    user,
    endpoint,
    message,
    type: "warning",
  });
};

module.exports = {
  success,
  error,
  warn,
};
