<?php

namespace Lake\FormMedia\Form;

use Illuminate\Support\Facades\Storage;

use Dcat\Admin\Form\Field as BaseField;

/**
 * 表单字段
 *
 * @create 2020-11-25
 * @author deatil
 */
class Field extends BaseField
{
    protected $view = 'lake-form-media::field';
 
    protected static $css = [
        '@extension/lake/form-media/field.css'
    ];

    protected static $js = [
        '@extension/lake/form-media/field.js'
    ];

    protected $path = '';
    protected $limit = 1;
    protected $remove = false;
    protected $type = 'img';
    
    protected $nametype = 'uniqid';

    /**
     * 设置限制数量.
     *
     * @param int $limit
     *
     * @return $this
     */
    public function limit($limit = 1)
    {
        $this->limit = $limit;

        return $this;
    }

    /**
     * 移除
     *
     * @param boolen $remove
     *
     * @return $this
     */
    public function remove($remove = false){
        $this->remove = $remove;
        return $this;
    }

    /**
     * 设置当前可用目录
     *
     * @param string $path
     *
     * @return $this
     */
    public function path($path = ''){
        $this->path = $path;
        return $this;
    }

    /**
     * 设置上传保存文件名类型
     *
     * @param string $type uniqid|datetime
     *
     * @return $this
     */
    public function nametype($type = 'uniqid')
    {
        if ($type == 'datetime') {
            $type = 'datetime';
        } else {
            $type = 'uniqid';
        }
        
        $this->nametype = $type;
        return $this;
    }

    /**
     * 呈现
     *
     * @return $this
     */
    public function render()
    {   
        $disk = config('admin.upload.disk');

        $storage = Storage::disk($disk);

        $this->addVariables([
            'path' => $this->path,
            'limit' => $this->limit,
            'rootpath' => $storage->url(''),
            'remove' => $this->remove,
        ]);

        $path = $this->path;
        $name = $this->column;
        $limit = $this->limit;
        $nametype = $this->nametype;
        $rootpath = $storage->url('');
        $remove = ($this->remove == true) ? 1 : 0;

        // 初始化
        $this->script = "
            if (! window.LakeFormMedia{$name}) {
                window.LakeFormMedia{$name} = new LakeFormMedia('{$path}', '{$name}', {$limit}, '{$rootpath}', {$remove}, '{$this->type}', '{$nametype}');
                LakeFormMedia{$name}.Run();
            }
            LakeFormMedia{$name}.init();
            ";
        
        return parent::render();
    }

}
