const express = require('express')
const router = express.Router()
const model = require('../model/model')

router.post('/post', async (req, res) => {
    const data = new model({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image
    });
    
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.get('/getAll', async (req, res) => {
    try{
        const data = await model.find()
        res.json(data)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/getOne/:id', async (req, res) => {
    try{
        const data = await model.findById(req.params.id)
        res.json(data)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
})

router.patch('/update/:id', async (req, res) => {
    try{
        const id = req.params.id
        const updateData = req.body
        const options = {new: true}

        const result = await model.findByIdAndUpdate(id, updateData, options)
        res.send(result)
    }
    catch(error) {
        res.status(400).json({message: error.message})
    }
})

router.delete('/delete/:id', async (req, res) => {
    try{
        const id = req.params.id
        const data = await model.findByIdAndDelete(id)
        res.send(`'${data.name}' apagado com sucesso.`) 
    }
    catch(error) {
        res.status(400).json({message: error.message})
    }
})

module.exports = router