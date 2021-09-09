
const app = Vue.createApp({
    components: {
        BaseButton,
    },
    data() {
        return {
            biodiversityTable: null,
            draw: 1,
            selectedKey: null,
            deleteError: null,
            form: {
                familyKey: '',
                groupKey: '',
                orderKey: '',
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
            var url = `api/biodiversity/download/?startRow=0&rowCount=100000&sortBy=name&sortDirection=asc&keywords=${this.form.keywords}&familyKey=${this.form.familyKey}&groupKey=${this.form.groupKey}&orderKey=${this.form.orderKey}`
            window.open(url, '_blank');
        },


        deletedSelectedRecord() {
            if (this.selectedKey) {
                var result = confirm("Sure you want to delete this species? Note that if the species is linked to any Survey data or has references, it will not be deleted! You can contact WMIS support in such cases.");
                if (result) {
                    axios.delete(`/api/biodiversity/species/${this.selectedKey}/delete/`)
                        .then(response => window.location.href = "/Biodiversity")
                        .catch(error => this.deleteError = error.response.data.exceptionMessage || "An unexpected error occured while deleting the record.")
                }
            }
           
        },
    },

    mounted() {
        WMIS.loadAndInitializeSelect2($("#groups"), "/api/taxonomy/group/", "Group");
        WMIS.loadAndInitializeSelect2($("#orders"), "/api/taxonomy/order/", "Order");
        WMIS.loadAndInitializeSelect2($("#families"), "/api/taxonomy/family/", "Family");
    },

    created() {
        const vm = this;
        document.title = "WMIS Biodiversity";
        $(document).ready(function () {
            vm.biodiversityTable = $("#biodiversity").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": 'single',
                "ajax": {
                    "url": "/api/biodiversity",
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

                            groupKey: vm.form.groupKey,
                            orderKey: vm.form.orderKey,
                            familyKey: vm.form.familyKey,
                            keywords: vm.form.keywords
                        }

                    },
                    "dataSrc": function (json) {
                        json.draw = vm.draw;
                        json.recordsTotal = json.resultCount;
                        json.recordsFiltered = json.resultCount;

                        if (!json.dataRequest.groupKey) {
                            WMIS.appendDataToSelect(json.filters.groups, $('#groups'));
                        }

                        if (!json.dataRequest.orderKey) {
                            WMIS.appendDataToSelect(json.filters.orders, $('#orders'));
                        }

                        if (!json.dataRequest.familyKey) {
                            WMIS.appendDataToSelect(json.filters.families, $('#families'));
                        }
                        return json.data
                    },

                    "drawCallback": function (settings) {
                        vm.selectedKey = null;
                        vm.biodiversityTable.$('tr.bg-info').removeClass('bg-info');
                    }
                },

                "dom": '<"top">rt<"bottom"ip><"clear">',

                //"dom": 'Bfrtip',
                "columns": [
                    { "data": "group.name" },
                    { "data": "kingdom.name" },
                    { "data": "phylum.name" },
                    { "data": "class.name" },
                    { "data": "order.name" },
                    { "data": "family.name" },
                    { "data": "commonName" },
                    { "data": "name" },
                    //{ "data": "subSpeciesName" },
                    { "data": "statusRank.name" },
                    {
                        "data": "lastUpdated",
                        "render": function (data, type, row) {
                            if (typeof (data) != 'undefined' && data != null)
                                return moment(data, moment.ISO_8601).format('L');
                            else
                                return "";
                        }
                    }
                ],
            });

            $('#biodiversity tbody').on('click', 'tr', function () {
                vm.biodiversityTable.$('tr.bg-info').removeClass('bg-info');
                const data = vm.biodiversityTable.row(this).data();
                if ($(this).hasClass('bg-info') || data.key === vm.selectedKey ) {
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
                    vm.biodiversityTable.search(e.target.value).draw();
                }
            });

            $('#searchbtn').click(function (e) {
                vm.biodiversityTable.search(vm.form.keywords).draw();
            });

            $('#groups').change(function (e) {
                const val = e.target.value;
                vm.form.groupKey = val === 'all' ? '' : val;
                
                $('#orders').val("all");
                $('#orders').trigger("change");
                vm.form.orderKey = '';

                $('#families').val("all");
                $('#families').trigger("change");
                vm.form.familyKey = '';

                vm.biodiversityTable.search(vm.form.groupKey).draw();
            });

            $('#orders').change(function (e) {
                const val = e.target.value;
                vm.form.orderKey = val === 'all' ? '' : val;
                vm.biodiversityTable.search(vm.form.orderKey).draw();
            });

            $('#families').change(function (e) {
                const val = e.target.value;
                vm.form.familyKey = val === 'all' ? '' : val;
                vm.biodiversityTable.search(vm.form.familyKey).draw();
            });

        });

    },

});

app.use(ElementPlus)
app.mount('#wmis-app')