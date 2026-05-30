const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "gayatri3",   // change this
    database: "flowerShop"
});

db.connect(err => {
    if (err) {
        console.log("DB Error:", err);
    } else {
        console.log("MySQL Connected");
    }
});

/* ---------------- PRODUCTS ---------------- */
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, result) => {
        res.json(result);
    });
});

app.post("/products", (req, res) => {
    const { name, price } = req.body;
    db.query("INSERT INTO products (name, price) VALUES (?,?)",
        [name, price],
        (err, result) => {
            res.json(result);
        }
    );
});

/* ---------------- CUSTOMERS ---------------- */
app.get("/customers", (req, res) => {
    db.query("SELECT * FROM customers", (err, result) => {
        res.json(result);
    });
});

app.post("/customers", (req, res) => {
    const { name, email, phone } = req.body;
    db.query("INSERT INTO customers (name, email, phone) VALUES (?,?,?)",
        [name, email, phone],
        (err, result) => {
            res.json(result);
        }
    );
});

/* ---------------- ORDERS ---------------- */
app.get("/orders", (req, res) => {
    db.query("SELECT * FROM orders", (err, result) => {
        res.json(result);
    });
});

app.post("/orders", (req, res) => {
    const { product_name, quantity, total, status } = req.body;
    db.query("INSERT INTO orders (product_name, quantity, total, status) VALUES (?,?,?,?)",
        [product_name, quantity, total, status],
        (err, result) => {
            res.json(result);
        }
    );
});

/* ---------------- PAYMENTS ---------------- */
app.get("/payments", (req, res) => {
    db.query("SELECT * FROM payments", (err, result) => {
        res.json(result);
    });
});

app.post("/payments", (req, res) => {
    const { order_id, amount, method, status } = req.body;
    db.query("INSERT INTO payments (order_id, amount, method, status) VALUES (?,?,?,?)",
        [order_id, amount, method, status],
        (err, result) => {
            res.json(result);
        }
    );
});

/* ---------------- INVENTORY ---------------- */
app.get("/inventory", (req, res) => {
    db.query("SELECT * FROM inventory", (err, result) => {
        res.json(result);
    });
});

app.post("/inventory", (req, res) => {
    const { item_name, stock, price } = req.body;
    db.query("INSERT INTO inventory (item_name, stock, price) VALUES (?,?,?)",
        [item_name, stock, price],
        (err, result) => {
            res.json(result);
        }
    );
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

app.get("/dashboard-stats", (req, res) => {
    let stats = {};

    db.query("SELECT COUNT(*) AS count FROM products", (err, p) => {
        stats.products = p[0].count;

        db.query("SELECT COUNT(*) AS count FROM customers", (err, c) => {
            stats.customers = c[0].count;

            db.query("SELECT COUNT(*) AS count FROM orders", (err, o) => {
                stats.orders = o[0].count;

                db.query("SELECT COUNT(*) AS count FROM payments", (err, pay) => {
                    stats.payments = pay[0].count;

                    db.query("SELECT COUNT(*) AS count FROM inventory", (err, i) => {
                        stats.inventory = i[0].count;

                        res.json(stats);
                    });
                });
            });
        });
    });
});