const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const client = require('./connection')
const { user } = require('pg/lib/defaults')
const app = express()

app.use(express.static(path.join(__dirname, 'Home')));
app.use(bodyParser.json())
app.set('view engine','ejs')
app.set('views','views')


app.listen(5500, () => {
    console.log('server berjalan')
})

client.connect(err => {
    if (err) {
        console.log(err.message)
    } else {
        console.log('connected....')
    }
})

app.get('/', (req, res) => {
    res.render("index")
})

app.get('/CardHome', (req, res) => {
    res.render("CardHome")
})

app.get('/Input', (req, res) => {
    client.query(`SELECT * FROM public.kasir_barang`, (err, result) => {
        const users= JSON.parse(JSON.stringify(result))
        if (err) {
            res.send(err.message)       
        } else {
            // res.send(users)
            res.render("InputProduct",{users: users, title: "hasan"}) // mengirim hasil
        }
    })
})

app.post('/',(req,res)=>{

    const {nama_barang, harga_beli, harga_jual} = req.body

    client.query((`INSERT INTO kasir_barang(nama_barang,harga_beli,harga_jual) values('${nama_barang}','${harga_beli}','${harga_jual}')`),(err,result)=>{
        if (!err) {
            res.send('Insert sucsess') //mengirim hasil
        } else {
            res.send(err.message) // mngirim error
        }
    })


})

app.put('/:id', (req,res)=>{

    const {nama_barang, harga_beli, harga_jual} = req.body

    client.query((`UPDATE kasir_barang SET nama_barang = '${nama_barang}', harga_beli = '${harga_beli}', harga_jual = '${harga_jual}' WHERE id='${req.params.id}'`),(err,result) =>{
        if (!err) {
            res.send('Update sucsess') //mengirim hasil
        } else {
            res.send(err.message) // mngirim error
        }
    } )
})

app.delete('/:id',(req,res)=>{

    const {nama_barang, harga_beli, harga_jual} = req.body

    client.query((`DELETE kasir_barang WHERE id='${req.params.id}'`),(req,result)=>{

        if (!err) {
            res.send('Delete sucsess') //mengirim hasil
        } else {
            res.send(err.message) // mngirim error
        }
    })

})