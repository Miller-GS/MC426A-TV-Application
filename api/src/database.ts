import mysql from "mysql2"

const conn = mysql.createConnection({
    host: "0.0.0.0",
    user: "user",
    password: "password",
    database: "projeto",
    port: 3306
});

export default conn

export const query = (sql: string, params?: any) => {
    return new Promise((resolve, reject) => {
        conn.execute(sql, params, (err, results) => {
            if(err) reject(err)
            resolve(results)
        });
    })
}