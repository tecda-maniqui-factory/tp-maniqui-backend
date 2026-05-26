import bcrypt from 'bcryptjs';
import { Usuario } from './src/models/index.js';
import { conectarDB } from './src/db.js';

const crearAdminInicial = async () => {
  try {
    await conectarDB();

    const username = 'admin_pablo';
    const password = 'tecda2026';
    
    // Verificar si ya existe
    const existe = await Usuario.findOne({ where: { username } });
    if (existe) {
      console.log(`⚠️ El usuario ${username} ya existe. Actualizando contraseña...`);
      const salt = await bcrypt.genSalt(10);
      existe.password_hash = await bcrypt.hash(password, salt);
      await existe.save();
      console.log('✅ Contraseña actualizada con éxito.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      await Usuario.create({
        username,
        password_hash,
        nombre_completo: 'Pablo Administrador',
        email: 'admin@tecda.com',
        rol: 'gerente_prod'
      });
      console.log('✅ Usuario Administrador inicial creado con éxito.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando admin:', error.message);
    process.exit(1);
  }
};

crearAdminInicial();
