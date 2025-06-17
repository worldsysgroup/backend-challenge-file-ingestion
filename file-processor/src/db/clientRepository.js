const sql = require('mssql');

async function insertOne(pool, fields) {
  const [nombre, apellido, dni, estado, fechaIngreso, esPep, esSujetoObligado] = fields;
  try {
    await pool.request().query`
      INSERT INTO datosclientes (nombre, apellido, dni, estado, fecha_ingreso, es_pep, es_sujeto_obligado)
      VALUES (${nombre}, ${apellido}, ${dni}, ${estado}, ${fechaIngreso}, ${esPep === 'true' ? 1 : 0}, ${esSujetoObligado === 'true' ? 1 : 0})
    `;
  } catch (err) {
    console.error('Insert error:', err);
  }
}

async function insertBatch(pool, batch) {
  const table = new sql.Table('datosclientes');
  table.create = false;
  table.columns.add('nombre', sql.NVarChar(100), { nullable: true });
  table.columns.add('apellido', sql.NVarChar(100), { nullable: true });
  table.columns.add('dni', sql.NVarChar(20), { nullable: true });
  table.columns.add('estado', sql.NVarChar(20), { nullable: true });
  table.columns.add('fecha_ingreso', sql.Date, { nullable: true });
  table.columns.add('es_pep', sql.Bit, { nullable: true });
  table.columns.add('es_sujeto_obligado', sql.Bit, { nullable: true });

  for (const row of batch) {
    const [nombre, apellido, dni, estado, fechaIngreso, esPep, esSujetoObligado] = row;
    table.rows.add(nombre, apellido, dni, estado, fechaIngreso, esPep === 'true' ? 1 : 0, esSujetoObligado === 'true' ? 1 : 0);
  }

  try {
    await pool.request().bulk(table);
  } catch (err) {
    console.error('Bulk insert error:', err);
  }
}

module.exports = {
  insertOne,
  insertBatch,
};