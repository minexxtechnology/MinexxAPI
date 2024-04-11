class Company{
    id
    name
    address
    number
    country
    type
    created
    mining

    constructor(input){
        this.id = input.id
        this.name = input.name
        this.address = input.address || null
        this.number = input.number || null
        this.country = input.country || null
        this.type = input.type || `Other`
        this.mining = input.mining || false
        this.created = input.created || new Date()
    }
}

module.exports = Company