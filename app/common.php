<?php
// 应用公共文件
use \Firebase\JWT\JWT;

//生成验签
function signToken($data = "", $exp_time = 0, $scopes = ""){
    $key=config('jwt.key');         //这里是自定义的一个随机字串，应该写在config文件中的，解密时也会用，相当    于加密中常用的 盐  salt
    $time = time(); //当前时间
    $token['iss'] = ''; //签发者 可选
    $token['aud'] = ''; //接收该JWT的一方，可选
    $token['iat'] = $time; //签发时间
    $token['nbf'] = $time; //(Not Before)：某个时间点后才能访问，比如设置time+30，表示当前时间30秒后才能使用
    if ($scopes) {
        $token['scopes'] = $scopes; //token标识，请求接口的token
    }
    if (!$exp_time) {
        $exp_time = 7200*12;//默认=24小时过期
    }
    $token['exp'] = $time + $exp_time; //token过期时间,这里设置2个小时
    if ($data) {
        $token['data'] = $data; //自定义参数
    }
    $alg = 'HS256'; //签名算法方式
//            $keyId = "keyId"; //这个有时必须要加上，不加上，报错，报错内容：'"kid" empty, unable to lookup correct key'
    $jwt = JWT::encode($token, $key, $alg);
    return $jwt;
}

//验证token
function checkToken($jwt)
{
    $key = config('jwt.key');
    JWT::$leeway = 60;//当前时间减去60，把时间留点余地
    try {
        $decoded = JWT::decode($jwt, $key);
        $arr = (array)$decoded;
        $returndata['code'] = "200";//200=成功
        $returndata['msg'] = "成功";//
        $returndata['data'] = $arr;//返回的数据
        return json_encode($returndata); //返回信息
    } catch (\Firebase\JWT\SignatureInvalidException $e) {  //签名不正确
        $returndata['code'] = "101";//101=签名不正确
        $returndata['msg'] = $e->getMessage();
        $returndata['data'] = "";//返回的数据
        return json_encode($returndata); //返回信息
    } catch (\Firebase\JWT\BeforeValidException $e) {  // 签名在某个时间点之后才能用
        $returndata['code'] = "102";//102=签名不正确
        $returndata['msg'] = $e->getMessage();
        $returndata['data'] = "";//返回的数据
        return json_encode($returndata); //返回信息
    } catch (\Firebase\JWT\ExpiredException $e) {  // token过期
        $returndata['code'] = "103";//103=签名不正确
        $returndata['msg'] = $e->getMessage();
        $returndata['data'] = "";//返回的数据
        return json_encode($returndata); //返回信息
    } catch (Exception $e) {  //其他错误
        $returndata['code'] = "199";//199=签名不正确
        $returndata['msg'] = $e->getMessage();
        $returndata['data'] = "";//返回的数据
        return json_encode($returndata); //返回信息
    }
}
/****
 * @param number $code
 * @param string $msg
 * @param array $data
 */
function success($code, string $msg='', array $data=[], $httpCode=200){
    $result=array("code"=>$code,"msg"=>$msg,"data"=>$data);
    return json($result,$httpCode);
}