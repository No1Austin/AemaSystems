import pool from "./db/pool.js";

try {

const result =
await pool.query(

"SELECT NOW()"

);

console.log(

result.rows

);

}
catch(err){

console.log(err);

}