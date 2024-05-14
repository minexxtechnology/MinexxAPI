const moment = require("moment");
const fns = require("date-fns");
const {sheets, spreadsheets, firebase} = require("../utils/connect");
const {getFile} = require("./file");

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

const getAdminDaily = async (selection) => {
  const report = [];
  const dates = [];
  for (let x = 0; x < 7; x++) {
    report[moment().subtract(x, "day").toDate().toUTCString().substring(0, 3)] = 0;
    dates.push(moment().subtract(x, "days").toDate());
  }
  let field = "Production Weight (Kg)";
  let date = "Production Date";
  let results;
  if (selection == "production") {
    results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.production, range: "Production!A:ZZ"});
    field = "Production Weight (Kg)";
    date = "Production Date";
  }
  if (selection == "blending") {
    results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.blending, range: "Blending!A:ZZ"});
    field = "Total Output Weight(kg)";
    date = "Blending Date";
  }
  if (selection == "processing") {
    results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.processing, range: "Processing!A:ZZ"});
    field = "Processing Weight (kg)";
    date = "Date";
  }

  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf(field)]);

  for await (const row of rows) {
    for (const day of dates) {
      if (fns.isSameDay(day, moment(row[header.indexOf(date)]).toDate())) {
        report[day.toUTCString().substring(0, 3)] += (Number(row[header.indexOf(field)])/1000).toFixed(1);
      }
    }
  }

  return report;
};

