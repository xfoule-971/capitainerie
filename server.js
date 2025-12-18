require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const { initClientConnection } = require('./db/mongo');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const indexRouter = require('./routes/index');

const app = express();

// ===============================
// Configuration des vues (EJS)
// ===============================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ===============================
// Connexion MongoDB
// ===============================
initClientConnection()
    .then(() => {
        console.log('Connexion MongoDB effectuée avec succès');
    })
    .catch((err) => {
        console.error('Erreur de connexion MongoDB :', err);
        process.exit(1);
    });

// ===============================
// Middlewares
// ===============================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ===============================
// Sessions (OBLIGATOIRE POUR LOGIN)
// ===============================
app.use(session({
    secret: process.env.SESSION_SECRET || 'russel-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true
    }
}));

// ===============================
// Swagger
// ===============================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===============================
// Routes WEB
// ===============================
app.use('/', indexRouter);

// ===============================
// 404 (HTML)
// ===============================
app.use((req, res) => {
    res.status(404).render('index', {
        error: 'Page introuvable'
    });
});

// ===============================
// Gestion des erreurs
// ===============================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('index', {
        error: 'Erreur serveur'
    });
});

// ===============================
// LANCEMENT DU SERVEUR
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

