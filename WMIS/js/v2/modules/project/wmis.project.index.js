
const app = Vue.createApp({
    mixins: [GlobalMixin],

    components: {
        BaseButton,
        BaseInput,
        BaseLinkButton,
        BaseDropdownSelect
    },
    data: function() {
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

            leads: [],
            regions: [],
            statuses: []
        }
    },

    computed: {
        isSelected: function() {
            return this.selectedKey !== null && this.selectedKey !== undefined;
        }
    },

    watch: {
        draw:function() {
            this.selectedKey = null;
        }
    },


    methods: {
        downloadRecords:function() {
            var url = `/api/project/download/?projectLead=${this.form.pLead}&projectStatus=${this.form.pStatus}&region=${this.form.region}&keywords=${this.form.keywords}`
            window.open(url, '_blank');
        },

        getDropdowns: function() {
            this.showLoading();
            axios.all([
                axios.get("/api/person/projectLeads/"),
                axios.get("/api/project/statuses/"),
                axios.get("/api/leadregion?startRow=0&rowCount=500"),
            ]).then(axios.spread((...responses) => {
                this.leads = responses[0].data.data
                this.statuses = responses[1].data.data
                this.regions = responses[2].data.data
            })).then(() => {
                this.leads.unshift({name: "All Leads", key: ""})
                this.statuses.unshift({name: "All Statuses", key: ""})
                this.regions.unshift({name: "All Regions", key: ""})
            }).catch(error => console.log(error))
            .finally(() => setTimeout(() => {
                this.hideLoading()
            }, 200))
        }
    },

    created: function() {
        this.getDropdowns();
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

        });

    },

});

app.use(ElementPlus)
app.mount('#wmis-app')