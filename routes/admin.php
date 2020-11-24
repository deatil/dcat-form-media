<?php

use Lake\FormMedia\Http\Controllers\FormMedia;

// 获取文件
Route::any('lake-form-media/getfiledata', FormMedia::class.'@getfiledata')->name('lake-form-media.getdate');

// 上传图片
Route::post('lake-form-media/upload', FormMedia::class.'@upload')->name('lake-form-media.upload');
Route::post('lake-form-media/new-folder', FormMedia::class.'@newFolder')->name('lake-form-media.new-folder');