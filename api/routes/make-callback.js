"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../utils");
// make express callback function
function makeExpressCallback(controller) {
    return function (req, res) {
        const result = controller(req, res);
        if (result instanceof Promise) {
            result
                .then(() => {
                res.send();
            })
                .catch((err) => {
                utils_1.Logger.error(err);
                res.status(500).send(err);
            });
        }
        else {
            res.send();
        }
    };
}
exports.default = makeExpressCallback;
