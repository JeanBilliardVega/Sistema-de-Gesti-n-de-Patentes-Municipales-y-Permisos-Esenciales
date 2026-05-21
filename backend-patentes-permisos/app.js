const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
/* Si lo cambian que sea distinto al front */
const port = 3000;
/* Conexion db, la informacion esta en docker-compose.yml */
const db = new Pool({
    user: 'admin',
    password: '1234',
    host: 'localhost',
    port: '5432',
    database: 'db_patentes_permisos'
})
const s = 10;
const clave_token = 'clavesecretasupersecreta';

app.get('/hola', (req, res) => {
    res.send('Hola mundo');
});

app.post('/api/registrar', async(req, res) => {
    const info = req.body || {};

    /* Verificar que se hallan completado todos los campos, se aceptaran los temrinos y condiciones, y que coincidan las contrasenas*/
    if (!info.nombre || !info.rut || !info.email || !info.region || !info.comuna || !info.password || !info.confirmPassword) {
        return res.status(400).json({error: 'Se deben completar todos los campos'});
    }
    if (!info.acceptTerms) {
        return res.status(400).json({error: 'No se aceptaron los terminos y condiciones del servicio'});
    }
    if (info.password !== info.confirmPassword) {
        return res.status(400).json({error: 'Las contrasenas deben de coincidir'});
    }
    try {
        /* Verifica si en la base de datos ya existe un usuario con rut o email igual */
        const existe_usuario = await db.query('SELECT * FROM usuarios WHERE rut = $1 OR email = $2', [info.rut, info.email])
        if (existe_usuario.rows.length > 0) {
            if (existe_usuario.rows[0].rut === info.rut) {
                return res.status(409).json({error: 'El RUT ya se encuentra registrado en el sistema'});
            }
            return res.status(409).json({error: 'El email ya se encuentra registrado en el sistema'});
        }

        const password_encriptada = await bcrypt.hash(info.password, s);
        const usuario_nuevo = await db.query('INSERT INTO usuarios (rut, nombre, email, region, comuna, password) VALUES ($1, $2, $3, $4, $5, $6)',
                                            [info.rut, info.nombre, info.email, info.region, info.comuna, password_encriptada])
        return res.status(201).json({mensaje: 'Se ha registrado exitosamente'})
    } catch (error) {
        console.error('Error al registrar nuevo usuario: ' + error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});

app.post('/api/iniciar_sesion', async(req, res) => {
    const info = req.body || {};

    if (!info.rut || !info.password) {
        return res.status(400).json({mensaje: 'RUT o email no valido'})
    }
    try {
        const peticion = await db.query('SELECT * FROM usuarios WHERE rut = $1', [info.rut]);
        if (peticion.rows.length === 0) {
            return res.status(401).json({mensaje: 'RUT o email no valido'});
        }

        const usuario_encontrado = peticion.rows[0];
        const clave_correcta = await bcrypt.compare(info.password, usuario_encontrado.password);
        if (!clave_correcta) {
            return res.status(401).json({mensaje: 'RUT o email no valido'});
        }
        const token_sesion = jwt.sign(
            {
                id: usuario_encontrado.id,
                rut: usuario_encontrado.rut,
                nombre: usuario_encontrado.nombre,
                email: usuario_encontrado.email
            },
            clave_token,
            {
                expiresIn: '4h'
            }
        )

        return res.status(200).json({
            mensaje: 'Sesion iniciada correctamente',
            token: token_sesion,
            usuario: {
                rut: usuario_encontrado.rut,
                nombre: usuario_encontrado.nombre,
                email: usuario_encontrado.email,
                rol: usuario_encontrado.rol
            }
        })
    } catch (error) {
        console.error('Error al iniciar sesion: ' + error);
        return res.status(500).json({mensaje: 'Error interno del servidor'})
    }
});

app.listen(port, () => {
    console.log('a');
});