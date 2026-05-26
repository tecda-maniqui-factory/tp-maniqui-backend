import dotenv from 'dotenv';
import app from './app.js';
import { conectarDB } from './db.js';

dotenv.config();

const PORT = process.env.PORT || 8081;

conectarDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor Tecda Maniquí corriendo en http://localhost:${PORT}`);
  console.log(`📡 Modo: ${process.env.NODE_ENV}`);
});
