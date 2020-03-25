module.exports = {
    jwtSecret: "secret",
    sessionSecret: "topsecret",
    postgres: {
        host: "localhost",
        port: "5432",
        username: "postgres",
        password: "root",
        database: "corona",
        readReplicaHost: "localhost"
    },
    apiToken: "token"
};
