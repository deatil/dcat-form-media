<?php

namespace Lake\FormMedia;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

/**
 * Class MediaManager.
 */
class MediaManager
{
    /**
     * @var string
     */
    protected $path = '/';

    /**
     * @var string
     */
    protected $nametype = 'uniqid';

    /**
     * @var \Illuminate\Filesystem\FilesystemAdapter
     */
    protected $storage;

    /**
     * @var array
     */
    protected $fileTypes = [
        'image' => 'png|jpg|jpeg|ico|gif|bmp|svg|wbmp',
        'xls'   => 'xls|xlt|xla|xlsx|xltx|xlsm|xltm|xlam|xlsb',
        'word'  => 'doc|docx|dot|dotx|docm|dotm',
        'ppt'   => 'ppt|pptx|pptm',
        'pdf'   => 'pdf',
        'code'  => 'php|js|java|python|ruby|go|c|cpp|sql|m|h|json|html|aspx',
        'zip'   => 'zip|tar\.gz|rar|rpm',
        'text'  => 'txt|pac|log|md',
        'audio' => 'mp3|wav|flac|3pg|aa|aac|ape|au|m4a|mpc|ogg',
        'video' => 'mkv|rmvb|flv|mp4|avi|wmv|rm|asf|mpeg',
    ];
    
    /**
     * 创建
     */
    public static function create()
    {
        return new static();
    }

    /**
     * 默认驱动
     */
    public function defaultDisk()
    {
        $disk = config('admin.upload.disk');

        return $this->withDisk($disk);
    }

    /**
     * 使用驱动
     */
    public function withDisk($disk)
    {
        $this->storage = Storage::disk($disk);
        
        return $this;
    }
    
    /**
     * 设置目录
     */
    public function setPath($path = '/')
    {
        $this->path = $path;
        return $this;
    }

    public function ls($type = 'image', $order = 'time')
    {
        $files = $this->storage->files($this->path);
        
        $directories = $this->storage->directories($this->path);
        
        $manager = $this;
        $files = $this->formatFiles($files)
            ->map(function($item) use($type, $manager) {
                if ($type == 'blend') {
                    return $item;
                }
                
                $fileType = $manager->detectFileType($item['name']);
                if ($type == $fileType) {
                    return $item;
                }
                
                return null;
            })
            ->filter(function($item) {
                return ! empty($item);
            });
        
        $list = $this->formatDirectories($directories)
            ->merge($files);
        
        if ($order == 'name') {
            $list = $list->sort(function ($item) {
                    return $item['name'];
                });
        } else {
            $list = $list->sortByDesc(function ($item) {
                    return $item['time'];
                });
        }
            
        return $list->all();
    }

    /**
     * Get full path for a giving fiel path.
     *
     * @param string $path
     *
     * @return string
     */
    protected function getFullPath($path)
    {
        return $this->storage
            ->getDriver()
            ->getAdapter()
            ->applyPathPrefix($path);
    }

    /**
     * 下载
     */
    public function download()
    {
        $fullPath = $this->getFullPath($this->path);

        if (File::isFile($fullPath)) {
            return response()->download($fullPath);
        }

        return response('', 404);
    }

    public function delete($path)
    {
        $paths = is_array($path) ? $path : func_get_args();

        foreach ($paths as $path) {
            $fullPath = $this->getFullPath($path);

            if (is_file($fullPath)) {
                $this->storage->delete($path);
            } else {
                $this->storage->deleteDirectory($path);
            }
        }

        return true;
    }

    public function move($new)
    {
        return $this->storage->move($this->path, $new);
    }

    /**
     * @param UploadedFile[] $files
     * @param string         $dir
     *
     * @return mixed
     */
    public function upload($files = [])
    {
        foreach ($files as $file) {
            $this->storage->putFileAs($this->path, $file, $this->getPutFileName($file));
        }

        return true;
    }
    
    /**
     * 检测文件上传类型
     */
    public function checkType($files = [], $type = null)
    {
        foreach ($files as $file) {
            $fileExtension = $file->getClientOriginalExtension();
            $fileType = $this->detectFileType('file.'.$fileExtension);
            if ($fileType != $type) {
                return false;
            }
        }

        return true;
    }
    
    public function setNametype($type = 'uniqid')
    {
        $this->nametype = $type;
        return $this;
    }
    
    public function getPutFileName($file)
    {
        if ($this->nametype == 'datetime') {
            return $this->generateDatetimeName($file);
        } else {
            return $this->generateUniqueName($file);
        }
    }
    
    /**
     * uniqid文件名
     */
    public function generateUniqueName($file)
    {
        return md5(uniqid().microtime()).'.'.$file->getClientOriginalExtension();
    }
    
    /**
     * 时间文件名
     */
    public function generateDatetimeName($file)
    {
        return date('YmdHis').mt_rand(10000, 99999).'.'.$file->getClientOriginalExtension();
    }
    
