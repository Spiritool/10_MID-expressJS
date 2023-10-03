const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const connection = require('../config/db');

router.get('/', function (req, res) {
    connection.query(`SELECT b.judul, a.penulis, a.ulasan, a.peringkat
    from reviews a
    JOIN movies b on b.id_movie=a.id_movie`, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
                error:err
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data Movies',
                data: rows
            })
        }
    });
});

router.post('/store', [
    body('id_movie').notEmpty(),
    body('penulis').notEmpty(),
    body('ulasan').notEmpty(),
    body('peringkat').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        id_movie: req.body.id_movie,
        penulis: req.body.penulis,
        ulasan: req.body.ulasan,
        peringkat: req.body.peringkat,
    }
    connection.query('insert into reviews set ?', Data, function(err, rows) {
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
    connection.query(`SELECT b.judul, a.penulis, a.ulasan, a.peringkat
    from reviews a
    JOIN movies b on b.id_movie=a.id_movie where id_review = ${id}`, function (err, rows) {
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
                message: 'Data Movies',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/:id', [
    body('id_movie').notEmpty(),
    body('penulis').notEmpty(),
    body('ulasan').notEmpty(),
    body('peringkat').notEmpty(),
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
        penulis: req.body.penulis,
        ulasan: req.body.ulasan,
        peringkat: req.body.peringkat,
    }
    connection.query(`update reviews set ? where id_review = ${id}`, Data, function (err, rows) {
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
    connection.query(`delete from reviews where id_review = ${id}`, function (err, rows) {
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
    