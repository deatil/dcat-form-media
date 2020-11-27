<?php

namespace Lake\FormMedia\Form;

use Illuminate\Support\Facades\Storage;

use Dcat\Admin\Form\Field as BaseField;

use Lake\FormMedia\MediaManager;

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
        '@extension/lake/form-media/jquery.dragsort.js',
        '@extension/lake/form-media/field.js'
    ];

    protected $path = '';
    protected $limit = 1;
    protected $remove = false;
    protected $type = 'img';
    
    protected $nametype = 'uniqid';
    protected $pageSize = 120;

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
     * 设置每页数量
     *
     * @param int $pageSize
     *
     * @return $this
     */
    public function pageSize($pageSize = 120)
    {
        $this->pageSize = $pageSize;

        return $this;
    }

    /**
     * 呈现
     *
     * @return $this
     */
    public function render()
    {
        $path = $this->path;
        $limit = $this->limit;
        $type = $this->type;
        $nametype = $this->nametype;
        $pageSize = $this->pageSize;
        $rootpath = (new MediaManager())->buildUrl('');
        $remove = ($this->remove == true) ? 1 : 0;

        $this->addVariables([
            'options' => [
                'path' => $path,
                'limit' => $limit,
                'type' => $type,
                'nametype' => $nametype,
                'pageSize' => $pageSize,
                'rootpath' => $rootpath,
                'remove' => $remove,
                
                'get_files_url' => route('admin.lake-form-media.get-files'),
                'upload_url' => route('admin.lake-form-media.upload'),
                'new_folder_url' => route('admin.lake-form-media.new-folder'),
            ],
        ]);

        return parent::render();
    }

}
