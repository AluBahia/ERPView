import { Service } from 'node-windows';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const svc = new Service({
  name: 'ERPView Sync Agent',
  description: 'Agente de sincronização SQL Server -> Supabase para ERPView',
  script: join(__dirname, '..', 'dist', 'index.js'),
  env: [
    { name: 'NODE_ENV', value: 'production' },
  ],
});

svc.on('install', () => {
  console.log('Serviço instalado com sucesso');
  svc.start();
});

svc.on('alreadyinstalled', () => {
  console.log('Serviço já está instalado');
});

svc.on('start', () => {
  console.log('Serviço iniciado');
});

if (process.argv.includes('--uninstall')) {
  svc.uninstall();
} else {
  svc.install();
}
