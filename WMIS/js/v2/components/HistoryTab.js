
const HistoryTab = {
    components: {
        BaseInput,
        BaseButton
    },
    props: {
        parent_table_key: {
            type: [String, Number],
            required: true
        },
        parent_table_name: {
            type: String,
            required: true
        }
    },
    template: '#history-tab-template',

    data() {
        return {
            table: null,
            draw: 1,
            formModal: null,
            filterValue: null,
            filterOptions: [],
            form: {
                key: "",
                item: "",
                value: "",
                changeDate: "",
                comment: ""
            }
        }
    },

    watch: {
        filterValue(newVal) {
            this.reloadTable()
        }
    },

   
    methods: {
        reloadTable() {
            this.table.ajax.reload(null, false);
        },

        handleSave() {
            axios.post('/api/history/', this.form)
                .then(_ => {
                    this.reloadTable();
                    this.formModal.hide();
                }).catch(error => {
                    console.log(error)
                });
        },

        populateHistoryFilters() {
            axios.get(`/api/history/filterTypes?parentTableKey=${this.parent_table_key}&parentTableName=${this.parent_table_name}`)
                .then(response => {
                    this.filterOptions = response.data.map(d => d.item)
                }).catch(error => {
                    console.log(error)
                });
        }
    },

    mounted() {
        this.populateHistoryFilters()
        this.formModal = new bootstrap.Modal(document.getElementById("historyEditModal"), {
            keyboard: false,
            backdrop: 'static'
        });

        document.getElementById('historyEditModal').addEventListener('hidden.bs.modal', () => {
            this.form = {
                key: "",
                item: "",
                value: "",
                changeDate: "",
                comment: ""
            };
        });
    },
    created() {
        const vm = this;

        $(document).ready(function () {
            vm.table = $("#historyTable").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": false,
                "ajax": {
                    "url": "/api/history/",
                    "data": function (d, settings) {
                        let sortDirection = null;
                        let sortedColumnName = null;

                        if (settings.aaSorting.length > 0) {
                            sortDirection = settings.aaSorting[0][1];
                            let sortedColumnIndex = settings.aaSorting[0][0];
                            sortedColumnName = settings.aoColumns[sortedColumnIndex].mData;
                        }

                        vm.draw = settings.iDraw

                        const options = {
                            startRow: d.start,
                            rowCount: d.length,
                            sortBy: sortedColumnName,
                            sortDirection: sortDirection,
                            i: settings.iDraw,
                            table: vm.parent_table_name,
                            key: vm.parent_table_key
                        }

                        if (vm.filterValue) {
                            options.filter = vm.filterValue
                        }

                        return options;
                    },
                    "dataSrc": function (json) {
                        json.draw = vm.draw;
                        json.recordsTotal = json.resultCount;
                        json.recordsFiltered = json.resultCount;

                        return json.data
                    },
                },
                "dom": '<"top">rt<"bottom"ip><"clear">',
                "columns": [
                    {
                        "data": "changeDate",
                        "render": function (data, type, row) {
                            var date = moment(data, moment.ISO_8601).local().format('L h:mm a');
                            return date;
                        }
                    },
                    { "data": "item" },
                    { "data": "value" },
                    { "data": "changeBy" },
                    { "data": "comment" },
                    {
                        "data": null,
                        "width": "60px",
                        "className": "editHistory",
                        "render": function (data, type, row, meta) {
                            return `<span class='text-primary cursor-pointer' data-row-index=${meta.row}>EDIT</span>`
                        }
                    }
                ],
            });

            $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
                $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
            });

            $("#historyTabTemplate").on('click', 'td.editHistory span', function (event) {
                let rowIndex = $(event.target).data().rowIndex
                const rowData = vm.table.row(rowIndex).data();
                vm.form.key = rowData.key;
                vm.form.item = rowData.item;
                vm.form.value = rowData.value;
                vm.form.changeDate = rowData.changeDate;
                vm.form.comment = rowData.comment;

                vm.formModal.show();
            });

        });
    },

}