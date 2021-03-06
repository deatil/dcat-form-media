/**
 * LakeFormMedia-field.js v1.0.10
 *
 * @create 2020-11-28
 * @author deatil
 */
$(function () {
    var LakeFormMedia = {
        init: function() {
            var thiz = this;
            
            // 刷新预览
            $('body')
                .off('change', '.lake-form-media-input')
                .on('change', '.lake-form-media-input', function() {
                    thiz.refreshInputPreview(this);
                });
            
            // 拖拽排序
            $('body')
                .off('mouseenter', '.js-dragsort')
                .on('mouseenter', '.js-dragsort', function() {
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
            $('body')
                .off("click", ".lake-form-media-img-show-item-delete")
                .on("click", ".lake-form-media-img-show-item-delete", function(){
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
            $('body')
                .off('click', '.lake-form-media-btn-file')
                .on('click', '.lake-form-media-btn-file', function (event) {
                    var modal = $(this)
                    
                    var title = modal.data('title')
                    
                    var mediaCont = $(this).parents('.lake-form-media');
                    var name = mediaCont.data('name');
                    
                    var options = mediaCont.data('options');
                    options = $.extend({}, options);
                    
                    var path = options.path;
                    var uploadUrl = options.upload_url;
                    var createFolderUrl = options.create_folder_url;
                    
                    var mediaModalCont = mediaCont.find('.lake-form-media-modal');
                    var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
                    mediaModalPageCont.data('current-page', 1);
                    
                    var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                    mediaModalNavOlCont.data('current-path', path);
                    
                    if (uploadUrl.length <= 0) {
                        mediaModalCont.find('.lake-form-media-upload-label').addClass('hidden');
                    }
                    if (createFolderUrl.length <= 0) {
                        mediaModalCont.find('.lake-form-media-create-folder-label').addClass('hidden');
                    }
                    if (uploadUrl.length <= 0 && createFolderUrl.length <= 0) {
                        mediaModalCont.find('.lake-form-media-actions-label').addClass('hidden');
                    }
                    
                    mediaModalCont.find('.modal-title').text('请选择' + title)
                    
                    thiz.getdata(name, path, options);
                });
            
            // 点击排序切换
            $('body')
                .off('click', ".lake-form-media-modal-order")
                .on('click', ".lake-form-media-modal-order", function() {
                    var order = $(this).data('order');
                    
                    if (order == 'name') {
                        $(this).data('order', 'time');
                        
                        $(this).find('.fa')
                            .removeClass('fa-sort-alpha-asc')
                            .addClass('fa-calendar-times-o');
                    } else {
                        $(this).data('order', 'name');
                        
                        $(this).find('.fa')
                            .removeClass('fa-calendar-times-o')
                            .addClass('fa-sort-alpha-asc');
                    }
                    
                    var mediaCont = $(this).parents('.lake-form-media');
                    var mediaModalCont = mediaCont.find('.lake-form-media-modal');
                    var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                    var name = mediaCont.data('name');
                    var path = mediaModalNavOlCont.data('current-path');
                    var options = mediaCont.data('options');
                    
                    thiz.getdata(name, path, options)
                });
            
            // 点击文件夹
            $('body')
                .off('click', ".lake-form-media-dir-op")
                .on('click', ".lake-form-media-dir-op", function() {
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
            $('body')
                .off("click", ".lake-form-media-nav-li")
                .on("click", ".lake-form-media-nav-li", function(){
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
            $('body')
                .off("click", '.lake-form-media-modal-prev-page')
                .on("click", '.lake-form-media-modal-prev-page', function() {
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
            $('body')
                .off("click", '.lake-form-media-modal-next-page')
                .on("click", '.lake-form-media-modal-next-page', function() {
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
            $('.lake-form-media-modal-prev-page,.lake-form-media-modal-next-page')
                .off('mouseover')
                .off('mouseleave')
                .on('mouseover', function () {
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
                })
                .on('mouseleave', function () {
                    layer.close($(this).attr('layer-idx'));
                    
                    $(this).attr('layer-idx', '');
                });
            
            // 新建文件夹
            $('body')
                .off('click', ".lake-form-media-dir-button")
                .on('click', ".lake-form-media-dir-button", function(res){
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
                        url: options.create_folder_url,
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
            $('body')
                .off('change', '.lake-form-media-upload')
                .on('change', '.lake-form-media-upload', function() {
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
                    form.append("type", options.type);
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
            
            // 提交
            $('body')
                .off('click', '.lake-form-media-submit')
                .on('click', '.lake-form-media-submit', function(res){
                    var mediaCont = $(this).parents('.lake-form-media');
                    var name = mediaCont.data('name');
                    
                    var mediaModalCont = mediaCont.find('.lake-form-media-modal');
                    var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
                    
                    var currentPath = mediaModalNavOlCont.data('current-path');
                    var options = mediaCont.data('options');
                    
                    var inputCont = mediaCont.find('.lake-form-media-input');
                    
                    var limit = options.limit;
                    var type = options.type
                    
                    // 列表
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
                    
                    if (type == 'blend') {
                        select_true_list = mediaModalCont
                            .find('.lake-form-media-selected');
                    } else {
                        select_true_list = mediaModalCont
                            .find('.lake-form-media-selected[data-type="'+type+'"]');
                    }
                    
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
                        if (urlList_json == '[]') {
                            $('#LakeFormMediaModel'+name).modal('hide');
                            return null;
                        }
                        inputCont.val(urlList_json);
                        inputCont.attr("value", urlList_json);
                    }
                    
                    thiz.refreshPreview(name, urlList, options)
                    $('#LakeFormMediaModel'+name).modal('hide');
                });
            
            // 选中点击
            $('body')
                .off("click", ".lake-form-media-field-item-op")
                .on("click", ".lake-form-media-field-item-op", function(){
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
                    
                    if (type != 'blend') {
                        if (type != itemType) {
                            return false;
                        }
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
                            if (selectNum > limit) {
                                toastr.error('选择图片不能超过 '+limit+' 张');
                                return 1;
                            }
                        }
                        
                        $(this).addClass('lake-form-media-selected');
                    }
                    
                    return 1;
                });
            
            // 图片/视频预览
            $("body")
                .off('click', ".lake-form-media-img-show-item-preview")
                .on('click', ".lake-form-media-img-show-item-preview", function() {
                    var type = $(this).data('type');
                    var url = $(this).data('url');
                    
                    var preview = '';
                    if (type == 'image') {
                        preview = '<img height="100%" src="' + url + '" />';
                    } else if (type == 'audio' || type == 'video') {
                        preview = '<video height="100%" controls src="' + url + '"></video>';
                    }
                    
                    layer.open({
                        type: 1,
                        area: ['auto', '85%'],
                        title: '预览',
                        end: function(index, layero) {
                            return false;
                        },
                        content: '<div style="display: flex;align-items: center;justify-content: center;text-align: justify;height: 100%;">'+preview+'</div>',
                    });
                });
        },
        
        getdata: function(name, path = '/', options = []) {
            var mediaCont = $('.lake-form-media-' + name);
            
            var type = options.type;
            var limit = options.limit;
            var remove = options.remove;
            var rootpath = options.rootpath;
            var pageSize = options.pageSize;
            
            var mediaModalCont = mediaCont.find('.lake-form-media-modal');
            var mediaModalTableCont = mediaModalCont.find('.lake-form-media-body-table');
            var mediaModalNavOlCont = mediaModalCont.find('.lake-form-media-nav-ol');
            var mediaModalPageCont = mediaModalCont.find('.lake-form-media-modal-page');
            var mediaModalOrderCont = mediaModalCont.find('.lake-form-media-modal-order');
            
            var inputCont = mediaCont.find('.lake-form-media-input');
            
            var order = mediaModalOrderCont.data('order');
            var currentPath = mediaModalNavOlCont.data('current-path');
            var currentPage = mediaModalPageCont.data('current-page');
            var pageSize = mediaModalPageCont.data('page-size');
            
            var thiz = this;
            
            $.ajax({
                url: options.get_files_url 
                    + "?path="+path
                    + "&type="+type
                    + "&order="+order
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
                                htmltemp +=     '<div class="thumbnail lake-form-media-field-item lake-form-media-dir-op" data-type="'+list[i]['type']+'" data-path="/'+list[i]['name']+'" title="'+list[i]['name']+'（'+list[i]['time']+'）">';
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
                                
                                htmltemp +=     '<div class="thumbnail lake-form-media-field-item lake-form-media-field-item-op" data-type="'+list[i]['type']+'" data-url="'+list[i]['name']+'" title="'+list[i]['name']+'（'+list[i]['time']+'）">';
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
        
        // 刷新表单预览
        refreshInputPreview: function(cont) {
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
                    valueArr = this.isJSON(value);
                } else {
                    if (value != '[]' && value != '') {
                        valueArr.push(value)
                    }
                }
                this.refreshPreview(name, valueArr, options);
            } else {
                mediaModalCont
                    .find('.lake-form-media-img-show')
                    .hide();
            }
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
                var src = urlList[i];
                if (! this.isUrl(src)) {
                    src = rootpath + urlList[i];
                }
                
                var html = '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-3 lake-form-media-preview-item" data-src="'+urlList[i]+'">';
                    html += '<div class="thumbnail lake-form-media-row-col">';
                
                html += '<div class="lake-form-media-row-img">';
                html += this.getFileDisplay(src);
                html += '</div>';
                
                var suffix = this.getFileSuffix(src);
                
                html += '<div class="caption">';
                if (suffix == 'image' || suffix == 'video') {
                    html += '<span class="btn btn-default lake-form-media-img-show-item-preview" data-type="'+suffix+'" data-url="'+src+'" title="预览"><i class="fa fa-search-plus"></i></span>';
                }
                if (remove) {
                    html += '<span class="btn btn-default file-delete-multiple lake-form-media-img-show-item-delete" data-url="'+urlList[i]+'" title="移除"><i class="fa fa-trash-o"></i></span>';
                }
                if (limit > 1) {
                    html += '<span class="btn btn-default lake-form-media-img-show-item-dragsort js-dragsort" title="拖动"><i class="fa fa-arrows"></i></span>';
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
    
        isUrl: function(url) {
            if (url.substr(0, 7).toLowerCase() == "http://" 
                || url.substr(0, 8).toLowerCase() == "https://"
                || url.substr(0, 2).toLowerCase() == "//"
            ) {
                return true;
            }
            
            return false;
        },
        
        getFileSuffix: function (src) {
            try {
                var srcArr = src.split('.');
                var suffix = srcArr[srcArr.length - 1];
            } catch(err) {
                var suffix = '';
            }
            
            if (suffix) {
                var type = this.getFileType(suffix.toLocaleLowerCase());
            } else {
                var type = '';
            }
            
            return type;
        },
        
        getFileDisplay: function (src) {
            var type = this.getFileSuffix(src);
            
            var html = '';
            if (type === 'image') {
                html += '<img width="100%" src="' + src + '" alt="'+src+'"/>';
            } else if (type === 'video') {
                html += '<video width="100%" height="100%" src="' + src + '"></video>';
            } else if (type === 'audio') {
                html += '<i class="fa fa-file-audio-o fa-fw lake-form-media-preview-fa"></i>';
            } else if (type === 'word') {
                html += '<i class="fa fa-file-word-o fa-fw lake-form-media-preview-fa"></i>';
            } else if (type === 'code') {
                html += '<i class="fa fa-file-code-o fa-fw lake-form-media-preview-fa"></i>';
            } else if (type === 'zip') {
                html += '<i class="fa fa-file-zip-o fa-fw lake-form-media-preview-fa"></i>';
            } else if (type === 'text') {
                html += '<i class="fa fa-file-text-o fa-fw lake-form-media-preview-fa"></i>';
            } else {
                html += '<i class="fa fa-file fa-fw lake-form-media-preview-fa"></i>';
            }
            
            return html;
        },
        
        getFileType: function (suffix) {
            // 匹配图片
            var image = [
                'bmp', 'cgm', 'djv', 'djvu', 'gif', 'ico', 'ief', 'jp2', 'jpe', 'jpeg', 'jpg', 'mac', 'pbm', 'pct', 'pgm', 'pic', 'pict',
                'png', 'pnm', 'pnt', 'pntg', 'ppm', 'qti', 'qtif', 'ras', 'rgb', 'svg', 'tif', 'tiff', 'wbmp', 'xbm', 'xpm', 'xwd'
            ];

            // 匹配音频
            var audio = ['mp3', 'wav', 'flac', '3pg', 'aa', 'aac', 'ape', 'au', 'm4a', 'mpc', 'ogg'];

            // 匹配视频
            var video = ['mp4', 'rmvb', 'flv', 'mkv', 'avi', 'wmv', 'rm', 'asf', 'mpeg'];

            // 匹配文稿
            var word = [
                'doc', 'dot', 'docx', 'dotx', 'docm', 'dotm', 'xls', 'xlt', 'xla', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlam', 'xlsb',
                'pdf', 'ppt', 'pot', 'pps', 'ppa', 'pptx', 'potx', 'ppsx', 'ppam', 'pptm', 'potm', 'ppsm'
            ];

            // 匹配代码
            var code = ['php', 'js', 'java', 'python', 'ruby', 'go', 'c', 'cpp', 'sql', 'm', 'h', 'json', 'html', 'aspx'];

            // 匹配压缩包
            var zip = ['zip', 'tar', 'gz', 'rar', 'rpm'];

            // 匹配文本
            var text = ['txt', 'pac', 'log', 'md'];
            
            var list = {
                'image': image,
                'audio': audio,
                'video': video,
                'word': word,
                'code': code,
                'zip': zip,
                'text': text,
            }
            
            for (var key in list) {
                if (list[key].indexOf(suffix) != -1) {
                    return key;
                }
            };
            
            return false;
        },
        
        // 翻译
        lang: function () {
            var args = arguments,
                string = args[0],
                i = 1;
            string = string.toLowerCase();
            if (typeof Lang !== 'undefined' && typeof Lang[string] !== 'undefined') {
                if (typeof Lang[string] == 'object') {
                    return Lang[string];
                }
                string = Lang[string];
            } else if (string.indexOf('.') !== -1 && false) {
                var arr = string.split('.');
                var current = Lang[arr[0]];
                for (var i = 1; i < arr.length; i++) {
                    current = typeof current[arr[i]] != 'undefined' ? current[arr[i]] : '';
                    if (typeof current != 'object')
                        break;
                }
                if (typeof current == 'object')
                    return current;
                string = current;
            } else {
                string = args[0];
            }
            return string.replace(/%((%)|s|d)/g, function (m) {
                // m is the matched format, e.g. %s, %d
                var val = null;
                if (m[2]) {
                    val = m[2];
                } else {
                    val = args[i];
                    // A switch statement so that the formatter can be extended. Default is %s
                    switch (m) {
                        case '%d':
                            val = parseFloat(val);
                            if (isNaN(val)) {
                                val = 0;
                            }
                            break;
                    }
                    i++;
                }
                return val;
            });
        },
    }
    
    LakeFormMedia.init();
    window.LakeFormMedia = LakeFormMedia;
});