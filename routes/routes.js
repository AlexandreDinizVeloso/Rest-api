const express = require('express')

const router = express.Router()

router.post('/post', (req, res) => {
    res.send(`POST API`)
})

router.get('/getAll', (req, res) => {
    res.send(`GetAll API`)
})

router.get('/getOne/:id', (req, res) => {
    res.send(`Get by ID API: ${req.params.id}`)
})

router.patch('/update/:id', (req, res) => {
    res.send(`Update API`)
})

router.delete('/delete/:id', (req, res) => {
    res.send(`Delete by ID API`)
})

module.exports = router