import dotenv from 'dotenv';
dotenv.config();

// Valores de teste que passam na validação Zod do config.ts
process.env.SQLSERVER_HOST = process.env.SQLSERVER_HOST || 'localhost';
process.env.SQLSERVER_PORT = process.env.SQLSERVER_PORT || '1433';
process.env.SQLSERVER_DATABASE = process.env.SQLSERVER_DATABASE || 'test';
process.env.SQLSERVER_USER = process.env.SQLSERVER_USER || 'test_user';
process.env.SQLSERVER_PASSWORD = process.env.SQLSERVER_PASSWORD || 'test_pass';
process.env.SQLSERVER_ENCRYPT = process.env.SQLSERVER_ENCRYPT || 'false';
process.env.SQLSERVER_TRUST_CERT = process.env.SQLSERVER_TRUST_CERT || 'true';
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-key';
process.env.LOG_FILE = process.env.LOG_FILE || 'test-sync-agent.log';
