const fs = require('fs')
const data = require('../data.json')
const { birth, date } = require('../utils')

exports.index = function(req, res) {
    return res.render("instructors/index", { instructors: data.instructors })
}

// show
exports.show = function(req, res) {
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })
    if (!foundInstructor) return res.send("Instructor not found!")




    const instructor = {
        ...foundInstructor,
        birth: birth(foundInstructor.birth),
        // string e transformar em array quadno encontrar uma virgula
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
    }

    return res.render("instructors/show", { instructor })
}

// create
exports.create = function(req,res) {
    return res.render("instructors/create")
}

//Post
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
    const id = Number(data.instructors.length + 1)

    data.instructors.push({
            id,
            avatar_url,
            name,
            birth,
            gender,
            services,
            created_at
        })
        //adiciona o req.body no array instructors
        // data.instructors.push(req.body)
        // escreve os dados do req body depois de traduzido em json, no data.js
        //call back function serve para nao bloquear o aplicativo enqto está rodando a função
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if (err) return res.send("write file error!")

            return res.redirect("/instructors")
        })
        //  return res.send(req.body)
}

// edit
exports.edit = function(req, res) {
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })
    if (!foundInstructor) return res.send("Instructor not found!")

    const instructor = {
        ...foundInstructor,
        // birth: date(foundInstructor.birth) // 1992-3-27
        birth: date(foundInstructor.birth).iso
    }


    return res.render('instructors/edit', { instructor })
}

// put
exports.put = function(req, res) {
    const { id } = req.body
    let index = 0
    const foundInstructor = data.instructors.find(function(instructor, foundIndex) {
        if (id == instructor.id) {
            index = foundIndex
            return true
        }
    })
    if (!foundInstructor) return res.send("Instructor not found!")

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("write file error")
        return res.redirect(`/instructors/${id}`)
    })
}

// DELETE
exports.delete = function(req, res) {
    const { id } = req.body
    const filteredInstructor = data.instructors.filter(function(instructor) {
        return instructor.id != id
    })

    data.instructors = filteredInstructor
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("write file error")
        return res.redirect("/instructors")
    })
}