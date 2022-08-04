"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importStar(require("./config"));
// Verify configuration values
config_1.default.verify();
const utils_1 = require("./utils");
const server_1 = __importDefault(require("./websocket-server/server"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const maintenance_1 = __importDefault(require("./middlewares/maintenance"));
const db_1 = __importDefault(require("./db"));
// Bootstrap application with express
const app = (0, express_1.default)();
// Middleware
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ credentials: true, origin: config_1.FRONTEND_ORIGIN }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.json());
app.use('/', express_1.default.static(config_1.PUBLIC_DIR));
app.set('trust proxy', true);
// Routes
app.use(maintenance_1.default);
app.use(post_routes_1.default);
app.use(user_routes_1.default);
app.get('*', (req, res) => {
    res.status(404).json({
        message: 'Not found'
    });
});
// Express server
const server = app.listen(config_1.PORT, () => {
    utils_1.Logger.success(`Express server is running on port ${config_1.PORT}`);
});
// Initialize websocket server
function listen() {
    if (app.get('env') === 'test')
        return;
    (0, server_1.default)(server);
}
// Connect to MongoDB
(0, db_1.default)(listen);