    public function createFolder($name)
    {
        $path = rtrim($this->path, '/').'/'.trim($name, '/');

        return $this->storage->makeDirectory($path);
    }

    public function exists()
    {
        $path = $this->getFullPath($this->path);

        return file_exists($path);
    }

    /**
     * @return array
     */
    public function urls()
    {
        return [
            'path' => $this->path,
        ];
    }
    
    /**
     * 生成url
     */
    public function buildUrl($url = '')
    {
        if (URL::isValidUrl($url)) {
            return $url;
        }
        
        return $this->storage->url($url);
    }

    /**
     * 格式化文件
     */
    public function formatFiles($files = [])
    {
        $files = array_map(function ($file) {
            return [
                'icon'      => '',
                'name'      => $file,
                'namesmall' => pathinfo($file, PATHINFO_BASENAME),
                'preview'   => $this->getFilePreview($file),
                'isDir'     => false,
                'size'      => $this->getFilesize($file),
                'url'       => $this->storage->url($file),
                'time'      => $this->getFileChangeTime($file),
                'type'      => $this->detectFileType($file)
            ];
        }, $files);

        return collect($files);
    }

    /**
     * 格式化文件夹
     */
    public function formatDirectories($dirs = [])
    {
        $preview = '<a href="javascript:;"><span class="file-icon text-aqua"><i class="fa fa-folder"></i></span></a>';

        $dirs = array_map(function ($dir) use ($preview) {
            return [
                'icon'      => '',
                'name'      => $dir,
                'namesmall' => basename($dir),
                'preview'   => str_replace('__path__', $dir, $preview),
                'isDir'     => true,
                'size'      => '-',
                'url'       => $this->storage->url($dir),
                'time'      => $this->getFileChangeTime($dir),
                'type'      => 'dir',
            ];
        }, $dirs);

        return collect($dirs);
    }

    public function navigation()
    {
        $folders = explode('/', $this->path);

        $folders = array_filter($folders);

        $path = '';

        $navigation = [];

        foreach ($folders as $folder) {
            $path = rtrim($path, '/').'/'.$folder;

            $navigation[] = [
                'name'  => $folder,
                'url'   => $path,
            ];
        }

        return $navigation;
    }

    public function getFilePreview($file)
    {
        switch ($this->detectFileType($file)) {
            case 'image':
                $url = $this->storage->url($file);
                if ($url) {
                    $preview = '<span class="file-icon has-img"><img src="'.$url.'" alt="'.$url.'"></span>';
                } else {
                    $preview = '<span class="file-icon"><i class="fa fa-file-image-o"></i></span>';
                }
                break;

            case 'video':
                /**
                if ($this->storage->getDriver()->getConfig()->has('url')) {
                    $url = $this->storage->url($file);
                    $preview = "<span class=\"file-icon has-video\"><video width='30%' src=\"$url\" alt=\"Attachment\"></span>";
                } else {
                    $preview = '<span class="file-icon"><i class="fa fa-file-video-o"></i></span>';
                }
                */
                $preview = '<span class="file-icon"><i class="fa fa-file-video-o"></i></span>';
                break;

            case 'audio':
                $preview = '<span class="file-icon"><i class="fa fa-file-video-o"></i></span>';
                break;

            case 'pdf':
                $preview = '<span class="file-icon"><i class="fa fa-file-pdf-o"></i></span>';
                break;

            case 'word':
                $preview = '<span class="file-icon"><i class="fa fa-file-word-o"></i></span>';
                break;

            case 'ppt':
                $preview = '<span class="file-icon"><i class="fa fa-file-powerpoint-o"></i></span>';
                break;

            case 'xls':
                $preview = '<span class="file-icon"><i class="fa fa-file-excel-o"></i></span>';
                break;

            case 'text':
                $preview = '<span class="file-icon"><i class="fa fa-file-text-o"></i></span>';
                break;

            case 'code':
                $preview = '<span class="file-icon"><i class="fa fa-code"></i></span>';
                break;

            case 'zip':
                $preview = '<span class="file-icon"><i class="fa fa-file-zip-o"></i></span>';
                break;

            default:
                $preview = '<span class="file-icon"><i class="fa fa-file"></i></span>';
        }

        return $preview;
    }

    protected function detectFileType($file)
    {
        $extension = File::extension($file);

        foreach ($this->fileTypes as $type => $regex) {
            if (preg_match("/^($regex)$/i", $extension) !== 0) {
                return $type;
            }
        }

        return false;
    }

    public function getFilesize($file)
    {
        try {
            $bytes = filesize($this->getFullPath($file));
            $units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

            for ($i = 0; $bytes > 1024; $i++) {
                $bytes /= 1024;
            }
            return round($bytes, 2).' '.$units[$i];
        } catch (\ErrorException $e) {
            return '未知';
        }
    }

    public function getFileChangeTime($file)
    {
        try {
            $time = filectime($this->getFullPath($file));
            return date('Y-m-d H:i:s', $time);
        } catch (\ErrorException $e) {
            return '';
        }
    }
}
