
const app = Vue.createApp({
    components: {
        BaseButton,
        BaseInput
    },
    data() {
        return {
            table: null,
            draw: 1,
            selectedKey: null,
            newCollarModal: null,
            form: {
                needingReview: false,
                regionKey: '',
                speciesKey: '',
                keywords: '',
            },

            newCollarForm: {
                collarId: ""
            }
        }
    },

    computed: {
        isSelected() {
            return this.selectedKey !== null && this.selectedKey !== undefined;
        },

        disableCreate() {
            return this.newCollarForm.collarId==""
        }
    },

    watch: {
        draw() {
            this.selectedKey = null;
        }
    },


    methods: {
        downloadRecords() {
            var url = `api/collar/download/?startRow=0&rowCount=20000&sortBy=collarStatus.name&sortDirection=asc&subSortBy=&subSortDirection=&i=5&keywords=${this.form.keywords}&regionKey=${this.form.regionKey}&speciesKey=${this.form.speciesKey}&needingReview=${this.form.needingReview}`
            window.open(url, '_blank');
        },

        reloadTable() {
            this.table.ajax.reload(null, false);
        },
        handleCreateCollar() {
            axios({
                url: '/api/collar/',
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded; charset=utf-8' },
                data: `=${encodeURIComponent(this.newCollarForm.collarId)}`
            }).then(response => {
                window.location.href = "/CollaredAnimal/Edit/" + response.data;
                this.newCollarModal.hide();
            })
            .catch(error => console.log(error))
        }

    },

    mounted() {
        WMIS.loadAndInitializeSelect2($("#species"), "/api/biodiversity/species?startRow=0&rowCount=7000", "Species", true, 'All Species', 'data');
        WMIS.loadAndInitializeSelect2($("#region"), "/api/collar/region?startRow=0&rowCount=500", "Region", true, 'All Regions', 'data');
        this.newCollarModal = new bootstrap.Modal(document.getElementById("newCollarModal"), {
            keyboard: false,
            backdrop: 'static'
        });
    },

    created() {
        document.title = "WMIS Collared Animal";
        const vm = this;
        document.title = "WMIS Biodiversity";

        $(document).ready(function () {
            vm.table = $("#collarTable").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": 'single',
                "order": [[3, 'asc'], [4, 'asc']],
                "ajax": {
                    "url": "/api/collar/",
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

                            keywords:vm.form.keywords,
                            regionKey: vm.form.regionKey,
                            speciesKey: vm.form.speciesKey,
                            needingReview: vm.form.needingReview
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
                    { "data": "animalId" },
                    { "data": "subscriptionId" },
                    { "data": "collarState.name" },
                    { "data": "collarStatus.name" },
                    {
                        "data": "inactiveDate",
                        "render": function (data, type, row) {
                            var date = moment(data, moment.ISO_8601)
                            if (date.isValid()) {
                                return date.format('L');
                            } else {
                                return '';
                            }
                        }
                    },
                    { "data": "animalStatus.name" },
                    { "data": "vhfFrequency" },
                    { "data": "animalSex.name" },
                    { "data": "herdPopulation.name" },
                    { "data": "collarType.name" }
                ],
            });

            $('#collarTable tbody').on('click', 'tr', function () {
                vm.table.$('tr.bg-info').removeClass('bg-info');
                const data = vm.table.row(this).data();
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

            $('#species').change(function (e) {
                const val = e.target.value;
                vm.form.speciesKey = val === 'all' ? '' : val;
                vm.reloadTable()
            });

            $('#region').change(function (e) {
                const val = e.target.value;
                vm.form.regionKey = val === 'all' ? '' : val;
                vm.reloadTable()
            });

            $('#keyword').keyup(function (e) {
                if (e.keyCode == 13) {
                    vm.reloadTable()
                }
            });

            $('#searchbtn').click(function (e) {
                vm.table.ajax.reload(null, false);
            });


        });

    },

});

app.use(ElementPlus)
app.mount('#wmis-app')