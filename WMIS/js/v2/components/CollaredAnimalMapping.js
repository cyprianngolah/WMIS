
const CollaredAnimalMapping = {
    template: "#mapping-tab-template",

    components: {
        BaseButton,
        BaseInput,
        GoogleMap,
        //GMap,
    },
    props: {
        animal_id: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            table: null,
            selectedPass: null,
            updatePassForm: null,
            editArgosPassModal: null,
            statusFilterOptions: [
                { key: -1, name: 'All Statuses' },
                { key: 0, name: 'Warnings' },
                { key: 1, name: 'Rejected' }
            ],
            daysFilterOptions: [
                { key: -1, name: 'All Days' },
                { key: 7, name: 'Last Week' },
                { key: 30, name: 'Last Month' },
                { key: 90, name: 'Last Quarter' }
            ],
            passStatuses: [],
            filters: {
                passStatuses: null,
                statusFilterKey: -1,
                daysFilterKey: -1,
                showGpsOnly: true,
            },

            argosPasses: []
        }
    },

    watch: {
        filters: {
            deep: true,
            handler(newVal) {
                this.refreshTable()
            }
        },

        selectedPass(newVal) {
            if (!newVal) {
                this.updatePassForm = null
            } else {
                this.updatePassForm = JSON.parse(JSON.stringify(newVal))
            }
        }
    },

    methods: {
        getArgosPassStatuses() {
            axios.get("/api/argos/passStatuses?startRow=0&rowCount=500")
                .then(response => {
                    this.passStatuses = response.data.data
                }).catch(error => console.log(error))
        },

        refreshTable() {
            this.table.ajax.reload(null, true)
        },

       downloadShapeFile () {
           window.open("/api/argos/passesShapeFile?startRow=0&rowCount=20000&collaredAnimalId=" + this.animal_id, '_self');
        },

       downloadKmlFile () {
           window.open("/api/argos/passesKmlFile?startRow=0&rowCount=20000&collaredAnimalId=" + this.animal_id, '_self');
        },
        downloadExcelFile() {
            window.open("/api/argos/passesExcelFile?startRow=0&rowCount=200000&collaredAnimalId=" + this.animal_id, '_self');
        },
        formatDate(dte) {
            if (!dte) return null;
            return moment(dte).format('L h:mm a')
        },

        handleSelectedPass(payload) {
            if (payload) {
                this.selectedPass = JSON.parse(JSON.stringify(payload))

                // highlight the record in the table
                let row = this.table.rows(function (idx, data, node) {
                    return data.key == payload.key;
                });
                if (row) {
                    this.table.$('tr.highlightPassRow').removeClass('highlightPassRow');
                    $(row.nodes()).addClass('highlightPassRow');
                }
            } else {
                this.selectedPass = null
            }
        },

        updatePass() {
            if (!this.updatePassForm) return;
            axios.post(`/api/argos/pass/save`, {
                argosPassId: this.updatePassForm.key,
                argosPassStatusId: this.updatePassForm.argosPassStatus.key,
                comment: this.updatePassForm.comment,
                isLastValidLocation: this.updatePassForm.isLastValidLocation
            }).then(() => {
                this.editArgosPassModal.hide();
                this.refreshTable();
                this.selectedPass = null;
            }).catch(error => console.log(error))
        },

        clearPassStatus() {
            if (!this.updatePassForm) return;
            axios.post(`/api/argos/pass/save`, {
                argosPassId: this.updatePassForm.key,
                argosPassStatusId: 0,
                comment: this.updatePassForm.comment,
            }).then(() => {
                this.editArgosPassModal.hide();
                this.refreshTable();
                this.selectedPass = null;
            }).catch(error => console.log(error));
        },

        
    },

    mounted() {
        this.editArgosPassModal = new bootstrap.Modal(document.getElementById("editArgosPassModal"), {
            keyboard: false,
            backdrop: 'static'
        });

        document.getElementById('editArgosPassModal').addEventListener('hidden.bs.modal', () => {
            this.selectedPass = null;
            this.table.$('tr.highlightPassRow').removeClass('highlightPassRow');
        });
    },

    created() {
        this.getArgosPassStatuses()
        const vm = this;

        $(document).ready(function () {
            vm.table = $("#locationTable").DataTable({
                "pageLength": 100,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": "single",
                "scrollY": "500px",
                "scrollCollapse": true,
                "responsive": true,
                "ajax": {
                    "url": "/api/argos/passes/",
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
                            collaredAnimalId: vm.animal_id,
                        }

                        if (vm.filters.statusFilterKey >= 0) options.statusFilter = vm.filters.statusFilterKey;
                        if (vm.filters.daysFilterKey >= 0) options.daysFilter = vm.filters.daysFilterKey;
                        if (vm.filters.showGpsOnly == true) options.showGpsOnly = vm.filters.showGpsOnly;
                        
                        return options;
                    },
                    "dataSrc": function (json) {
                        json.draw = vm.draw;
                        json.recordsTotal = json.resultCount;
                        json.recordsFiltered = json.resultCount;
                        vm.argosPasses = json.data
                        return json.data
                    },
                },
                "dom": '<"top">rt<"bottom"ip><"clear">',
                "createdRow": function (row, data, dataIndex) {
                    let hasPassStatus = data.argosPassStatus && data.argosPassStatus.key > 0;
                    if (hasPassStatus) {
                        let isRejected = data.argosPassStatus.isRejected;
                        if (!isRejected) {
                            $(row).addClass('warning-status');
                        } else if (hasPassStatus && isRejected) {
                            $(row).addClass('rejected-status');
                        }
                    }
                },
                "columns": [
                    {
                        "data": "locationDate",
                        "render": function (data, type, row) {
                            var date = moment(data, moment.ISO_8601).local().format('L h:mm a');
                            return date;
                        }
                    },
                    { "data": "latitude" },
                    { "data": "longitude" },
                    { "data": "locationClass" },
                    {
                        "data": "isLastValidLocation",
                        render: function (data, type, row) {
                            return data ? 'Yes' : '';
                        }
                    },
                    { "data": "cepRadius" },
                    { "data": "argosPassStatus.name" },
                    { "data": "comment" },
                    {
                        "data": null,
                        "width": "60px",
                        "className": "editRow text-center",
                        "render": function (data, type, row, meta) {
                            return `<span class="el-icon-edit editbtn h6 cursor-pointer" data-row-index=${meta.row}></span>`
                        }
                    }
                ],
            });

            $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
                $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
            });

            $('#locationTable tbody').on('click', 'tr', function () {
                vm.table.$('tr.highlightPassRow').removeClass('highlightPassRow')
                let row = vm.table.row(this).data();
                if (row) {
                    vm.selectedPass = JSON.parse(JSON.stringify(row));
                    $(this).addClass('highlightPassRow');
                }
            });

            $("#locationTable").on('click', 'td.editRow span', function (e) {
                let rowIndex = $(e.target).data().rowIndex
                const rowData = vm.table.row(rowIndex).data();
                if (rowData) {
                    vm.selectedPass = JSON.parse(JSON.stringify(rowData))
                    vm.editArgosPassModal.show();
                }
            })

        });
    },
}