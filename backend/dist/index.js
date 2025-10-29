"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Selamat datang di Simple Orders API!');
});
app.use('/api', routes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Terjadi kesalahan pada server!', error: err.message });
});
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map