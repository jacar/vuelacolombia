const { execSync } = require('child_process');

// Si es llamado por el ciclo de vida interno de `npm install`, salir sin recursión
if (process.env.npm_command === 'install' || process.env.NPM_ALREADY_INSTALLING) {
  process.exit(0);
}

console.log('Instalando dependencias...');
try {
  execSync('npm install', {
    stdio: 'inherit',
    env: { ...process.env, NPM_ALREADY_INSTALLING: 'true' }
  });
  console.log('Dependencias instaladas con éxito.');
} catch (error) {
  process.exit(error.status || 1);
}