const getDailyReport = async (user) => {
  const date = new Date();
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.purchase_tracker, range: "Purchase Tracker!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("ID")] && item[header.indexOf("Payment Date")] && item[header.indexOf("Lot Status")] == "Paid");
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
    if (fns.isSameDay(date, moment(row[header.indexOf("Payment Date")]).toDate())) {
      if (row[header.indexOf("Type of Minerals")] === `Cassiterite`) {
        cassiterite.dailyActual += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("Type of Minerals")] === `Coltan`) {
        coltan.dailyActual += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (row[header.indexOf("Type of Minerals")] === `Wolframite`) {
        wolframite.dailyActual += Number(row[header.indexOf("Processing Weight (kg)")]);
      }
    }

    if (moment(row[header.indexOf("Payment Date")]).isBetween(fns.startOfMonth(new Date()), new Date()) || fns.isSameDay(fns.startOfMonth(new Date()), moment(row[header.indexOf("Payment Date")]).toDate())) {
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
    buyer: 0,
    shipped: 0,
    rmr: 0,
  };
  const coltan = {
    minexx: 0,
    supplier: 0,
    buyer: 0,
    shipped: 0,
    rmr: 0,
  };
  const wolframite = {
    minexx: 0,
    supplier: 0,
    buyer: 0,
    shipped: 0,
    rmr: 0,
  };
  for await (const row of rows) {
    if (row[header.indexOf("Type of Minerals")] === `Cassiterite`) {
      if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `minexx container`) {
        cassiterite.minexx += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `with buyer`) {
        cassiterite.buyer += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `shipped`) {
        cassiterite.shipped += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `with supplier`) {
        cassiterite.supplier += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `rmr container`) {
        cassiterite.rmr += Number(row[header.indexOf("Processing Weight (kg)")]);
      }
    } else if (row[header.indexOf("Type of Minerals")] === `Coltan`) {
      if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `minexx container`) {
        coltan.minexx += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `with buyer`) {
        coltan.buyer += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `shipped`) {
        coltan.shipped += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `with supplier`) {
        coltan.supplier += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `rmr container`) {
        coltan.rmr += Number(row[header.indexOf("Processing Weight (kg)")]);
      }
    } else if (row[header.indexOf("Type of Minerals")] === `Wolframite`) {
      if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `minexx container`) {
        wolframite.minexx += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `with buyer`) {
        wolframite.buyer += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `shipped`) {
        wolframite.shipped += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `with supplier`) {
        wolframite.supplier += Number(row[header.indexOf("Processing Weight (kg)")]);
      } else if (String(row[header.indexOf("New Location storage")]).trim().toLowerCase() === `rmr container`) {
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

const getSystemLogs = async () => {
  const logs = [];
  const docs = await firebase.firestore().collection("logs").orderBy("time", "desc").get();

  docs.forEach((doc)=>{
    const log = doc.data();
    log.id = doc.id;
    log.time = doc.createTime.toDate();
    logs.push(log);
  });

  return logs;
};

const getTraceProduction = async (id) => {
  const production = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.production, range: "Production!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("ID")] && item[header.indexOf("Company Name")] === id);

  for await (const row of rows.reverse()) {
    const image = await getFile(row[header.indexOf(`Picture`)].split(`/`)[1]);
    const prod = {
      weight: row[header.indexOf(`Production Weight (Kg)`)],
      location: row[header.indexOf(`Business Location`)],
      rmbRep: row[header.indexOf(`Name of RMB Representative`)],
      traceAgent: row[header.indexOf(`Traceability Agent`)],
      operator: row[header.indexOf(`Name of Operator Representative`)],
      bags: row[header.indexOf(`Number of Bags`)],
      totalWeight: row[header.indexOf(`Total Weight (Kg)`)],
      note: row[header.indexOf(`Note`)],
      picture: image,
    };
    production.push(prod);
  }

  return production;
};

const getTraceBagsProduced = async (id) => {
  const bags = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.bags, range: "Bags!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("ID")] && item[header.indexOf("Company Name")] === id);

  for await (const row of rows.reverse()) {
    const prod = {
      id: row[header.indexOf(`ID`)],
      tag: row[header.indexOf(`Tag Number`)],
      weight: row[header.indexOf(`Weight (Kg)`)],
      tunnel: row[header.indexOf(`Tunnel/pit number or name`)],
      date: row[header.indexOf(`Production/Mining Date`)],
      miner: row[header.indexOf(`Miner Name`)],
      transporter: row[header.indexOf(`Transporter Name`)],
      rmrRep: row[header.indexOf(`RMB Representative at mine site`)],
      security: row[header.indexOf(`Security officer Name`)],
      concentrate: row[header.indexOf(`Estimated concentrate %`)],
      color: row[header.indexOf(`Color of the bag/drum package`)],
      transport: row[header.indexOf(`Transport mode`)],
      itinerary: row[header.indexOf(`Transport itinerary`)],
      time: row[header.indexOf(`Time`)],
      production: row[header.indexOf(`Production ID`)],
    };
    bags.push(prod);
  }

  return bags;
};

const getTraceProcessing = async (id) => {
  const processing = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.processing, range: "Processing!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("ID")] && item[header.indexOf("Company Name")] === id);

  for await (const row of rows.reverse()) {
    const image = row[header.indexOf(`Picture`)] ? await getFile(row[header.indexOf(`Picture`)].split(`/`)[1]) : null;
    const proc = {
      id: row[header.indexOf(`ID`)],
      date: row[header.indexOf(`Date`)],
      location: row[header.indexOf(`Business Location`)],
      rmb: row[header.indexOf(`RMB Representative`)],
      trace: row[header.indexOf(`Traceability Agent`)],
      operator: row[header.indexOf(`Operator Representative`)],
      mineral: row[header.indexOf(`Mineral Type`)],
      inputBags: row[header.indexOf(`Number of Input Bags`)],
      inputWeight: row[header.indexOf(`Total Input Weight (kg)`)],
      outputBags: row[header.indexOf(`Number of Output Bags`)],
      outputWeight: row[header.indexOf(`Total Output Weight(kg)`)],
      tags: row[header.indexOf(`Tag Number`)],
      tagDate: row[header.indexOf(`Tagging Date and Time`)],
      grade: row[header.indexOf(`Grade (%)`)],
      processingWeight: row[header.indexOf(`Processing Weight (kg)`)],
      note: row[header.indexOf(`Note`)],
      picture: image,
      supplier: row[header.indexOf(`Name of mine supplier`)],
      asi: row[header.indexOf(`Presence of Alex Stuart International (ASI)`)],
      lab: row[header.indexOf(`Laboratory`)],
      certificate: row[header.indexOf(`Certificate`)],
      price: row[header.indexOf(`PRICING (USD)`)],
      lme: row[header.indexOf(`LME`)],
      tc: row[header.indexOf(`TC`)],
      ta: row[header.indexOf(`Price per Ta (%)`)],
      unitPrice: row[header.indexOf(`Unit Price`)],
      totalPrice: row[header.indexOf(`Total Price`)],
      paymentMethod: row[header.indexOf(`Payment Method`)],
      security: row[header.indexOf(`Security officer Name`)],
      lot: row[header.indexOf(`Lot Number`)],
    };
    processing.push(proc);
  }

  return processing;
};

const getTraceBagsProcessed = async (id) => {
  const bagsProc= [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.proc_bags, range: "Proc Bags!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("ID")] && item[header.indexOf("Company Name")] === id);

  for await (const row of rows.reverse()) {
    const prod = {
      id: row[header.indexOf(`ID`)],
      tag: row[header.indexOf(`Tag Number`)],
      weight: row[header.indexOf(`Weight (Kg)`)],
      processing: row[header.indexOf(`Tunnel/pit number or name`)],
      date: row[header.indexOf(`Production/Mining Date`)],
      rmrRep: row[header.indexOf(`RMB Representative at mine site`)],
      security: row[header.indexOf(`Security officer Name`)],
      time: row[header.indexOf(`Time`)],
      purchase: row[header.indexOf(`Purchase Tracker`)],
      bags: row[header.indexOf(`SumBags`)],
      production: row[header.indexOf(`Production ID`)],
      storage: row[header.indexOf(`Storage container`)],
      color: row[header.indexOf(`Color of the package/container`)],
      mineral: row[header.indexOf(`Mineral type`)],
      grade: row[header.indexOf(`Grade (%)`)],
    };
    bagsProc.push(prod);
  }

  return bagsProc;
};

const getTraceDrums = async (id) => {
  const drums= [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.drum, range: "Drum!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Drum Number")] && item[header.indexOf("Company Name")] === id);

  for await (const row of rows.reverse()) {
    const drum = {
      drum: row[header.indexOf(`Drum Number`)],
      grossWeight: row[header.indexOf(`Gross weight`)],
      netWeight: row[header.indexOf(`Net weight `)],
      itsci: row[header.indexOf(`Itsci Tag Number`)],
      color: row[header.indexOf(`Drum/Bag Color`)],
      grade: row[header.indexOf(`Grade (%) `)],
      blending: row[header.indexOf(`Blending ID`)],
      asi: row[header.indexOf(`ASI Tag number`)],
    };
    drums.push(drum);
  }

  return drums;
};

module.exports = {
  getPurchases,
  getAdminDaily,
  getDailyReport,
  getBalanceReport,
  getPurchaseReport,
  getSystemLogs,
  getTraceProduction,
  getTraceBagsProduced,
  getTraceProcessing,
  getTraceBagsProcessed,
  getTraceDrums,
};
