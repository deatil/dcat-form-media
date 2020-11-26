;(function () {

    function LakeFormMedia(options = []) {
        this.warp = $(options.name)
        this.path = options.path;
        this.name = options.name;
        this.limit = options.limit;
        this.remove = options.remove;
        this.rootpath = options.rootpath;
        this.type = options.type;
        this.nametype = options.nametype;
        this.page_size = options.page_size;
        this.current_page = 1;
        this.total_page = 0;
        this.media_crr_path = '/';
    }

    //初始化
    LakeFormMedia.prototype.init = function(){
        var name = this.name;
        var limit = this.limit;
        var remove = this.remove;
        var rootpath = this.rootpath;
        var _this = this;
        var value = $('input[name='+name+']').val();
        var value_arr = [];
        if (value) {
            if (limit == 1) {
                if (value != '[]' && value != '') {
                    value_arr.push(value)
                }
            } else {
                value_arr = this.isJSON(value);
            }
            _this.previewImg(value_arr);
            
            if (limit > 1) {
                // 拖拽排序
                $(".lake_form_media_img_show_row_"+name).dragsort({
                    itemSelector: 'div.lake-form-media-preview-item',
                    dragSelector: ".js-dragsort",
                    dragEnd: function () {
                        _this.refreshPreview();
                    },
                    placeHolderTemplate: $('<div class="lake-form-media-preview-item" />'),
                    scrollSpeed: 15
                });
            }
        } else {
            $('.lake_form_media_img_show_'+name).hide();
        }
        
    }

    // 初始化
    LakeFormMedia.prototype.listen = function(){
        this.init();
        
        var _this = this;

        // 弹出图片选择器
        $('#LakeFormMediaModel'+_this.name).on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
            var recipient = button.data('whatever') // Extract info from data-* attributes
            var title = button.data('title') //标题
            var name = button.data('name') //标题
            var path = button.data('path') //目录
            var limit = button.data('limit') //标题
            var remove = button.data('remove') //标题
            var rootpath = button.data('rootpath') //标题
            var modal = $(this)
            modal.find('.modal-title').text('请选择' + title)
            
            _this.current_page = 1;
            _this.getdata(path);
        })

        // 点击文件
        $("body").delegate(".thumbnail.lake_form_media_file_op"+_this.name,"click",function(){
            var path = $(this).data('path');
             _this.current_page = 1;
            _this.getdata(path)
        });

        // 点击nav
        $("body").delegate(".lake_form_media_nav_li"+_this.name,"click",function(){
            var path = $(this).data('path');
             _this.current_page = 1;
            _this.getdata(path)
        });

        // 分页-上一页
        $('.lake-form-media-'+_this.name).delegate('.lake-form-media-modal-prev-page', "click", function() {
            if (_this.current_page > 1) {
                _this.current_page -= 1;
            } else {
                _this.current_page = 1;
            }
            _this.getdata(_this.path)
        });

        // 分页-下一页
        $('.lake-form-media-'+_this.name).delegate('.lake-form-media-modal-next-page', "click", function() {
            if (_this.current_page < _this.total_page) {
                _this.current_page += 1;
            } else {
                _this.current_page = _this.total_page;
            }
            _this.getdata(_this.path)
        });

        // 新建文件夹
        $("body").delegate(".lake_form_media_dir_button_"+_this.name, 'click', function(res){
            var obj = $("#lake_form_media_dir_input_"+_this.name);
            var dir = obj.val();
            
            var form = new FormData();
            form.append("name",dir);
            form.append("dir",_this.media_crr_path);
            form.append("_token",Dcat.token);
            $.ajax({
                type: 'post',
                url: '/admin/lake-form-media/new-folder',
                data: form,
                processData: false,
                contentType : false,
                success: function(data){
                    if (data['code'] == 200) {
                        toastr.success(data['msg']);
                        obj.val('');
                        _this.getdata(_this.media_crr_path)
                    } else {
                        toastr.error(data['msg']);
                    }
                },
                error: function(XmlHttpRequest, textStatus, errorThrown){
                    toastr.error('创建失败');
                }
            });
        });

        // 上传图片
        $("body").delegate('.file-upload.lake_form_media_upload'+_this.name,'change', function(){
           var files = $(this).prop('files');
           var form = new FormData();
           for (var i = 0; i < files.length; i++) {
               form.append("files[]", files[i]);
           }
           form.append("path", _this.media_crr_path);
           form.append("nametype", _this.nametype);
           form.append("_token", Dcat.token);
           $.ajax({
                type: 'post', // 提交方式 get/post
                url: '/admin/lake-form-media/upload', // 需要提交的 url
                data: form,
                processData: false,
                contentType : false,
                success: function(data){
                    if(data['code'] == 200){
                        toastr.success(data['msg']);
                        _this.getdata(_this.media_crr_path)  //获取数据
                    }else{
                        toastr.error(data['msg']);
                    }
                },
                error: function(XmlHttpRequest, textStatus, errorThrown){
                    toastr.error('上传失败');
                }
            });
        });

        // 提交按钮
        $("body").delegate('#lake_form_media_submit'+_this.name,'click',function(res){
            var limit = _this.limit;
            var name = _this.name;
            var rootpath = _this.rootpath;
            var remove = _this.remove
            var type = _this.type
            // 提交按钮
            var url_list = [];
            var url_list_str = $('input[name='+name+']').val();
            if(url_list_str == '[]'){
                url_list_str = '';
            }
            if(url_list_str){
                if(limit == 1){
                    //去掉预览
                    _this.previewImg([])
                }else{
                    url_list = _this.isJSON( url_list_str );
                }
                
            }
            var select_true_list = null;
            if(type == 'img'){
                select_true_list = $('.lake_form_media_img_op'+name+'.lake_form_media_select_true');
            }else if(type == 'video'){
                select_true_list = $('.lake_form_media_video_op'+name+'.lake_form_media_select_true');
            }
            for (var i = 0; i < select_true_list.length; i++) {
                url_list.push($(select_true_list[i]).data('url'));
            }

            url_list = _this.unique(url_list);

            if (limit == 1) {
                $('input[name='+name+']').val(url_list[0]);
                $('input[name='+name+']').attr("value",url_list[0]);
            } else {
                url_list_json = JSON.stringify( url_list );
                if(url_list_json == '[]'){
                    $('#LakeFormMediaModel'+_this.name).modal('hide');
                    return null;
                }
                $('input[name='+name+']').val(url_list_json);
                $('input[name='+name+']').attr("value",url_list_json);
            }
            
            _this.previewImg(url_list)
            $('#LakeFormMediaModel'+_this.name).modal('hide');
        });

        if (_this.type == 'img') {
            // 点击图片
            $("body").delegate(".lake_form_media_img_op"+_this.name,"click",function(){
                var limit = _this.limit;
                var name = _this.name;
                var rootpath = _this.rootpath;
                var remove = _this.remove

                //现有多少张
                var now_num_val = $('input[name='+name+']').val();
                if(now_num_val == '[]'){
                    now_num_val = '';
                }
                var now_num_arr = [];
                if(now_num_val){
                    if(limit == 1){
                        now_num_arr.push(now_num_val)
                    }else{
                        now_num_arr=_this.isJSON( now_num_val );
                    }
                }
                var now_num = now_num_arr.length;

                var select_num = now_num;

                var classlist = $(this).attr('class').split(' ');
                
                var tag = false;
                for (var i = 0; i < classlist.length; i++) {
                    if(classlist[i] == 'lake_form_media_select_true'){
                        tag = true;
                    }
                }
                if(tag){
                    //取消选中
                    $(this).removeClass('lake_form_media_select_true');
                }else{
                    //选中
                    if(limit == 1){
                        //取消之前选中的
                        $('.lake_form_media_select_true').removeClass('lake_form_media_select_true')

                    }else{
                        if(select_num >= limit){
                            _this.tip('选择图片不能超过 '+limit+' 张');
                            return 1;
                        }
                    }
                    $(this).addClass('lake_form_media_select_true');
                }
                return 1;
            });
        }else if(_this.type == 'video'){
            //点击视频
            $("body").delegate(".lake_form_media_video_op"+_this.name,"click",function(){
                var limit = _this.limit;
                var name = _this.name;
                var rootpath = _this.rootpath;
                var remove = _this.remove

                //现有多少个
                var now_num_val = $('input[name='+name+']').val();
                if(now_num_val == '[]'){
                    now_num_val = '';
                }
                var now_num_arr = [];
                if(now_num_val){
                    if(limit == 1){
                        now_num_arr.push(now_num_val)
                    }else{
                        now_num_arr=_this.isJSON( now_num_val );
                    }
                }
                var now_num = now_num_arr.length;

                var select_num = now_num;

                var classlist = $(this).attr('class').split(' ');
                
                var tag = false;
                for (var i = 0; i < classlist.length; i++) {
                    if(classlist[i] == 'lake_form_media_select_true'){
                        tag = true;
                    }
                }
                if (tag) {
                    //取消选中
                    $(this).removeClass('lake_form_media_select_true');
                } else {
                    //选中
                    if(limit == 1){
                        //取消之前选中的
                        $('.lake_form_media_select_true').removeClass('lake_form_media_select_true')

                    }else{
                        if(select_num >= limit){
                            _this.tip('选择的视频不能超过 '+limit+' 个');
                            return 1;
                        }
                    }
                    $(this).addClass('lake_form_media_select_true');
                }
                return 1;
            });
        }

        // 预览操作
        $("body").delegate(".lake_form_media_img_show_"+_this.name+"_item","click",function(){
            var url_list = [];
            var itemurl = $(this).data('url');
            var op = $(this).data('op');

            var limit = _this.limit;
            var name = _this.name;
            var rootpath = _this.rootpath;
            var remove = _this.remove

            var new_url_list = [];

            var url_list_str = $('input[name='+name+']').val();

            if(limit == 1){
                url_list.push(url_list_str);
            }else{
                url_list = _this.isJSON( url_list_str );
            }

            if (op == 'delete') {
                //删除
                for (var i = 0; i < url_list.length ; i++) {
                    if (url_list[i] != itemurl) {
                        new_url_list.push(url_list[i]);
                    }
                }
            } else {
                return 0;
            }

            var inputString = JSON.stringify( new_url_list );
            if (inputString == '[]' || inputString  == '[""]') {
                inputString = '';
            }
            
            $('input[name='+name+']').val(inputString);
            _this.previewImg(new_url_list)
            return 1;
        });
    }
    
    // 刷新预览
    LakeFormMedia.prototype.refreshPreview = function() {
        var url_list = [];
        $(".lake_form_media_img_show_row_"+this.name).find('.lake-form-media-preview-item').each(function(i, cont) {
            url_list.push($(cont).data('src'));
        });
        
        var inputString = JSON.stringify( url_list );
        if (inputString == '[]' || inputString  == '[""]') {
            inputString = '';
        }
        
        $('input[name='+this.name+']').val(inputString);
    }

    // 获取图片数据
    LakeFormMedia.prototype.getdata = function(path = '/'){
        var name = this.name;
        var limit = this.limit;
        var remove = this.remove;
        var rootpath = this.rootpath;
        var current_page = this.current_page;
        var page_size = this.page_size;
        
        this.path = path;
        
        var _this = this;
        $.ajax({
            method: 'GET',
            url: "/admin/lake-form-media/get-files?path="+path+"&page="+current_page+"&pageSize=" + page_size,
            datatype:'json',
            async: true,
            success: function (res) {
                var list = res['data']['list'];
                var nav = res['data']['nav'];
                
                $('#lake_form_media_body_table_'+_this.name).html('');
                if (JSON.stringify(list) != '[]') {
                    for (var i in list) {
                        if (list[i]['isDir']) {
                            var htmltemp = '';
                            htmltemp += '<div class="col-xs-4 col-md-3">';
                            htmltemp +=     '<div class="thumbnail  lake_form_media_file_op'+name+'" data-path="/'+list[i]['name']+'">';
                            htmltemp +=         list[i]['preview'];
                            htmltemp +=         '<div class="file-info">';
                            htmltemp +=             '<a href="javascript:;" class="file-name" title="'+list[i]['name']+'">'+list[i]['namesmall']+'</a>';
                            htmltemp +=         '</div>';
                            htmltemp +=     '</div>';
                            htmltemp += '</div>';
                            $('#lake_form_media_body_table_'+_this.name).append(htmltemp);
                        }else{
                            var htmltemp = '';
                            htmltemp += '<div class="col-xs-4 col-md-3">';
                            
                            if(list[i]['type'] == 'image'){
                                htmltemp +=     '<div class="thumbnail lake-field-preview-item lake_form_media_img_op'+name+'" data-url="'+list[i]['name']+'">';
                            }else if(list[i]['type'] == 'video'){
                                htmltemp +=     '<div class="thumbnail lake-field-preview-item lake_form_media_video_op'+name+'" data-url="'+list[i]['name']+'">';
                            }else{
                                htmltemp +=    '<div class="thumbnail " data-url="'+list[i]['name']+'">';
                            }
                            htmltemp +=         list[i]['preview'];
                            htmltemp +=         '<div class="file-info">';
                            htmltemp +=             '<a href="javascript:;" class="file-name" title="'+list[i]['name']+'">'+list[i]['namesmall']+'</a>';
                            htmltemp +=         '</div>';
                            htmltemp +=     '</div>';
                            htmltemp += '</div>';

                            $('#lake_form_media_body_table_'+_this.name).append(htmltemp);
                        }
                    }
                    
                } else {
                    var htmltemp = '<div class="col-12"><div class="lake_form_media_empty">空</div></div>';
                    $('#lake_form_media_body_table_'+_this.name).append(htmltemp);
                }
                
                $('#lake_form_media_nav_ol_'+_this.name).html('<li class="breadcrumb-item lake_form_media_nav_li'+name+'" data-path="/""><a href="javascript:;"><i class="fa fa-th-large"></i> </a></li>');
                _this.media_crr_path = '/';
                for (var i = 0; i < nav.length; i++) {
                    $('#lake_form_media_nav_ol_'+_this.name).append('<li class="breadcrumb-item"><a class="lake_form_media_nav_li'+name+'" href="javascript:;" data-path="'+nav[i]['url']+'"> '+nav[i]['name']+'</a></li>');
                    _this.media_crr_path = nav[i]['url'];
                }
                
                var url_list_str = $('input[name='+_this.name+']').val();
                var url_list = [];
                if (limit == 1) {
                    $('[data-url="'+url_list_str+'"]').addClass('lake_form_media_select_true');
                } else {
                    url_list = _this.isJSON( url_list_str );
                    for (var index in url_list) {
                        $('[data-url="'+url_list[index]+'"]')
                            .addClass('lake_form_media_select_true');
                    }
                }
                
                var total_page = parseInt(res['data']['total_page']);
                var current_page = parseInt(res['data']['current_page']);
                var per_page = parseInt(res['data']['per_page']);
                
                _this.total_page = total_page;
                _this.current_page = current_page;
                
                if (total_page > 1) {
                    if (current_page > 1) {
                        $('.lake-form-media-'+_this.name).find('.lake-form-media-modal-prev-page').removeClass('hidden');
                    } else {
                        $('.lake-form-media-'+_this.name).find('.lake-form-media-modal-prev-page').addClass('hidden');
                    }
                    
                    if (current_page < total_page) {
                        $('.lake-form-media-'+_this.name).find('.lake-form-media-modal-next-page').removeClass('hidden');
                    } else {
                        $('.lake-form-media-'+_this.name).find('.lake-form-media-modal-next-page').addClass('hidden');
                    }
                } else {
                    $('.lake-form-media-'+_this.name).find('.lake-form-media-modal-prev-page').addClass('hidden');
                    $('.lake-form-media-'+_this.name).find('.lake-form-media-modal-next-page').addClass('hidden');
                }

            },
            cache: false,
            contentType: false,
            processData: false
        });
    }

    // 弹窗
    LakeFormMedia.prototype.tip = function(title = '提示'){
        layer.alert(title);
    }

    // 数组去重
    LakeFormMedia.prototype.unique = function (arr){
      var hash=[];
      for (var i = 0; i < arr.length; i++) {
         if(hash.indexOf(arr[i])==-1){
          hash.push(arr[i]);
         }
      }
      return hash;
    }

    // 改变预览
    LakeFormMedia.prototype.previewImg = function(url_list){
        var name = this.name;
        var limit = this.limit;
        var remove = this.remove;
        var rootpath = this.rootpath;
        var _this = this;
        
        $(".lake_form_media_img_show_row_"+name).html('');
        if (url_list.length > 0) {
            $('.lake_form_media_img_show_'+name).show();
        } else {
            $('.lake_form_media_img_show_'+name).hide();
        }
        
        for (var i = 0; i < url_list.length; i++) {
            var src = rootpath+url_list[i];
            var html = '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-3 lake-form-media-preview-item" data-src="'+url_list[i]+'">';
                html += '<div class="thumbnail lake_form_media_row_col">';
            
            if (_this.type == 'img') {
                html += '<img width="100%" max-height="160px" src="'+src+'" alt="'+src+'"/>';
            } else if (_this.type == 'video') {
                html += '<video width="100%" max-height="160px" src="'+src+'" alt="'+src+'"/>';
            }
            
            html += '<div class="caption">';
            if (remove) {
                html += '<a type="button" class="btn btn-default file-delete-multiple lake_form_media_img_show_'+name+'_item" data-url="'+url_list[i]+'" data-op="delete" title="删除"><i class="fa fa-times"></i></a>';
            }
            if (limit > 1) {
                html += '<a href="javascript:;" type="button" class="btn btn-default js-dragsort" title="拖动"><i class="fa fa-arrows"></i></a>';
            }
            html += '</div>';
            
            html += '</div>';
            html += '</div>';
            
            $(".lake_form_media_img_show_row_"+name).append(html+'');
        }
    }

    // 判断是否是json 字符串
    LakeFormMedia.prototype.isJSON = function(str) {
        if (typeof str == 'string') {
            try {
                return JSON.parse(str);
            } catch(e) {
                return [str];
            }
        }
        return [];  
    }

    window.LakeFormMedia = LakeFormMedia;
})();