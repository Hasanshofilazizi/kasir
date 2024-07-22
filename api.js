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
// app.get('/InputProduct', (req, res) => {
//     const users= JSON.parse(JSON.stringify(res))
//     res.render("InputProduct",{users: users, title: "hasan"})
// })
app.get('/Checkout', (req, res) => {
    client.query('SELECT * FROM public.kasir_barang', (err, result) => {
        if (err) {
            res.send(err.message);
        } else {
            const users = result.rows;
            res.render('Checkout', { users: users, product: null, title: 'Product Management' });
        }
    });
})
app.get('/OrderProduct', (req, res) => {
    res.render("OrderProduct")
})
app.get('/PaymentProduct', (req, res) => {
    res.render("PaymentProduct")
})
app.get('/Register', (req, res) => {
    res.render("Register")
})

app.use(express.urlencoded({ extended: true }));

app.get('/InputProduct', (req, res) => {
    client.query('SELECT * FROM public.kasir_barang', (err, result) => {
        if (err) {
            res.send(err.message);
        } else {
            const users = result.rows;
            res.render('InputProduct', { users: users, product: null, title: 'Product Management' });
        }
    });
});

app.post('/saveProduct', (req, res) => {
    const { id, nama_barang, harga_beli, harga_jual } = req.body;
    if (id) {
        // Update existing product
        client.query(
            'UPDATE public.kasir_barang SET nama_barang = $1, harga_beli = $2, harga_jual = $3 WHERE id = $4',
            [nama_barang, harga_beli, harga_jual, id],
            (err, result) => {
                if (err) {
                    res.send(err.message);
                } else {
                    res.redirect('/InputProduct');
                }
            }
        );
    } else {
        // Insert new product
        client.query(
            'INSERT INTO public.kasir_barang (nama_barang, harga_beli, harga_jual) VALUES ($1, $2, $3)',
            [nama_barang, harga_beli, harga_jual],
            (err, result) => {
                if (err) {
                    res.send(err.message);
                } else {
                    res.redirect('/InputProduct');
                }
            }
        );
    }
});

app.get('/editProduct/:id', (req, res) => {
    const productId = req.params.id;
    client.query('SELECT * FROM public.kasir_barang WHERE id = $1', [productId], (err, result) => {
        if (err) {
            res.send(err.message);
        } else {
            const product = result.rows[0];
            client.query('SELECT * FROM public.kasir_barang', (err, allProducts) => {
                if (err) {
                    res.send(err.message);
                } else {
                    const users = allProducts.rows;
                    res.render('InputProduct', { users: users, product: product, title: 'Product Management' });
                }
            });
        }
    });
});

app.get('/deleteProduct/:id', (req, res) => {
    const productId = req.params.id;
    client.query('DELETE FROM public.kasir_barang WHERE id = $1', [productId], (err, result) => {
        if (err) {
            res.send(err.message);
        } else {
            res.redirect('/InputProduct');
        }
    });
});


app.post('/views',(req,res)=>{

    const {nama_barang, harga_beli, harga_jual} = req.body

    client.query((`INSERT INTO kasir_barang(nama_barang,harga_beli,harga_jual) values('${nama_barang}','${harga_beli}','${harga_jual}')`),(err,result)=>{
        if (!err) {
            res.send('Insert sucsess') //mengirim hasil
        } else {
            res.send(err.message) // mngirim error
        }
    })


})

app.put('/views/:id', (req,res)=>{

    const {nama_barang, harga_beli, harga_jual} = req.body

    client.query((`UPDATE kasir_barang SET nama_barang = '${nama_barang}', harga_beli = '${harga_beli}', harga_jual = '${harga_jual}' WHERE id='${req.params.id}'`),(err,result) =>{
        if (!err) {
            res.send('Update sucsess') //mengirim hasil
        } else {
            res.send(err.message) // mngirim error
        }
    } )
})

app.delete('/views/:id',(req,res)=>{

    client.query((`DELETE FROM kasir_barang WHERE id='${req.params.id}'`),(err,result)=>{

        if (!err) {
            res.send('Delete sucsess') //mengirim hasil
        } else {
            res.send(err.message) // mngirim error
        }
    })

})