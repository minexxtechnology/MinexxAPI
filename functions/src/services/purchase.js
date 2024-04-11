const moment = require("moment");
const fns = require("date-fns");
const {sheets, spreadsheets} = require("../utils/connect");

const getPurchases = async () => {
  const date = moment().subtract(1, "day").toDate();
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.purchase_tracker, range: "Purchase Tracker!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("ID")]);
  const purchases = [];
  for await (const row of rows) {
    if (fns.isSameDay(date, moment(row[header.indexOf("Delivery Date")]).toDate())) {
      purchases.push(row);
    }
  }

  return purchases;
};

const getDailyReport = async (user) => {
  const date = moment().subtract(1, "day").toDate();
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.purchase_tracker, range: "Purchase Tracker!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("ID")]);
  const cassiterite = {
    dailyTarget: 4760,
    dailyActual: 0,
    mtdTarget: 100000,
    mtdActual: 0,
  };
  const coltan = {
    dailyTarget: 380,
    dailyActual: 0,
    mtdTarget: 8000,
    mtdActual: 0,
  };
  const wolframite = {
    dailyTarget: 190,
    dailyActual: 0,
    mtdTarget: 4000,
    mtdActual: 0,
  };
  for await (const row of rows) {
    if (fns.isSameDay(date, moment(row[header.indexOf("Delivery Date")]).toDate())) {
      if (row[header.indexOf("Type of Minerals")] === `Cassiterite`) {
        cassiterite.dailyActual += Number(row[header.indexOf("Total Weight Delivered")]);
      } else if (row[header.indexOf("Type of Minerals")] === `Coltan`) {
        coltan.dailyActual += Number(row[header.indexOf("Total Weight Delivered")]);
      } else if (row[header.indexOf("Type of Minerals")] === `Wolframite`) {
        wolframite.dailyActual += Number(row[header.indexOf("Total Weight Delivered")]);
      }
    }

    if (moment(row[header.indexOf("Delivery Date")]).isBetween(fns.startOfMonth(new Date()), new Date()) || fns.isSameDay(fns.startOfMonth(new Date()), moment(row[header.indexOf("Delivery Date")]).toDate())) {
      if (row[header.indexOf("Type of Minerals")] === `Cassiterite`) {
        cassiterite.mtdActual += Number(row[header.indexOf("Total Weight Delivered")]);
      } else if (row[header.indexOf("Type of Minerals")] === `Coltan`) {
        coltan.mtdActual += Number(row[header.indexOf("Total Weight Delivered")]);
      } else if (row[header.indexOf("Type of Minerals")] === `Wolframite`) {
        wolframite.mtdActual += Number(row[header.indexOf("Total Weight Delivered")]);
      }
    }
  }

  return {cassiterite, coltan, wolframite};
};

module.exports = {
  getPurchases,
  getDailyReport,
};
