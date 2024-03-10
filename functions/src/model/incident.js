class Incident{
    id
    date
    reportedOn
    reportedBy
    location
    riskCategory
    indicator
    proof
    image
    description
    score
    level
    source
    detailedDescription
    company

    constructor(input){
        this.id = input.id
        this.date = input.date || new Date()
        this.reportedOn = input.reportedOn || new Date()
        this.reportedBy = input.reportedBy
        this.location = input.location
        this.riskCategory = input.riskCategory
        this.indicator = input.indicator
        this.proof = input.proof
        this.image = input.image || null
        this.description = input.description
        this.score = input.score || 0
        this.level = input.level || `moderate`
        this.source = input.source || null
        this.detailedDescription = input.detailedDescription || null
        this.company = input.company || null
    }
}

module.exports = Incident