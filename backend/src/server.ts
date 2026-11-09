// Entry Point: server initialization and port listener setup
import "dotenv/config"; // must stay first: loads .env before any module reads process.env
import { app } from "./app.js";

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});