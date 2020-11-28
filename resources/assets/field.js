/**
 * LakeFormMedia-field.js v1.0.5
 *
 * @create 2020-11-28
 * @author deatil
 */
$(function () {
    var LakeFormMedia = {
        init: function() {
            var thiz = this;
            
            $('.lake-form-media-input').each(function(i, cont) {
                var mediaCont = $(cont).parents('.lake-form-media');
                var value = $(cont).val();
                
                var name = mediaCont.data('name');
                
                var mediaModalCont = mediaCont.find('.lake-form-media-modal');
                
                var options = mediaCont.data('options');
                options = $.extend({}, options);
                
                var limit = options.limit;
                
                var valueArr = [];
                if (value) {
                    if (limit > 1) {
                        valueArr = thiz.isJSON(value);
                    } else {
                        if (value != '[]' && value != '') {
                            valueArr.push(value)
                        }
                    }
                    thiz.refreshPreview(name, valueArr, options);
                } else {
                    mediaModalCont
                        .find('.lake-form-media-img-show')
                        .hide();
                }
                
            });
            
            // 拖拽排序
            $('body').on('mouseenter', '.js-dragsort', function() {
                var showRowCont = $(this).parents(".lake-form-media-img-show-row");
                if (showRowCont.hasClass('bind-dragsort')) {
                    return ;
                }
                
                var mediaCont = $(this).parents('.lake-form-media');
                var name = mediaCont.data('name');
                
                showRowCont.dragsort({
                    itemSelector: 'div.lake-form-media-preview-item',
                    dragSelector: ".js-dragsort",
                    dragEnd: function () {
                        thiz.refreshInputString(name);
                    },
                    placeHolderTemplate: $('<div class="lake-form-media-preview-item" />'),
                    scrollSpeed: 15
                });
                showRowCont.addClass('bind-dragsort')
            });
            
            // 删除
            $('body').on("click", ".lake-form-media-img-show-item-delete", function(){
                var mediaCont = $(this).parents('.lake-form-media');
                var name = mediaCont.data('name');
                
                var itemurl = $(this).data('url');
                
                var mediaShowCont = mediaCont.find('.lake-form-media-img-show');
                
                mediaCont.find('.lake-form-media-preview-item[data-src="' + itemurl + '"]').remove();
                thiz.refreshInputString(name);
                
                if (mediaShowCont.find('.lake-form-media-preview-item').length < 1) {
                    mediaShowCont.hide();
                }
                
                return 1;
            });
            
            // 弹出选择器
            $('body').on('click', '.lake-form-media-btn-file', function (event) {
                var modal = $(this)
                
                var title = modal.data('title')
                
                var mediaCont = $(this).parents('.lake-form-media');
                var name = mediaCont.data('name');
                
                var options = mediaCont.data('options');
                options = $.extend({}, options);
                
                var path = options.path
                
                var mediaModalCont = mediaCont.find('.lake-form-media-modal');
                var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
                mediaModalPageCont.data('current-page', 1);
                
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                mediaModalNavOlCont.data('current-path', path);
                
                mediaModalCont.find('.modal-title').text('请选择' + title)
                
                thiz.getdata(name, path, options);
            })
            
            // 点击文件夹
            $('body').on('click', ".lake-form-media-dir-op", function() {
                var mediaCont = $(this).parents('.lake-form-media');
                var name = mediaCont.data('name');
                
                var path = $(this).data('path');
                
                var mediaModalCont = mediaCont.find('.lake-form-media-modal');
                var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
                mediaModalPageCont.data('current-page', 1);
                
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                mediaModalNavOlCont.data('current-path', path);
                
                var options = mediaCont.data('options');
                
                thiz.getdata(name, path, options)
            });
            
            // 点击nav
            $('body').on("click", ".lake-form-media-nav-li", function(){
                var mediaCont = $(this).parents('.lake-form-media');
                var name = mediaCont.data('name');
                
                var path = $(this).data('path');
                
                var mediaModalCont = mediaCont.find('.lake-form-media-modal');
                var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
                mediaModalPageCont.data('current-page', 1);
                
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                mediaModalNavOlCont.data('current-path', path);
                
                var options = mediaCont.data('options');
                
                thiz.getdata(name, path, options)
            });
            
            // 分页-上一页
            $('body').on("click", '.lake-form-media-modal-prev-page', function() {
                var mediaCont = $(this).parents('.lake-form-media');
                var name = mediaCont.data('name');
                
                var mediaModalCont = mediaCont.find('.lake-form-media-modal');
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
                var mediaCont = $(this).parents('.lake-form-media');
                var name = mediaCont.data('name');
                
                var mediaModalCont = mediaCont.find('.lake-form-media-modal');
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
            
            // 页码提示
            $('.lake-form-media-modal-prev-page,.lake-form-media-modal-next-page').on('mouseover', function () {
                var pageCont = $(this).parents('.lake-form-media-modal-page');
                
                var currentPage = pageCont.data('current-page');
                var totalPage = pageCont.data('total-page');
                var pageSize = pageCont.data('page-size');
                var title = '第'+currentPage+'页 / 共'+totalPage+'页，每页'+pageSize+'条';
                var idx = layer.tips(title, this, {
                  tips: [1, '#586cb1'],
                  time: 0,
                  maxWidth: 210,
                });
                
                $(this).attr('layer-idx', idx);
            }).on('mouseleave', function () {
                layer.close($(this).attr('layer-idx'));
                
                $(this).attr('layer-idx', '');
            });
            
            // 新建文件夹
            $('body').on('click', ".lake-form-media-dir-button", function(res){
                var mediaCont = $(this).parents('.lake-form-media');
                var name = mediaCont.data('name');
                
                var mediaModalCont = mediaCont.find('.lake-form-media-modal');
                
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
                    url: options.new_folder_url,
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
            $('body').on('change', '.lake-form-media-upload', function() {
                var mediaCont = $(this).parents('.lake-form-media');
                var name = mediaCont.data('name');
                
                var mediaModalCont = mediaCont.find('.lake-form-media-modal');
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
                    url: options.upload_url,
                    data: form,
                    processData: false,
                    contentType : false,
                    success: function(data){
                        if (data['code'] == 200) {
                            toastr.success(data['msg']);
                            thiz.getdata(name, currentPath, options)
                        } else {
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
                var mediaCont = $(this).parents('.lake-form-media');
                var name = mediaCont.data('name');
                
                var mediaModalCont = mediaCont.find('.lake-form-media-modal');
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                
                var currentPath = mediaModalNavOlCont.data('current-path');
                var options = mediaCont.data('options');
                
                var inputCont = mediaCont.find('.lake-form-media-input');
                
                var limit = options.limit;
                var type = options.type
                
                // 提交按钮
                var urlList = [];
                var urlListStr = inputCont.val();
                if (urlListStr == '[]') {
                    urlListStr = '';
                }
                
                if (urlListStr) {
                    if (limit == 1) {
                        // 去掉预览
                        thiz.refreshPreview(name, [], options)
                    } else {
                        urlList = thiz.isJSON( urlListStr );
                    }
                }
                
                select_true_list = mediaModalCont
                    .find('.lake-form-media-selected[data-type="'+type+'"]');
                for (var i = 0; i < select_true_list.length; i++) {
                    urlList.push($(select_true_list[i]).data('url'));
                }
                
                urlList = thiz.unique(urlList);
                
                if (limit == 1) {
                    inputCont.val(urlList[0]);
                    inputCont.attr("value", urlList[0]);
                } else {
                    // 提交限制数量
                    var newUrlList = [];
                    
                    if (urlList.length < limit) {
                        limit = urlList.length;
                    }
                    
                    for (var i = 0; i < limit; i++) {
                        newUrlList.push(urlList[i]);
                    }
                    urlList = newUrlList;
                    
                    urlList_json = JSON.stringify( urlList );
                    if(urlList_json == '[]'){
                        $('#LakeFormMediaModel'+name).modal('hide');
                        return null;
                    }
                    inputCont.val(urlList_json);
                    inputCont.attr("value", urlList_json);
                }
                
                thiz.refreshPreview(name, urlList, options)
                $('#LakeFormMediaModel'+name).modal('hide');
            });
            
            // 点击图片 / 点击视频
            $('body').on("click", ".lake-form-media-field-item-op", function(){
                var itemType = $(this).data('type');
                
                var mediaCont = $(this).parents('.lake-form-media');
                var name = mediaCont.data('name');
                
                var mediaModalCont = mediaCont.find('.lake-form-media-modal');
                var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                
                var currentPath = mediaModalNavOlCont.data('current-path');
                var options = mediaCont.data('options');
                
                var inputCont = mediaCont.find('.lake-form-media-input');
                
                var type = options.type;
                var limit = options.limit;
                
                if (type != itemType) {
                    return false;
                }

                // 现有多少张
                var nowNumVal = inputCont.val();
                if (nowNumVal == '[]') {
                    nowNumVal = '';
                }
                var nowNumArr = [];
                if (nowNumVal) {
                    if (limit == 1) {
                        nowNumArr.push(nowNumVal)
                    } else {
                        nowNumArr = thiz.isJSON( nowNumVal );
                    }
                }
                
                var noNeedSelectArr = [];
                var imgItem = mediaModalCont
                    .find('.lake-form-media-field-item[data-type="'+itemType+'"]');
                for (var i = 0; i < imgItem.length; i++) {
                    var itemUrl = $(imgItem[i]).data('url');
                    if ($.inArray(itemUrl, nowNumArr) != -1) {
                        noNeedSelectArr.push(itemUrl);
                    }
                }
                var selectedItem = mediaModalCont.find('.lake-form-media-selected');
                
                var selectNum = nowNumArr.length - noNeedSelectArr.length + selectedItem.length;
                
                var tag = $(this).hasClass('lake-form-media-selected');

                if (tag) {
                    // 取消选中
                    $(this).removeClass('lake-form-media-selected');
                } else {
                    // 选中
                    if (limit == 1) {
                        // 取消之前选中的
                        mediaModalCont
                            .find('.lake-form-media-selected')
                            .removeClass('lake-form-media-selected')
                    } else {
                        if (selectNum >= limit) {
                            toastr.error('选择图片不能超过 '+limit+' 张');
                            return 1;
                        }
                    }
                    
                    $(this).addClass('lake-form-media-selected');
                }
                
                return 1;
            });
        },
        
        getdata: function(name, path = '/', options = []) {
            var mediaCont = $('.lake-form-media-' + name);
            
            var limit = options.limit;
            var remove = options.remove;
            var rootpath = options.rootpath;
            var pageSize = options.pageSize;
            
            var mediaModalCont = mediaCont.find('.lake-form-media-modal');
            var mediaModalTableCont = mediaModalCont.find('.lake-form-media-body-table');
            var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
            var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
            
            var inputCont = mediaCont.find('.lake-form-media-input');
            
            var currentPath = mediaModalNavOlCont.data('current-path');
            var currentPage = mediaModalPageCont.data('current-page');
            var pageSize = mediaModalPageCont.data('page-size');
            
            var thiz = this;
            
            $.ajax({
                url: options.get_files_url 
                    + "?path="+path
                    + "&page="+currentPage
                    + "&pageSize="+pageSize,
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
                                htmltemp +=     '<div class="thumbnail lake-form-media-field-item lake-form-media-dir-op" data-type="'+list[i]['type']+'" data-path="/'+list[i]['name']+'" title="'+list[i]['name']+'">';
                                htmltemp +=         list[i]['preview'];
                                htmltemp +=         '<div class="file-info">';
                                htmltemp +=             '<a href="javascript:;" class="file-name">'+list[i]['namesmall']+'</a>';
                                htmltemp +=         '</div>';
                                htmltemp +=     '</div>';
                                htmltemp += '</div>';
                                mediaModalTableCont.append(htmltemp);
                            }else{
                                var htmltemp = '';
                                htmltemp += '<div class="col-xs-4 col-md-3">';
                                
                                htmltemp +=     '<div class="thumbnail lake-form-media-field-item lake-form-media-field-item-op" data-type="'+list[i]['type']+'" data-url="'+list[i]['name']+'" title="'+list[i]['name']+'">';
                                htmltemp +=         list[i]['preview'];
                                htmltemp +=         '<div class="file-info">';
                                htmltemp +=             '<a href="javascript:;" class="file-name">'+list[i]['namesmall']+'</a>';
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
                    
                    mediaModalNavOlCont.html('<li class="breadcrumb-item lake-form-media-nav-li" data-path="/""><a href="javascript:;"><i class="fa fa-th-large"></i> </a></li>');
                    mediaModalNavOlCont.data('current-path', '/');
                    for (var i = 0; i < nav.length; i++) {
                        mediaModalNavOlCont.append('<li class="breadcrumb-item"><a class="lake-form-media-nav-li" href="javascript:;" data-path="'+nav[i]['url']+'"> '+nav[i]['name']+'</a></li>');
                        mediaModalNavOlCont.data('current-path', nav[i]['url']);
                    }
                    
                    var urlListStr = inputCont.val();
                    var urlList = [];
                    if (limit == 1) {
                        mediaModalTableCont.find('[data-url="'+urlListStr+'"]')
                            .addClass('lake-form-media-selected');
                    } else {
                        urlList = thiz.isJSON( urlListStr );
                        for (var index in urlList) {
                            mediaModalTableCont.find('[data-url="'+urlList[index]+'"]')
                                .addClass('lake-form-media-selected');
                        }
                    }
                    
                    var totalPage = parseInt(res['data']['total_page']);
                    var currentPage = parseInt(res['data']['current_page']);
                    var perPage = parseInt(res['data']['per_page']);
                    
                    mediaModalPageCont.data('current-page', currentPage);
                    mediaModalPageCont.data('total-page', totalPage);
                    
                    if (totalPage > 1) {
                        if (currentPage > 1) {
                            mediaModalPageCont.find('.lake-form-media-modal-prev-page').removeClass('hidden');
                        } else {
                            mediaModalPageCont.find('.lake-form-media-modal-prev-page').addClass('hidden');
                        }
                        
                        if (currentPage < totalPage) {
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
        
        // 刷新表单数据
        refreshInputString: function(name) {
            var mediaCont = $('.lake-form-media-'+name);
            var inputCont = mediaCont.find('.lake-form-media-input');
            
            var urlList = [];
            mediaCont.find('.lake-form-media-preview-item')
                .each(function(i, cont) {
                    urlList.push($(cont).data('src'));
                });
            
            var inputString = JSON.stringify( urlList );
            if (inputString == '[]' || inputString  == '[""]') {
                inputString = '';
            }
            
            inputCont.val(inputString);
        },
        
        // 刷新/显示 预览
        refreshPreview: function(name, urlList, options = []) {
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
                
                html += '<div class="lake-form-media-row-img">';
                if (options.type == 'image') {
                    html += '<img width="100%" src="'+src+'" alt="'+src+'"/>';
                } else if (options.type == 'video') {
                    html += '<video width="100%" src="'+src+'" alt="'+src+'"/>';
                }
                html += '</div>';
                
                html += '<div class="caption">';
                if (remove) {
                    html += '<a type="button" class="btn btn-default file-delete-multiple lake-form-media-img-show-item-delete" data-url="'+urlList[i]+'" title="删除"><i class="fa fa-times"></i></a>';
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
        
        unique: function (arr){
            var hash = [];
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
});