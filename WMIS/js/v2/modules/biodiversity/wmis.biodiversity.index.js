
const app = Vue.createApp({
    data() {
        return {
            groups: [],
            families: [],
            orders: [],
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
        form: {
            immediate: false,
            deep: true,
            handler(newValue) {
                
            }
        },
        draw() {
            this.selectedKey = null;
        }
    },


    methods: {
        deletedSelectedRecord() {
            if (this.selectedKey) {
                var result = confirm("Sure you want to delete this species? Note that if the species is linked to any Survey data or has references, it will not be deleted! You can contact WMIS support in such cases.");
                if (result) {
                    axios.delete(`/api/biodiversity/species/${this.selectedKey}/delete/`)
                        .then(response => window.location.href = "/Biodiversity")
                        .catch(error => this.deleteError = error.response.data.exceptionMessage || "An unexpected error occured while deleting the record.")
                }
            }
           
        }
    },


    created() {
        const vm = this;
        document.title = "WMIS Biodiversity";
        $(document).ready(function () {
            const biodiversityTable = $("#biodiversity").DataTable({
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

                        // set the groups, families and orders
                        vm.groups = json.filters.groups;
                        vm.families = json.filters.families;
                        vm.orders = json.filters.orders;

                        return json.data
                    },
                    "drawCallback": function (settings) {
                        vm.selectedKey = null;
                        biodiversityTable.$('tr.bg-info').removeClass('bg-info');
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
                biodiversityTable.$('tr.bg-info').removeClass('bg-info');
                const data = biodiversityTable.row(this).data();
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

        });

    },

});


app.mount('#wmis-app')