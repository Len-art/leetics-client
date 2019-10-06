"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(settings) {
        this.defaults = {
            url: 'https://len-art.tech/api',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        };
        this.call = (path, method, args) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { url, headers } = this.defaults;
                    const response = yield fetch(`${url}/${path}`, {
                        method,
                        headers,
                        body: JSON.stringify(args),
                    });
                    const contentLength = response.headers.get('Content-Length');
                    if (!contentLength) {
                        res();
                    }
                    if (response.ok) {
                        res(yield response.json());
                    }
                    else {
                        const { message } = yield response.json();
                        throw new Error(message);
                    }
                }
                catch (error) {
                    console.log(error);
                    rej(error);
                }
            }));
        });
        this.post = (path, args) => this.call(path, 'POST', args);
        this.get = (path, args) => this.call(path, 'GET', args);
        this.getUrl = () => {
            return this.defaults.url;
        };
        this.getHeaders = () => {
            return this.defaults.headers;
        };
        this.defaults = Object.assign(Object.assign({}, this.defaults), settings);
    }
}
exports.default = default_1;
//# sourceMappingURL=client.js.map