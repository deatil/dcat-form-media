;(function () {

    function LakeFormMedia(path,name,limit,rootpath,remove,type,nametype){
        this.warp = $(name)
        this.path = path;
        this.name = name;
        this.limit = limit;
        this.remove = remove;
        this.rootpath = rootpath;
        this.type = type;
        this.nametype = nametype;
        this.lake_form_media_crr_path = '/';
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
        if(value){
            if(limit == 1){
                if(value != '[]' && value != ''){
                    value_arr.push(value)
                }
            }else{
                value_arr=this.isJSON(value);
            }
            _this.changeImg(value_arr);
        }else{
            $('.lake_form_media_img_show_'+name).hide();
        }
        
    }

    // 初始化
    LakeFormMedia.prototype.Run = function(){

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
            
            _this.getdata(path);
        })

        // 点击文件
        $("body").delegate(".thumbnail.lake_form_media_file_op"+_this.name,"click",function(){
            var path = $(this).data('path');
            _this.getdata(path)
        });

        // 点击nav
        $("body").delegate(".lake_form_media_nav_li"+_this.name,"click",function(){
            var path = $(this).data('path');
            _this.getdata(path)
        });

        // 新建文件夹
        $("body").delegate(".lake_form_media_dir_button_"+_this.name, 'click', function(res){
            var obj = $("#lake_form_media_dir_input_"+_this.name);
            var dir = obj.val();
            
            var form = new FormData();
            form.append("name",dir);
            form.append("dir",_this.lake_form_media_crr_path);
            form.append("_token",Dcat.token);
            $.ajax({
                type: 'post', // 提交方式 get/post
                url: '/admin/lake-form-media/new-folder', // 需要提交的 url
                data: form,
                processData: false,
                contentType : false,
                success: function(data){
                    if(data['code'] == 200){
                        toastr.success(data['msg']);
                        obj.val('');
                        _this.getdata(_this.lake_form_media_crr_path)  //获取数据
                    }else{
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
           form.append("path", _this.lake_form_media_crr_path);
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
                        _this.getdata(_this.lake_form_media_crr_path)  //获取数据
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
                    _this.changeImg([])
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
                url_list.push(select_true_list[i].dataset.url);
            }

            url_list = _this.unique1(url_list);

            if(limit == 1){
                $('input[name='+name+']').val(url_list[0]);
                $('input[name='+name+']').attr("value",url_list[0]);
            }else{
                url_list_json = JSON.stringify( url_list );
                if(url_list_json == '[]'){
                    $('#LakeFormMediaModel'+_this.name).modal('hide');
                    return null;
                }
                $('input[name='+name+']').val(url_list_json);
                $('input[name='+name+']').attr("value",url_list_json);
            }
            
            _this.changeImg(url_list)
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
                            _this.lake_form_media_tip('选择图片不能超过 '+limit+' 张');
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
                            _this.lake_form_media_tip('选择的视频不能超过 '+limit+' 个');
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

            if(op == 'delete'){
                //删除
                for (var i = 0; i < url_list.length ; i++) {
                    if(url_list[i] != itemurl){
                        new_url_list.push(url_list[i]);
                    }
                }
            }else if(op == 'left'){
                //移动
                var key = 0;
                for (var i = 0; i < url_list.length ; i++) {
                    if(url_list[i] == itemurl){
                       key = i;
                       break;
                    }
                }
                new_url_list = url_list;
                var temp = new_url_list[key-1];
                new_url_list[key-1] = new_url_list[key];
                new_url_list[key] = temp;
            }else if(op == 'right'){
                //移动
                var key = 0;
                for (var i = 0; i < url_list.length ; i++) {
                    if(url_list[i] == itemurl){
                       key = i;
                       break;
                    }
                }
                new_url_list = url_list;
                var temp = new_url_list[key+1];
                new_url_list[key+1] = new_url_list[key];
                new_url_list[key] = temp;
            }else{
                return 0;
            }

            var inputs = JSON.stringify( new_url_list );
            if(inputs == '[]' || inputs  == '[""]'){
                inputs = '';
            }
            $('input[name='+name+']').val(inputs);
            _this.changeImg(new_url_list)
            return 1;
        });
    }

    // 获取图片数据
    LakeFormMedia.prototype.getdata = function(path = '/'){
        var name = this.name;
        var limit = this.limit;
        var remove = this.remove;
        var rootpath = this.rootpath;
        var _this = this;
        $.ajax({
            method: 'GET',
            url: "/admin/lake-form-media/get-files?path="+path,
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
                _this.lake_form_media_crr_path = '/';
                for (var i = 0; i < nav.length; i++) {
                    $('#lake_form_media_nav_ol_'+_this.name).append('<li class="breadcrumb-item"><a class="lake_form_media_nav_li'+name+'" href="javascript:;" data-path="'+nav[i]['url']+'"> '+nav[i]['name']+'</a></li>');
                    _this.lake_form_media_crr_path = nav[i]['url'];
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

            },
            cache: false,
            contentType: false,
            processData: false
        });
    }

    // 弹窗
    LakeFormMedia.prototype.lake_form_media_tip = function(title = '提示'){
        layer.alert(title);
    }

    // 数组去重
    LakeFormMedia.prototype.unique1 = function (arr){
      var hash=[];
      for (var i = 0; i < arr.length; i++) {
         if(hash.indexOf(arr[i])==-1){
          hash.push(arr[i]);
         }
      }
      return hash;
    }

    // 改变预览
    LakeFormMedia.prototype.changeImg = function(url_list){
        var name = this.name;
        var limit = this.limit;
        var remove = this.remove;
        var rootpath = this.rootpath;
        var _this = this;
        $(".lake_form_media_img_show_row_"+name).html('');
        if(url_list.length > 0){
            $('.lake_form_media_img_show_'+name).show();
        }else{
            $('.lake_form_media_img_show_'+name).hide();
        }
        for (var i = 0; i < url_list.length; i++) {
            var html = '';
           if(_this.type == 'img'){
                html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-3"><div class="thumbnail lake_form_media_row_col"><img width="100%" max-height="160px" src="'+rootpath+url_list[i]+'" alt="'+rootpath+url_list[i]+'"/><div class="caption">';
            }else if(_this.type == 'video'){
                html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-3"><div class="thumbnail lake_form_media_row_col"><video width="100%" max-height="160px" src="'+rootpath+url_list[i]+'" alt="'+rootpath+url_list[i]+'"/><div class="caption">';
            }
            if(remove){
                html += '<a type="button" class="btn btn-default file-delete-multiple lake_form_media_img_show_'+name+'_item" data-url="'+url_list[i]+'" data-op="delete" title="删除"><i class="fa fa-trash-o"></i></a>';
            }
            if(i != 0){
                html += '<a type="button" class="btn btn-default file-delete-multiple lake_form_media_img_show_'+name+'_item" data-url="'+url_list[i]+'" data-op="left" title="左"><i class="fa fa-arrow-left"></i></a>';
            }
            if(i != url_list.length -1){
                html += '<a type="button" class="btn btn-default file-delete-multiple lake_form_media_img_show_'+name+'_item" data-url="'+url_list[i]+'" data-op="right" title="右"><i class="fa fa-arrow-right"></i></a>';
            }
            $(".lake_form_media_img_show_row_"+name).append(html+'</div></div></div>');
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