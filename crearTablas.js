const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '1234',
  host: '127.0.0.1',
  port: 5432,
  database: 'db_patentes_permisos'
});

const crearTablas = async () => {
  const queryUsuarios = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      rut VARCHAR(12) UNIQUE NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      region VARCHAR(100),
      comuna VARCHAR(100),
      rol VARCHAR(20) DEFAULT 'ciudadano', 
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const querySolicitudes =  `
    CREATE TABLE IF NOT EXISTS solicitudes (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
      razon_social VARCHAR(255) NOT NULL,
      rut_comercial VARCHAR(20) NOT NULL,
      tipo_patente VARCHAR(100) NOT NULL,
      giro VARCHAR(255) NOT NULL,
      direccion VARCHAR(255) NOT NULL,
      rol_avaluo VARCHAR(50) NOT NULL,
      superficie NUMERIC,
      telefono VARCHAR(30) NOT NULL,
      descripcion TEXT,
      estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
      fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  const queryDocumentos = `
    CREATE TABLE IF NOT EXISTS documentos_solicitud (
      id SERIAL PRIMARY KEY,
      solicitud_id INTEGER NOT NULL REFERENCES solicitudes(id) ON DELETE CASCADE,
      nombre VARCHAR(255) NOT NULL,
      tipo VARCHAR(100),
      ruta VARCHAR(500),
      fecha_subida TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  try {
    console.log('Conectando a la base de datos...');
    await pool.query(queryUsuarios);
    await pool.query(querySolicitudes);
    await pool.query(queryDocumentos);
    console.log('Tablas creadas con éxito (o ya existían).');
  } catch (error) {
    console.error('Error al crear las tablas:', error);
  } finally {
    await pool.end(); 
  }
};

crearTablas();