
//list init;
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

// Making a nested list from xml file
// caching disabled to allow data update inside xml;
$.ajax({
    url: '/lib/data.xml',
    dataType: 'xml',
    cache: false,
    success: function (data) {
        $(data).find('TreeViewItemHead').each(function ()
        {
            
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
        $(data).find('TreeViewItem').each(function () {
            var p = whoIsParent(this);
            var atext = $(this).attr('Text');
            var a = document.getElementsByTagName('a');
            var head;
            $(a).each(function () {
                if ($(p).attr('Text') == this.text) {
                    
                    head = $(this).parent();
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
                }
            });
            
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
                        if ($(this).text().length > 0 ) {
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
            var vars = $(data).find('TreeViewItem');

            elements.pop();
            for (let i = 0; i < elements.length; i++) {
                elements[i] = elements[i].substring(elements[i].lastIndexOf(':') + 1).trim();

            }
            let datas = new Set();
            for (let j = 0; j < vars.length; j++) {
                var text = $(vars[j]).text();
                for (let k = 0; k < elements.length; k++) {
                    if (text.includes(elements[k])) {
                        datas.add(vars[j]);
                        break;
                    }
                    else {
                        continue;
                    }
                }
                
            }

            //initializing aml doc;
            function generateAML() {
                var writer = new XMLWriter('UTF-8', '1.0');
                // Header of AML file
                writer.writeStartDocument(true);
                writer.writeElementString('CAEXFile');
                writer.writeAttributeString('FileName', 'Model.aml');
                writer.writeAttributeString('SchemaVersion', '2.15');
                writer.writeAttributeString('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
                writer.writeEndElement();
                writer.writeStartElement('AdditionalInformation');
                writer.writeAttributeString('AutomationMLVersion', '3.0');
                writer.writeEndElement();
                writer.writeStartElement('AdditionalInformation');
                writer.writeStartElement('WriterHeader');
                writer.writeElementString('WriterName', 'Automation ML e.V.');
                writer.writeElementString('WriterID', 'Automation ML e.V.');
                writer.writeElementString('WriterVendor', 'Automation ML e.V.');
                writer.writeElementString('WriterVendorURL', 'www.AutomationML.org');
                writer.writeElementString('WriterVersion', '5.6.10.0');
                writer.writeElementString('WriterRelease', '5.6.10.0');
                writer.writeElementString('LastWritingDateTime', Date.now());
                writer.writeElementString('WriterProjectTitle', 'Testing');
                writer.writeElementString('WriterProjectID', 'My Project');
                writer.writeEndElement();
                writer.writeEndElement();
                var items = Array.from(datas);
                // Categories array
                var headers = $(data).find('TreeViewItemHead');
                var categories = Array();
                $(headers).each(function () {
                    var cat = $(this).attr('Category')
                    if (cat != undefined) {

                        categories.push(cat);
                    }

                });
                console.log(categories);

                // Data 
                writer.writeStartElement('InstanceHierarchy');
                writer.writeAttributeString('Name', 'Plant');
                var counter = 1;
                $(items).find('Data').each(function () {
                    writer.writeStartElement('InternalElement');
                    writer.writeAttributeString('Name', $(this).find('Name').text());
                    writer.writeAttributeString('ID', counter + 'IH');
                    var elem = $(whoIsParent(whoIsParent(items[counter - 1]))).attr('Text');
                    if (elem != undefined) {
                        writer.writeAttributeString('RefBaseSystemUnitPath', ('Plant/' + elem));
                        writer.writeStartElement('RoleRequirements');
                        writer.writeAttributeString('RefBaseRoleClassPath', ('Roles/' + elem));
                        writer.writeEndElement();
                        
                    }
                    counter+=1;
                    
                    writer.writeEndElement();


                })
                writer.writeEndElement();
               

                // Interface Classes
                writer.writeStartElement('InterfaceClassLib');
                writer.writeAttributeString('Name', 'Interfaces');

                writer.writeElementString('Version', '0');


                writer.writeEndElement();
                writer.writeEndElement();
                
                // Role Classes
                writer.writeStartElement('RoleClassLib');
                writer.writeAttributeString('Name', 'Roles');

                writer.writeElementString('Version', '0');
                for (var i = 0; i < categories.length; i += 1) {
                    writer.writeStartElement('RoleClass');
                    writer.writeAttributeString('Name', categories[i]);
                    writer.writeEndElement();
                }
                
             

                writer.writeEndElement();
                writer.writeEndElement();

                

                // Unit Classes
                writer.writeStartElement('SystemUnitClassLib');
                writer.writeAttributeString('Name', 'Plant');
                var elemCount = items.length;
                for (var c = 0; c < categories.length; c += 1) {
                    if (elemCount != 0) {
                        writer.writeStartElement('SystemUnitClass');
                        writer.writeAttributeString('Name', categories[c]);
                        writer.writeElementString('Version', '0');


                        for (var k = 0; k < items.length; k += 1) { // Adding children to appropriate category
                            var elem = $(whoIsParent(whoIsParent(items[k]))).attr('Text');
                            if (elem == categories[c]) {

                                writer.writeStartElement('InternalElement');
                                writer.writeAttributeString('Name', $(items[k]).find('Name').text());
                                writer.writeAttributeString('ID', (k).toString() + 'IE');
                                //Attributes for each object
                                var parentData;
                                $(data).find('Data').children().each(function () {
                                    
                                    if ($(this).prop('tagName') == 'Name' && $(this).text() == $(items[k]).find('Name').text()) {
                                        parentData = whoIsParent(this);
                                        
                                        return;
                                    }
                                    
                                });
                                $(parentData).children().each(function () {
                                    writer.writeStartElement('Attribute')
                                    writer.writeAttributeString('Name', $(this).prop('tagName'))
                                    writer.writeElementString('Value', $(this).text());
                                    if ($(this).attr('Type') != undefined) {
                                        writer.writeAttributeString('AttributeDataType', $(this).attr('Type'));
                                    }
                                    if ($(this).attr('Unit') != undefined) {
                                        writer.writeAttributeString('Unit', $(this).attr('Unit'));
                                    }
                                    writer.writeEndElement();
                                   

                                });
                                writer.writeEndElement();
                                elemCount -= 1;

                            }
                        }
                        writer.writeEndElement();
                    }
                    
                    
                }
                writer.writeEndElement();
                // Attribute Types
                
                writer.writeStartElement('AttributeTypeLib');
                writer.writeAttributeString('Name', 'Attributes');

                writer.writeElementString('Version', '0');


                
                writer.writeEndElement();

                writer.writeEndElement();
              
               

               

                
                
                writer.writeEndDocument();

                var result = writer.flush();


                var str = result.toString();
                //replacing outdated declaration to prevent AML crashes;
                str = str.replace('<?xml version="1.0" encoding="UTF-8" standalone="true" ?>', '<?xml version="1.0" encoding="UTF-8" ?>')
                
                //Download link call
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(new Blob([str]));
                a.download = 'Model.aml';
                a.click();
                console.log(str);
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

    },
    error: function () {
        console.log('Unexpected Error at AML button');
    }
    
    

})

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
function itemSelected() {
    
    con.textContent += counter + ': Added: ' + $(this).parent().find('a').text() + '\n';
    counter++;
}
//Clear button logic;
var clearButt = document.getElementById('clearData');
clearButt.addEventListener('click', function () {
   
    con.textContent = '';
    con.focus();
    counter = 0;
})








