const ProjectSurveys = {
    components: {
        BaseButton,
        BaseLinkButton,
        BaseDropdownSelect
    },
    props: {
        project_id: Number,
        survey_types: Array
    },

    template: "#project-surveys",

    data: function() {
        return {
            table: null,
            selectedKey: null,
            filters: {
                surveyTypeKey: -1
            },
        }
    },

    watch: {
        "filters.surveyTypeKey": function(newVal) {
            this.table.ajax.reload(null, true)
        }
    },

    methods: {
        downloadRecords: function() {
            var url = `/api/project/${this.project_id}/surveys/download/?startRow=0&rowCount=1000&sortBy=surveyType&sortDirection=asc&surveyTypeKey=${this.filters.surveyTypeKey}`
            window.open(url, '_blank');
        }
    },

    created: function() {
        const vm = this;
        $(document).ready(function () {

            setTimeout(() => {
                vm.table = $("#survey").DataTable({
                    "pageLength": 25,
                    "scrollX": true,
                    "searching": false,
                    "processing": true,
                    "serverSide": true,
                    "select": 'single',
                    "ajax": {
                        "url": `/api/project/${vm.project_id}/surveys/`,
                        "data": function (d, settings) {
                            let sortDirection = null;
                            let sortedColumnName = null;

                            if (settings.aaSorting.length > 0) {
                                sortDirection = settings.aaSorting[0][1];
                                let sortedColumnIndex = settings.aaSorting[0][0];
                                sortedColumnName = settings.aoColumns[sortedColumnIndex].mData;
                            }

                            vm.draw = settings.iDraw

                            return {
                                startRow: d.start,
                                rowCount: d.length,
                                sortBy: sortedColumnName,
                                sortDirection: sortDirection,
                                i: settings.iDraw,

                                surveyTypeKey: vm.filters.surveyTypeKey
                            }

                        },
                        "dataSrc": function (json) {
                            json.draw = vm.draw;
                            json.recordsTotal = json.resultCount;
                            json.recordsFiltered = json.resultCount;

                            return json.data
                        },

                        "drawCallback": function (settings) {
                            vm.selectedKey = null;
                            vm.table.$('tr.bg-info').removeClass('bg-info');
                        }
                    },
                    "dom": '<"top">rt<"bottom"ip><"clear">',
                    "columns": [
                        {
                            "data": "surveyType",
                            "render": function (data, type, row) {
                                if (typeof (data) != 'undefined' && data != null) {
                                    return data.name;
                                } else {
                                    return "";
                                }
                            }
                        },
                        {
                            "data": "template",
                            "render": function (data, type, row) {
                                if (typeof (data) != 'undefined' && data != null) {
                                    return data.name;
                                } else {
                                    return "";
                                }
                            }
                        },
                        {
                            "data": "targetSpecies",
                            "render": function (data, type, row) {
                                if (typeof (data) != 'undefined' && data != null) {
                                    return data.name;
                                } else {
                                    return "";
                                }
                            }
                        },
                        {
                            "data": "targetSpecies",
                            "name": "commonName",
                            "render": function (data, type, row) {
                                if (typeof (data) != 'undefined' && data != null) {
                                    return data.commonName;
                                } else {
                                    return "";
                                }
                            }
                        },
                        {
                            "data": "startDate",
                            "render": function (data, type, row) {
                                if (typeof (data) != 'undefined' && data != null)
                                    return moment(data, moment.ISO_8601).format('L');
                                else
                                    return "";
                            }
                        },
                        {
                            "data": "observationCount",
                            "sortable": false
                        }
                    ],
                });

                $('#survey tbody').on('click', 'tr', function () {
                    vm.table.$('tr.bg-info').removeClass('bg-info');
                    const data = vm.table.row(this).data();
                    if ($(this).hasClass('bg-info') || data.key === vm.selectedKey) {
                        $(this).removeClass('bg-info');
                        vm.selectedKey = null
                    } else {
                        if (data) {
                            vm.selectedKey = data.key
                            $(this).addClass('bg-info');
                        }
                    }
                });
                $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
                    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
                });

        }, 00)

        });
        
    }


}