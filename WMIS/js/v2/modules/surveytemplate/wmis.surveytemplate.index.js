
const app = Vue.createApp({
    mixins: [GlobalMixin],

    components: {
        BaseButton,
        BaseLinkButton,
        BaseInput
    },
    data: function() {
        return {
            table: null,
            draw: 1,
            selectedKey: null,
            newTemplateModal: null,
            form: {
                keywords: '',
            },

            newTemplateForm: {
                surveyTemplateId: 0,
                name: "",
            },

        }
    },

    computed: {
        isSelected: function() {
            return this.selectedKey !== null && this.selectedKey !== undefined;
        },

        disableCreate: function() {
            return this.newTemplateForm.name.trim() == ""
        }
    },

    watch: {
        draw: function() {
            this.selectedKey = null;
        }
    },


    methods: {
        reloadTable: function() {
            this.table.ajax.reload(null, false);
        },

        handleCreateTemplate: function() {
            axios.post('/api/surveytemplate/', this.newTemplateForm)
                .then(response => {
                    window.location.href = "/SurveyTemplate/edit/" + response.data;
                }).catch(error => console.log(error))
        }
    },

    mounted: function() {
        this.newTemplateModal = this.createModal("newTemplateModal");
    },

    created: function() {
        const vm = this;

        $(document).ready(function () {
            vm.table = $("#templateTable").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": 'single',
                "ajax": {
                    "url": "/api/surveytemplate/",
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
                    { "data": "projectCount" },
                    { "data": "createdBy" },
                    {
                        "data": "dateCreated", // Date Created
                        "render": function (data, type, row) {
                            var date = moment(data, moment.ISO_8601).local().format('L h:mm a');
                            return date;
                        }
                    }
                ],
            });

            $('#templateTable tbody').on('click', 'tr', function () {
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