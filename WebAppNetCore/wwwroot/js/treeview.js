

//Fetching data from <a> tag
var data = document.getElementById('returnedData').innerHTML;

data = data.replaceAll('&lt;', '<');
data = data.replaceAll('&gt;', '>');

//console.log(data);
//list init;
var collectionValue = document.getElementById('userData').value;
var li = document.createElement('li');
$('#tree').append(li);
var a = document.createElement('a');
a.text = 'Machinery';
a.className = 'itemExpandable';
li.style.listStyle = 'none';
li.append(a);
var sub_ul = document.createElement('ul');
li.append(sub_ul);
var arrayCollection;
localStorage.setItem('data', data);
var ext = 0;
var allowStr2 = true;

var excIncButt = document.getElementById('libButt');
var currentCol = document.getElementById('currentCol');


excIncButt.addEventListener('click', function () {

    if (allowStr2) {
        allowStr2 = false;
        excIncButt.style.color = 'green';
        excIncButt.innerHTML = 'Include interface library'
        excIncButt.style.width = '100%';

    }
    else {
        allowStr2 = true;
        excIncButt.style.color = 'red';
        excIncButt.innerHTML = 'Exclude interface library'
        excIncButt.style.width = '100%';
    }
})


// Making a nested list from xml file
// caching disabled to allow data update inside xml;

$(data).find('TreeViewItemHead').each(function () {

    var t = isParent(this);

    if (t == true) {
        var p = whoIsParent($(this));
        var parent = $(p).attr('Text');
        if (parent == 'Machinery') {

            var header = document.createElement('li');
            header.style.margin = '5px';

            var at = document.createElement('a');
            at.text = ($(this).attr('Text'))
            at.className = 'itemExpandable';

            header.style.listStyle = 'none';
            header.append(at);

            sub_ul.append(header);
            lastElem = header;


        }
        else {
            var subul = document.createElement('ul');

            var head = document.createElement('li');
            head.style.listStyle = 'none';
            head.style.margin = '5px';
            subul.append(head);

            var innertext = document.createElement('a');
            innertext.text = $(this).attr('Text')
            innertext.className = 'itemExpandable';

            head.append(innertext);

            lastElem.append(subul);

        }
    }





})
var atexts = [];
var addedValues = [];
$(data).find('TreeViewItem').each(function () {
  
    
    var p = whoIsParent(this);
    var category = ($(p).parent().attr('Category'));
    var atext = $(this).attr('Text');
    var manufacturer = $(this).parent().attr('text');
    
    
    
    //console.log("this is atext variable:" + atext);
    //console.log("inserting category is: " + category);
    //console.log("manufacturer is: " + manufacturer);


    var tree = $('#tree');
    console.log(tree);
    
    var childElement;
    var mainList = $(tree).first();
    $(mainList).children().each(function () {
        childElement = $(this).children();
        
    })
    var listManufacturer;
    
    $(childElement).find('UL').children().each(function () {
        var listCategory;
        //console.log(this);
        var candidateAnchor = $(this).first();
        //console.log($(candidateAnchor).text())
        $(candidateAnchor).children().parent().parent().parent().children().each(function () {
            if ($(this).prop('tagName') == 'A') {
                if ($(this).text() == category) {
                    listCategory = ($(this).parent());

                }
                else {
                    return;
                }
            }
        });
        
        
        if ($(candidateAnchor).text() == manufacturer){
            //console.log($(this));
            listManufacturer = $(this);
        }
        if (listCategory != undefined) {
            $(listCategory).children().each(function () {
                if ($(this).prop('tagName') == 'UL') {
                    $(this).children().each(function () {
                        $(this).children().each(function () {
                            
                            console.log($(this).prop('tagName'));
                            if ($(this).prop('tagName') == 'A') {
                                if (this.text == manufacturer) {
                                   listManufacturer = ($(this).parent());
                                }
                            }
                        });
                    });
                }
            });
        }
        //console.log('Inserting to...');
        //console.log(listManufacturer)
        
        if (listManufacturer != undefined && listCategory != undefined) {
            addElement(listManufacturer);
            atexts.push(atext);
            
        }
        
    })
    
    
    function addElement(head) {

        if (addedValues) {
            if (addedValues.includes(atext)) {
                //console.log('This is a duplicate!' + atext);
                return;
            }
        }
        
            var ul = $('<ul/>').appendTo(head);
            var li = document.createElement('li');
            li.style.listStyle = 'none';

            li.className = 'itemSelectableParent';
            //li.onclick = itemSelected;

            ul.append(li);
            var val = document.createElement('a');
            val.text = atext;
            val.className = 'itemSelectable';
            val.onclick = itemSelected;
            li.append(val);

            li.style.display = 'none';
            var butt = document.createElement('button');
            butt.textContent = 'info';
            butt.className = 'infoButtons';
            butt.addEventListener('click', function () {
                getDataByName(this.previousSibling.textContent);

            })
            li.append(butt);
            addedValues.push(atext);
    }


    //console.log(atexts);
    

})
var expandables = document.querySelectorAll('.itemExpandable');
expandables.forEach(
    expandable => {
        expandable.addEventListener('click',
            function () {
                var parent = $(this).parent();


                $(parent).find('.itemSelectableParent').each(function () {

                    if ($(this).is(':visible')) {
                        $(this).hide();
                    }
                    else {
                        $(this).show();
                    }

                });





            });
    });
