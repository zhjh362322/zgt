$(function() {
    // -----------------------------------------quotation---------------------------------
    // 定义一个参数，避免每次点新增都要请求一次
    var _options;

    //验证方法
    function valContent(rules){
        return $("#quotation").validate({
            // errorLabelContainer: $(".error"),
            rules: rules
        }).form();
    }

    // 表头新增按钮
    $('.showAdd').click(function(e) {
        $('#quotation input').val('');
        $('.plant').show();
        $('#quotationModal').modal('show');
    })
    $('.search').click(function(e) {
        var formData = $('#search').serializeArray();
        var data = {};
        $.each(formData, function(i, field) {
            data[this.name] = this.value;
        })
        window.location.href = '/basic/quotation?search=' + data.search;
    })
    $('.save').click(function(e) {
        var fm = new FormData($('#quotation')[0]);
        // var imgs = $('.ad')[0].files;
        // 这里要个验证过程 ...
        var url = '/basic/quotation';
        var rules = {};
        if(fm.get('id')) {
            url += '/mod'
            rules = {
                name: 'required',
                startCity: 'required',
                endCity: 'required',
                plant: 'required',
                contacts: 'required',
                cellphone: 'required',
                price: 'required',
                time: 'required'
            }
        } else {
            rules = {
                qheadimg: 'required',
                name: 'required',
                startCity: 'required',
                endCity: 'required',
                plant: 'required',
                contacts: 'required',
                cellphone: 'required',
                price: 'required',
                time: 'required'
            }
        }
        if(valContent(rules)) {
            $.ajax({
                url: url,
                type: 'POST',
                data: fm,
                dataType: 'JSON',
                cache: false,
                processData:false,
                contentType:false,
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
        $.get('/basic/quotation/del?id=' + id, function(data, status) {
            if(status === 'success' && data["msg"]) {
                alert(data.msg)
            }
            window.location.reload();
        })
    })

    $('.mod').click(function(e) {
        var id = $(this)[0].dataset.id;
        $('.plant').hide();
        $.get('/basic/quotation/mod?id=' + id, function(data, status) {
            if(status === 'success') {
                var ipts = $('#quotation input');
                var selects = $('#quotation select');
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
                $('#quotationModal').modal('show');
            }
        })
    })
    // 打开模态框加载公司下拉数据  --修改时selected值与人加载先后不确定？？？
    $('#quotationModal').on('show.bs.modal', function() {
        $('label.error').css('display', 'none');
        if(!_options) {
            $.get('/basic/quotation/add', function(data, status) {
                if(status === 'success') {
                    var options = [];
                    $.each(data, function(i, item) {
                        var option = '<option value="' + item._id + '">' + item.name + '</option>'
                        options.push(option);
                    })
                    _options = options;
                    $('.plantSelect').html(options.join(''))
                }
            })
        }
        $('label.error').hide();
    })

    $('.plantSelect').change(function(e) {
        var id = $(this)[0].value;
        $.get('/basic/quotation/car?id=' + id, function(data, status) {
            if(status === 'success') {
                var options = [];
                $.each(data, function(i, item) {
                    var option = '<option value="' + item._id + '">' + item.carNo + '</option>'
                    options.push(option);
                })
                $('.carSelect').html(options.join(''))
            }
        })
    })
})