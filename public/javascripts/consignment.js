$(function() {
    $('.sign').click(function() {
        var id = $(this)[0].dataset.id;
        update(id, 1);
    })
    $('.unsign').click(function() {
        var id = $(this)[0].dataset.id;
        update(id, 0);
    })
    $('.search').click(function(e) {
        var formData = $('#search').serializeArray();
        var data = {};
        $.each(formData, function(i, field) {
            data[this.name] = this.value;
        })
        window.location.href = '/consignment?search=' + data.search;
    })
    function update(id, status) {
        $.get('/consignment/update?id=' + id + '&status=' + status, function(data, status) {
            if(status === 'success' && data["msg"]) {
                alert(data.msg)
            }
            window.location.reload();
        })
    }
});