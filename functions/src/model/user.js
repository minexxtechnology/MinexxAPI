class User{
    uid
    name
    surname
    email
    password
    phone
    photoURL
    company
    status
    type
    companies
    created
    updated
    lastLogin

    constructor(input){
        this.uid = input.uid
        this.name = input.name
        this.surname = input.surname
        this.email = input.email
        this.password = input.password
        this.companies = input.companies || []
        this.phone = input.phone || null
        this.photoURL = input.photoURL || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6UoKMDDkR6Vm71IvuhKhIzMSCeUoG9oh3k7SMJ1qfWQ&s`
        this.status = input.status || `active`
        this.type = input.type || `minexx`
        this.company = input.company || null
        this.created = input.created || new Date()
        this.updated = input.updated || new Date()
        this.lastLogin = input.lastLogin || new Date()
    }
}

module.exports = User