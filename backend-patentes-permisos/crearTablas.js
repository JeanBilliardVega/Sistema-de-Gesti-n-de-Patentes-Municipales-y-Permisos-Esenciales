const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  password: '1234',
  host: 'localhost',
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

  try {
    console.log('Conectando a la base de datos...');
    await pool.query(queryUsuarios);
    console.log('Tabla "usuarios" creada con éxito (o ya existía).');
  } catch (error) {
    console.error('Error al crear las tablas:', error);
  } finally {
    await pool.end(); 
  }
};

crearTablas();