$(function() {
    $('.submit').click(function() {
        var formData = $('#login').serializeArray();
        var data = {};
        $.each(formData, function(i, field) {
            data[this.name] = this.value;
        })
        $.ajax({
            url: '/users/login',
            type: 'POST',
            data: data,
            success: function(data, status) {
                if(status === 'success') {
                    location.href = '/welcome'
                }
            },
            error: function(xhr, err) {
                console.log(err)
            }
        })
    })
})