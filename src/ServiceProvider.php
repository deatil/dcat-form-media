<?php

namespace Lake\FormMedia;

use Dcat\Admin\Admin;
use Dcat\Admin\Form;
use Dcat\Admin\Extend\ServiceProvider as BaseServiceProvider;

use Lake\FormMedia\Form\Field;

/**
 * 表单媒体扩展
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
            Form::extend('files', Field\Files::class);
        });

        // 加载语言包
        Admin::booting(function () {
            $script = "
            window.LakeFormMediaLang = {
                'empty': '" . static::trans('form-media.js_empty') . "',
                'system_tip': '" . static::trans('form-media.js_system_tip') . "',
                'remove_tip': '" . static::trans('form-media.js_remove_tip') . "',
                'select_type': '" . static::trans('form-media.js_select_type') . "',
                'page_render': '" . static::trans('form-media.js_page_render') . "',
                'dir_not_empty': '" . static::trans('form-media.js_dir_not_empty') . "',
                'create_dir_error': '" . static::trans('form-media.js_create_dir_error') . "',
                'upload_error': '" . static::trans('form-media.js_upload_error') . "',
                'selected_error': '" . static::trans('form-media.js_selected_error') . "',
                'getdata_error': '" . static::trans('form-media.js_getdata_error') . "',
                'preview_title': '" . static::trans('form-media.js_preview_title') . "',
                'preview': '" . static::trans('form-media.js_preview') . "',
                'remove': '" . static::trans('form-media.js_remove') . "',
                'dragsort': '" . static::trans('form-media.js_dragsort') . "',
                'copy_success': '" . static::trans('form-media.js_copy_success') . "',
                'copy_error': '" . static::trans('form-media.js_copy_error') . "',
            };
            ";
            Admin::script($script);
        });
    }
    
}