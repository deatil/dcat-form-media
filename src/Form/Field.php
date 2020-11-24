<?php

namespace Lake\FormMedia\Form;

use Illuminate\Support\Facades\Storage;

use Dcat\Admin\Form\Field as BaseField;

class Field extends BaseField
{
    protected $view = 'lake-form-media::field';
 
    protected static $css = [
        'vendor/lake/form-media/field.css'
    ];

    protected static $js = [
        'vendor/lake/form-media/field.js'
    ];

    protected $limit = 1;
    protected $rootpath = '';
    protected $remove = false;
    protected $type = 'img';

    /**
     * Set rows of textarea.
     *
     * @param int $rows
     *
     * @return $this
     */
    public function limit($limit = 1)
    {
        $this->limit = $limit;

        return $this;
    }

    public function remove($tag = false){
        $this->remove = $tag;
        return $this;
    }

    public function render()
    {   
        $disk = config('admin.upload.disk');

        $storage = Storage::disk($disk);

        $this->addVariables([
            'limit' => $this->limit,
            'rootpath' => $storage->url(''),
            'remove' => $this->remove,
        ]);

        $name = $this->column;
        $limit = $this->limit;
        $rootpath = $storage->url('');
        $remove = $this->remove;

        // 初始化
        $this->script = "
            if (! window.LakeFormMedia{$name}) {
                window.LakeFormMedia{$name} = new LakeFormMedia('{$name}',{$limit},'{$rootpath}',{$remove}+'','{$this->type}');
                LakeFormMedia{$name}.Run();
            }
            LakeFormMedia{$name}.init();
            ";
        
        return parent::render();
    }

}
