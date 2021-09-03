const ProjectSites = {
    template: "#project-sites",
    components: {
        BaseInput,
        BaseButton
    },
    props: {
        project_id: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            table: null,
            draw: 1,
            selectedKey: null,
            selectedRecord: null,
            form: {

            }
        }
    },

    computed: {
        disabled() {
            return this.selectedKey == null
        }
    },


    methods: {
        launchEditPage() {
            if (!this.selectedKey) return;
            window.location.href = `/Project/EditSite/${this.selectedKey}`;
        },
        launchNewPage() {
            window.location.href = `/Project/NewSite/${this.project_id}`;
        }
    },

    created() {
        const vm = this;

        $(document).ready(function () {
            vm.table = $("#sitesTable").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": 'single',
                "ajax": {
                    "url": `/api/project/${vm.project_id}/sites/`,
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
                    { "data": "siteNumber" },
                    { "data": "name" },
                    { "data": "latitude" },
                    { "data": "longitude" },
                    {
                        "data": "dateEstablished",
                        "render": function (data, type, row) {
                            if (typeof (data) != 'undefined' && data != null)
                                return moment(data, moment.ISO_8601).format('L');
                            else
                                return "";
                        }
                    }
                ],
            });

            $('#sitesTable tbody').on('click', 'tr', function () {
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

        });
    }
}