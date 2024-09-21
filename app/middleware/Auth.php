<?php

namespace app\middleware;
use think\Request;
use Closure;

class Auth
{
    public function handle(Request $request, Closure $next)
    {
        // 在这里进行 Token 验证逻辑
        $token = $request->header('Authorization');
        if (empty($token)) {
            return success( 401, 'Unauthorized',[], 401);
        }

        // 进行更复杂的 Token 验证逻辑，比如解析 Token，验证有效性等
        $result = checkToken($token);
        if($result['code']!='200'){
            return success($result['code'],$result['msg'],[]);
        }
        return $next($request);
    }
}