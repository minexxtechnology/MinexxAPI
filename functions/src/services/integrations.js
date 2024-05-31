const axios = require("axios");

const metalsAPI = async () => {
  try {
    const response = await axios.default.get(`https://metals-api.com/api/latest?access_key=l333ljg4122qws9kxkb4hly7a8dje27vk46c7zkceih11wmnrj7lqreku176&base=USD&symbols=TIN,LME-TIN,TIN3M`);
    return response.data.rates;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  metalsAPI,
};
