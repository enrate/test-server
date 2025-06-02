import pool from "../db.js";
export default async function getUsers({ userId, email }) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        let query = 'SELECT * FROM users';
        const params = [];
        const conditions = [];
        // Добавляем фильтры, если они переданы
        if (userId !== undefined) {
            conditions.push('id = ?');
            params.push(userId);
        }
        if (email !== undefined) {
            conditions.push('email = ?');
            params.push(email);
        }
        // Добавляем WHERE если есть условия
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        // Выполняем запрос
        const [users] = await connection.query(query, params);
        await connection.commit();
        return users;
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
//module.exports = { getUsers };
