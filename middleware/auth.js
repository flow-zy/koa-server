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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = void 0;
exports.default = auth;
exports.verifyToken = verifyToken;
exports.generateToken = generateToken;
exports.generateRefreshToken = generateRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const log4js_1 = require("../config/log4js");
const redis_1 = require("../config/redis");
const response_1 = require("../types/response");
const auth_1 = require("../enums/auth");
exports.defaultOptions = {
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '3h',
        refreshExpiresIn: '7d',
        issuer: 'your-app-name',
        audience: 'your-app-users'
    },
    whitelist: [
        /^\/static/,
        /^\/login/,
        /^\/register/,
        /^\/upload/,
        /^\/apidocs/,
        /^\/swagger-json/
    ],
    enableRefreshToken: true,
    checkIp: true,
    singleLogin: true,
    logging: true
};
function auth(options = {}) {
    const finalOptions = Object.assign(Object.assign({}, exports.defaultOptions), options);
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        // 检查是否在白名单中
        if (finalOptions.whitelist.some((path) => path.test(ctx.path))) {
            return next();
        }
        try {
            // 获取令牌
            const token = getTokenFromRequest(ctx, finalOptions.getToken);
            if (!token) {
                return ctx.error(auth_1.AuthMessage.TOKEN_REQUIRED, response_1.StatusCode.UNAUTHORIZED);
            }
            // 验证令牌
            const decoded = yield verifyToken(token, finalOptions);
            if (!decoded) {
                return ctx.error(auth_1.AuthMessage.TOKEN_INVALID, response_1.StatusCode.UNAUTHORIZED);
            }
            // 检查令牌是否被注销
            // const isRevoked = await checkTokenRevocation(decoded.jti)
            // if (isRevoked) {
            // 	return ctx.error(
            // 		AuthMessage.TOKEN_REVOKED,
            // 		StatusCode.UNAUTHORIZED
            // 	)
            // }
            console.log(decoded, 'decoded', ctx.ip);
            // IP 检查
            if (finalOptions.checkIp && decoded.payload.ip !== ctx.ip) {
                return ctx.error(auth_1.AuthMessage.IP_MISMATCH, response_1.StatusCode.UNAUTHORIZED);
            }
            // 单点登录检查
            // if (finalOptions.singleLogin) {
            // 	const currentToken = await redis.get(
            // 		`user:token:${decoded.userId}`
            // 	)
            // 	if (currentToken && currentToken !== token) {
            // 		return ctx.error(
            // 			AuthMessage.ACCOUNT_LOGGED_ELSEWHERE,
            // 			StatusCode.UNAUTHORIZED
            // 		)
            // 	}
            // }
            // 记录访问日志
            if (finalOptions.logging) {
                log4js_1.logger.info('Auth Access:', {
                    userId: decoded.userId,
                    path: ctx.path,
                    method: ctx.method,
                    ip: ctx.ip,
                    userAgent: ctx.get('user-agent')
                });
            }
            // 将用户信息添加到上下文
            ctx.state.user = decoded.payload;
            // 检查令牌是否即将过期，如果是则刷新
            yield handleTokenRefresh(ctx, decoded, finalOptions);
            yield next();
        }
        catch (err) {
            const error = err;
            console.log(error, 'error');
            log4js_1.logger.error('Auth Error:', {
                path: ctx.path,
                method: ctx.method,
                ip: ctx.ip,
                error: error.message
            });
            if (error.name === 'TokenExpiredError') {
                return ctx.error(auth_1.AuthMessage.TOKEN_EXPIRED, response_1.StatusCode.UNAUTHORIZED);
            }
            return ctx.error(auth_1.AuthMessage.AUTH_FAILED, response_1.StatusCode.UNAUTHORIZED);
        }
    });
}
// 从请求中获取令牌
function getTokenFromRequest(ctx, customGetToken) {
    if (customGetToken) {
        return customGetToken(ctx);
    }
    const authorization = ctx.get('Authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.slice(7);
    }
    return null;
}
// 验证令牌
function verifyToken(token, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            jsonwebtoken_1.default.verify(token, options.jwt.secret, {
                issuer: options.jwt.issuer,
                audience: options.jwt.audience
            }, (err, decoded) => {
                if (err) {
                    resolve(null);
                }
                else {
                    resolve(decoded);
                }
            });
        });
    });
}
// 检查令牌是否被注销
function checkTokenRevocation(jti) {
    return __awaiter(this, void 0, void 0, function* () {
        const revoked = yield redis_1.redis.get(`token:revoked:${jti}`);
        return !!revoked;
    });
}
// 处理令牌刷新
function handleTokenRefresh(ctx, decoded, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options.enableRefreshToken)
            return;
        const now = Math.floor(Date.now() / 1000);
        const exp = decoded.exp;
        const threshold = 60 * 30; // 30分钟
        if (exp - now < threshold) {
            const newToken = jsonwebtoken_1.default.sign({
                userId: decoded.userId,
                ip: ctx.ip,
                jti: decoded.jti
            }, options.jwt.secret, {
                expiresIn: options.jwt.expiresIn,
                issuer: options.jwt.issuer,
                audience: options.jwt.audience
            });
            ctx.set('X-New-Token', newToken);
        }
    });
}
// 生成新的访问令牌
function generateToken(payload, options) {
    return jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, payload), { jti: Math.random().toString(36).substr(2) }), options.jwt.secret, {
        expiresIn: options.jwt.expiresIn,
        issuer: options.jwt.issuer,
        audience: options.jwt.audience
    });
}
// 生成刷新令牌
function generateRefreshToken(userId, options) {
    return jsonwebtoken_1.default.sign({
        userId,
        type: 'refresh',
        jti: Math.random().toString(36).substr(2)
    }, options.jwt.secret, {
        expiresIn: options.jwt.refreshExpiresIn,
        issuer: options.jwt.issuer,
        audience: options.jwt.audience
    });
}
