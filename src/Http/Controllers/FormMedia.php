<?php

namespace Lake\FormMedia\Http\Controllers;

use Illuminate\Routing\Controller;

use Lake\FormMedia\MediaManager;

class FormMedia extends Controller
{
    /**
     * 获取文件
     */
    public function getfiledata()
    {
        $path = request()->input('path','name');
        $manager = new MediaManager($path);

        $data = [
            'list' => $manager->ls(), //数据
            'nav' => $manager->navigation()  // 导航
        ];
        
        return $data;
    }

    /**
     * 上传图片
     */
    public function upload()
    {
        $files = request()->file('files');
        $dir = request()->get('dir', '/');
        $manager = new MediaManager($dir);
        try {
            if ($manager->upload($files)) {
                return ['code' => 200,'msg' => '上传成功'];
            }
        } catch (\Exception $e) {
            return ['code' => -1,'msg' => '上传失败'];
        }
        return ['code' => -1,'msg' => '上传失败'];
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
                return ['code' => 200, 'msg' => '创建成功'];
            }
        } catch (\Exception $e) {
            return ['code' => -1, 'msg' => '创建失败'];
        }
        
        return ['code' => -1, 'msg' => '创建失败'];
    }
}



