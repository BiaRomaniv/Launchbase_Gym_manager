const fs = require('fs')
const data = require('./data.json')
const { birth, date } = require('./utils')

exports.index = function(req, res) {
    return res.render("members/index", { members: data.members })
}

// show
exports.show = function(req, res) {
    const { id } = req.params

    const foundMember = data.members.find(function(member) {
        return member.id == id
    })
    if (!foundMember) return res.send("member not found!")




    const member = {
        ...foundMember,
        birth: birth(foundMember.birth),
        // string e transformar em array quadno encontrar uma virgula

        created_at: new Intl.DateTimeFormat("pt-BR").format(foundMember.created_at),
    }

    return res.render("members/show", { member })
}

//create
exports.create = function(req, res) {
    return res.render("members/create")
}

// post
exports.post = function(req, res) {
    //cria um array com o objeto
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Please, fill all fields')
        }
    }


    // desestruturar o req body
    let { avatar_url, birth, name, services, gender } = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.members.length + 1)

    data.members.push({
            id,
            avatar_url,
            name,
            birth,
            gender,
            services,
            created_at
        })
        //adiciona o req.body no array members
        // data.members.push(req.body)
        // escreve os dados do req body depois de traduzido em json, no data.js
        //call back function serve para nao bloquear o aplicativo enqto está rodando a função
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if (err) return res.send("write file error!")

            return res.redirect("/members")
        })
        //  return res.send(req.body)
}

// edit
exports.edit = function(req, res) {
    const { id } = req.params

    const foundMember = data.members.find(function(member) {
        return member.id == id
    })
    if (!foundMember) return res.send("member not found!")

    const member = {
        ...foundMember,
        // birth: date(foundMember.birth) // 1992-3-27
        birth: date(foundMember.birth)
    }


    return res.render('members/edit', { member })
}

// put

exports.put = function(req, res) {
    const { id } = req.body
    let index = 0
    const foundMember = data.members.find(function(member, foundIndex) {
        if (id == member.id) {
            index = foundIndex
            return true
        }
    })
    if (!foundMember) return res.send("member not found!")

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("write file error")
        return res.redirect(`/members/${id}`)
    })
}

// DELETE

exports.delete = function(req, res) {
    const { id } = req.body
    const filteredMember = data.members.filter(function(member) {
        return member.id != id
    })

    data.members = filteredMember
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("write file error")
        return res.redirect("/members")
    })
}