// db.js
import postgres from 'postgres'

const sql = postgres('postgres://postgres:2001@localhost:5432/interview', {ssl : 'require'});

export default sql