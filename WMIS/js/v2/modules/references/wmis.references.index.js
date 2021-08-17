﻿
const app = Vue.createApp({
    data() {
        return {
            table: null,
            draw: 1,
            selectedKey: null,
            form: {
                yearFilter: "",
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

    mounted() {
        WMIS.loadAndInitializeSelect2($("#year"), "/api/references/years", "Year");
    },

    created() {
        const vm = this;
        document.title = "References";

        $(document).ready(function () {
            vm.table = $("#references").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": 'single',
                "ajax": {
                    "url": "/api/references",
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
                            keywords: vm.form.keywords,
                            yearFilter: vm.form.yearFilter
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
                    { "data": "code" },
                    { "data": "author" },
                    { "data": "year" },
                    { "data": "title" },
                    { "data": "editionPublicationOrganization" },
                    { "data": "volumePage" },
                    { "data": "publisher" },
                    { "data": "city" },
                    { "data": "location" }
                ],
            });

            $('#references tbody').on('click', 'tr', function () {
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

            $('#year').change(function (e) {
                const val = e.target.value;
                vm.form.yearFilter = val === 'all' ? '' : val;
                vm.table.search(vm.form.yearFilter).draw();
            });

            $('#searchbtn').click(function (e) {
                vm.table.search(vm.form.keywords).draw();
            });
        });

    },

});

app.mount('#wmis-app')