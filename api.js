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

// app.use(session({
//     secret: 'query', // Ganti dengan kunci rahasia Anda
//     resave: false, // Session tidak akan disimpan kembali jika tidak ada perubahan
//     saveUninitialized: true, // Session baru akan disimpan walaupun belum ada perubahan
//     cookie: { secure: false } // Set secure ke true jika menggunakan HTTPS
// }))

app.get('/', (req, res) => {
    res.render("index")
})

app.get('/CardHome', (req, res) => {
    res.render("CardHome")
})

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
// app.get('/Register', (req, res) => {
//     res.render("Register")
// })

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

app.post('/saveRegister', (req, res) => {
    const { id, username, email, pasword } = req.body;
    if (id) {
        // Update existing product
        client.query(
            `UPDATE public.akun SET username = $1, email = $2, pasword = $3 WHERE id = $4`,
            [username, email, pasword, id],
            (err, result) => {
                if (err) {
                    res.send(err.message);
                } else {
                    res.redirect('/Register');
                }
            }
        );
    } else {
        client.query(
            `INSERT INTO public.akun (username, email, pasword) VALUES ($1, $2, $3)`,
            [username, email, pasword],
            (err, result) => {
                if (err) {
                    res.send(err.message);
                } else {
                    res.redirect('/Register');
                }
            }
        );
    }

});

app.get('/Register', (req, res) => {
    client.query('SELECT * FROM public.akun', (err, result) => {
        if (err) {
            res.send(err.message);
        } else {
            const users = result.rows;
            res.render('Register', { users: users, title: 'users' });
        }
    });
});