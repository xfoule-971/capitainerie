const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Port de Plaisance',
            version: '1.0.0',
            description: 'Documentation de l’API Catways / Réservations / Users'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur local'
            }
        ]
    },
    apis: ['./routes/*.js'] // Swagger lira les commentaires JSDoc dans routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
