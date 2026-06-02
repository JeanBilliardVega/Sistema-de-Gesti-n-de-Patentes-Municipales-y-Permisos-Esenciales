const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
/* Si lo cambian que sea distinto al front */
const port = 3000;
/* Conexion db, la informacion esta en docker-compose.yml */
const db = new Pool({
    user: 'admin',
    password: '1234',
    host: '127.0.0.1',
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
                email: usuario_encontrado.email,
                rol: usuario_encontrado.rol
            },
            clave_token,
            { expiresIn: '4h' }
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

const verificarToken = (req, res, next) => {
    const autorizacion = req.headers['authorization'];
    if (!autorizacion) {
        return res.status(403).json({error: 'Acceso denegado, falta de credenciales'});
    }
    
    const token = autorizacion.split(' ')[1];
    if (!token) {
        return res.status(403).json({error: 'Token invalido'});
    }

    try {
        const verificacionToken = jwt.verify(token, clave_token);
        req.usuario = verificacionToken;
        next();
    } catch (error) {
        return res.status(401).json({error: 'Token invalido o expirado, vuelva a iniciar sesion'});
    }
};

app.get('/api/obtener_informacion_usuario', verificarToken, async (req, res) => {
    try {
        return res.status(200).json({
            mensaje: 'Bienvenido ' + req.usuario.nombre,
            info: {
                rut: req.usuario.rut,
                nombre: req.usuario.nombre,
                email: req.usuario.email,
                rol: req.usuario.rol
            }
        });
    } catch (error) {
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const unico = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, unico);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF o imágenes'));
        }
    }
});

