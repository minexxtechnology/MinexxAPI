class Session{
    id
    user
    valid
    userAgent
    created
    updated
    ipAddress

    constructor(input){
        this.user = input.user
        this.valid = input.valid || true
        this.userAgent = input.userAgent
        this.created = input.created || new Date()
        this.updated = input.updated || new Date()
        this.ipAddress = input.ipAddress || `0.0.0.0`
    }
}

module.exports = Session