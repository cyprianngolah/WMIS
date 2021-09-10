
const app = Vue.createApp({
    components: {
        BaseButton,
        BaseInput,
        BaseDropdownSelect
    },

    data() {
        return {
            table: null,
            draw: 1,
            selectedKey: null,
            form: {
                groupKey: '',
                keywords: '',
            },
            taxonomyGroups: []
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

        getTaxonomyGroups() {
            axios.get("/api/taxonomy/taxonomygroup/")
                .then(response => {
                    this.taxonomyGroups = response.data
                    this.taxonomyGroups.unshift({name: "All Groups", key: ''})
                }).catch(error => console.log(error))
        }
    },

    mounted() {
        //WMIS.loadAndInitializeSelect2($("#taxonomyGroup"), "/api/taxonomy/taxonomygroup/", "Taxonomy Group");
        this.getTaxonomyGroups()
    },

    created() {
        const vm = this;
        document.title = "Taxonomies";

        $(document).ready(function () {
            vm.table = $("#taxonomies").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": 'single',
                "ajax": {
                    "url": "/api/taxonomy",
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

                            taxonomyGroupKey: vm.form.groupKey,
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

                "columns": [
                    { "data": "key" },
                    { "data": "name" },
                    { "data": "taxonomyGroup.name" }
                ],
            });

            $('#taxonomies tbody').on('click', 'tr', function () {
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
                    vm.table.search(e.target.value).draw();
                }
            });

            $('#searchbtn').click(function (e) {
                vm.table.search(vm.form.keywords).draw();
            });

            $('#taxonomyGroup').change(function (e) {
                const val = e.target.value;
                vm.form.groupKey = val === 'all' ? '' : val;
                vm.table.search(vm.form.groupKey).draw();
            });
        });

    },

});

app.use(ElementPlus)
app.mount('#wmis-app')