class Export{
    id
    blendingID
    date
    mineral
    grade
    netWeight
    grossWeight
    stockBalance
    exportationID
    rmbRep
    exportRep
    traceabilityAgent
    destination
    itinerary
    shipmentNumber
    exportCert
    rraCert
    transporter
    driverID
    truckFrontPlate
    truckBackPlate
    tags
    totalGrossWeight
    totalNetWeight
    value
    company
    itsciForms
    note
    picture
    otherDocument
    transporterDocument
    asiDocument
    rraExportDocument
    rmbExportDocument
    exporterApplicationDocument
    scannedExportDocuments
    link

    constructor(input){
        this.id = input.id
        this.blendingID = input.blendingID || 0
        this.date = new Date(input.date)
        this.mineral = input.mineral
        this.grade = input.grade || 0
        this.value = input.value || 0
        this.netWeight = input.netWeight || 0
        this.grossWeight = input.grossWeight || 0
        this.stockBalance = input.stockBalance || 0
        this. exportationID = input.exportationID || null
        this.rmbRep = input.rmbRep || null
        this.exportRep = input.exportRep || null
        this.traceabilityAgent = input.traceabilityAgent || null
        this.destination = input.destination || null
        this.itinerary = input.itinerary || null
        this.shipmentNumber = input.shipmentNumber || null
        this.exportCert = input.exportCert || null
        this.rraCert = input.rraCert || null
        this.transporter = input.transporter || null
        this.driverID = input.driverID || null
        this.truckFrontPlate = input.truckFrontPlate || null
        this.truckBackPlate = input.truckBackPlate || null
        this.tags = input.tags || 0
        this.totalGrossWeight = input.totalGrossWeight || null
        this.totalNetWeight = input.totalNetWeight || 0
        this.company = input.company || null
        this.itsciForms = input.itsciForms || null
        this.note = input.note || null
        this.picture = input.picture || null
        this.otherDocument = input.otherDocument || null
        this.transporterDocument = input.transporterDocument || null
        this.asiDocument = input.asiDocument || null
        this.rraExportDocument = input.rraExportDocument || null
        this.rmbExportDocument = input.rmbExportDocument || null
        this.exporterApplicationDocument = input.exporterApplicationDocument || null
        this.scannedExportDocuments = input.scannedExportDocuments || null
        this.link = input.link || null
    }
}

module.exports = Export