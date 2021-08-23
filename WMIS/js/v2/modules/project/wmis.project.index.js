
const app = Vue.createApp({
    data() {
        return {
            table: null,
            draw: 1,
            selectedKey: null,
            form: {
                pLead: '',
                pStatus: '',
                region: '',
                keywords: '',
            },
        }
    },

    computed: {
        isSelected() {
            return this.selectedKey !== null && this.selectedKey !== undefined;
        }
    },

    watch: {
        draw() {
            this.selectedKey = null;
        }
    },


    methods: {
        downloadRecords() {
            var url = `/api/project/download/?projectLead=${this.form.pLead}&projectStatus=${this.form.pStatus}&region=${this.form.region}&keywords=${this.form.keywords}`
            window.open(url, '_blank');
        },
    },

    mounted() {
        WMIS.loadAndInitializeSelect2($("#pLead"), "/api/person/projectLeads/", "Project Lead", true, 'data');
        WMIS.loadAndInitializeSelect2($("#pStatus"), "/api/project/statuses/", "Project Status", true, 'data');
        WMIS.loadAndInitializeSelect2($("#region"), "/api/leadregion?startRow=0&rowCount=500", "Ecoregion", true, 'data');
    },

    created() {
        const vm = this;
        document.title = "WMIS Projects";
        $(document).ready(function () {
            vm.table = $("#project").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": 'single',
                "ajax": {
                    "url": "/api/project",
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

                            projectLead: vm.form.pLead,
                            projectStatus: vm.form.pStatus,
                            region: vm.form.region,
                            keywords: vm.form.keywords
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

                //"dom": 'Bfrtip',
                "columns": [
                    { "data": "projectNumber" },
                    { "data": "name" },
                    { "data": "leadRegion.name" },
                    { "data": "projectLead.jobTitle" },
                    { "data": "status.name" },
                    {
                        "data": "statusDate",
                        "render": function (data, type, row) {
                            if (typeof (data) != 'undefined' && data != null)
                                return moment(data, moment.ISO_8601).format('L');
                            else
                                return "";
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
                    }
                ],
            });

            $('#project tbody').on('click', 'tr', function () {
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

            $('#keyword').keyup(function (e) {
                if (e.keyCode == 13) {
                    vm.table.search(vm.form.keywords).draw();
                }
            });

            $('#searchbtn').click(function (e) {
                vm.table.search(vm.form.keywords).draw();
            });

            $('#pLead').change(function (e) {
                const val = e.target.value;
                vm.form.pLead = val === 'all' ? '' : val;
                vm.table.search(vm.form.pLead).draw();
            });

            $('#pStatus').change(function (e) {
                const val = e.target.value;
                vm.form.pStatus = val === 'all' ? '' : val;
                vm.table.search(vm.form.pStatus).draw();
            });

            $('#region').change(function (e) {
                const val = e.target.value;
                vm.form.region = val === 'all' ? '' : val;
                vm.table.search(vm.form.region).draw();
            });

        });

    },

});

app.use(ElementPlus)
app.mount('#wmis-app')