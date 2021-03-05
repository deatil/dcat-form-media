<?php

namespace Lake\FormMedia;

use Dcat\Admin\Admin;
use Dcat\Admin\Form;
use Dcat\Admin\Extend\ServiceProvider as BaseServiceProvider;

use Lake\FormMedia\Form\Field;

/**
 * 表单媒体上传管理
 *
 * @create 2020-11-25
 * @author deatil
 */
class ServiceProvider extends BaseServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();
        
        // 设置别名
        if (! class_exists('LakeFormMedia')) {
            class_alias(__CLASS__, 'LakeFormMedia');
        }

        // 加载路由
        $this->app->booted(function () {
            $this->registerRoutes(__DIR__.'/../routes/admin.php');
        });
        
        // 视图
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'lake-form-media');

        // 加载插件
        Admin::booting(function () {
            Form::extend('photo', Field\Photo::class);
            Form::extend('photos', Field\Photos::class);
            Form::extend('video', Field\Video::class);
            Form::extend('audio', Field\Audio::class);
            Form::extend('files', Field\File::class);
        });
    }
    
}