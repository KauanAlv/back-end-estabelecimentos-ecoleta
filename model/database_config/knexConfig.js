module.exports = {
    development: {
      // ⚠️ ALTERAÇÃO: Define o cliente como 'mysql2'
      client: 'mysql2',
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
        // Opcional: Define charset (recomendado para UTF8)
        charset: 'utf8mb4'
      },
     
      // Configurações de Migração
      migrations: {
        tableName: 'knex_migrations', // Nome da tabela de migrações
        directory: './db/migrations'
      },
      seeds: {
        directory: './db/seeds'
      }
    },
   
    // Você pode adicionar configurações para produção, testes, etc.
  };