const Export = require("../model/export");
const {sheets, spreadsheets} = require("../utils/connect");
const {getCompany} = require("./company");
const {getFile} = require("./file");

const getExports = async () => {
  const exports = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.export, range: "Export!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Exportation ID")]);

  for await (const single of rows) {
    const export_ = new Export({
      id: rows.indexOf(single),
      blendingID: single[header.indexOf(`Blending ID`)],
      date: new Date(single[header.indexOf(`Date`)]),
      mineral: single[header.indexOf(`Mineral Type`)],
      grade: single[header.indexOf(`Grade `)],
      value: single[header.indexOf(`Export value (USD)`)],
      netWeight: single[header.indexOf(`Net Weight (kg)`)],
      grossWeight: single[header.indexOf(`Gross Weight (kg)`)],
      stockBalance: single[header.indexOf(`Stock Balance`)],
      exportationID: single[header.indexOf(`Exportation ID`)],
      rmbRep: single[header.indexOf(`RMB Representative`)],
      exportRep: single[header.indexOf(`Exporter Representative`)],
      traceabilityAgent: single[header.indexOf(`Traceability Agent`)],
      destination: single[header.indexOf(`Destination`)],
      itinerary: single[header.indexOf(`Itinerary`)],
      shipmentNumber: single[header.indexOf(`Shipment Number`)],
      exportCert: single[header.indexOf(`Export Certificate Number`)],
      rraCert: single[header.indexOf(`RRA certificate Number`)],
      transporter: single[header.indexOf(`Transporter`)],
      driverID: single[header.indexOf(`ID Number of the driver`)],
      truckFrontPlate: single[header.indexOf(`Truck Plate Number - Front`)],
      truckBackPlate: single[header.indexOf(`Truck Plate Number - Back`)],
      tags: single[header.indexOf(`Number of tags`)],
      totalGrossWeight: single[header.indexOf(`Total Gross Weight(kg)`)],
      totalNetWeight: single[header.indexOf(`Total Net Weight(kg)`)],
      company: single[header.indexOf(`Company Name`)],
      itsciForms: single[header.indexOf(`All ITSCI forms (mine & processing, export) signed and scanned`)],
      note: single[header.indexOf(`Note`)],
      picture: single[header.indexOf(`Picture`)],
      otherDocument: single[header.indexOf(`Other Document`)],
      transporterDocument: single[header.indexOf(`Transporter Document`)],
      asiDocument: single[header.indexOf(`ASI Document`)],
      rraExportDocument: single[header.indexOf(`RRA Export Document`)],
      rmbExportDocument: single[header.indexOf(`RMB Export Document`)],
      exporterApplicationDocument: single[header.indexOf(`Exporter Application Document`)],
      scannedExportDocuments: single[header.indexOf(`Scanned Export Documents`)],
      link: single[header.indexOf(`Track`)],
    });
    try {
      export_.company = await getCompany(export_.company);
    } catch (err) {/* empty */}
    exports.push(export_);
  }

  return exports;
};

const getCompanyExports = async (id) => {
  const exports = [];
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.export, range: "Export!A:ZZ"});
  const header = results.data.values[0];
  const rows = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Exportation ID")] && item[header.indexOf("Company Name")] === id);

  for await (const single of rows) {
    const export_ = new Export({
      id: rows.indexOf(single),
      blendingID: single[header.indexOf(`Blending ID`)],
      date: single[header.indexOf(`Date`)],
      mineral: single[header.indexOf(`Mineral Type`)],
      grade: single[header.indexOf(`Grade `)],
      value: single[header.indexOf(`Export value (USD)`)],
      netWeight: single[header.indexOf(`Net Weight (kg)`)],
      grossWeight: single[header.indexOf(`Gross Weight (kg)`)],
      stockBalance: single[header.indexOf(`Stock Balance`)],
      exportationID: single[header.indexOf(`Exportation ID`)],
      rmbRep: single[header.indexOf(`RMB Representative`)],
      exportRep: single[header.indexOf(`Exporter Representative`)],
      traceabilityAgent: single[header.indexOf(`Traceability Agent`)],
      destination: single[header.indexOf(`Destination`)],
      itinerary: single[header.indexOf(`Itinerary`)],
      shipmentNumber: single[header.indexOf(`Shipment Number`)],
      exportCert: single[header.indexOf(`Export Certificate Number`)],
      rraCert: single[header.indexOf(`RRA certificate Number`)],
      transporter: single[header.indexOf(`Transporter`)],
      driverID: single[header.indexOf(`ID Number of the driver`)],
      truckFrontPlate: single[header.indexOf(`Truck Plate Number - Front`)],
      truckBackPlate: single[header.indexOf(`Truck Plate Number - Back`)],
      tags: single[header.indexOf(`Number of tags`)],
      totalGrossWeight: single[header.indexOf(`Total Gross Weight(kg)`)],
      totalNetWeight: single[header.indexOf(`Total Net Weight(kg)`)],
      company: single[header.indexOf(`Company Name`)],
      itsciForms: single[header.indexOf(`All ITSCI forms (mine & processing, export) signed and scanned`)],
      note: single[header.indexOf(`Note`)],
      picture: single[header.indexOf(`Picture`)],
      otherDocument: single[header.indexOf(`Other Document`)],
      transporterDocument: single[header.indexOf(`Transporter Document`)],
      asiDocument: single[header.indexOf(`ASI Document`)],
      rraExportDocument: single[header.indexOf(`RRA Export Document`)],
      rmbExportDocument: single[header.indexOf(`RMB Export Document`)],
      exporterApplicationDocument: single[header.indexOf(`Exporter Application Document`)],
      scannedExportDocuments: single[header.indexOf(`Scanned Export Documents`)],
      link: single[header.indexOf(`Track`)],
    });
    try {
      export_.company = await getCompany(export_.company);
    } catch (err) {/* empty */}
    exports.push(export_);
  }

  return exports;
};

