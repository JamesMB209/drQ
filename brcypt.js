const bcrypt = require("bcrypt")

module.exports.hashPassword = (plainPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt((err, salt) => {
            if (err) {
                reject(`Error in Salting: ${err}`)
            } else {
                bcrypt.hash(plainPassword, salt, (err, hash) => {
                    if (err) {
                        reject(`Error in hash: ${err}`)
                    } else {
                        resolve(hash)
                    }
                })
            }
        })
    })
}

module.exports.checkPassword = (plainPassword, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, hashedPassword, (err, same) => {
            if (err) {
                reject(`Error in checking: ${err}`)
            } else {
                resolve(same)
            }
        })
    })
}