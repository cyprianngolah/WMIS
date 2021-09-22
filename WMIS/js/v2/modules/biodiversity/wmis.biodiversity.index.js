
const app = Vue.createApp({
    mixins: [GlobalMixin],

    components: {
        BaseButton,
        BaseLinkButton,
        BaseDropdownSelect
    },
    data: function() {
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
            groups: [],
            orders: [],
            families: [],
        }
    },

    computed: {
        isSelected: function() {
            return this.selectedKey !== null && this.selectedKey !== undefined;
        }
    },

    watch: {
        draw: function() {
            this.selectedKey = null;
        }
    },


    methods: {
        downloadRecords: function() {
            var url = `api/biodiversity/download/?startRow=0&rowCount=100000&sortBy=name&sortDirection=asc&keywords=${this.form.keywords}&familyKey=${this.form.familyKey}&groupKey=${this.form.groupKey}&orderKey=${this.form.orderKey}`
            window.open(url, '_blank');
        },


        deletedSelectedRecord: function() {
            if (this.selectedKey) {
                axios.delete(`/api/biodiversity/species/${this.selectedKey}/delete/`)
                    .then(_ => window.location.href = "/Biodiversity")
                    .catch(error => this.deleteError = error.response.data.exceptionMessage || "An unexpected error occured while deleting the record.")
                
            }
           
        },


        fetchFilters: function() {
            //this.showLoading();
            axios.all([
                axios.get('/api/taxonomy/group/'),
                axios.get('/api/taxonomy/order/'),
                axios.get('/api/taxonomy/family/')
            ]).then(axios.spread((...responses) => {
                this.groups = responses[0].data
                this.orders = responses[1].data
                this.families = responses[2].data
            })).then(_ => {
                this.groups.unshift({ name: "All Groups", key: "" })
                this.orders.unshift({ name: "All Orders", key: "" })
                this.families.unshift({ name: "All Families", key: "" })
            }).catch(error => {
                console.log(error)
            }).finally(() => setTimeout(() => {
                //this.hideLoading()
            }, 200))
        }
    },

    created: function() {
        this.fetchFilters()
        const vm = this;
        document.title = "WMIS Biodiversity";
        
        $(document).ready(function () {
            vm.showLoading();
            vm.biodiversityTable = $("#biodiversity").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
                "processing": false,
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
                        vm.hideLoading();
                        if (!json.dataRequest.groupKey) {
                            vm.groups = json.filters.groups;
                            vm.groups.unshift({ name: "All Groups", key: "" })
                        }

                        if (!json.dataRequest.orderKey) {
                            vm.orders = json.filters.orders;
                            vm.orders.unshift({ name: "All Orders", key: "" })
                        }

                        if (!json.dataRequest.familyKey) {
                            vm.families = json.filters.families;
                            vm.families.unshift({ name: "All Families", key: "" })
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

            
        });

    },

});

app.use(ElementPlus)
app.mount('#wmis-app')