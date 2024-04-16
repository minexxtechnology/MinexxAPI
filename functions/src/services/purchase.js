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
  const date = new Date();
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
        cassiterite.dailyActual += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("Type of Minerals")] === `Coltan`) {
        coltan.dailyActual += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("Type of Minerals")] === `Wolframite`) {
        wolframite.dailyActual += Number(row[header.indexOf("Processing Weight (kg)")]);
      }
    }

    if (moment(row[header.indexOf("Delivery Date")]).isBetween(fns.startOfMonth(new Date()), new Date()) || fns.isSameDay(fns.startOfMonth(new Date()), moment(row[header.indexOf("Delivery Date")]).toDate())) {
      if (row[header.indexOf("Type of Minerals")] === `Cassiterite`) {
        cassiterite.mtdActual += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("Type of Minerals")] === `Coltan`) {
        coltan.mtdActual += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("Type of Minerals")] === `Wolframite`) {
        wolframite.mtdActual += Number(row[header.indexOf("Processing Weight (kg)")]);
      }
    }
  }

  return {cassiterite, coltan, wolframite};
};

const getBalanceReport = async (user) => {
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.purchase_tracker, range: "Purchase Tracker!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("ID")]);
  const cassiterite = {
    minexx: 0,
    supplier: 0,
    shipped: 0,
    rmr: 0,
  };
  const coltan = {
    minexx: 0,
    supplier: 0,
    shipped: 0,
    rmr: 0,
  };
  const wolframite = {
    minexx: 0,
    supplier: 0,
    shipped: 0,
    rmr: 0,
  };
  for await (const row of rows) {
    if (row[header.indexOf("Type of Minerals")] === `Cassiterite`) {
      if (row[header.indexOf("New Location storage")] === `Minexx Container`) {
        cassiterite.minexx += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("New Location storage")] === `With Buyer`) {
        cassiterite.shipped += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("New Location storage")] === `With Supplier`) {
        cassiterite.supplier += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("New Location storage")] === `RMR Container`) {
        cassiterite.rmr += Number(row[header.indexOf("Processing Weight (kg)")]);
      }
    } else if (row[header.indexOf("Type of Minerals")] === `Coltan`) {
      if (row[header.indexOf("New Location storage")] === `Minexx Container`) {
        coltan.minexx += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("New Location storage")] === `With Buyer`) {
        coltan.shipped += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("New Location storage")] === `With Supplier`) {
        coltan.supplier += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("New Location storage")] === `RMR Container`) {
        coltan.rmr += Number(row[header.indexOf("Processing Weight (kg)")]);
      }
    } else if (row[header.indexOf("Type of Minerals")] === `Wolframite`) {
      if (row[header.indexOf("New Location storage")] === `Minexx Container`) {
        wolframite.minexx += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("New Location storage")] === `With Buyer`) {
        wolframite.shipped += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("New Location storage")] === `With Supplier`) {
        wolframite.supplier += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("New Location storage")] === `RMR Container`) {
        wolframite.rmr += Number(row[header.indexOf("Processing Weight (kg)")]);
      }
    }
  }

  return {cassiterite, coltan, wolframite};
};

const getPurchaseReport = async (user) => {
  const date = new Date();
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.purchase_tracker, range: "Purchase Tracker!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("ID")]);
  const cassiterite = {
    daily: 0,
    weekly: 0,
    monthly: 0,
  };
  const coltan = {
    daily: 0,
    weekly: 0,
    monthly: 0,
  };
  const wolframite = {
    daily: 0,
    weekly: 0,
    monthly: 0,
  };

  for await (const row of rows) {
    if (row[header.indexOf("Type of Minerals")] === `Cassiterite`) {
      if (fns.isSameDay(date, moment(row[header.indexOf("Delivery Date")]).toDate())) {
        cassiterite.daily += Number(row[header.indexOf("Amount Paid")]);
      }
      if (fns.isSameWeek(date, moment(row[header.indexOf("Delivery Date")]).toDate())) {
        cassiterite.weekly += Number(row[header.indexOf("Amount Paid")]);
      }
      if (fns.isSameMonth(date, moment(row[header.indexOf("Delivery Date")]).toDate())) {
        cassiterite.monthly += Number(row[header.indexOf("Amount Paid")]);
      }
    } else if (row[header.indexOf("Type of Minerals")] === `Coltan`) {
      if (fns.isSameDay(date, moment(row[header.indexOf("Delivery Date")]).toDate())) {
        coltan.daily += Number(row[header.indexOf("Amount Paid")]);
      }
      if (fns.isSameWeek(date, moment(row[header.indexOf("Delivery Date")]).toDate())) {
        coltan.weekly += Number(row[header.indexOf("Amount Paid")]);
      }
      if (fns.isSameMonth(date, moment(row[header.indexOf("Delivery Date")]).toDate())) {
        coltan.monthly += Number(row[header.indexOf("Amount Paid")]);
      }
    } else if (row[header.indexOf("Type of Minerals")] === `Wolframite`) {
      if (fns.isSameDay(date, moment(row[header.indexOf("Delivery Date")]).toDate())) {
        wolframite.daily += Number(row[header.indexOf("Amount Paid")]);
      }
      if (fns.isSameWeek(date, moment(row[header.indexOf("Delivery Date")]).toDate())) {
        wolframite.weekly += Number(row[header.indexOf("Amount Paid")]);
      }
      if (fns.isSameMonth(date, moment(row[header.indexOf("Delivery Date")]).toDate())) {
        wolframite.monthly += Number(row[header.indexOf("Amount Paid")]);
      }
    }
  }

  return {cassiterite, coltan, wolframite};
};

module.exports = {
  getPurchases,
  getDailyReport,
  getBalanceReport,
  getPurchaseReport,
};
