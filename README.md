# Dcat-admin 媒体管理拓展


## 预览

### 表单
![form](https://user-images.githubusercontent.com/24578855/100129072-03f43f00-2ebc-11eb-8fec-b2e0d03e26bb.jpg)

### 弹出选择框
![form-model](https://user-images.githubusercontent.com/24578855/100129077-06569900-2ebc-11eb-85ed-5320ba568b7b.jpg)


## 环境
 - PHP >= 7.2.5
 - Laravel 5.5.0 ~ 8.*
 - Fileinfo PHP Extension


## 安装

### composer 安装

```
composer require lake/form-media
```

### 发布资源

```
php artisan vendor:publish --tag=lake-form-media
```

## 使用

#### 单图 数据库结构 varchar

##### 可删除

```
$form->photo('photo','图片')->limit(1)->remove(true)->help('单图，可删除');
```

##### 不可删除

```
$form->photo('photo','图片')->limit(1)->remove(false)->help('单图，不可删除');

$form->photo('photo','图片')->limit(1)->help('单图，可删除');
```

#### 多图 数据库结构 json

```
$form->photos('photo', '图片')->limit(9)->remove(true);  //可删除
```

#### 视频 数据库结构 json/varchar

```
$form->video('video','视频')->limit(9)->remove(true);  //可删除

```

### 参数说明
```
limit(int)      ： 图片限制条数
remove(boolean) :  是否有删除按钮   

photo 、 photos 、 video  的 参数默认值不一样

photo  默认 limit = 1  remove = false

photos 默认 limit = 9  remove = true

video  默认 limit = 1  remove = true
```


##### 多图上传提交的数据为 json 字符串，如需输出数组，请在对应模型中加入下面代码
```
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Demo extends Model
{
    
    public function getPicturesAttribute($pictures)
    {

        return json_decode($pictures, true);

    }

}
```

## 特别鸣谢

感谢 `narwhalformmedia` 提供的原始代码
```
yelphp/narwhalformmedia
```
