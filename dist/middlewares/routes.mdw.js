"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_route_1 = __importDefault(require("../routes/admin/admin.route"));
function default_1(app) {
    app.use("/admin", admin_route_1.default);
}
exports.default = default_1;
//# sourceMappingURL=routes.mdw.js.map