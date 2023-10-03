const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const connection = require('../config/db');

router.get('/', function (req, res) {
    connection.query('SELECT * from actors', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
                error:err
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data Genre',
                data: rows
            })
        }
    });
});

router.post('/store', [
    body('nama_aktor').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        nama_aktor: req.body.nama_aktor,
    }
    connection.query('insert into actors set ?', Data, function(err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
                error:err
            })
        }else{
            return res.status(201).json({
                status: true,
                message: 'Success..!',
                data: rows[0]
            })
        }
    })
})

router.get('/(:id)', function (req, res) {
    let id = req.params.id;
    connection.query(`select * from actors where id_aktor = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }
        if(rows.lenght <=0){
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            })
        }
        else{
            return res.status(200).json({
                status: true,
                message: 'Data Genre',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/:id', [
    body('nama_aktor').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        nama_aktor: req.body.nama_aktor,
    }
    connection.query(`update actors set ? where id_aktor = ${id}`, Data, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Success..!',
            })
        }
    })
})  

router.delete('/delete/(:id)', function(req, res){
    let id = req.params.id;
    connection.query(`delete from actors where id_aktor = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }else{
            return res.status(200).json({
                status: true,
                message: 'Data has been delete !',
            })
        }
    })
})

module.exports = router; // Corrected export statement
