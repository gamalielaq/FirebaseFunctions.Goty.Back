"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.getGoty = exports.helloWorld = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
var serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://firestore-chart.firebaseio.com'
});
const db = admin.firestore(); //Coneccion a la base de datos de firestore
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.json({
        mesange: "Hola mundo desde funciones de fire store"
    });
});
exports.getGoty = functions.https.onRequest(async (request, response) => {
    const gotyRef = db.collection('goty');
    const docsSnap = await gotyRef.get();
    const juegos = docsSnap.docs.map(doc => doc.data());
    response.json(juegos);
});
// Servidor Epress  node basico
// npm install express cors
//Configuració nExpres 
const app = express();
app.use(cors({ origin: true })); // permitmos cualquier peticon de cualquier domiio (cors)
app.get('/goty', async (req, res) => {
    const gotyRef = db.collection('goty');
    const docsSnap = await gotyRef.get();
    const juegos = docsSnap.docs.map(doc => doc.data());
    res.json(juegos);
});
app.post('/goty/:id', async (req, res) => {
    const id = req.params.id;
    const gameRef = db.collection('goty').doc(id);
    const gameSnap = await gameRef.get();
    if (!gameSnap.exists) {
        res.status(404).json({
            ok: false,
            msg: 'No existe un juego con ese id ' + id
        });
    }
    else {
        const antes = gameSnap.data() || { votos: 0 };
        await gameRef.update({
            votos: antes.votos + 1
        });
        res.status(200).json({
            ok: true,
            msg: `Gracias por tu voto ${antes.name}`
        });
    }
});
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map