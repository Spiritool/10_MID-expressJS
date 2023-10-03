const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const connection = require('../config/db');

router.get('/', function (req, res) {
    connection.query(`select a.id_peran, b.judul, c.nama_aktor, a.karakter
    from roles a
    JOIN movies b on b.id_movie=a.id_movie
    JOIN actors c on c.id_aktor=a.id_aktor`, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
                error:err
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data Booking',
                data: rows
            })
        }
    });
});

router.post('/store', [
    body('id_movie').notEmpty(),
    body('id_aktor').notEmpty(),
    body('karakter').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        id_movie: req.body.id_movie,
        id_aktor: req.body.id_aktor,
        karakter: req.body.karakter,
    }
    connection.query('insert into roles set ?', Data, function(err, rows) {
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
    connection.query(`select a.id_peran, b.judul, c.nama_aktor, a.karakter
    from roles a
    JOIN movies b on b.id_movie=a.id_movie
    JOIN actors c on c.id_aktor=a.id_aktor 
    where id_peran = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
                error:err
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
                message: 'Data Roles',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/:id', [
    body('id_movie').notEmpty(),
    body('id_aktor').notEmpty(),
    body('karakter').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        id_movie: req.body.id_movie,
        id_aktor: req.body.id_aktor,
        karakter: req.body.karakter,
    }
    connection.query(`update roles set ? where id_peran = ${id}`, Data, function (err, rows) {
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
    connection.query(`delete from roles where id_peran = ${id}`, function (err, rows) {
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
