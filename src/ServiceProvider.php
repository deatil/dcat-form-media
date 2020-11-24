<?php

namespace Lake\FormMedia;

use Illuminate\Support\ServiceProvider as BaseServiceProvider;

use Dcat\Admin\Admin;
use Dcat\Admin\Form;

use Lake\FormMedia\Form\Field;

class ServiceProvider extends BaseServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function boot()
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'lake-form-media');

        if ($this->app->runningInConsole()) {
            $this->publishes(
                [__DIR__.'/../resources/assets' => public_path('vendor/lake/form-media')],
                'lake-form-media'
            );
        }

        // 加载插件
        Admin::booting(function () {
            Form::extend('photo', Field\Photo::class);
            Form::extend('photos', Field\Photos::class);
            Form::extend('video', Field\Video::class);
        });

        // 加载路由
        $this->app->booted(function () {
            $this->registerRoutes(__DIR__.'/../routes/admin.php');
        });
        
    }
    
    /**
     * 注册路由.
     *
     * @param $callback
     */
    protected function registerRoutes($callback)
    {
        Admin::app()->routes(function ($router) use ($callback) {
            $router->group([
                'prefix'     => config('admin.route.prefix'),
                'middleware' => config('admin.route.middleware'),
            ], $callback);
        });
    }
    
}