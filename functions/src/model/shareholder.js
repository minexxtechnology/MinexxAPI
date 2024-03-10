class Shareholder {
    id
    company
    name
    percent
    nationality
    nationalID
    address

    constructor(input){
        this.id = input.id
        this.company = input.company
        this.name = input.name
        this.percent = input.percent
        this.nationality = input.nationality
        this.nationalID = input.nationalID
        this.address = input.address
    }
}

module.exports = Shareholder