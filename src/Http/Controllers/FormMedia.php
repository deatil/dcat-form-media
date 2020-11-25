<?php

namespace Lake\FormMedia\Http\Controllers;

use Illuminate\Routing\Controller;

use Lake\FormMedia\MediaManager;

class FormMedia extends Controller
{
    /**
     * 获取文件
     */
    public function getList()
    {
        $path = request()->input('path', '/');
        
        $manager = (new MediaManager())
            ->setPath($path);

        $data = [
            'list' => $manager->ls(), //数据
            'nav' => $manager->navigation()  // 导航
        ];
        
        return $this->renderJson('获取成功', 200, $data);
    }

    /**
     * 上传图片
     */
    public function upload()
    {
        $files = request()->file('files');
        $path = request()->get('path', '/');
        
        $nametype = request()->get('nametype', 'uniqid');
        
        $manager = (new MediaManager())
            ->setPath($path)
            ->setNametype($nametype);
        
        try {
            if ($manager->upload($files)) {
                return $this->renderJson('上传成功', 200);
            }
        } catch (\Exception $e) {
            return $this->renderJson('上传失败', -1);
        }
        
        return $this->renderJson('上传失败', -1);
    }

    /**
     * 新建文件夹
     */
    public function newFolder()
    {
        $dir = request()->input('dir');
        $name = request()->input('name');

        $manager = new MediaManager($dir);

        try {
            if ($manager->newFolder($name)) {
                return $this->renderJson('创建成功', 200);
            }
        } catch (\Exception $e) {
            return $this->renderJson('创建失败', -1);
        }
        
        return $this->renderJson('创建失败', -1);
    }
    
    /**
     * 输出json
     */
    protected function renderJson($msg, $code = 200, $data = [])
    {
        return response()->json([
            'code' => $code, 
            'msg' => $msg,
            'data' => $data,
        ]);
    }
}



