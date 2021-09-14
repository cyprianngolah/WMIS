
const FileTab = {
    mixins: [GlobalMixin],

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
    template: '#file-tab-template',

    data: function() {
        return {
            table: null,
            draw: 1,
            formModal: null,
            form: {
                name: '',
                path: '',
                parentTableName: this.parent_table_name,
                parentTableKey: this.parent_table_key,
            },

            isEditing: false
        }
    },

    computed: {
        canSave: function() {
            return !!this.form.name && !!this.form.path;
        }
    },


    methods: {
        showCreateModal: function() {
            this.form.name=""
            this.form.path=""
            this.formModal.show();
        },
        handleDelete: function(id) {
            this.$confirm('Are you sure you want to delete this record?')
                .then(_ => {
                    axios.delete(`/api/file/${id}`)
                        .then(_ => {
                            this.reloadTable();
                        })
                })
                .catch(_ => { console.log("action cancelled") });
        },

        handleCreate: function() {
            if (this.isEditing) return;
            this.form.parentTableName = this.parent_table_name
            this.form.parentTableKey = this.parent_table_key
            axios.put(`/api/file`, this.form)
                .then(_ => {
                    this.reloadTable()
                    this.formModal.hide();
                })
                .catch(error => console.log(error))
        },

        handleUpdate: function() {
            if (!this.isEditing) return;
            axios.post(`/api/file`, this.form)
                .then(_ => {
                    this.reloadTable()
                    this.formModal.hide();
                })
                .catch(error => console.log(error))
        },

        reloadTable: function() {
            this.table.ajax.reload(null, false);
        },

        resetForm: function() {
            this.form = {
                name: "",
                key: "",
                path: ""
            };
            this.isEditing = false;
        }
    },

    mounted: function() {
        this.formModal = this.createModal("fileInputModal");
    },

    created: function() {
        const vm = this;

        $(document).ready(function () {
            vm.table = $("#fileTable").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": false,
                "ajax": {
                    "url": "/api/file/",
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
                            table: vm.parent_table_name,
                            key: vm.parent_table_key
                        }

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
                    { "data": "name" },
                    {
                        "data": "path",
                        "render": function (data, type, row, meta) {
                            return '<a href="' + data + '" target="_blank">' + data + '</a>';
                        }
                    },
                    {
                        "data": null,
                        "width": "60px",
                        "className": "editFile",
                        "render": function (data, type, row, meta) {
                            return `<span class='text-primary cursor-pointer' data-row-index=${meta.row}>EDIT</span>`
                        }
                    },
                    {
                        "data": "key",
                        "className": "deleteFile",
                        "width": "60px",
                        "render": function (data, type, row) {
                            return `<span class='text-danger cursor-pointer' data-row-key=${data}>DELETE</span>`
                        }
                    }
                ],
            });

            $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
                $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
            });

            $("#fileTabTemplate").on('click', 'td.deleteFile span', function (event) {
                let rowKey = $(event.target).data().rowKey
                vm.handleDelete(rowKey);
            });

            $("#fileTabTemplate").on('click', 'td.editFile span', function (event) {
                let rowIndex = $(event.target).data().rowIndex
                const rowData = vm.table.row(rowIndex).data();
                vm.form.key = rowData.key;
                vm.form.name = rowData.name;
                vm.form.path = rowData.path;
                vm.isEditing = true;
                vm.formModal.show();
            });

        });
    },

}