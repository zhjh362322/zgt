$(function() {
    // -----------------------------------------shipper---------------------------------
    // 定义一个参数，避免每次点新增都要请求一次
    var _options;
    function valContent(){
        return $("#user").validate({
            // errorLabelContainer: $(".error"),
            rules: {
                uid: 'required',
                cellphone: 'required',
                level: 'required',
                status: 'required',
                owner: 'required',
                name: 'required'
            }
        }).form();
    }
    // 表头新增按钮
    $('.showAdd').click(function(e) {
        $('#user input').val('');
        $('.level').show();
        $('.owner').show();
        $('#userModal').modal('show');
    })
    $('.search').click(function(e) {
        var formData = $('#search').serializeArray();
        var data = {};
        $.each(formData, function(i, field) {
            data[this.name] = this.value;
        })
        window.location.href = '/basic/user?search=' + data.search;
    })
    $('.save').click(function(e) {
        var formData = $('#user').serializeArray();
        // 这里要个验证过程 ...
        var data = {};
        $.each(formData, function(i, field) {
            data[this.name] = this.value;
        })
        var url = '/basic/user';
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
        $.get('/basic/user/del?id=' + id, function(data, status) {
            if(status === 'success' && data["msg"]) {
                alert(data.msg)
            }
            window.location.reload();
        })
    })

    $('.mod').click(function(e) {
        $('.level').hide();
        $('.owner').hide();
        var id = $(this)[0].dataset.id;
        $.get('/basic/user/mod?id=' + id, function(data, status) {
            if(status === 'success') {
                var ipts = $('#user input');
                var selects = $('#user select');
                $.each(ipts, function(i, field) {
                    // form表单中有name就_id的， 新增不了
                    if(field.name === 'id') {
                        $(field).val(data._id);
                    } else if(field.name !== 'password') {
                        $(field).val(data[field.name]);
                    }
                })
                $.each(selects, function(i, field) {
                    $(field).val(data[field.name])
                })
                $('#userModal').modal('show');
            }
        })
    })
    // 打开模态框加载公司下拉数据  --修改时selected值与人加载先后不确定？？？
    $('#userModal').on('show.bs.modal', function() {
        $('.level select').change(function(e) {
            var opt = $(this).children('option:selected').val();
            if(opt > 0) {
                $.get('/basic/user/add?level=' + opt, function(data) {
                    var options = [];
                    $.each(data, function(i, item) {
                        var option = '<option value="' + item._id + '">' + item.name + '</option>'
                        options.push(option);
                    })
                    $('.ownerSelect').html(options.join(''))
                    $('.owner').addClass('active');
                });
            } else {
                $('.ownerSelect').html('');
                $('.owner').removeClass('active');
            }
        })
        $('label.error').hide();
    })
})