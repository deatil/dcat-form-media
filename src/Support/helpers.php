<?php

use Lake\FormMedia\MediaManager;

if (! function_exists('lake_form_media_url')) {
    /**
     * 生成url链接
     *
     * @create 2020-11-26
     * @author deatil
     */
    function lake_form_media_url($url = '') {
        return (new MediaManager())->buildUrl($url);
    }
}

if (! function_exists('lake_form_media_urls')) {
    /**
     * 生成url链接列表
     *
     * @create 2020-11-26
     * @author deatil
     */
    function lake_form_media_urls($urls = []) {
        $newUrls = [];
        foreach ($urls as $url) {
            $newUrls[] = lake_form_media_url($url);
        }
        
        return $newUrls;
    }
}
