import mysql from "mysql";
import pass from "./passwords.js";

const con = mysql.createConnection({
	host: "localhost",
	user: pass.username,
	password: pass.password,
	port: pass.port,
	multipleStatements: true
});

con.connect();

// exports.con = con;
// exports.mysql = mysql;

export default con;