{/**
 *
 * @param {Number} id - Index of the exportation details being fetched
 * @returns
*/}
const getExport = async (id) => {
  const results = await sheets.spreadsheets.values.get({spreadsheetId: spreadsheets.export, range: "Export!A:ZZ"});
  const header = results.data.values[0];
  const single = results.data.values.filter((item, i)=>i>0 && item[header.indexOf("Exportation ID")])[id];

  const export_ = new Export({
    id,
    blendingID: single[header.indexOf(`Blending ID`)],
    date: single[header.indexOf(`Date`)],
    mineral: single[header.indexOf(`Mineral Type`)],
    grade: single[header.indexOf(`Grade `)],
    value: single[header.indexOf(`Export value (USD)`)],
    netWeight: single[header.indexOf(`Net Weight (kg)`)],
    grossWeight: single[header.indexOf(`Gross Weight (kg)`)],
    stockBalance: single[header.indexOf(`Stock Balance`)],
    exportationID: single[header.indexOf(`Exportation ID`)],
    rmbRep: single[header.indexOf(`RMB Representative`)],
    exportRep: single[header.indexOf(`Exporter Representative`)],
    traceabilityAgent: single[header.indexOf(`Traceability Agent`)],
    destination: single[header.indexOf(`Destination`)],
    itinerary: single[header.indexOf(`Itinerary`)],
    shipmentNumber: single[header.indexOf(`Shipment Number`)],
    exportCert: single[header.indexOf(`Export Certificate Number`)],
    rraCert: single[header.indexOf(`RRA certificate Number`)],
    transporter: single[header.indexOf(`Transporter`)],
    driverID: single[header.indexOf(`ID Number of the driver`)],
    truckFrontPlate: single[header.indexOf(`Truck Plate Number - Front`)],
    truckBackPlate: single[header.indexOf(`Truck Plate Number - Back`)],
    tags: single[header.indexOf(`Number of tags`)],
    totalGrossWeight: single[header.indexOf(`Total Gross Weight(kg)`)],
    totalNetWeight: single[header.indexOf(`Total Net Weight(kg)`)],
    company: single[header.indexOf(`Company Name`)],
    itsciForms: single[header.indexOf(`All ITSCI forms (mine & processing, export) signed and scanned`)],
    note: single[header.indexOf(`Note`)],
    picture: single[header.indexOf(`Picture`)],
    otherDocument: single[header.indexOf(`Other Document`)],
    transporterDocument: single[header.indexOf(`Transporter Document`)],
    asiDocument: single[header.indexOf(`ASI Document`)],
    rraExportDocument: single[header.indexOf(`RRA Export Document`)],
    rmbExportDocument: single[header.indexOf(`RMB Export Document`)],
    exporterApplicationDocument: single[header.indexOf(`Exporter Application Document`)],
    scannedExportDocuments: single[header.indexOf(`Scanned Export Documents`)],
    link: single[header.indexOf(`Track`)],
  });

  try {
    export_.company = await getCompany(export_.company);
  } catch (err) {/* empty */}

  try {
    export_.itsciForms = await getFile(export_.itsciForms.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.picture = await getFile(export_.picture.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.otherDocument = await getFile(export_.otherDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.transporterDocument = await getFile(export_.transporterDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.asiDocument = await getFile(export_.asiDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.rraExportDocument = await getFile(export_.rraExportDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.rmbExportDocument = await getFile(export_.rmbExportDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.exporterApplicationDocument = await getFile(export_.exporterApplicationDocument.split(`/`)[1]);
  } catch (err) {/* empty */}
  try {
    export_.scannedExportDocuments = await getFile(export_.scannedExportDocuments.split(`/`)[1]);
  } catch (err) {/* empty */}

  return export_;
};

module.exports = {
  getExport,
  getExports,
  getCompanyExports,
};
