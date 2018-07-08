$(function() {
    // -----------------------------------------plant---------------------------------
    // 定义一个参数，避免每次点新增都要请求一次
    var _options;

    function valContent(){
        return $("#plant").validate({
            errorLabelContainer: $(".error"),
            rules: {
                serial: 'required',
                name: 'required',
                type: 'required',
                company: 'required',
                cellphone: 'required'
            }
        }).form();
    }
    // 表头新增按钮
    $('.showAdd').click(function(e) {
        $('#plant input').val('');
        $('.company').show();
        $('#plantModal').modal('show');
    })
    $('.search').click(function(e) {
        var formData = $('#search').serializeArray();
        var data = {};
        $.each(formData, function(i, field) {
            data[this.name] = this.value;
        })
        window.location.href = '/basic/plant?search=' + data.search;
    })
    $('.save').click(function(e) {
        var formData = $('#plant').serializeArray();
        // 这里要个验证过程 ...
        var data = {};
        $.each(formData, function(i, field) {
            data[this.name] = this.value;
        })
        var url = '/basic/plant';
        if(data.id) {
            url += '/mod'
        }
        if(valContent()) {
            $.ajax({
                url: url,
                type: 'POST',
                data: data,
                success: function(data, status) {
                    if(status === 'success' && data.code == 304) {
                        console.log(data)
                    } else {
                        window.location.reload();
                    }
                },
                error: function(xhr, err) {
                    console.log(err)
                }
            })
        }

    })

    $('.del').click(function(e) {
        var id = $(this)[0].dataset.id;
        $.get('/basic/plant/del?id=' + id, function(data, status) {
            if(status === 'success' && data["msg"]) {
                alert(data.msg)
            }
            window.location.reload();
        })
    })

    $('.mod').click(function(e) {
        var id = $(this)[0].dataset.id;
        $('.company').hide();
        $.get('/basic/plant/mod?id=' + id, function(data, status) {
            if(status === 'success') {
                var ipts = $('#plant input');
                var selects = $('#plant select');
                $.each(ipts, function(i, field) {
                    // form表单中有name就_id的， 新增不了
                    if(field.name === 'id') {
                        $(field).val(data._id);
                    } else {
                        $(field).val(data[field.name]);
                    }
                })
                $.each(selects, function(i, field) {
                    $(field).val(data[field.name])
                })
                $('#plantModal').modal('show');
            }
        })
    })
    // 打开模态框加载公司下拉数据  --修改时selected值与人加载先后不确定？？？
    $('#plantModal').on('show.bs.modal', function() {
        if(!_options) {
            $.get('/basic/plant/add', function(data, status) {
                if(status === 'success') {
                    var options = [];
                    $.each(data, function(i, item) {
                        var option = '<option value="' + item._id + '">' + item.name + '</option>'
                        options.push(option);
                    })
                    _options = options;
                    $('.companySelect').html(options.join(''))
                }
            })
        }
        $('label.error').hide();
    })
})