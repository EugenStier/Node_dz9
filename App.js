const bcrypt = require("bcrypt");
const db = require("./models");

const app = express();
app.use(express.json());

// Маршрут для регистрации
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка на существующий email
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email уже зарегистрирован" });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await db.User.create({ email, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`)
);
