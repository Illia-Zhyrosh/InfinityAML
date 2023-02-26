$.ajax({
    url: '/lib/data.xml',
    dataType: 'xml',
    cache: false,
    success: function (data) {
        var options = document.getElementById('categoryOptions');
        var machineName = document.getElementById('machineName');
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
            selectable.className = 'selectableOption';
            selectable.innerText = categories[i];
            
            options.appendChild(selectable);
        }

        const okButt = document.getElementById('okButt');
        const cancelButt = document.getElementById('cancelButt');
        const rowButt = document.getElementById('rowAddButt');
        okButt.addEventListener('click', function () {
            console.log(options.value + '\n' + machineName.value);
        });
        cancelButt.addEventListener('click', function () {
            alert('Cancel!');
        });
        rowButt.addEventListener('click', function () {
            var div = document.createElement('div');
            div.setAttribute('role', 'row');
            var selectName = document.createElement('select');
            var text = document.createElement('option');
            text.innerText = 'optionName';
            selectName.appendChild(text);
            div.appendChild(selectName);

            var selectType = document.createElement('select');
            var typeClass = document.createElement('option');
            typeClass.innerText = 'Class';
            var typeAttribute = document.createElement('option');
            typeAttribute.innerText = 'Attribute';
            var typeRole = document.createElement('option');
            typeRole.innerText = 'Role';
            var typeInterface = document.createElement('option');
            typeInterface.innerText = 'Interface';
            selectType.append(typeClass, typeAttribute, typeRole, typeInterface);
            div.appendChild(selectType);
            

            var input = document.createElement('input');
            input.setAttribute('required','required');
            div.appendChild(input);
            document.getElementById('optionalData').appendChild(div);
        })

    }
        
   }
)

