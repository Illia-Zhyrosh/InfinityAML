$.ajax({
    url: '/lib/data.xml',
    dataType: 'xml',
    cache: false,
    success: function (data) {
        // Adding all available categories 
        var options = document.getElementById('categoryOptions');
        var headers = $(data).find('TreeViewItemHead');
        var categories = Array();
        var text;
        const okButt = document.getElementById('okButt');
        okButt.disabled = true;
        const cancelButt = document.getElementById('cancelButt');
        const rowButt = document.getElementById('rowAddButt');
        var doc = document.getElementById('parentNode');
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
        var manufacturerName = document.getElementById('manufacturerName');
        manufacturerName.addEventListener('change', function () {
            
            isValueEmpty(this);
        })
        var machineName = document.getElementById('machineName');
        machineName.addEventListener('change', function () {
            isValueEmpty(this);
        })
        // Buttons logic

        //if any of inputs empty disable ok button
        function isValueEmpty(value) {
            var div = $(value).parent();
            var parent = div.parent();
            var values = Array();
            var inputCount = 0;
            $(parent).children().each(function () {
                $(this).children().each(function () {
                    if ($(this).prop('tagName') == 'INPUT' && !$(this).prop('disabled'))
                    {
                        inputCount += 1;
                        if (this.value != "" && this.value != undefined) {
                            values.push(this.value);
                            
                        }
                    }
                })
            })
            console.log(inputCount + ' ' + values.length);
            if (inputCount == values.length) {
                okButt.disabled = false;
            }
            else {
                okButt.disabled = true;
            }

        }
        
        okButt.addEventListener('click', function () {
            
            var parameterStrings = '';
             // Reading user input
            $(doc).children().each(function () {
                if ($(this).attr('role') == 'row' && $(this).attr('class') != 'buttonPanel') {
                    var name,value;
                    
                    $(this).children().each(function () {
                        
                        if ($(this).prop('tagName') == 'A') {
                            
                            name = this.text;
                        }
                        else {
                            value = this.value;
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
            var stringClean = stringArr.filter(function (val) {
                return val != null && val != "";
            })
            console.log(stringClean);
            // Finding category
            var insertCategory;
            $(data).find('TreeViewItemHead').each(function () {
                if ($(this).attr('Category') != null) {
                    var category = $(this).attr('Category');
                    if (category == stringClean[1]) {
                        insertCategory = this;
                        return false;
                    };
                }
            });
            //console.log(insertCategory);
            // Finding or creating manufacturer
            var manufacturer;
            $(insertCategory).find('TreeViewItemHead').each(function () {
                
                if ($(this).attr('Text') == stringClean[3]) {
                    manufacturer = this;
                }
            });
            if (manufacturer == undefined) {
                manufacturer = document.createElementNS("http://www.w3.org/1999/xhtml", "TreeViewItemHead");
                manufacturer.setAttributeNS("http://www.w3.org/1999/xhtml",'Text', stringClean[3]);
                
            }
            // Creating entry
            var entry = document.createElementNS("http://www.w3.org/1999/xhtml", "TreeViewItem");
            entry.setAttributeNS("http://www.w3.org/1999/xhtml", "Text", stringClean[5]);
            manufacturer.appendChild(entry);
            console.log(manufacturer);
        });
        cancelButt.addEventListener('click', function () {
            window.location.reload();
        });
        // Adding custom options button
        rowButt.addEventListener('click', function () {
            var optionRows = document.getElementById('optionalData');
            okButt.disabled = true;
            var div = document.createElement('div');
            div.setAttribute('role', 'row');
            var optionName = document.createElement('input');
            optionName.id = 'inputField';
            optionName.setAttribute('required', 'required');
            optionName.addEventListener('change', function () {
                isValueEmpty(this);
            })
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
            
            
            optionRows.appendChild(div);
            selectType.addEventListener('change', function () {
                if (selectType.value == 'Attribute') {
                    input.disabled = false;
                    input2.disabled = false;
                    input.addEventListener('change', function () {
                        isValueEmpty(this);
                    } );
                    input2.addEventListener('change', function () {
                        isValueEmpty(this);
                    } );
                }
                else {
                    input.value = '';
                    input.removeEventListener('change', function () {
                        isValueEmpty(this);
                    });
                    input2.value = '';
                    input2.removeEventListener('change', function () {
                        isValueEmpty(this);
                    });
                    input.disabled = true;
                    input2.disabled = true;
                    
                    
                    
                }

            })
            
            
        })

    }
        
   }
)

