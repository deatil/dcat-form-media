<?php

use Lake\FormMedia\Http\Controllers\FormMedia;

// 获取文件
Route::any('lake-form-media/get-files', FormMedia::class.'@getFiles')->name('admin.lake-form-media.get-files');

// 上传图片
Route::post('lake-form-media/upload', FormMedia::class.'@upload')->name('admin.lake-form-media.upload');

// 新建文件夹
Route::post('lake-form-media/create-folder', FormMedia::class.'@createFolder')->name('admin.lake-form-media.create-folder');