//Xml search for data functions:
function getDataByName(name) {
    $(data).find('TreeViewItem').children().each(function () {
        var elemName = ($(this).find('Name'));
        if ($(elemName).text() == name) {

            var resultInfo = '';
            var parent = $(elemName).parent();
            $(parent).children().each(function () {
                if ($(this).text()) {
                    var row = $(this).prop('tagName') + ': ' + $(this).text() + '\n';
                }
                else {
                    var row = $(this).prop('tagName') + ': N/A' + '\n';
                }

                resultInfo += row;

            })
            alert(resultInfo);
        }
    });
}
//Gets data from console 
function getData() {
    var elements = con.textContent.split('\n');
    var cleanElements = Array();
    elements.forEach(function (elem) {
        elem = elem.substring(elem.lastIndexOf(':') + 2, elem.length);
        if (elem != "") {
            console.log(elem);
            cleanElements.push(elem);
        }

    })
    let datas = new Set();
    cleanElements.forEach(function (elem) {
        var treeviewItems = $(data).find('TreeViewItem');
        $(treeviewItems).find('Data').children().each(function () {
            var tagName = $(this).prop('tagName');

            if (tagName.toString().toLowerCase() == 'name') {
                if ($(this).text() == elem) {
                    //console.log(elem);
                    datas.add($(this).parent().parent());
                }
            }
        })
    })
    //console.log(datas);



    //initializing aml doc;
    function generateAML() {
        var writer = new XMLWriter('UTF-8', '1.0');
        // Defining AML 3.0 Header
        writer.writeStartDocument(true);
        writer.writeElementString('CAEXFile');
        writer.writeAttributeString('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        writer.writeAttributeString('xmlns', "http://www.dke.de/CAEX");
        writer.writeAttributeString('SchemaVersion', '3.0');
        writer.writeAttributeString('FileName', 'Model.aml');
        writer.writeAttributeString('xsi:schemaLocation', "http://www.dke.de/CAEX CAEX_ClassModel_V.3.0.xsd")
        writer.writeEndElement(); // header done;

        writer.writeStartElement('AdditionalInformation');
        writer.writeAttributeString('AutomationMLVersion', '3.0');
        writer.writeEndElement(); // additional info done;

        writer.writeStartElement('SuperiorStandardVersion');
        writer.writeString('AutomationML 2.10');
        writer.writeEndElement(); // superior standard version done;
        var date = new Date(Date.now()).toISOString();
        writer.writeStartElement('SourceDocumentInformation');
        writer.writeAttributeString('OriginName', "Automation ML e.V.");
        writer.writeAttributeString('OriginID', "Automation ML e.V.");
        writer.writeAttributeString('OriginVersion', "5.6.10.0");
        writer.writeAttributeString('LastWritingDateTime', date);
        writer.writeAttributeString('OriginVendor', "Automation ML e.V.");
        writer.writeAttributeString('OriginVendorURL', "www.AutomationML.org");
        writer.writeAttributeString('OriginRelease', "5.6.10.0");
        writer.writeAttributeString('OriginProjectTitle', "Testing");
        writer.writeAttributeString('OriginProjectID', "My Project");
        writer.writeEndElement(); // Source doc info done;

        writer.writeStartElement('SourceDocumentInformation');
        writer.writeAttributeString('OriginName', "AutomationML Editor");
        writer.writeAttributeString('OriginID', "916578CA-FE0D-474E-A4FC-9E1719892369");
        writer.writeAttributeString('OriginVersion', "5.6.10.0");
        writer.writeAttributeString('LastWritingDateTime', date);
        writer.writeAttributeString('OriginProjectID', "unspecified");
        writer.writeAttributeString('OriginProjectTitle', "unspecified");
        writer.writeAttributeString('OriginRelease', "5.6.10.0");
        writer.writeAttributeString('OriginVendor', "AutomationML e.V.");
        writer.writeAttributeString('OriginVendorURL', "www.AutomationML.org");
        writer.writeEndElement(); // Source doc info done;
        writer.writeStartElement('ExternalReference');
        writer.writeAttributeString('Path', "AutomationMLInterfaceClassLib.aml");
        writer.writeAttributeString('Alias', "InterfaceLib");
        writer.writeEndElement();


        var items = Array.from(datas);
        //console.log(items);
        // Categories array
        var headers = $(data).find('TreeViewItemHead');
        var categories = Array();
        $(headers).each(function () {
            var cat = $(this).attr('Category')
            if (cat != undefined) {

                categories.push(cat);
            }

        });
        //console.log(categories);

        // Instance hierarchy data 
        writer.writeStartElement('InstanceHierarchy');
        writer.writeAttributeString('Name', 'Plant');
        var counter = 1;

        $(items).each(function () {
            var dataCont = $(this).find('Data');

            writer.writeStartElement('InternalElement');
            writer.writeAttributeString('Name', $(dataCont).find('NAME').text());
            writer.writeAttributeString('ID', counter + 'IH');


            counter += 1;

            writer.writeEndElement();


        })
        writer.writeEndElement();
        //console.log(writer.flush().toString());

        // Interface Classes
        var interfacesSet = new Set();
        $(items).each(function () {
            var dataElem = $(this).find('Data');
            $(dataElem).children().each(function () {
                if ($(this).prop('tagName') == 'INTERFACE') {
                    interfacesSet.add($(this).attr('Name'));
                }
                if ($(this).prop('tagName') == 'SUPPORTEDINTERFACE') {
                    interfacesSet.add($(this).attr('Name'));
                }
            })

        })
        //console.log(interfacesSet);

        writer.writeStartElement('InterfaceClassLib');
        writer.writeAttributeString('Name', 'Interfaces');

        writer.writeElementString('Version', '0');
        var interfaceCount = 0;
        interfacesSet.forEach(function (interfaceElem) {
            writer.writeStartElement('InterfaceClass');
            writer.writeAttributeString('Name', interfaceElem);
            writer.writeAttributeString('ID', "IF" + interfaceCount);
            //Finding appropriate interface path

            writer.writeAttributeString('RefBaseClassPath', "InterfaceLib@AutomationMLInterfaceClassLib/AutomationMLBaseInterface");
            writer.writeEndElement();
            interfaceCount += 1;

        })

        writer.writeEndElement();
        writer.writeEndElement();

        // Role Classes
        var roles = new Set();
        $(items).each(function () {


            var dataElem = $(this).find('Data');
            $(dataElem).children().each(function () {

                if ($(this).prop('tagName') == 'ROLE') {
                    roles.add($(this).text())
                }
            })

        })

        writer.writeStartElement('RoleClassLib');
        writer.writeAttributeString('Name', 'Roles');

        writer.writeElementString('Version', '0');
        // Adding Roles

        roles.forEach(function (role) {
            writer.writeStartElement('RoleClass');
            writer.writeAttributeString('Name', role);
            writer.writeEndElement();
        });
        // Supported Roles Handling
        var supRoleCount = 0;
        console.log("Supported role handling!");
        $(items).each(function () {
            var item = $(this).find('Name').text();
            $(this).find('Data').children().each(function () {

                if ($(this).prop('tagName').toString().toLowerCase() == 'supportedrole') {
                    var supRole = ($(this).text());
                    roles.add(supRole);
                    if (supRole != '' && supRole != undefined && supRoleCount <=
                        $(this).find('supportedroleclass').length + 1) {
                        writer.writeStartElement('RoleClass');
                        writer.writeAttributeString('Name', supRole);
                        writer.writeEndElement();
                        supRoleCount += 1;
                        //console.log(supRoleCount);
                    }


                }

            })
            //console.log(item);
        })
        writer.writeEndElement();
        writer.writeEndElement();
        //console.log(roles);
        //console.log(roles.size);


        // Unit Classes
        writer.writeStartElement('SystemUnitClassLib');
        writer.writeAttributeString('Name', 'Plant');
        var classFromData = new Set();

        $(items).each(function () {
            $(this).find('Data').each(function () {
                var value = ($(this).find('class').text());

                if (value == "" || value == undefined) {
                    // Inferring class from category
                    var itemCategory = ($(whoIsParent(whoIsParent(this))).parent().attr('category'));
                    if (itemCategory == "Robotics") {
                        classFromData.add("Robot");
                    }
                    else if (itemCategory == "Conveyors") {
                        classFromData.add("Conveyor");
                    }
                    else if (itemCategory == "CNC") {
                        classFromData.add("CNC");
                    }
                    else {
                        classFromData.add($(whoIsParent(whoIsParent(this))).parent().attr('category'));
                    }
                }
                else {
                    classFromData.add(value);
                }

            });

        });
        //console.log(classFromData);
        var supportedClasses = new Set();
        $(items).each(function () {


            var dataElem = $(this).find('Data');
            $(dataElem).children().each(function () {
                if ($(this).prop('tagName').toString().toLowerCase == 'supportedclasses') {
                    supportedClasses.add($(this).text())
                }
            })

        })
        //console.log(supportedClasses);

        classFromData.forEach(function (value) {
            //Adding SystemClassLib element and it's related children
            var value2;
            if (value != "") {
                writer.writeStartElement('SystemUnitClass')
                writer.writeAttributeString('Name', value);
                $(items).each(function () {

                    $(this).find('Data').each(function () {
                        value2 = ($(this).find('class').text());

                        if (value2 == "" || value2 == undefined) {
                            // Inferring class from category
                            var itemCategory = ($(whoIsParent(whoIsParent(this))).parent().attr('category'));
                            if (itemCategory == "Robotics") {
                                value2 = ("Robot");
                            }
                            else if (itemCategory == "Conveyors") {
                                value2 = ("Conveyor");
                            }
                            else if (itemCategory == "CNC") {
                                value2 = ("CNC")
                            }
                            else {
                                value2 = itemCategory;
                            }
                        }
                        if (value == value2) {
                            writer.writeStartElement('InternalElement');
                            writer.writeAttributeString('Name', $(this).find('Name').text());
                            writer.writeAttributeString('ID', counter + "IHC");

                            var extIntCount = 0;
                            // Assigning attributes to classes

                            $(this).children().each(function () {
                                //console.log($(this).prop('tagName') + " " + $(this).text());

                                if ($(this).prop('tagName') != 'CLASS' &&
                                    $(this).prop('tagName') != 'ROLE' &&
                                    $(this).prop('tagName') != 'INTERFACE' &&
                                    $(this).prop('tagName') != 'SUPPORTEDCLASS' &&
                                    $(this).prop('tagName') != 'SUPPORTEDROLE' &&
                                    $(this).prop('tagName') != 'SUPPORTEDINTERFACE') {
                                    writer.writeStartElement('Attribute');
                                    writer.writeAttributeString('Name', $(this).prop('tagName'));
                                    writer.writeAttributeString('AttributeDataType', $(this).attr('Type'));
                                    if ($(this).prop('tagName') != 'NAME' && $(this).prop('tagName') != 'MODELPATH') {
                                        writer.writeAttributeString('RefAttributeType', 'Attributes/' + $(this).prop('tagName'));
                                    }

                                    if ($(this).attr('Unit')) {
                                        writer.writeAttributeString('Unit', $(this).attr('Unit'));
                                    }
                                    writer.writeStartElement('Value');
                                    writer.writeString($(this).text());
                                    writer.writeEndElement();
                                    writer.writeEndElement();


                                }
                            })
                            // Assigning interfaces to classes
                            $(this).children().each(function () {
                                if ($(this).prop('tagName') == 'INTERFACE') {

                                    writer.writeStartElement('ExternalInterface');
                                    writer.writeAttributeString('Name', $(this).attr('Name'));
                                    writer.writeAttributeString('RefBaseClassPath', 'Interfaces/' + $(this).attr('Name'));
                                    writer.writeAttributeString('ID', 'EIE' + ext);
                                    writer.writeStartElement('Version');
                                    writer.writeString('0');
                                    writer.writeEndElement();
                                    ext += 1;
                                    if ($(this).find('InterfaceData')) {
                                        var item = $(this).find('InterfaceData');
                                        console.log('insideIntData!');
                                        $(item).children().each(function () {
                                            writer.writeStartElement('Attribute');
                                            writer.writeAttributeString('Name', $(this).prop('tagName'));
                                            writer.writeAttributeString('AttributeDataType', $(this).attr('Type'));
                                            writer.writeAttributeString('Unit', $(this).attr('Unit'));
                                            writer.writeStartElement('Value')
                                            writer.writeString($(this).text());
                                            writer.writeEndElement();
                                            writer.writeEndElement();
                                        })

                                    }
                                    writer.writeEndElement();
                                }
                                else if ($(this).prop('tagName') == 'SUPPORTEDINTERFACE') {

                                    writer.writeStartElement('ExternalInterface');
                                    writer.writeAttributeString('Name', $(this).attr('Name'));
                                    writer.writeAttributeString('RefBaseClassPath', 'Interfaces/' + $(this).attr('Name'));
                                    writer.writeAttributeString('ID', 'EIE' + ext);
                                    writer.writeStartElement('Version');
                                    writer.writeString('0');
                                    writer.writeEndElement();
                                    ext += 1;
                                    if ($(this).find('InterfaceData')) {
                                        var item = $(this).find('InterfaceData');
                                        console.log('insideIntData!');
                                        $(item).children().each(function () {
                                            writer.writeStartElement('Attribute');
                                            writer.writeAttributeString('Name', $(this).prop('tagName'));
                                            writer.writeAttributeString('AttributeDataType', $(this).attr('Type'));
                                            writer.writeAttributeString('Unit', $(this).attr('Unit'));
                                            writer.writeStartElement('Value')
                                            writer.writeString($(this).text());
                                            writer.writeEndElement();
                                            writer.writeEndElement();
                                        })

                                    }
                                    writer.writeEndElement();
                                }


                            })

                            // Adding roles to internal elements of the class;
                            var item = $(this).parent();
                            //console.log(item);
                            var dataVal = $(item).find('Data');
                            //console.log(dataVal);
                            roles.forEach(function (roleName) {
                                $(dataVal).children().each(function () {

                                    console.log($(this).prop('tagName'));
                                    if ($(this).prop('tagName').toString().toLowerCase() == 'role' ||
                                        $(this).prop('tagName').toString().toLowerCase() == 'supportedrole') {
                                        console.log($(this).text() + " " + roleName);
                                        if ($(this).text() == roleName) {
                                            writer.writeStartElement('SupportedRoleClass');
                                            writer.writeAttributeString('RefRoleClassPath', "Roles/" + roleName);
                                            writer.writeEndElement();
                                        };
                                    }
                                    else {
                                        console.log('No role found');
                                    }


                                })
                            })






                            writer.writeEndElement();
                            counter += 1;
                        }
                    });

                })
                writer.writeEndElement();
            }

        })

       
        // Supported classes handling
        var supCounter = 0;
        console.log("Supported class handling!");
        $(items).each(function () {

            var itemName = $(this).find('Name').text();
            var parentClass = $(this).find('Class').text();
            //console.log(itemName + " " + parentClass);
            $(this).find('Data').children().each(function () {
                //console.log($(this).prop('tagName'));

                if ($(this).prop('tagName').toString().toLowerCase() == 'supportedclass') {
                    var supportedClassData = $(this).text();
                    writer.writeStartElement('SystemUnitClass');
                    //console.log("Item: " + itemName + ' supports ' + supportedClassData
                    //    + " which inherits from: " + parentClass);

                    writer.writeAttributeString('Name', supportedClassData);
                    writer.writeAttributeString('RefBaseClassPath', "Plant/" + parentClass);
                    writer.writeStartElement('InternalElement');
                    writer.writeAttributeString('Name', itemName + "_" + supCounter);
                    writer.writeAttributeString('ID', "SPI" + supCounter);
                    writer.writeAttributeString('RefBaseSystemUnitPath', "Plant/" + supportedClassData);
                    supCounter += 1;
                    writer.writeEndElement();
                    writer.writeEndElement();


                }


            })


        })



        writer.writeEndElement();
        writer.writeEndElement();// End of SystemUnitClassLib

        writer.writeEndElement();
        writer.writeEndElement();

        // Attribute Types
        var attributes = new Set();
        writer.writeStartElement('AttributeTypeLib');
        writer.writeAttributeString('Name', 'Attributes');

        writer.writeElementString('Version', '0');
        $(items).each(function () {
            var dataVal = $(this).find('Data');
            $(dataVal).children().each(function () {
                if ($(this).prop('tagName') != 'CLASS' &&
                    $(this).prop('tagName') != 'SUPPORTEDCLASS' &&
                    $(this).prop('tagName') != 'ROLE' &&
                    $(this).prop('tagName') != 'SUPPORTEDROLE' &&
                    $(this).prop('tagName') != 'INTERFACE' &&
                    $(this).prop('tagName') != 'SUPPORTEDINTERFACE' &&
                    $(this).prop('tagName') != 'NAME') {
                    var val = $(this).prop('tagName');


                    attributes.add(val);



                    /*console.log($(this).prop('tagName'));*/
                }

            })
        })
        attributes.forEach(function (attributeName) {
            writer.writeStartElement('AttributeType');
            writer.writeAttributeString('Name', attributeName);
            $(items).each(function () {
                var dataVal = $(this).find('Data');
                $(dataVal).children().each(function () {

                    if ($(this).prop('tagName') == attributeName) {
                        writer.writeAttributeString('AttributeDataType', $(this).attr('Type'));

                        if ($(this).attr('Unit') != undefined) {
                            writer.writeAttributeString('Unit', $(this).attr('Unit'));
                        }
                    }
                })
            })
            writer.writeEndElement();
        })






        /*console.log(attributes);*/



        writer.writeEndElement();

        writer.writeEndElement();







        writer.writeEndDocument();

        var result = writer.flush();


        var str = result.toString();
        //replacing outdated declaration to prevent AML crashes;
        str = str.replace('<?xml version="1.0" encoding="UTF-8" standalone="true" ?>', '<?xml version="1.0" encoding="UTF-8" ?>')

        //Download link call
        var str2 = document.getElementById('interfaceLib').innerText;

        // Include interface lib button

        var filesArr = Array();
        filesArr.push(str, str2);
        var fileCount = 0;
        filesArr.forEach(function (file) {
            var a = document.createElement('a');

            a.href = window.URL.createObjectURL(new Blob([file]));
            if (fileCount == 0) {
                a.download = 'Model.aml';
                fileCount += 1;
            }
            else {
                if (allowStr2 == true) {
                    a.download = 'AutomationMLInterfaceClassLib.aml';


                }
                else {
                    return false;
                }


            }

            a.click();
        })

        //console.log(str);
    }
    generateAML();



};
//Aml button logic

var amlButt = document.getElementById('genAML');
amlButt.addEventListener('click', function () {
    var text = con.textContent;
    if (text != null && text != '') {

        getData();
    }
    else {
        alert('No info here');
    }
});


// Checks if current item is having any child elements;
function isParent(value) {
    var childrencount = $(value).children('TreeViewItemHead').length;
    var childrenitemcount = $(value).children('TreeViewItem').length;
    if ((childrencount > 0 || childrenitemcount > 0) && $(value).attr('Text') != 'Machinery') {
        return true;
    }
    else {
        return false;
    }
}
function whoIsParent(value) {
    return $(value).parent();
}
var counter = 0;
//Returns the (user visible) name of selected element in the list;
const con = document.getElementById('console');
con.textContent = '';
con.focus();
function itemSelected() {
    con.focus();
    con.textContent += counter + ': Added: ' + $(this).parent().find('a').text() + '\n';
    localStorage.setItem('conRowCount', counter + 1);
    counter++;
}
//Clear button logic;
var clearButt = document.getElementById('clearData');
clearButt.addEventListener('click', function () {

    con.textContent = '';
    con.focus();
    counter = 0;
})








