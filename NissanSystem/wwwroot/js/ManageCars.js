var table = null;
var editor;
var input_filter_timeout = [];
var isFirstLoad = true;
var Operators = null;

function GetTableColumnsDefinition() {
    var columns = [
        { // checkbox column
            title: 'select',
            data: null,
            orderable: false,
            searchable: false,
            defaultContent: '',
            className: 'dt-body-center select-checkbox'
        },
        { // edit button column
            title: 'edit',
            data: null,
            orderable: false,
            searchable: false,
            defaultContent: '<a class="edit text-primary" title="Edit Row"> \
                                <span class="fa fa-wrench" aria-hidden="true"></span> \
                            </a>'
        },
        {
            'data': 'Id',
            title: 'DB key',
            visible: false
        },
        {
            'data': 'CarType',
            title: 'Car Type',
            className: 'editable inline',
            editable: true
        },
        {
            'data': 'ProductionYear',
            title: 'Production Year',
            className: 'editable inline',
            editable: true
        },
        {
            'data': 'CarNumber',
            title: 'Plate Number',
            className: 'editable inline',
            editable: true
        },
        {
            'data': 'ValidLicense',
            title: 'Valid License',
            className: 'editable inline',
            editable: true
        },
        {
            'data': 'ValidInsurance',
            title: 'Valid Insurance',
            className: 'editable inline',
            editable: true
        },
        {
            'data': 'CarLocation',
            title: 'Car Location',
            className: 'editable inline',
            editable: true
        },
        {
            'data': 'CarCounter',
            title: 'Car Counter',
            className: 'editable inline',
            editable: true
        },
        {
            'data': 'CarNotes',
            title: 'Car Notes',
            className: 'editable inline',
            editable: true
        },
        {
            'data': 'GeneralNotes',
            title: 'Notes',
            className: 'editable inline',
            editable: true
        },
        {
            'data': 'Agency',
            title: 'Agency',
            className: 'editable inline',
            editable: true
        },

        {
            'data': 'Photo1',
            title: 'Photos',
            editable: false,
            render: function (data, type, row, meta) {
                if (data === null || $.trim(data) === '')
                    return data;
                if (type === 'display') {
                    return `<a class="fa fa-info-circle" data-toggle="tooltip" title="<img src='/Uploaded_photos/${row.Photo1}' width='500' height='500'/>" alt="Photo No 1"/></a>
                            <span></span>
                            <a class="fa fa-info-circle" data-toggle="tooltip" title="<img src='/Uploaded_photos/${row.Photo2}' width='500' height='500'/>" alt="Photo No 2"/></a>
                            <span></span>
                            <a class="fa fa-info-circle" data-toggle="tooltip" title="<img src='/Uploaded_photos/${row.Photo3}' width='500' height='500'/>" alt="Photo No 3"/></a>
                            <a class="fa fa-info-circle" data-toggle="tooltip" title="<img src='/Uploaded_photos/${row.Photo4}' width='500' height='500'/>" alt="Photo No 4"/></a>
                           `
                        ;
                }

                return data;
            }
        },
        //{
        //    'data': 'OpenedForAllUsers',
        //    title: 'Opened For All Users',
        //    className: 'editable inline',
        //    editable: true,
        //    editType: 'checkbox',
        //    editSeparator: "|",
        //    editOptions: [
        //        { label: '', value: '1' }
        //    ],
        //    editDefault: 0,
        //    render: function (data, type, row, meta) {
        //        if (data === null || $.trim(data) === '')
        //            return data;
        //        if (type === 'display') {
        //            return '<input type="checkbox" class="editor-active" ' + (data ? 'checked="checked"' : '') + 'value="' + data + '" onclick="return false;" /><span css="checkboxValue" style="display:none;">' + data + '</span>';
        //        }
        //        return data;
        //    }
        //},
        //{
        //    'data': 'GroupOwnerIDs',
        //    title: 'Group Owner(s)',
        //    className: 'editable',
        //    editable: true,
        //    editType: 'select',
        //    multiple: true,
        //    editSeparator: ',',
        //    editOptions: Operators,
        //    editAttr: {
        //        'class': 'form-control-sm form-control input-s-sm inline select2-dropdown ddlGroupOwners',
        //        'multiple': 'multiple',
        //        'data-close-on-select': false
        //    },
        //    render: function (data, type, row, meta) {
        //        if (data === null || $.trim(data) === '')
        //            return data;
        //        if (type === 'display') {
        //            var arrGroupOwners = row['GroupOwners'].split('\n').map(function (item) { return $.trim(item); });
        //            var arrResult = arrGroupOwners.map(function (item, i) {
        //                return '<div>' + item + '</div>';
        //            });
        //            return arrResult.join('\n');
        //        }
        //        return data;
        //    }// end render
        //},
    ];
    return columns;
}// end function GetTableColumnsDefinition


