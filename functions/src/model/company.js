class Company{
    id
    name
    address
    number
    country
    type
    created

    constructor(input){
        this.id = input.id
        this.name = input.name
        this.address = input.address || null
        this.number = input.number || null
        this.country = input.country || null
        this.type = input.type || `Other`
        this.created = input.created || new Date()
    }
}

module.exports = Company