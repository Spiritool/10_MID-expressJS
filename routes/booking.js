const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const connection = require('../config/db');

router.get('/', function (req, res) {
    connection.query(`SELECT b.judul, a.tanggal_pemesanan, a.jumlah_tiket
    from bookings a
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
                message: 'Data Booking',
                data: rows
            })
        }
    });
});

router.post('/store', [
    body('id_movie').notEmpty(),
    body('tanggal_pemesanan').notEmpty(),
    body('jumlah_tiket').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        id_movie: req.body.id_movie,
        tanggal_pemesanan: req.body.tanggal_pemesanan,
        jumlah_tiket: req.body.jumlah_tiket,
    }
    connection.query('insert into bookings set ?', Data, function(err, rows) {
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
    connection.query(`SELECT b.judul, a.tanggal_pemesanan, a.jumlah_tiket
    from bookings a
    JOIN movies b on b.id_movie=a.id_movie where id_booking = ${id}`, function (err, rows) {
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
                message: 'Data Booking',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/:id', [
    body('id_movie').notEmpty(),
    body('tanggal_pemesanan').notEmpty(),
    body('jumlah_tiket').notEmpty(),
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
        tanggal_pemesanan: req.body.tanggal_pemesanan,
        jumlah_tiket: req.body.jumlah_tiket,
    }
    connection.query(`update bookings set ? where id_booking = ${id}`, Data, function (err, rows) {
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
    connection.query(`delete from bookings where id_booking = ${id}`, function (err, rows) {
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
