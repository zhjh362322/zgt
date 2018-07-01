$(function() {
    // -----------------------------------------company---------------------------------
    function valContent(){
        return $("#company").validate({
            // errorLabelContainer: $(".error"),
            rules: {
                serial: 'required',
                name: 'required'
            }
        }).form();
    }
    // 表头新增按钮
    $('.showAdd').click(function(e) {
        $('#company input').val('');
        $('#companyModal').modal('show');
    })

    $('.save').click(function(e) {
        var formData = $('#company').serializeArray();
        // 这里要个验证过程 ...
        var data = {};
        $.each(formData, function(i, field) {
            data[this.name] = this.value;
        })
        var url = '/basic/company';
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
        $.get('/basic/company/del?id=' + id, function(data, status) {
            if(status === 'success' && data["msg"]) {
                alert(data.msg)
            }
            window.location.reload();
        })
    })

    $('.mod').click(function(e) {
        var id = $(this)[0].dataset.id;
        $.get('/basic/company/mod?id=' + id, function(data, status) {
            if(status === 'success') {
                var ipts = $('#company input');
                $.each(ipts, function(i, field) {
                    // form表单中有name就_id的， 新增不了
                    if(field.name === 'id') {
                        $(field).val(data._id);
                    } else {
                        $(field).val(data[field.name]);
                    }
                })

                $('#companyModal').modal('show');
            }
        })
    })
})