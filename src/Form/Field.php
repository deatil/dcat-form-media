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
    
    protected $uploadUrl = '';
    protected $listUrl = '';
    protected $newFolderUrl = '';
    protected $type = '';

    protected $path = '';
    protected $limit = 1;
    protected $remove = false;
    
    protected $nametype = 'uniqid';
    protected $pageSize = 120;

    /**
     * 设置上传链接
     *
     * @param string $uploadUrl
     *
     * @return $this
     */
    public function uploadUrl($uploadUrl = null)
    {
        $this->uploadUrl = $uploadUrl;

        return $this;
    }

    /**
     * 设置数据列表链接
     *
     * @param string $listUrl
     *
     * @return $this
     */
    public function listUrl($listUrl = null)
    {
        $this->listUrl = $listUrl;

        return $this;
    }

    /**
     * 设置新建文件夹链接
     *
     * @param string $newFolderUrl
     *
     * @return $this
     */
    public function newFolderUrl($newFolderUrl = null)
    {
        $this->newFolderUrl = $newFolderUrl;

        return $this;
    }

    /**
     * 设置类型
     *
     * 类型包括：blend、image、xls、word、ppt、pdf、code、zip、text、audio、video
     * 其中 blend 为全部类型
     *
     * @param string $type
     *
     * @return $this
     */
    public function type($type = 'image')
    {
        $this->type = $type;

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

    public function render()
    {
        $path = $this->path;
        $limit = $this->limit;
        $type = $this->type;
        $nametype = $this->nametype;
        $pageSize = $this->pageSize;
        $rootpath = (new MediaManager())->buildUrl('');
        $remove = ($this->remove == true) ? 1 : 0;
        
        if (empty($this->uploadUrl)) {
            $this->uploadUrl = route('admin.lake-form-media.upload');
        }
        
        if (empty($this->listUrl)) {
            $this->listUrl = route('admin.lake-form-media.get-files');
        }
        
        if (empty($this->newFolderUrl)) {
            $this->newFolderUrl = route('admin.lake-form-media.new-folder');
        }

        $this->addVariables([
            'options' => [
                'path' => $path,
                'limit' => $limit,
                'type' => $type,
                'nametype' => $nametype,
                'pageSize' => $pageSize,
                'rootpath' => $rootpath,
                'remove' => $remove,
                
                'get_files_url' => $this->listUrl,
                'upload_url' => $this->uploadUrl,
                'new_folder_url' => $this->newFolderUrl,
            ],
        ]);

        return parent::render();
    }

}
