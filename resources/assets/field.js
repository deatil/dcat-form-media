;(function () {
    var LakeFormMedia = {
        init: function() {
            var thiz = this;
            
            $('.lake-form-media-btn-file').each(function(i, cont) {
                var name = $(cont).data('name');
                var options = $(cont).data('options');
                var value = $(cont).data('value');
                
                options = $.extend({}, options);
                
                var limit = options.limit;
                
                var mediaCont = $('.lake-form-media-'+name);
                var mediaModalCont = $('.lake-form-media-modal-'+name);
                
                var value_arr = [];
                if (value) {
                    if (limit > 1) {
                        value_arr = value;
                    } else {
                        if (value != '[]' && value != '') {
                            value_arr.push(value)
                        }
                    }
                    thiz.previewImg(name, value_arr, options);
                    
                    if (limit > 1) {
                        // 拖拽排序
                        mediaCont
                            .find(".lake-form-media-img-show-row").dragsort({
                                itemSelector: 'div.lake-form-media-preview-item',
                                dragSelector: ".js-dragsort",
                                dragEnd: function () {
                                    thiz.refreshPreview(name);
                                },
                                placeHolderTemplate: $('<div class="lake-form-media-preview-item" />'),
                                scrollSpeed: 15
                            });
                    }
                } else {
                    mediaModalCont
                        .find('.lake-form-media-img-show')
                        .hide();
                }
                
            });

            // 删除
            $('body').on("click", ".lake-form-media-img-show-item-delete", function(){
                var name = $(this).data('name');
                var itemurl = $(this).data('url');
                
                var mediaCont = $('.lake-form-media-'+name);
                var mediaShowCont = mediaCont.find('.lake-form-media-img-show');
                
                mediaCont.find('.lake-form-media-preview-item[data-src="' + itemurl + '"]').remove();
                thiz.refreshPreview(name);
                
                if (mediaShowCont.find('.lake-form-media-preview-item').length < 1) {
                    mediaShowCont.hide();
                }
                
                return 1;
            });
            
            // 弹出选择器
            $('body').on('click', '.lake-form-media-btn-file', function (event) {
                var modal = $(this)
                
                var title = modal.data('title')
                var name = modal.data('name')
                var options = modal.data('options')
                
                var path = options.path
                
                var mediaModalCont = $('.lake-form-media-modal-'+name);
                var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
                mediaModalPageCont.data('current-page', 1);
                
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                mediaModalNavOlCont.data('current-path', path);
                
                mediaModalCont.find('.modal-title').text('请选择' + title)
                
                thiz.getdata(name, path, options);
            })
            
            // 点击文件夹
            $('body').on('click', ".lake-form-media-file-op", function() {
                var name = $(this).data('name');
                var path = $(this).data('path');
                
                var mediaCont = $('.lake-form-media-'+name);
                var mediaModalCont = $('.lake-form-media-modal-'+name);
                var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
                mediaModalPageCont.data('current-page', 1);
                
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                mediaModalNavOlCont.data('current-path', path);
                
                var options = mediaCont.data('options');
                
                thiz.getdata(name, path, options)
            });
            
            // 点击nav
            $('body').on("click", ".lake-form-media-nav-li", function(){
                var name = $(this).data('name');
                var path = $(this).data('path');
                
                var mediaCont = $('.lake-form-media-'+name);
                var mediaModalCont = $('.lake-form-media-modal-'+name);
                var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
                mediaModalPageCont.data('current-page', 1);
                
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                mediaModalNavOlCont.data('current-path', path);
                
                var options = mediaCont.data('options');
                
                thiz.getdata(name, path, options)
            });
            
            // 分页-上一页
            $('body').on("click", '.lake-form-media-modal-prev-page', function() {
                var name = $(this).data('name');
                
                var mediaCont = $('.lake-form-media-'+name);
                var mediaModalCont = $('.lake-form-media-modal-'+name);
                var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
                var currentPage = mediaModalPageCont.data('current-page');
                
                currentPage = parseInt(currentPage);
                if (currentPage > 1) {
                    currentPage -= 1;
                    mediaModalPageCont.data('current-page', currentPage);
                } else {
                    mediaModalPageCont.data('current-page', 1);
                }
                
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                var path = mediaModalNavOlCont.data('current-path');
                
                var options = mediaCont.data('options');
                
                thiz.getdata(name, path, options)
            });
            
            // 分页-下一页
            $('body').on("click", '.lake-form-media-modal-next-page', function() {
                var name = $(this).data('name');
                
                var mediaCont = $('.lake-form-media-'+name);
                var mediaModalCont = $('.lake-form-media-modal-'+name);
                var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
                var currentPage = mediaModalPageCont.data('current-page');
                var totalPage = mediaModalPageCont.data('total-page');
                
                currentPage = parseInt(currentPage);
                totalPage = parseInt(totalPage);
                if (currentPage < totalPage) {
                    currentPage += 1;
                    mediaModalPageCont.data('current-page', currentPage);
                } else {
                    mediaModalPageCont.data('current-page', totalPage);
                }
                
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                var path = mediaModalNavOlCont.data('current-path');
                
                var options = mediaCont.data('options');
                
                thiz.getdata(name, path, options)
            });

            // 新建文件夹
            $('body').on('click', ".lake-form-media-dir-button", function(res){
                var name = $(this).data('name');
                
                var mediaCont = $('.lake-form-media-'+name);
                var mediaModalCont = $('.lake-form-media-modal-'+name);
                
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                var currentPath = mediaModalNavOlCont.data('current-path');
                
                var options = mediaCont.data('options');
                
                var obj = mediaModalCont.find(".lake-form-media-dir-input");
                var dir = obj.val();
                
                var form = new FormData();
                form.append("name", dir);
                form.append("dir", currentPath);
                form.append("_token", Dcat.token);
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
                            thiz.getdata(name, currentPath, options)
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
            $('body').delegate('.lake-form-media-upload', 'change', function() {
                var name = $(this).data('name');
                
                var mediaCont = $('.lake-form-media-'+name);
                var mediaModalCont = $('.lake-form-media-modal-'+name);
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                
                var currentPath = mediaModalNavOlCont.data('current-path');
                var options = mediaCont.data('options');
                
                var files = $(this).prop('files');
                var form = new FormData();
                for (var i = 0; i < files.length; i++) {
                    form.append("files[]", files[i]);
                }
               
                form.append("path", currentPath);
                form.append("nametype", options.nametype);
                form.append("_token", Dcat.token);
                $.ajax({
                    type: 'post', 
                    url: '/admin/lake-form-media/upload',
                    data: form,
                    processData: false,
                    contentType : false,
                    success: function(data){
                        if(data['code'] == 200){
                            toastr.success(data['msg']);
                            thiz.getdata(name, currentPath, options)
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
            $('body').on('click', '.lake-form-media-submit', function(res){
                var name = $(this).data('name');
                
                var mediaCont = $('.lake-form-media-'+name);
                var mediaModalCont = $('.lake-form-media-modal-'+name);
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                
                var currentPath = mediaModalNavOlCont.data('current-path');
                var options = mediaCont.data('options');
                
                var inputCont = $('.lake-form-media-input-' + name);
                
                var limit = options.limit;
                var rootpath = options.rootpath;
                var remove = options.remove
                var type = options.type
                
                // 提交按钮
                var url_list = [];
                var url_list_str = inputCont.val();
                if (url_list_str == '[]') {
                    url_list_str = '';
                }
                
                if (url_list_str) {
                    if (limit == 1) {
                        //去掉预览
                        thiz.previewImg(name, [], options)
                    } else {
                        url_list = thiz.isJSON( url_list_str );
                    }
                }
                
                var select_true_list = null;
                if(type == 'img'){
                    select_true_list = mediaModalCont
                        .find('.lake-form-media-img-op.lake-form-media-selected');
                }else if(type == 'video'){
                    select_true_list = mediaModalCont
                        .find('.lake-form-media-video-op.lake-form-media-selected');
                }
                for (var i = 0; i < select_true_list.length; i++) {
                    url_list.push($(select_true_list[i]).data('url'));
                }
                
                url_list = thiz.unique(url_list);
                
                if (limit == 1) {
                    inputCont.val(url_list[0]);
                    inputCont.attr("value", url_list[0]);
                } else {
                    url_list_json = JSON.stringify( url_list );
                    if(url_list_json == '[]'){
                        $('#LakeFormMediaModel'+name).modal('hide');
                        return null;
                    }
                    inputCont.val(url_list_json);
                    inputCont.attr("value", url_list_json);
                }
                
                thiz.previewImg(name, url_list, options)
                $('#LakeFormMediaModel'+name).modal('hide');
            });
            
            // 点击图片
            $('body').on("click", ".lake-form-media-img-op", function(){
                var name = $(this).data('name');
                
                var mediaCont = $('.lake-form-media-'+name);
                var mediaModalCont = $('.lake-form-media-modal-'+name);
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                
                var currentPath = mediaModalNavOlCont.data('current-path');
                var options = mediaCont.data('options');
                
                var inputCont = $('.lake-form-media-input-' + name);
                
                var type = options.type;
                
                var limit = options.limit;
                var rootpath = options.rootpath;
                var remove = options.remove
                
                if (type != 'img') {
                    return false;
                }

                // 现有多少张
                var now_num_val = inputCont.val();
                if (now_num_val == '[]') {
                    now_num_val = '';
                }
                var now_num_arr = [];
                if (now_num_val) {
                    if(limit == 1){
                        now_num_arr.push(now_num_val)
                    }else{
                        now_num_arr = thiz.isJSON( now_num_val );
                    }
                }
                var select_num = now_num_arr.length;
                
                var tag = $(this).hasClass('lake-form-media-selected');

                if (tag) {
                    //取消选中
                    $(this).removeClass('lake-form-media-selected');
                } else {
                    //选中
                    if (limit == 1) {
                        //取消之前选中的
                        mediaModalCont.find('.lake-form-media-selected').removeClass('lake-form-media-selected')
                    } else {
                        if (select_num >= limit) {
                            thiz.tip('选择图片不能超过 '+limit+' 张');
                            return 1;
                        }
                    }
                    $(this).addClass('lake-form-media-selected');
                }
                
                return 1;
            });
            
            // 点击视频
            $('body').on("click", ".lake-form-media-video-op", function(){
                var name = $(this).data('name');
                
                var mediaCont = $('.lake-form-media-'+name);
                var mediaModalCont = $('.lake-form-media-modal-'+name);
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                
                var currentPath = mediaModalNavOlCont.data('current-path');
                var options = mediaCont.data('options');
                
                var inputCont = $('.lake-form-media-input-' + name);
                
                var type = options.type;
                
                var limit = options.limit;
                var rootpath = options.rootpath;
                var remove = options.remove
                
                if (type != 'video') {
                    return false;
                }

                //现有多少个
                var now_num_val = inputCont.val();
                if (now_num_val == '[]') {
                    now_num_val = '';
                }
                var now_num_arr = [];
                if (now_num_val) {
                    if(limit == 1){
                        now_num_arr.push(now_num_val)
                    }else{
                        now_num_arr = thiz.isJSON( now_num_val );
                    }
                }
                var select_num = now_num_arr.length;

                var tag = $(this).hasClass('lake-form-media-selected');

                if (tag) {
                    //取消选中
                    $(this).removeClass('lake-form-media-selected');
                } else {
                    //选中
                    if (limit == 1) {
                        //取消之前选中的
                        mediaModalCont.find('.lake-form-media-selected').removeClass('lake-form-media-selected')
                    }else{
                        if (select_num >= limit){
                            thiz.tip('选择的视频不能超过 '+limit+' 条');
                            return 1;
                        }
                    }
                    $(this).addClass('lake-form-media-selected');
                }
                return 1;
            });
        },
        
        getdata: function(name, path = '/', options = []) {
            var limit = options.limit;
            var remove = options.remove;
            var rootpath = options.rootpath;
            var pageSize = options.pageSize;
            
            var mediaModalCont = $('.lake-form-media-modal-'+name);
            var mediaModalTableCont = mediaModalCont.find('.lake-form-media-body-table');
            var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
            var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
            
            var inputCont = $('.lake-form-media-input-' + name);
            
            var currentPath = mediaModalNavOlCont.data('current-path');
            var currentPage = mediaModalPageCont.data('current-page');
            var pageSize = mediaModalPageCont.data('page-size');
            
            var thiz = this;
            
            $.ajax({
                url: "/admin/lake-form-media/get-files?path="+path+"&page="+currentPage+"&pageSize="+pageSize,
                method: 'GET',
                datatype:'json',
                async: true,
                success: function (res) {
                    var list = res['data']['list'];
                    var nav = res['data']['nav'];
                    
                    mediaModalTableCont.html('');
                    if (JSON.stringify(list) != '[]') {
                        for (var i in list) {
                            if (list[i]['isDir']) {
                                var htmltemp = '';
                                htmltemp += '<div class="col-xs-4 col-md-3">';
                                htmltemp +=     '<div class="thumbnail lake-form-media-file-op" data-name="'+name+'" data-path="/'+list[i]['name']+'">';
                                htmltemp +=         list[i]['preview'];
                                htmltemp +=         '<div class="file-info">';
                                htmltemp +=             '<a href="javascript:;" class="file-name" title="'+list[i]['name']+'">'+list[i]['namesmall']+'</a>';
                                htmltemp +=         '</div>';
                                htmltemp +=     '</div>';
                                htmltemp += '</div>';
                                mediaModalTableCont.append(htmltemp);
                            }else{
                                var htmltemp = '';
                                htmltemp += '<div class="col-xs-4 col-md-3">';
                                
                                if(list[i]['type'] == 'image'){
                                    htmltemp +=     '<div class="thumbnail lake-field-preview-item lake-form-media-img-op" data-name="'+name+'" data-url="'+list[i]['name']+'">';
                                }else if(list[i]['type'] == 'video'){
                                    htmltemp +=     '<div class="thumbnail lake-field-preview-item lake-form-media-video-op" data-name="'+name+'" data-url="'+list[i]['name']+'">';
                                }else{
                                    htmltemp +=    '<div class="thumbnail " data-url="'+list[i]['name']+'">';
                                }
                                htmltemp +=         list[i]['preview'];
                                htmltemp +=         '<div class="file-info">';
                                htmltemp +=             '<a href="javascript:;" class="file-name" title="'+list[i]['name']+'">'+list[i]['namesmall']+'</a>';
                                htmltemp +=         '</div>';
                                htmltemp +=     '</div>';
                                htmltemp += '</div>';

                                mediaModalTableCont.append(htmltemp);
                            }
                        }
                        
                    } else {
                        var htmltemp = '<div class="col-12"><div class="lake-form-media-empty">空</div></div>';
                        mediaModalTableCont.append(htmltemp);
                    }
                    
                    mediaModalNavOlCont.html('<li class="breadcrumb-item lake-form-media-nav-li" data-name="'+name+'" data-path="/""><a href="javascript:;"><i class="fa fa-th-large"></i> </a></li>');
                    mediaModalNavOlCont.data('current-path', '/');
                    for (var i = 0; i < nav.length; i++) {
                        mediaModalNavOlCont.append('<li class="breadcrumb-item"><a class="lake-form-media-nav-li" data-name="'+name+'" href="javascript:;" data-path="'+nav[i]['url']+'"> '+nav[i]['name']+'</a></li>');
                        mediaModalNavOlCont.data('current-path', nav[i]['url']);
                    }
                    
                    var url_list_str = inputCont.val();
                    var url_list = [];
                    if (limit == 1) {
                        mediaModalTableCont.find('[data-url="'+url_list_str+'"]')
                            .addClass('lake-form-media-selected');
                    } else {
                        url_list = thiz.isJSON( url_list_str );
                        for (var index in url_list) {
                            mediaModalTableCont.find('[data-url="'+url_list[index]+'"]')
                                .addClass('lake-form-media-selected');
                        }
                    }
                    
                    var total_page = parseInt(res['data']['total_page']);
                    var current_page = parseInt(res['data']['current_page']);
                    var per_page = parseInt(res['data']['per_page']);
                    
                    mediaModalPageCont.data('current-page', current_page);
                    mediaModalPageCont.data('total-page', total_page);
                    
                    if (total_page > 1) {
                        if (current_page > 1) {
                            mediaModalPageCont.find('.lake-form-media-modal-prev-page').removeClass('hidden');
                        } else {
                            mediaModalPageCont.find('.lake-form-media-modal-prev-page').addClass('hidden');
                        }
                        
                        if (current_page < total_page) {
                            mediaModalPageCont.find('.lake-form-media-modal-next-page').removeClass('hidden');
                        } else {
                            mediaModalPageCont.find('.lake-form-media-modal-next-page').addClass('hidden');
                        }
                    } else {
                        mediaModalPageCont.find('.lake-form-media-modal-prev-page').addClass('hidden');
                        mediaModalPageCont.find('.lake-form-media-modal-next-page').addClass('hidden');
                    }

                },
                cache: false,
                contentType: false,
                processData: false
            });
        },
        
        refreshPreview: function(name) {
            var mediaCont = $('.lake-form-media-'+name);
            var inputCont = $('.lake-form-media-input-' + name);
            
            var url_list = [];
            mediaCont.find('.lake-form-media-preview-item')
                .each(function(i, cont) {
                    url_list.push($(cont).data('src'));
                });
            
            var inputString = JSON.stringify( url_list );
            if (inputString == '[]' || inputString  == '[""]') {
                inputString = '';
            }
            
            inputCont.val(inputString);
        },
        
        previewImg: function(name, urlList, options = []) {
            var limit = options.limit;
            var remove = options.remove;
            var rootpath = options.rootpath;
            
            var mediaCont = $('.lake-form-media-'+name);
            var imgShowCont = mediaCont.find('.lake-form-media-img-show');
            var imgShowRowCont = mediaCont.find('.lake-form-media-img-show-row');
            
            imgShowRowCont.html('');
            if (urlList.length > 0) {
                imgShowCont.show();
            } else {
                imgShowCont.hide();
            }
            
            for (var i = 0; i < urlList.length; i++) {
                var src = rootpath+urlList[i];
                var html = '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-3 lake-form-media-preview-item" data-src="'+urlList[i]+'">';
                    html += '<div class="thumbnail lake-form-media-row-col">';
                
                if (options.type == 'img') {
                    html += '<img width="100%" max-height="160px" src="'+src+'" alt="'+src+'"/>';
                } else if (options.type == 'video') {
                    html += '<video width="100%" max-height="160px" src="'+src+'" alt="'+src+'"/>';
                }
                
                html += '<div class="caption">';
                if (remove) {
                    html += '<a type="button" class="btn btn-default file-delete-multiple lake-form-media-img-show-item-delete" data-name="'+name+'" data-url="'+urlList[i]+'" title="删除"><i class="fa fa-times"></i></a>';
                }
                if (limit > 1) {
                    html += '<a href="javascript:;" type="button" class="btn btn-default js-dragsort" title="拖动"><i class="fa fa-arrows"></i></a>';
                }
                html += '</div>';
                
                html += '</div>';
                html += '</div>';
                
                imgShowRowCont.append(html);
            }
        },
        
        tip: function(title = '提示'){
            layer.alert(title);
        },
    
        unique: function (arr){
            var hash=[];
            for (var i = 0; i < arr.length; i++) {
                if(hash.indexOf(arr[i])==-1){
                    hash.push(arr[i]);
                }
            }
            
            return hash;
        },
    
        isJSON: function(str) {
            if (typeof str == 'string') {
                try {
                    return JSON.parse(str);
                } catch(e) {
                    return [str];
                }
            }
            return [];  
        },

    }
    
    LakeFormMedia.init();
})();