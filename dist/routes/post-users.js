import pool from "../db.js";
import { z } from "zod/v4";
const userSchema = z.object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    birthday: z.coerce.date(), // Используем coerce для автоматического преобразования строк в Date
    chlen: z.number(),
});
export default async function postUsers(data) {
    const result = userSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid data format: " + JSON.stringify(result.error.format()));
    }
    const user = result.data;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        // SQL запрос для вставки одной записи
        const sql = `
  INSERT INTO users (email, first_name, last_name, birthday, chlen)
  VALUES (?, ?, ?, ?, ?);
  
  SELECT * FROM users WHERE id = LAST_INSERT_ID();
`;
        // Выполняем запрос с данными пользователя
        const [createdUser] = await connection.query(sql, [
            user.email,
            user.firstName,
            user.lastName,
            user.birthday,
            user.chlen
        ]);
        await connection.commit();
        return { success: true, message: "User created successfully", user: createdUser };
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
