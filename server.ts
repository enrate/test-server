import 'dotenv/config';
import express, { NextFunction, Request, Response, RequestHandler  } from "express"
const app = express();
import getUsers from "./routes/get-users.js";
import postUsers from "./routes/post-users.js";

// Middleware для разбора JSON
app.use(express.json());

// Конфигурация
const PORT = 3003;
const API_TOKEN = 'dkfSkell35jwlslSL';


// Middleware проверки токена
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  const token = authHeader.split(' ')[1];
  
  if (token !== API_TOKEN) {
    return res.status(403).json({ error: 'Неверный токен' });
  }

  next();
};

app.get("/users", async (req, res) => {
  try {
    const filters = {
            userId: req.query.userId,
            email: req.query.email
        };

     const users = await getUsers(filters);
     res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message})
  }
})

app.post("/users", authMiddleware as RequestHandler, async (req, res) => {
  try {
    const ss = await postUsers(req.body)
    res.json(ss)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// Запуск сервера и Discord бота
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
