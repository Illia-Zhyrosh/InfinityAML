$.ajax({
    url: '/lib/data.xml',
    dataType: 'xml',
    cache: false,
    success: function (data) {
        // Adding all available categories 
        var options = document.getElementById('categoryOptions');
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
        // Buttons logic

        const okButt = document.getElementById('okButt');
        const cancelButt = document.getElementById('cancelButt');
        const rowButt = document.getElementById('rowAddButt');
        // Reading user input
        okButt.addEventListener('click', function () {
            var doc = document.getElementById('parentNode');
            var parameterStrings = '';
            $(doc).children().each(function () {
                if ($(this).attr('role') == 'row' && $(this).attr('class') != 'buttonPanel') {
                    var name,value;
                    
                    $(this).children().each(function () {
                        
                        if ($(this).prop('tagName') == 'A') {
                            
                            name = this.text;
                        }
                        else {

                            
                            value = this.value


                        }
                        
                    });
                    parameterStrings += `-${name}-${value}`;
                }
                else if ($(this).attr('class') == 'optionalData' && $(this).children().length > 0) {
                    console.log('Additional options detected!');
                    $(this).children().each(function () {
                        var name, input1, input2, input3, value, units;
                        var parameterRow;
                        $(this).children().each(function () {
                            if ($(this).prop('tagName') == 'SELECT') {
                                name = this.value;
                            }
                            else if ($(this).prop('tagName') == 'INPUT') {
                                if (input1 == undefined) {
                                    input1 = this.value;
                                }
                                else if (input2 == undefined && input1 != undefined) {
                                    input2 = this.value;
                                }
                                else {
                                    input3 = this.value;
                                }
                            }
                            else {
                                if (value == undefined) {
                                    value = this.text.replace(': ', ' ');
                                }
                                else {
                                    units = this.text.replace(': ', ' ');;
                                }
                            }
                        });
                        if (name != 'Attribute') {
                            parameterRow = `-${name}-${input1}`
                        }
                        else {
                            parameterRow = `-${name}-${input1}-${value}-${input2}-${units}-${input3}`
                        }
                        parameterStrings += parameterRow;
                    });
                    
                }
                

            });
            console.log(parameterStrings);
            // Creating XML appendage
            var writer = new XMLWriter('UTF-8', '1.0');
            var stringArr = (parameterStrings.split('-'));
            console.log(stringArr);
            
            
        });
        cancelButt.addEventListener('click', function () {
            alert('Cancel!');
        });
        // Adding custom options button
        rowButt.addEventListener('click', function () {
            var div = document.createElement('div');
            div.setAttribute('role', 'row');
            var optionName = document.createElement('input');
            optionName.id = 'inputField';
            optionName.setAttribute('required', 'required');
            div.appendChild(optionName);

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

            var valueTag = document.createElement('a');
            valueTag.text = 'Value: ';

            var unitTag = document.createElement('a');
            unitTag.text = 'Unit: ';
            unitTag.className = 'unitTag';
            var input = document.createElement('input');
            input.setAttribute('required', 'required');
            
            input.disabled = true;

            var input2 = document.createElement('input');
            input2.setAttribute('required', 'required');
            input2.disabled = true;
            input2.id = 'optionInput';
            div.appendChild(valueTag);
            div.appendChild(input);
            div.appendChild(input2);
            div.appendChild(unitTag);
            

            document.getElementById('optionalData').appendChild(div);
            selectType.addEventListener('change', function () {
                if (selectType.value == 'Attribute') {
                    input.disabled = false;
                    input2.disabled = false;
                }
                else {
                    input.disabled = true;
                    input2.disabled = true;
                    input.value = '';
                    input2.value = '';
                }

            });

           
        })

    }
        
   }
)

