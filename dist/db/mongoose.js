"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.connect = () => mongoose_1.default.connect('mongodb://127.0.0.1:27017/draft-api-ts', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
//# sourceMappingURL=mongoose.js.map