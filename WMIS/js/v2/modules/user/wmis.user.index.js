
const app = Vue.createApp({
    mixins: [GlobalMixin],
    components: {
        BaseButton,
        BaseLinkButton,
        BaseInput
    },
    data() {
        return {
            table: null,
            draw: 1,
            selectedKey: null,
            newUserModal: null,
            form: {
                keywords: '',
            },

            newUserForm: {
                username: "",
                name: "",
            },

        }
    },

    computed: {
        isSelected() {
            return this.selectedKey !== null && this.selectedKey !== undefined;
        },

        disableCreate() {
            return this.newUserForm.username == "" || this.newUserForm.name.trim() == ""
        }
    },

    watch: {
        draw() {
            this.selectedKey = null;
        }
    },


    methods: {
        reloadTable() {
            this.table.ajax.reload(null, false);
        },

        handleCreateUser() {
            axios.post('/api/person/', this.newUserForm)
                .then(response => {
                    window.location.href = "/User/Edit/" + response.data;
                }).catch(error => console.log(error))
        }
    },

    mounted() {
        this.newUserModal = this.createModal("newUserModal");
    },

    created() {
        const vm = this;

        $(document).ready(function () {
            vm.table = $("#userTable").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
               // "processing": true,         
                "serverSide": true,
                "select": 'single',
                "ajax": {
                    "url": "/api/person/applicationUsers",
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
                    { "data": "name" },
                    { "data": "username" },
                    {
                        "data": "roles",
                        "render": function (data, type, full, meta) {
                            if (data.length > 0) {
                                const r = data.map(d => d.name).join(", ");
                                return r;
                            } else {
                                return "";
                            }
                        }
                    }
                ],
            });

            $('#userTable tbody').on('click', 'tr', function () {
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