<?php

namespace app\controller;

use app\BaseController;
use think\annotation\route\Get;
use think\annotation\route\Middleware;
class Index extends BaseController
{
    public function index()
    {
        return '<style>*{ padding: 0; margin: 0; }</style><iframe src="https://www.thinkphp.cn/welcome?version=' . \think\facade\App::version() . '" width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>';
    }

    public function hello($name = 'ThinkPHP8')
    {
        return 'hello,' . $name;
    }

    #[Get('/ne/world')]
    #[Middleware('auth')]
    public function world(){
        return  success(200,'成功',['name'=>'thinkphp']);
    }
}
