module.exports = {
    development: {
        username: 'postgres',
        password: 'root',
        database: 'corona',
        host: 'localhost',
        port: '5432',
        migrationStorageTableName: '_migrations',
        dialect: 'postgres',
        define: {
            freezeTableName: true,
            underscored: true
        }
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        migrationStorageTableName: '_migrations',
        dialect: 'postgres',
        define: {
            freezeTableName: true,
            underscored: true
        }
    }
};
