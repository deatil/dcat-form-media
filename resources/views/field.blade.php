<div class="lake-form-media-{{ str_replace(['[', ']'], ['-', ''], $name) }} {{$viewClass['form-group']}} {!! !$errors->has($errorKey) ? '' : 'has-error' !!}" data-options="{{ json_encode($options) }}" >

    <label class="{{$viewClass['label']}} control-label">{{$label}}</label>
    
    <div class="{{$viewClass['field']}}">

        <div class="lake-form-media-img-show" style="display: none;">
            <div class="row lake-form-media-img-show-row" >
            </div>
        </div>

        @include('admin::form.error')
        <div class="input-group">
            
            <input type="text" 
                name="{{$name}}" 
                class="form-control lake-form-media-input lake-form-media-input-{{ str_replace(['[', ']'], ['-', ''], $name) }} {{$class}}"  
                placeholder="{{ $placeholder }} "  {!! $attributes !!} 
                value="{{ old($column, $value)?(is_array(old($column, $value))?json_encode(old($column, $value)):old($column, $value)):'' }}" />

            <div class="input-group-btn input-group-append">
                <div tabindex="500" 
                    class="btn btn-primary btn-file lake-form-media-btn-file" type="button" 
                    data-toggle="modal" 
                    data-target="#LakeFormMediaModel{{ str_replace(['[', ']'], ['-', ''], $name) }}" 
                    data-title="{{ $label }}" 
                    data-name="{{ str_replace(['[', ']'], ['-', ''], $name) }}"  
                    data-value="{{ old($column, $value)?(is_array(old($column, $value))?json_encode(old($column, $value)):old($column, $value)):'' }}"  
                    data-token="{{ csrf_token() }}">
                    <i class="fa fa-folder-open"></i>&nbsp;  
                    <span class="hidden-xs">浏览</span>
                </div>
            </div>

        </div><!-- /input-group -->
        @include('admin::form.help-block')
    </div>
</div>

<!-- 弹窗 -->
<div class="modal fade lake-form-media-modal-{{ str_replace(['[', ']'], ['-', ''], $name) }}" id="LakeFormMediaModel{{ str_replace(['[', ']'], ['-', ''], $name) }}" tabindex="-1" role="dialog" aria-labelledby="LakeFormMediaModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content"  style="width: 100%">
          <div class="modal-header">
            <h4 class="modal-title" id="LakeFormMediaModalLabel">选择图片</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          </div>
          <div class="mailbox-controls with-border" style="margin-left: 10px;">
                <!-- /.btn-group -->
                <label class="btn btn-primary">
                    <i class="fa fa-upload"></i>&nbsp;&nbsp;上传
                    <input type="file"  class="hidden file-upload lake-form-media-upload" multiple="" data-name="{{ str_replace(['[', ']'], ['-', ''], $name) }}" >
                </label>

                <div class="input-group pull-right goto-url" style="width: 250px;">
                    <input type="text" class="form-control lake-form-media-dir-input" value="">
                    <div class="input-group-btn input-group-append">
                        <button type="button" class="btn btn-primary lake-form-media-dir-button" data-name="{{ str_replace(['[', ']'], ['-', ''], $name) }}">
                            <i class="fa fa-folder"></i>&nbsp;&nbsp;新建
                        </button>
                    </div>
                </div>
            </div>

            <div class="modal-body pre-scrollable" >
                <!-- 页面导航 -->
                <ol class="breadcrumb lake-form-media-nav-ol" data-current-path="/" style="margin-bottom: 10px;">
                </ol>
                
                <!-- 图片 -->
                <div class="row lake-form-media-body-table">
                    <!-- js 加载 -->
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                <button type="button" class="btn btn-primary lake-form-media-submit" data-name="{{ str_replace(['[', ']'], ['-', ''], $name) }}">确定</button>
            </div>
            
            <!-- 分页 -->
            <div class="lake-form-media-modal-page"
                data-current-page="1"
                data-page-size="{{ $options['pageSize'] }}"
                data-total-page="0"
            >
                <button type="button" class="btn btn-primary hidden lake-form-media-modal-prev-page" data-name="{{ str_replace(['[', ']'], ['-', ''], $name) }}">上一页</button>
                <button type="button" class="btn btn-primary hidden lake-form-media-modal-next-page" data-name="{{ str_replace(['[', ']'], ['-', ''], $name) }}">下一页</button>
            </div>
        </div>
    </div>
</div>
