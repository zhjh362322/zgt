$(function() {
    $('.sign').click(function() {
        var id = $(this)[0].dataset.id;
        update(id, 1);
    })
    $('.unsign').click(function() {
        var id = $(this)[0].dataset.id;
        update(id, 0);
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