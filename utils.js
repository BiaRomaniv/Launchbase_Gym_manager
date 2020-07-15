module.exports = {
    birth: function birth(timestamp) {
        const today = new Date()
        const birthDate = new Date(timestamp)

        let birth = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()


        if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
            birth = birth - 1
        }
        return birth
    },
    date: function(timestamp) {
        const date = new Date(timestamp)
        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2) //pq o mes vem de 0 a 11
        const day = `0${date.getUTCDate()}`.slice(-2)

        return {

            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`
        }
    }
}