function GetOperators() {
    console.log('Loading operators...');
    $.ajax({
        "autoWidth": false,
        type: "GET",
        url: "/si_groups/GetOperators",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (result) {
            // parse results
            Operators = result.map(function (item) {
                return {
                    value: item.Id,
                    label: item.TDesc
                };
            });
            // add operator options
            Operators.forEach(function (e, i) {
                var operatorOption = $('<option />', {
                    value: e.value,
                    text: e.label
                });
                $('#ddlGroupOwners').append(operatorOption);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("jqXHR", jqXHR);
            console.log("textStatus", textStatus);
            console.log("errorThrown", errorThrown);
            console.log("responseText", jqXHR.responseText);
            showAlert('Failed to receive Operators.\nPlease try again or contact Si-Web Team.\n', true);
        },
        complete: function (jqXHR, textStatus) {
            console.log('Loading Operators List... Done');
        }

    });
}// end function GetOperators

function createSearchTable() {
    if (table !== null) {
        $('.tblReport').dataTable().fnDestroy();
        $('.tblReport').empty();
        table = null;
    }
    else {
        // Add event listener for columns visibility
        $('.tblReport').on('column-visibility.dt', function (e, settings, column, state) {
            // when using fix header, the table header is copied to another table on the bottom of the html
            var $columns = $('.dataTable thead tr.table_filters').find('th:eq(' + column + ')');
            console.log('Column ' + column + ' has changed to ' + (state ? 'visible' : 'hidden'));
            if (state)
                $columns.show();
            else
                $columns.hide();
        });

        // Add event listener for select all CheckBox
        $('body').on('click', '.checkAll', function (e) {
            if (this.checked) {
                table.rows({ page: 'current' }).select();
            }
            else {
                table.rows({ selected: true }).deselect();
            }
            $('.checkAll').prop('checked', this.checked);
        });// end $('#btnReportCheckBox').on('click'
    }
    var columns = GetTableColumnsDefinition();

    table = $('.tblReport')
        .DataTable({
            //dom: 'Bfrtip',
            dom: '<"dom_wrapper fh-fixedHeader"Bf>tip',
            fixedHeader: {
                header: true,
                headerOffset: 96
            },
            select: {
                style: 'os',
                selector: 'td:first-child'
            },
            ajax: {
                type: "GET",
                url: "/Home/GetCars",
                contentType: "application/json;",
                dataType: "json",
                dataSrc: function (json) {
                    return json;
                },
                error: function (xhr, textStatus, error) {
                    console.log(' AJAX ERROR');
                    if ($.trim(xhr.responseText) !== '') {
                        var msg = xhr.responseText;
                        if (msg.hasOwnProperty('d') && msg.d.startsWith('Error:'))
                            console.log(msg.d);
                        else
                            console.log(msg);
                    }
                    console.log(xhr.responseText);
                }
            },
            searchDelay: 500,
            'columns': columns,
            deferRender: true,
            lengthMenu: [ // page sizes
                [10, 25, 50, 100, 200, 500, 1000, 2000], // values (-1 = - all)
                [10, 25, 50, 100, 200, 500, 1000, 2000] // text
            ],
            rowCallback: function (row, data) {
                // $(row).attr('data-id', data.ID);
            },
            iDisplayLength: 50,
            buttons: [
                'pageLength', // 'excel',
                'colvis',
                'csv',
                {
                    text: '<span class="fa fa-plus" aria-hidden="true"></span> Add new Car',
                    titleAttr: 'Add a new Car',
                    action: function (e, dt, node, config) {
                        resetModalFeilds();
                        $('#NewCarModal').modal('show');
                        // $('.select2-dropdown').select2();
                    }
                },
                {
                    text: '<span class="fa fa-refresh"></span> Refresh',
                    action: function (e, dt, node, config) {
                        table.ajax.url("/Home/GetCars").load();
                    }
                },
            ],
            initComplete: function (settings, json) {
                $('a[data-toggle="tooltip"]').tooltip({
                    placement: 'left',
                    html: true
                });
            }
        });// end DataTable

    $.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
        var error_message = message.replace('DataTables warning: table id=' + settings.nTable.id + ' - ', '');
        console.error(error_message);
        TopAlert(error_message, 'danger', 5);
    };

    $('.dataTable thead th:first').width('50px');

    // create row to add the search boxes
    var $tr = $('<tr />', {
        'class': 'table_filters'
    });
    $('.dataTable thead').append($tr);

    // Apply the search
    table.columns().every(function (i) {
        var that = this;
        var title = $(that.header()).text();
        var searchable = that.settings()[0].aoColumns[i].bSearchable;
        // console.log(i, title);
        var $th = $('<th />');
        if (i === 0) {
            var checkAll = '<div class="custom-control custom-checkbox ml-3"> \
                                <input type="checkbox" class="custom-control-input checkAll" name="checkAll" title="Check / Uncheck all rows" data-title="' + title + '" id="headerList' + i + '" list="headerList' + i + '" /> \
                                <label class="custom-control-label" for="headerList' + i + '"></label> \
                            </div>';
            $th.append(checkAll);
        }
        else if ((title != null) && (title != '') && searchable) {
            $th.append('<input type="text" class="form-control" placeholder="" data-title="' + title + '" list="headerList' + i + '" />');
        }
        $tr.append($th);

        if (!this.visible()) {
            $th.hide();
        }// end if (that.visible())
        if (i != 0) {
            $('input', $th).on('keyup', function () {
                let colIndex = that[0][0];
                let searchDelay = that.table().context[0].searchDelay | 0;
                let searchValue = this.value;
                clearTimeout(input_filter_timeout[colIndex]);

                input_filter_timeout[colIndex] = setTimeout(function () {
                    if (that.search() !== searchValue) {
                        console.log('Search Start', input_filter_timeout[colIndex], searchDelay, searchValue);
                        // search( input [, regex[ , smart[ , caseInsen ]]] ) - enable the regex to use the or operator
                        that.search(searchValue, true);
                        if (!isFirstLoad)
                            that.draw();
                    }
                }, searchDelay);
            })// end input keyup
                .keypress(function (event) {
                    var keycode = (event.keyCode ? event.keyCode : event.which);
                    if (keycode === 13) {
                        console.log('Disabled enter key press for: ' + $(this).attr('data-title'));
                        event.preventDefault();
                    }
                });
        }
    }); // end table.columns().every

    table.on('search.dt', function () {
        //console.log('Search End', Date.now());
        // remove the check mark from the checkbox
        $('.checkAll').prop('checked', false);
    });

    // Add event listener for CheckBox - mark the checkAll if all checkboxes are marked
    table
        .on('select', function (e, dt, type, indexes) {
            if (table.rows({ page: 'current', selected: true }).count() === table.rows({ page: 'current' }).count())
                $('.checkAll').prop('checked', true);
        })
        .on('deselect', function (e, dt, type, indexes) {
            $('.checkAll').prop('checked', false);
        });

    createEditor(GetTableColumnsDefinition());
    table.button().add(2, { extend: "edit", editor: editor });
    table.button().add(3, { extend: "remove", editor: editor });

    if (isFirstLoad) {
        isFirstLoad = false;
        //fillSearchFromUrl();
        //table.draw();
    }
}// end function createSearchTable

function createEditor(columns) {
    var arrfields = [];
    for (var i in columns) {
        column = columns[i];
        if (column.editable) {
            var obj = {
                label: column.title,
                name: column.data
            };
            if (typeof column.editType !== 'undefined')
                obj.type = column.editType;
            if (typeof column.editOptions !== 'undefined')
                obj.options = column.editOptions;
            if (typeof column.editSeparator !== 'undefined')
                obj.separator = column.editSeparator;
            if (typeof column.editDefault !== 'undefined')
                obj.default = column.editDefault;
            if (typeof column.multiple !== 'undefined')
                obj.multiple = column.multiple;
            if (typeof column.editAttr !== 'undefined')
                obj.attr = column.editAttr;
            arrfields.push(obj);
        }// end if 
    }// end for loop

    // handler for the edit button above the table and on each line
    $('body').on('click', '.tblReport a.edit', function (e) {
        e.preventDefault();
        editor.edit(
            $(this).closest('tr'),
            {
                title: 'Edit record',
                buttons: 'Update'
            }
        );
        if ($(this).find('.select2-container').length === 0) {

            setTimeout(function () {
                $('.DTE_Field_Type_select .select2-dropdown').select2({
                    width: '400px'
                });
            }, 100);
        }
    });

    // inline table edit for each filled that is editable
    $('body').on('click', '.tblReport tbody tr td.editable.inline', function (e) {
        try {
            var cell = editor.inline(this, {
                //submit: 'allIfChanged',//  Submit the values of all fields if one or more have changed. If none have changed, nothing will be submitted
                //onBlur: false,
                buttons: [
                    {
                        label: '<span class="fa fa-check"></span>', //'&gt;',
                        fn: function () {
                            this.submit();
                        }
                    }
                ]
            });
        } catch (e) {
            showAlert(e, true);
            console.error(e);
        }
    });

    editor = new $.fn.dataTable.Editor({
        ajax: {
            type: "PATCH",
            url: "/Home/PatchCars",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: function (d) {
                console.log('send data', d);
                return JSON.stringify(d);

            },
            success: function (result, textStatus, c) {
                table.ajax.url("/Home/GetCars").load();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // alert('There was an error while saving the data');
                console.log("jqXHR", jqXHR);
                console.log("textStatus", textStatus);
                console.log("errorThrown", errorThrown);
                console.log("errorThrown", jqXHR.responseText);
            },
            dataFilter: function (data, dataType) {
                // data manipulation before returning the data to the editor
                try {
                    var msg = JSON.parse(data);
                    if (!msg.IsSuccess) {
                        if (msg.Message !== 'Validation error(s)') {
                            TopAlert(msg.Message.replace('Error: ', ''), 'danger', 5);
                            return null;
                        }
                    }
                    return JSON.stringify(msg.ResponseData);
                }
                catch (err) {
                    console.log('dataFilter', err, data);
                }
                return data;
            }
        },

        table: ".tblReport",
        idSrc: 'Id',
        fields: arrfields
    });

    editor.on('open', function () {
        console.log('open', 'selected Operator Id(s)', $('.DTE_Field .ddlGroupOwners').val());
    });

}// end function createEditor

function resetModalFeilds() {
    $('#NewCarModal .has-error').removeClass('has-error');
    // $('#ddlGroupOwners').val('-1');
    $('#txtCarType').val('');
    $('#txtProductionYear').val('');
    $('#txtCarNumber').val('');
    $('#txtValidLicense').val('');
    $('#txtValidInsurance').val('');
    $('#txtCarLocation').val('');
    $('#txtCarCounter').val('');
    $('#txtCarNotes').val('');
    $('#txtGeneralNotes').val('');
    $('#Agency').val('');
    $('#input-upload-photo1').val('');
    $('#input-upload-photo2').val('');
    $('#input-upload-photo3').val('');
    $('#input-upload-photo4').val('');
    // $("#chkOpenedForAllUsers").prop("checked", false);
}// end function resetModalFeilds

function addNewCar() {
    // Getting the values from form
    var txtCarType = $('#txtCarType').val();
    var txtProductionYear = $.trim($('#txtProductionYear').val());
    var txtCarNumber = $.trim($('#txtCarNumber').val());
    var txtValidLicense = $.trim($('#txtValidLicense').val());
    var txtValidInsurance = $.trim($('#txtValidInsurance').val());
    var txtCarLocation = $.trim($('#txtCarLocation').val());
    var txtCarCounter = $.trim($('#txtCarCounter').val());
    var txtCarNotes = $.trim($('#txtCarNotes').val());
    var txtGeneralNotes = $.trim($('#txtGeneralNotes').val());
    var Agency = $.trim($('#Agency').val());

    //var chkOpenedForAllUsers = $('#chkOpenedForAllUsers').is(':checked');

    if (txtCarNumber == null || txtCarNumber == "") {
        showAlert('Please Enter Car Number', true);
        return;
    }

    //ddlGroupOwnerIDs = ddlGroupOwnerIDs.map(function (item) { return item | 0; }).sort();

    var SendData = {
        "CarType": txtCarType,
        "ProductionYear": txtProductionYear,
        "CarNumber": txtCarNumber,
        "ValidLicense": txtValidLicense,
        "ValidInsurance": txtValidInsurance,
        "CarLocation": txtCarLocation,
        "CarCounter": txtCarCounter,
        "CarNotes": txtCarNotes,
        "GeneralNotes": txtGeneralNotes,
        "Agency": Agency,
        "Photo1": Window.photo1,
        "Photo2": Window.photo2,
        "Photo3": Window.photo3,
        "Photo4": Window.photo4
        //"OpenedForAllUsers": chkOpenedForAllUsers,
        // "GroupOwnerID": JSON.stringify(ddlGroupOwnerIDs)
    };

    console.log(SendData);

    var JSON_SendData = JSON.stringify(SendData);
    $('form').addClass('sk-loading');
    $.ajax({
        type: "POST",
        url: "/Home/AddCar",
        data: JSON_SendData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            table.ajax.url("/Home/GetCars").load();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("jqXHR", jqXHR);
            console.log("textStatus", textStatus);
            console.log("errorThrown", errorThrown);
            console.log("responseText", jqXHR.responseText);
            console.log("responseJSON", jqXHR.responseJSON);
            alert('Failed to receive data.\nPlease try again or contact Si-Web Team.\n', true);
        },
        complete: function (jqXHR, textStatus) {
            $('#NewCarModal').modal('hide');
            $('form').removeClass('sk-loading');
        }
    });
}// end function addNewCar

$("#btn-upload-photo1").on("click", function () {
    $("#input-upload-photo1").trigger("click");
});

$("#btn-upload-photo2").on("click", function () {
    $("#input-upload-photo2").trigger("click");
});

$("#btn-upload-photo3").on("click", function () {
    $("#input-upload-photo3").trigger("click");
});

$("#btn-upload-photo4").on("click", function () {
    $("#input-upload-photo4").trigger("click");
});

function uploadPhoto(fileUpload, photoNum) {
    var fileData = $(fileUpload).prop("files")[0];
    var formData = new FormData();
    formData.append("postedFile", fileData);
    $.ajax({
        url: '/Home/AddPhoto/',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (result) {
            if (result.startsWith("error:"))
                alert(result);
            else {
                Window["photo" + photoNum] = result;
                alert("the file uploaded successfully");
            }
        },
        error: function (errorData) {
            alert(errorData);
        }
    });
}

$(document).ready(function () {
    //GetOperators();
    //$('.select2-dropdown').select2();

    $('#btnAddCar').on("click", function (e) {
        e.preventDefault();
        addNewCar();
    });

    createSearchTable();

});// end $(document).ready

