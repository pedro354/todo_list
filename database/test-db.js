const { query } = require("./db");


(async () => {
  try {
    const res = await query('SELECT NOW()');
    console.log('Conectado com sucesso ao Supabase! Hora atual:', res.rows[0].now);
  } catch (err) {
    console.error('Erro ao conectar:', err.message);
  }
})();
