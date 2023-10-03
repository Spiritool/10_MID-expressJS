const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const connection = require('../config/db');

router.get('/', function (req, res) {
    connection.query(`SELECT a.judul, a.tahun_rilis, a.durasi, b.nama_genre as genre, c.nama_sutradara as sutradara
    from movies a
    JOIN genres b on a.id_genre = b.id_genre
    JOIN directors c on a.id_sutradara=c.id_sutradara`, function(err, rows){
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
    body('judul').notEmpty(),
    body('tahun_rilis').notEmpty(),
    body('durasi').notEmpty(),
    body('id_genre').notEmpty(),
    body('id_sutradara').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        judul: req.body.judul,
        tahun_rilis: req.body.tahun_rilis,
        durasi: req.body.durasi,
        id_genre: req.body.id_genre,
        id_sutradara: req.body.id_sutradara,
    }
    connection.query('insert into movies set ?', Data, function(err, rows) {
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
    connection.query(`SELECT a.judul, a.tahun_rilis, a.durasi, b.nama_genre as genre, c.nama_sutradara as sutradara
    from movies a
    JOIN genres b on a.id_genre = b.id_genre
    JOIN directors c on a.id_sutradara=c.id_sutradara where id_movie = ${id}`, function (err, rows) {
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
    body('judul').notEmpty(),
    body('tahun_rilis').notEmpty(),
    body('durasi').notEmpty(),
    body('id_genre').notEmpty(),
    body('id_sutradara').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        judul: req.body.judul,
        tahun_rilis: req.body.tahun_rilis,
        durasi: req.body.durasi,
        id_genre: req.body.id_genre,
        id_sutradara: req.body.id_sutradara,
    }
    connection.query(`update movies set ? where id_movie = ${id}`, Data, function (err, rows) {
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
    connection.query(`delete from movies where id_movie = ${id}`, function (err, rows) {
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