app.post('/api/ciudadano/crear_solicitud', upload.array('documentos', 10), async (req, res) => {
    const info = req.body || {};
    const archivos = req.files || [];

    const camposRequeridos = [
        'razonSocial', 'rutComercial', 'tipoPatente', 'giro',
        'direccion', 'rolAvaluo', 'telefono', 'rutDueno'   // añadido rutDueno
    ];
    const faltaRellenar = camposRequeridos.filter(campo => !info[campo]);
    if (faltaRellenar.length > 0) {
        return res.status(400).json({ error: 'Falta rellenar los campos: ' + faltaRellenar });
    }
    if (archivos.length === 0) {
        return res.status(400).json({ error: 'Debe adjuntar al menos un documento' });
    }

    // Buscar el usuario por RUT para obtener su id
    let usuario_id;
    try {
        const userRes = await db.query('SELECT id FROM usuarios WHERE rut = $1', [info.rutDueno]);
        if (userRes.rows.length === 0) {
            return res.status(400).json({ error: 'El RUT del dueño no está registrado en el sistema' });
        }
        usuario_id = userRes.rows[0].id;
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al verificar el RUT' });
    }

    const cliente = await db.connect();
    try {
        await cliente.query('BEGIN');
        const nuevaSolicitud = await cliente.query(
            `INSERT INTO solicitudes
                (usuario_id, razon_social, rut_comercial, tipo_patente, giro, direccion, rol_avaluo, superficie, telefono, descripcion)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id`,
            [
                usuario_id, info.razonSocial, info.rutComercial, info.tipoPatente, info.giro,
                info.direccion, info.rolAvaluo, info.superficie || null, info.telefono, info.descripcion || null
            ]
        );
        const solicitudId = nuevaSolicitud.rows[0].id;
        for (const archivo of archivos) {
            await cliente.query(
                `INSERT INTO documentos_solicitud (solicitud_id, nombre, tipo, ruta)
                 VALUES ($1, $2, $3, $4)`,
                [solicitudId, archivo.originalname, archivo.mimetype, archivo.path]
            );
        }
        await cliente.query('COMMIT');
        return res.status(201).json({ mensaje: 'Solicitud creada exitosamente', solicitudId });
    } catch (error) {
        await cliente.query('ROLLBACK');
        console.error('Error al crear solicitud:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        cliente.release();
    }
});

app.get('/api/ciudadano/mis_solicitudes', verificarToken, async (req, res) => {
    try {
        // Hacemos JOIN para obtener también los datos del usuario
        const peticion = await db.query(
            `SELECT s.*,
                    u.nombre as ciudadano_nombre,
                    u.rut as ciudadano_rut,
                    u.email as ciudadano_email,
                    u.comuna as ciudadano_comuna
             FROM solicitudes s
                      JOIN usuarios u ON s.usuario_id = u.id
             WHERE s.usuario_id = $1
             ORDER BY s.id DESC`,
            [req.usuario.id]
        );

        const solicitudes = peticion.rows;
        for (let sol of solicitudes) {
            const docs = await db.query(
                `SELECT id, nombre, ruta FROM documentos_solicitud WHERE solicitud_id = $1`,
                [sol.id]
            );
            sol.documentos = docs.rows;
        }

        return res.status(200).json(solicitudes);
    } catch (error) {
        console.error('Error al obtener solicitudes: ' + error);
        return res.status(500).json({error: 'Error interno del servidor'});
    }
});

// Endpoint público para obtener datos de un usuario por RUT
app.get('/api/usuario/:rut', async (req, res) => {
    const { rut } = req.params;
    try {
        const result = await db.query('SELECT nombre, email, rut FROM usuarios WHERE rut = $1', [rut]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const usuario = result.rows[0];
        res.json({
            nombre: usuario.nombre,
            email: usuario.email,
            rut: usuario.rut
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno' });
    }
});

app.get('/api/ciudadano/solicitud/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const peticion = await db.query(
            `SELECT s.*, 
                    u.nombre as ciudadano_nombre,
                    u.rut as ciudadano_rut,
                    u.email as ciudadano_email,
                    u.comuna as ciudadano_comuna
             FROM solicitudes s
             JOIN usuarios u ON s.usuario_id = u.id
             WHERE s.id = $1 AND s.usuario_id = $2`,
            [id, req.usuario.id]
        );
        if (peticion.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        const sol = peticion.rows[0];
        const docs = await db.query(
            `SELECT id, nombre, ruta, tipo FROM documentos_solicitud WHERE solicitud_id = $1`,
            [sol.id]
        );
        sol.documentos = docs.rows;
        return res.status(200).json(sol);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para el administrador
app.get('/api/funcionario/todas_solicitudes', verificarToken, async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Requiere privilegios de administrador.' });
    }

    try {
        const peticion = await db.query(
            `SELECT s.*,
                    u.nombre  AS ciudadano_nombre,
                    u.rut     AS ciudadano_rut,
                    u.email   AS ciudadano_email,
                    u.comuna  AS ciudadano_comuna
             FROM solicitudes s
                      JOIN usuarios u ON s.usuario_id = u.id
             ORDER BY s.id DESC`
        );

        const solicitudes = peticion.rows;
        for (let sol of solicitudes) {
            const docs = await db.query(
                `SELECT id, nombre, ruta FROM documentos_solicitud WHERE solicitud_id = $1`,
                [sol.id]
            );
            sol.documentos = docs.rows;
        }

        return res.status(200).json(solicitudes);
    } catch (error) {
        console.error('Error al obtener todas las solicitudes: ' + error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/funcionario/solicitud/:id', verificarToken, async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    try {
        const { id } = req.params;
        const peticion = await db.query(
            `SELECT s.*,
                    u.nombre as ciudadano_nombre,
                    u.rut as ciudadano_rut,
                    u.email as ciudadano_email,
                    u.comuna as ciudadano_comuna
             FROM solicitudes s
             JOIN usuarios u ON s.usuario_id = u.id
             WHERE s.id = $1`,
            [id]
        );
        if (peticion.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        const sol = peticion.rows[0];
        const docs = await db.query(
            `SELECT id, nombre, ruta, tipo FROM documentos_solicitud WHERE solicitud_id = $1`,
            [sol.id]
        );
        sol.documentos = docs.rows;
        return res.status(200).json(sol);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// PUT - Cambiar estado de solicitud (solo admin)
app.put('/api/funcionario/solicitud/:id/estado', verificarToken, async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    const { estado } = req.body;
    const { id } = req.params;
    const estadosValidos = ['pendiente', 'revisión', 'observada', 'aprobada', 'rechazada'];
    if (!estado || !estadosValidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado no válido' });
    }
    try {
        const resultado = await db.query(
            'UPDATE solicitudes SET estado = $1 WHERE id = $2 RETURNING *',
            [estado, id]
        );
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        return res.status(200).json({ mensaje: 'Estado actualizado correctamente', solicitud: resultado.rows[0] });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST - Enviar mensaje (admin y ciudadano)
app.post('/api/solicitud/:id/mensaje', verificarToken, async (req, res) => {
    const { contenido } = req.body;
    const { id } = req.params;
    if (!contenido || contenido.trim() === '') {
        return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }
    try {
        // Verificar que la solicitud existe y que el ciudadano solo pueda escribir en sus propias solicitudes
        const solRes = await db.query('SELECT * FROM solicitudes WHERE id = $1', [id]);
        if (solRes.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        if (req.usuario.rol !== 'admin' && solRes.rows[0].usuario_id !== req.usuario.id) {
            return res.status(403).json({ error: 'No tienes permiso para escribir en esta solicitud' });
        }
        const resultado = await db.query(
            'INSERT INTO mensajes (solicitud_id, usuario_id, contenido) VALUES ($1, $2, $3) RETURNING *',
            [id, req.usuario.id, contenido.trim()]
        );
        return res.status(201).json({ mensaje: 'Mensaje enviado', data: resultado.rows[0] });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET - Obtener mensajes de una solicitud
app.get('/api/solicitud/:id/mensajes', verificarToken, async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar acceso
        const solRes = await db.query('SELECT * FROM solicitudes WHERE id = $1', [id]);
        if (solRes.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        if (req.usuario.rol !== 'admin' && solRes.rows[0].usuario_id !== req.usuario.id) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        const resultado = await db.query(
            `SELECT m.*, u.nombre as autor_nombre, u.rol as autor_rol
             FROM mensajes m
             JOIN usuarios u ON m.usuario_id = u.id
             WHERE m.solicitud_id = $1
             ORDER BY m.fecha_envio ASC`,
            [id]
        );
        return res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/api/funcionario/solicitud/:id', verificarToken, async (req, res) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    try {
        const resultado = await db.query(
            'DELETE FROM solicitudes WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        return res.status(200).json({ mensaje: 'Solicitud eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
});

