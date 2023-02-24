$.ajax({
    url: '/lib/data.xml',
    dataType: 'xml',
    cache: false,
    success: function (data) {
        var options = document.getElementById('Options');
        var headers = $(data).find('TreeViewItemHead');
        var categories = Array();
        $(headers).each(function () {
            var cat = $(this).attr('Category')
            if (cat != undefined) {

                categories.push(cat);
            }

        });
        for (var i = 0; i < categories.length; i += 1) {
            var selectable = document.createElement('option');
            selectable.innerText = categories[i];
            options.appendChild(selectable);
        }
        const okButt = document.getElementById('okButt');
        const cancelButt = document.getElementById('cancelButt');
        okButt.addEventListener('click', function () {
            alert('OK!');
        })
        cancelButt.addEventListener('click', function () {
            alert('Cancel!');
        })

    }
        
   }
)

