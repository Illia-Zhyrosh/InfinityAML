
window.onload = function () {
    var categories = Array();
    var data = localStorage.getItem('data');


    //console.log(data);
    var options = document.getElementById('categoryOptions');
    var headers = $(data).find('TreeViewItemHead');
    var okButt = document.getElementById('okButt');
    var cancelButt = document.getElementById('cancelButt');
    var rowButt = document.getElementById('rowAddButt');
    var doc = document.getElementById('parentNode');
    okButt.disabled = true;
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

        isValid(this);
    })
    var machineName = document.getElementById('machineName');
    machineName.addEventListener('change', function () {
        isValid(this);
    })
    var collectionName = document.getElementById('collectionName');
    collectionName.addEventListener('change', function () {
        isValid(this);


    })
    
    // Buttons logic
    okButt.addEventListener('click', function (e) {
        e.preventDefault();
        var parameterStrings = '';

        // Reading user input
        $(doc).children().each(function () {
            if ($(this).attr('role') == 'row' && $(this).attr('class') != 'buttonPanel') {
                var name, value;

                $(this).children().each(function () {

                    if ($(this).prop('tagName') == 'A') {

                        name = this.text;
                    }
                    else if ($(this).prop('tagName') == 'INPUT') {
                        value = $(this).val().replaceAll(' ', '');
                    }
                    else {
                        value = $(this).val().replaceAll(' ', '');
                    }
                });
                parameterStrings += `~${name}~${value}`;
            }
            // Reading option rows
            else if ($(this).attr('class') == 'optionalData' && $(this).children().length > 0) {
                //console.log('Additional options detected!');


                var divs = $(this).children();
                $(divs).children().each(function () {
                    // option type
                    if ($(this).prop('id') == 'optionSelector') {
                        var value = $(this).val();
                        //console.log(value);
                        if (value != undefined) {
                            valueFinder(value, $(this).parent());
                        }


                    }


                    //console.log($(this));
                })



            };
        });
        function valueFinder(optionName, parent) {
            if (optionName == 'Interface') {
                var interfaceBaseClass;
                var interfaceName;
                var parameterRow = "";
                $(parent).children().each(function () {
                    if ($(this).prop('id') == 'interfaceBase') {
                        interfaceBaseClass = $(this).val();
                    }
                    if ($(this).prop('id') == 'inputField') {
                        interfaceName = $(this).val();
                    }
                })
                if (interfaceBaseClass != undefined && interfaceName != undefined) {
                    parameterRow += `~${optionName}~${interfaceBaseClass}~${interfaceName}`.replaceAll('undefined', '');





                }
                

                //console.log(parameterRow);
                var interfaceAttrCount = 0;
                $(parent).children().each(function () {
                    if ($(this).prop('id') == 'rowNode') {
                        var name;
                        var value;
                        var unit;
                        $(this).children().each(function () {
                            if ($(this).prop('id') == 'inputField') {
                                //console.log(this);
                                if ($(this).val()) {
                                    name = $(this).val();
                                    parameterRow += `~InterfaceAttribute${interfaceAttrCount}` + `~${name}`;
                                }
                            }
                            if ($(this).prop('id') == 'i1') {
                                //console.log(this);
                                if ($(this).val()) {
                                    value = $(this).val();
                                    parameterRow += '~Value' + `~${value}`;
                                }
                            }
                            if ($(this).prop('id') == 'optionInput') {
                                //console.log(this);
                                if ($(this).val()) {
                                    unit = $(this).val();
                                    parameterRow += '~Unit' + `~${unit}`;
                                }
                            }
                        })
                        interfaceAttrCount += 1;


                    }
                })

                parameterStrings += parameterRow;

            }
            else if (optionName == 'Role') {

                var parameterRow = "";
                var name;
                $(parent).children().each(function () {

                    if ($(this).prop('id') == 'inputField') {

                        name = $(this).val();

                    }

                });
                if (name != undefined) {
                    parameterRow = `~${optionName}~${name}`.replaceAll('undefined', '');
                    parameterStrings += parameterRow;
                }
                //console.log(parameterRow);


            }
            else if (optionName == 'Class') {
                var parameterRow = "";
                var name;
                $(parent).children().each(function () {

                    if ($(this).prop('id') == 'inputField') {

                        name = $(this).val();

                    }

                });
                if (name != undefined) {
                    parameterRow = `~${optionName}~${name}`.replaceAll('undefined', '');
                    parameterStrings += parameterRow;
                }
                //console.log(parameterRow);
                parameterRow = ""
            }
            else {
                var name;
                var value;
                var unit;
                var parameterRow = "";
                $(parent).children().each(function () {

                    if ($(this).prop('id') == 'inputField') {
                        name = $(this).val();
                        parameterRow += '~Attribute' + `~${name}`;
                    }
                    if ($(this).prop('id') == 'i1') {
                        value = $(this).val();
                        parameterRow += "~value" + `~${value}`;
                    }
                    if ($(this).prop('id') == 'optionInput') {
                        if ($(this).val() != ' ') {
                            unit = $(this).val();
                            parameterRow += "~unit" + `~${unit}`.replaceAll('undefined', '');
                        }
                    }

                })
                parameterStrings += parameterRow;
                //console.log(parameterRow);


            }

        }
        function flushToNode(elem) {


            elem = elem.replace('<?xml version="1.0" encoding="UTF-8" standalone="true" ?>', '');
            elem = $.parseXML(elem);
            $(elem).find($(elem).children().prop('tagName')).each(function () {
                elem = this;
            });

            return elem;
        }
        //console.log(parameterStrings);
        // Creating XML appendage
        var writer = new XMLWriter('UTF-8', '1.0');
        writer.writeStartDocument(true);
        var stringArr = (parameterStrings.split('~'));
        var stringClean = stringArr.filter(function (val) {
            return val != null && val != "";
        })
        //console.log(stringClean);
        // Finding category
        var xmlData = $.parseXML(localStorage.getItem('data'));
        //console.log(xmlData);
        var insertionCategory;
        $(xmlData).find('TreeViewItemHead').each(function () {
            if ($(this).attr('Category') == stringClean[1]) {
                insertionCategory = this;
                return false;
            }
        });
        //console.log(insertionCategory);
        var manufacturer;
        // Finding or assigning manufacturer
        var item;
        
        // Assigning exing
        $(insertionCategory).find('TreeViewItemHead').each(function () {
            if ($(this).attr('Text') == stringClean[3]) {
                manufacturer = this;
                item = this;
                return false;
            }
        });
        // Creating new manufacturer
        if (manufacturer == undefined) {
            writer.writeStartElement('TreeViewItemHead');
            writer.writeAttributeString('Text', stringClean[3]);

            writer.writeEndElement();
            writer.writeEndElement();
            manufacturer = writer.flush().toString().replace('<?xml version="1.0" encoding="UTF-8" standalone="true" ?>', '');
            item = new XMLSerializer().serializeToString($.parseXML(manufacturer));

            //console.log(item);
            // Converting #document to xml Node;
            item = flushToNode(item);
            //console.log(item);

        }
        // Inserting an item;
        writer.writeEndDocument();
        writer.writeStartDocument(true);
        writer.writeStartElement('TreeViewItem');
        writer.writeAttributeString('Text', stringClean[5]);
        writer.writeEndElement();
        writer.writeEndDocument();
        var machine = writer.flush().toString();
        machine = flushToNode(machine);
        console.log(machine);

        // Getting data
        if (stringClean.length > 5) {
            writer.writeStartDocument();
            writer.writeStartElement('Data');
            writer.writeStartElement('Name');
            writer.writeAttributeString('Type', 'xs:string');
            writer.writeString(stringClean[5]);
            writer.writeEndElement();
            var classCount = 0;
            var rolesCount = 0;
            var interfacesCount = 0;
            var externalInterfaces = new Set();
            for (var i = 6; i < stringClean.length; i += 1) {
                if (stringClean[i] == 'Class' && classCount == 0) {

                    writer.writeStartElement('Class');
                    writer.writeAttributeString('Type', 'xs:string');
                    if (stringClean[i + 1] != undefined) {
                        writer.writeString(stringClean[stringClean.indexOf(stringClean[i]) + 1]);
                    }

                    stringClean[i] = "";
                    stringClean[i + 1] = "";
                    writer.writeEndElement();
                    classCount += 1;
                }
                else if (stringClean[i] == 'Class' && classCount > 0) {
                    writer.writeStartElement('SupportedClass');
                    writer.writeAttributeString('Type', 'xs:string');
                    writer.writeString(stringClean[stringClean.indexOf(stringClean[i]) + 1]);
                    stringClean[i] = "";
                    stringClean[i + 1] = "";
                    writer.writeEndElement();
                    classCount += 1;
                }
                else if (stringClean[i] == 'Role' && rolesCount == 0) {
                    writer.writeStartElement('Role');
                    writer.writeAttributeString('Type', 'xs:string');
                    writer.writeString(stringClean[stringClean.indexOf(stringClean[i]) + 1]);
                    stringClean[i] = "";
                    stringClean[i + 1] = "";
                    writer.writeEndElement();
                    rolesCount += 1;
                }
                else if (stringClean[i] == 'Role' && rolesCount > 0) {
                    writer.writeStartElement('SupportedRole');
                    writer.writeAttributeString('Type', 'xs:string');
                    writer.writeString(stringClean[stringClean.indexOf(stringClean[i]) + 1]);
                    stringClean[i] = "";
                    stringClean[i + 1] = "";
                    writer.writeEndElement();
                    rolesCount += 1;
                }
                else if (stringClean[i] == 'Interface' && interfacesCount == 0) {
                    writer.writeStartElement('Interface');
                    writer.writeAttributeString('Type', 'xs:string');
                    writer.writeAttributeString('Name', stringClean[i + 2]);
                    writer.writeAttributeString('Path', stringClean[stringClean.indexOf(stringClean[i]) + 1]);
                    writer.writeString(stringClean[i + 2]);
                    
                    if (stringClean[i + 3] != undefined) {
                        if (stringClean[i + 3].substring(0, 18) != undefined) {
                            //console.log(stringClean[i + 3].substring(0, 18));
                            //console.log(stringClean[i + 3].length);
                            if (stringClean[i + 3].substring(0, 18) == 'InterfaceAttribute') {
                                //alert('There is attributes in ' + stringClean[i + 2]);
                                // Assigning attributes to interfaces
                                writer.writeStartElement('InterfaceData');
                                var k = i;
                                var interfaceAttrCounter = 0;
                                while (k <= stringClean.length) {
                                    if (stringClean[k + 3] != undefined) {
                                        if (stringClean[k + 3].substring(0, 18) == 'InterfaceAttribute') {
                                            if (interfaceAttrCounter == stringClean[k + 3].substring(18, 19)) {
                                                interfaceAttrCounter += 1;
                                                writer.writeStartElement(stringClean[k + 6]);
                                                writer.writeAttributeString('Name', stringClean[k + 6]);
                                                stringClean[k + 6] = "";
                                                writer.writeAttributeString('Type', 'xs:string');
                                                writer.writeAttributeString('Unit', stringClean[k + 8])
                                                stringClean[k + 8] = ""
                                                writer.writeString(stringClean[k + 4]);
                                                writer.writeEndElement();

                                                stringClean[k + 4] = "";
                                            };


                                        }

                                    }
                                    k += 1;
                                }

                                writer.writeEndElement();
                                writer.writeEndElement();
                            }
                        }
                        
                        
                    }
                    else {
                        writer.writeEndElement();
                    }
                    

                    stringClean[i] = "";
                    stringClean[i + 1] = "";
                    writer.writeEndElement();
                    
                    
                    interfacesCount += 1;
                }
                else if (stringClean[i] == 'Interface' && interfacesCount > 0) {
                    writer.writeStartElement('SupportedInterface');
                    writer.writeAttributeString('Type', 'xs:string');
                    writer.writeAttributeString('Name', stringClean[i + 2]);
                    writer.writeAttributeString('Path', stringClean[stringClean.indexOf(stringClean[i]) + 1]);
                    writer.writeString(stringClean[i + 2]);
                    
                    if (stringClean[i + 3] != undefined) {
                        if (stringClean[i + 3].substring(0, 18) != undefined) {
                            //console.log(stringClean[i + 3].substring(0, 18));
                            //console.log(stringClean[i + 3].length);
                            if (stringClean[i + 3].substring(0, 18) == 'InterfaceAttribute') {
                                //alert('There is attributes in ' + stringClean[i + 2]);
                                // Assigning attributes to interfaces
                                writer.writeStartElement('InterfaceData');
                                var k = i;
                                var interfaceAttrCounter = 0;
                                while (k <= stringClean.length) {
                                    if (stringClean[k + 3] != undefined) {
                                        if (stringClean[k + 3].substring(0, 18) == 'InterfaceAttribute') {
                                            if (interfaceAttrCounter == stringClean[k + 3].substring(18, 19)) {
                                                interfaceAttrCounter += 1;
                                                writer.writeStartElement(stringClean[k + 6]);
                                                writer.writeAttributeString('Name', stringClean[k + 6]);
                                                stringClean[k + 6] = "";
                                                writer.writeAttributeString('Type', 'xs:string');
                                                writer.writeAttributeString('Unit', stringClean[k + 8])
                                                stringClean[k + 8] = ""
                                                writer.writeString(stringClean[k + 4]);
                                                writer.writeEndElement();

                                                stringClean[k + 4] = "";
                                            };


                                        }

                                    }
                                    k += 1;
                                }
                                writer.writeEndElement();
                                writer.writeEndElement();
                            }
                        }
                    }
                    
                    
                    else {
                        stringClean[i] = "";
                        stringClean[i + 1] = "";
                        stringClean[i + 2] = "";
                        writer.writeEndElement();
                        writer.writeEndElement();
                        interfacesCount += 1;
                    }
                    writer.writeEndElement();
                }
                else if (stringClean[i] == "Attribute") {
                    writer.writeStartElement(stringClean[i + 1]);
                    //inferring datatype
                    if (!isNaN(stringClean[i + 3].replace(',', '.'))) {
                        writer.writeAttributeString('Type', 'xs:double');
                    }
                    else if ((stringClean[i + 3]).trim().toLowerCase() == "true" ? true : false ||
                        (stringClean[i + 3]).trim().toLowerCase() == "false" ? true : false) {
                        writer.writeAttributeString('Type', 'xs:boolean');
                    }
                    else {
                        writer.writeAttributeString('Type', 'xs:string');
                    }

                    writer.writeAttributeString('Name', stringClean[i + 1]);

                    writer.writeAttributeString('Unit', stringClean[i + 5]);

                    writer.writeString(stringClean[stringClean.indexOf(stringClean[i]) + 3]);


                    writer.writeEndElement();
                    stringClean[i] = "";
                    stringClean[i + 1] = "";
                    stringClean[i + 2] = "";
                    stringClean[i + 3] = "";
                    stringClean[i + 4] = "";
                    stringClean[i + 5] = "";
                    writer.writeEndElement();
                }
                writer.writeEndElement();
            }
            
            
        }
        writer.writeEndDocument();
        //console.log(stringClean);
        var dataVals = writer.flush().toString();

        dataVals = flushToNode(dataVals);

        machine.append(dataVals);
        item.appendChild(machine);
        insertionCategory.append(item);
        //console.log(insertionCategory);
        // Complete data document is here



        var dataStorage = document.getElementById('userData');
        dataStorage.value = new XMLSerializer().serializeToString(xmlData);
        //console.log(dataStorage.value);

        

    }




    )
    function isValid() {
        function CountInputs() {
            var inputCount = 0;
            var filledvalues = 0;
            inputCount -= 1;
            $(doc).children().each(function () {

                $(this).children().each(function () {

                   
                    

                    if ($(this).prop('tagName') == 'INPUT' && $(this).attr('name') != '__RequestVerificationToken') {
                        if ($(this).is(':visible') == true) {
                            inputCount += 1;
                            //console.log(this);
                        }

                        if ((this.value != '' && this.value != undefined) || this.disabled) {
                            filledvalues += 1;
                            //console.log(this);
                        }
                    }
                    else if ($(this).prop('tagName') == 'SELECT') {
                        if ($(this).is(':visible')) {
                            inputCount += 1;
                            //console.log(this);
                        }
                        if ($(this).val()) {
                            filledvalues += 1;
                            //console.log(this);
                        }
                        

                    }
                    
                    else
                    {
                        
                        $(this).children().each(function () {
                            if ($(this).prop('tagName') == 'INPUT' && $(this).attr('name') != '__RequestVerificationToken') {
                                inputCount += 1;
                                //console.log(this);
                                if ((this.value != '' && this.value != undefined) || this.disabled) {
                                    filledvalues += 1;
                                    //console.log(this);
                                }
                            }
                        })
                        $(this).children().children().each(function () {
                            if ($(this).prop('tagName') == 'INPUT') {
                                
                                inputCount += 1;
                                //console.log(this);
                                if ((this.value != '' && this.value != undefined) || this.disabled) {
                                    filledvalues += 1;
                                    //console.log(this);
                                }
                            }
                            if ($(this).prop('tagName') == 'SELECT') {

                                inputCount += 1;
                                //console.log(this);
                                if ((this.value != '' && this.value != undefined) || this.disabled) {
                                    filledvalues += 1;
                                    //console.log(this);
                                }
                            }

                        })
                    }
                })
                


            })
            if (document.getElementById('optionalData').childElementCount > 0) {
                inputCount += 1;
            }
            var option = document.getElementById('optionSelector')
            inputCount += 1;
            if ($(option).val()) {
                filledvalues += 1;
            }
            var interfaceInput = document.getElementById('interfaceBase');
            if ($(interfaceInput).is(':visible')) {
                inputCount += 1;
                if (interfaceInput.value != "" && interfaceInput.value != undefined) {
                    filledvalues += 1;
                }
            }
            console.log(inputCount + " " + filledvalues);
            if (inputCount == filledvalues) {
                okButt.disabled = false;
            }
            else {
                okButt.disabled = true;
            }
        }
        CountInputs();
    }


    // Adding custom options button
    rowButt.addEventListener('click', function () {


        function createOptions(firstvalue = 'Class') {
            var optionRows = document.getElementById('optionalData');
            okButt.disabled = true;
            optionRows.onchange = function () { isValid() };

            var div = document.createElement('div');
            div.setAttribute('role', 'row');
            div.id = 'rowNode';

            var selectType = document.createElement('select');
            selectType.id = 'optionSelector';
            var empty = document.createElement('option');
            empty.innerText = null;
            var typeClass = document.createElement('option');


            typeClass.innerText = 'Class';

            var typeAttribute = document.createElement('option');
            typeAttribute.innerText = 'Attribute';


            var typeRole = document.createElement('option');
            typeRole.innerText = 'Role';
            typeRole.addEventListener('select', isValid());

            var typeInterface = document.createElement('option');
            typeInterface.innerText = 'Interface';


            selectType.append(empty, typeClass, typeAttribute, typeRole, typeInterface);
            div.appendChild(selectType);
            var optionName = document.createElement('input');
            optionName.id = 'inputField';
            optionName.setAttribute('required', 'required');
            optionName.addEventListener('change', function () {
                isValid(this);
            })
            div.appendChild(optionName);
            var valueTag = document.createElement('a');
            valueTag.text = 'Value: ';
            valueTag.id = 'value';
            valueTag.style.display = 'none';
            var unitTag = document.createElement('a');
            unitTag.text = 'Unit: ';
            unitTag.className = 'unitTag';
            unitTag.id = 'unit';
            unitTag.style.display = 'none';
            var input = document.createElement('input');
            input.setAttribute('required', 'required');
            input.id = 'i1';
            input.disabled = true;
            input.style.display = 'none';
            var input2 = document.createElement('input');
            input2.setAttribute('required', 'required');
            input2.disabled = true;
            input2.id = 'optionInput';
            input2.style.display = 'none';
            var selector2 = document.createElement('select');
            selector2.id = 'interfaceBase';
            selector2.style.display = 'none';
            selector2.style.marginLeft = '1vh';
            var addAttributeButt = document.createElement('button');
            addAttributeButt.id = 'addAttrButt';
            addAttributeButt.style.display = 'none';
            addAttributeButt.innerText = 'Add attribute';
            addAttributeButt.className = 'actionButton';
            addAttributeButt.style.float = 'right';
            addAttributeButt.addEventListener('click', function () {
                
                var childRow = document.createElement('div');
                childRow.addEventListener('change', isValid());
                childRow.setAttribute('role', 'row');
                childRow.id ='rowNode';
                var optionName = document.createElement('input');
                optionName.setAttribute('required', 'required');
                optionName.style.display = 'compact';
                optionName.id = 'inputField';
                optionName.addEventListener('change', function () {
                    isValid(this);
                })
                var nameTag = document.createElement('a');
                nameTag.text = 'Attribute: ';
                nameTag.style.float = 'left';
                nameTag.style.margin = '0,5px,5px,5px';
                var valueTag = document.createElement('a');
                valueTag.text = 'Value: ';
                valueTag.id = 'value';
                valueTag.style.float = 'left';
                valueTag.style.marginRight = '0.4vh';
                var unitTag = document.createElement('a');
                unitTag.text = 'Unit: ';
                unitTag.className = 'unitTag';
                
                var input = document.createElement('input');
                input.id = 'i1';
                input.style.float = 'left';
                input.style.marginLeft = '3.36vh';
                var input2 = document.createElement('input')
                input2.id = 'optionInput'
                div.appendChild(childRow);
                
                childRow.appendChild(optionName);
                childRow.appendChild(nameTag);
                
                childRow.appendChild(input);
                childRow.appendChild(valueTag);
                
                childRow.appendChild(input2);
                childRow.appendChild(unitTag);
                input.style.display = 'block';
                input2.style.display = 'block';
                valueTag.style.display = 'block';
                unitTag.style.display = 'block';
                nameTag.style.display = 'block';
            })
            div.appendChild(valueTag);
            div.appendChild(input);
            div.appendChild(input2);
            div.appendChild(unitTag);
            div.appendChild(selector2);
            div.appendChild(addAttributeButt);
            optionRows.appendChild(div);
            // Getting interfaces
            var interfaces = document.getElementById('interfaceLib').innerHTML;
            interfaces = interfaces.replaceAll('&lt;', '<');
            interfaces = interfaces.replaceAll('&gt;', '>');
            //console.log(interfaces);
            var interfacesArr = Array()
            $(interfaces).find('InterfaceClass').each(function () {
                interfacesArr.push($(this).attr('Name'));
            })
            var selector;
            $(div).children().each(function () {
                if ($(this).prop('id') == 'interfaceBase') {
                    selector = $(this);
                }
            })

            var emptyop = document.createElement('option');
            selector.append(emptyop);
            interfacesArr.forEach(function (inter) {
                var opt = document.createElement('option');
                opt.innerText = inter;
                selector.append(opt);
            });
            // input handling event
            selectType.addEventListener('loadstart', function () {
                if ($(this).val() == '') {
                    var activeRow = $(this).parent();
                    $(activeRow).children().each(function () {
                        if ($(this).prop('id') != 'optionSelector') {
                            $(this).hide();
                        }
                    })
                }
            })

            selectType.addEventListener('change', function () {
                //console.log($(this).val());
                if ($(this).val() == '') {
                    var activeRow = $(this).parent();
                    $(activeRow).children().each(function () {
                        if ($(this).prop('id') != 'optionSelector') {
                            $(this).hide();
                            $(this).val("");
                            $(this).prop('disabled', true); 
                        }
                    })
                }
                else if ($(this).val() == 'Attribute') {
                    var activeRow = $(this).parent();
                    $(activeRow).children().each(function () {
                        var id = $(this).prop('id');
                        if (id != 'optionSelector' && id != 'inputField' &&
                            id != 'i1' && id != 'optionInput'
                            && id != 'value' && id != 'unit') {
                            $(this).hide();
                            $(this).val("");
                            
                        }
                        else {
                            $(this).show();
                            $(this).prop('disabled', false); 
                            
                            
                        } 

                    })
                    //console.log($(this).val());
                }
                else if ($(this).val() == 'Class' || $(this).val() == 'Role') {
                    var activeRow = $(this).parent();
                    $(activeRow).children().each(function () {
                        var id = $(this).prop('id');
                        if (id != 'optionSelector' && id != 'inputField') {
                            $(this).hide();
                            $(this).prop('disabled', true); 
                            $(this).val("");
                        }
                        else {
                            $(this).show();
                            $(this).prop('disabled', false); 
                            
                        }

                    })
                    //console.log($(this).val());
                }
                else {
                    var activeRow = $(this).parent();

                    $(activeRow).children().each(function () {
                        var id = $(this).prop('id');
                        if (id != 'optionSelector' && id != 'inputField' &&
                            id != 'interfaceBase' && id != 'addAttrButt' &&
                            id != 'childRow') {
                            $(this).hide();
                            $(this).prop('disabled', true); 
                            $(this).val("");
                        }
                        else {
                            $(this).show();
                            $(this).prop('disabled', false); 
                            
                        }


                    })
                    //console.log($(this).val());
                }

            })
            okButt.disabled = true;
            isValid();


        }
        createOptions();

    })

    cancelButt.addEventListener('click', function () {
        window.location.reload();
    });




}