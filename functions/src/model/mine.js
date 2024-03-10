class Mine {
    id
    name
    company
    mineral
    location
    note
    image

    constructor(input){
        this.id = input.id
        this.name = input.name
        this.company = input.company
        this.mineral = input.mineral
        this.location = input.location || null
        this.note = input.note || null
        this.image = input.image || ""
    }
}

module.exports = Mine