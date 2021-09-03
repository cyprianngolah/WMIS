
const initialCollaborator = {
    key: 0,
    name: "",
    organization: "",
    email: "",
    phoneNumber: ""
}

const app = Vue.createApp({
    components: {
        BaseInput,
        BaseDropdownSelect,
        ProjectSurveys,
        BaseButton,
        HistoryTab,
        ProjectSites,
    },

    data() {
        return {
            statuses: [],
            projectLeads: [],
            projectCollaborators: [],
            allCollaborators: [],
            editCollaboratorFormModal: null,
            addCollaboratorFormModal: null,
            editAdministratorsModal: null,
            currentProjectUsers: [],
            allProjectUsers: [],
            currentProjectAdmins: [],
            regions: [],
            surveyTypes: [],
            key: "",
            form: {},
            collaboratorForm: {},
            selectedCollaborator: "",
            editingCollaborator: false,
            initialData: ""
        }
    },

    computed: {
        lastUpdated() {
            return this.form.lastUpdated ? moment.utc(this.form.lastUpdated, moment.ISO_8601).local().format('L h:mm a') : ""
        },

        disabled() {
            return !this.isDirty || Object.keys(this.form).length == 0;
        },

        isDirty() {
            return this.initialData !== JSON.stringify(this.form)
        },

        /*computed: {
            adminsList() {
                const lst = this.currentProjectAdmins.map(p => p.name)
                return lst.join(", ");
            }
        }*/
    },

    methods: {
        getData() {
            this.setKey()
            axios.all([
                axios.get(`/api/Project/${this.key}`),
                axios.get('/api/project/statuses/?startRow=0&rowCount=500'),
                axios.get('/api/person/projectLeads?startRow=0&rowCount=500'),
                axios.get('/api/leadregion?startRow=0&rowCount=500'),
                axios.get('/api/project/surveytype?startRow=0&rowCount=500&includeAllOption=true'),
                axios.get(`/api/person/projectUsers/${this.key}`),
                axios.get(`/api/person/applicationUsers?keywords=&startRow=0&rowCount=1000`),
                axios.get(`/api/person/projectAdmins`)
            ]).then(axios.spread((...responses) => {
                this.form = responses[0].data
                this.initialData = JSON.stringify(responses[0].data)
                this.statuses = responses[1].data.data
                this.projectLeads = responses[2].data.data
                this.regions = responses[3].data.data
                this.surveyTypes = responses[4].data.data
                this.currentProjectUsers = responses[5].data.data.map(u => u.key)
                this.allProjectUsers = responses[6].data.data.filter(p => p.name != "").map(u => { return {key: u.key, name: u.name}})
                const adminList = responses[7].data.data.map(l => l.name)
                this.currentProjectAdmins = adminList.join(', ')
            })).catch(error => {
                console.log(error)
            })
        },
        setInitialCollaborator() {
            this.collaboratorForm = { ...initialCollaborator, ...{ projectId: this.key } }
        },
        getProjectCollaborators() {
            axios.all([
                axios.get(`/api/Collaborator/project/${this.key}`),
                axios.get('/api/collaborator/?startRow=0&rowCount=500&keyword='),
            ]).then(axios.spread((...responses) => {
                this.projectCollaborators = responses[0].data
                this.allCollaborators = responses[1].data.data
            })).catch(error => console.log(error))
        },

        removeCollaborator(key) {
            this.$confirm('Are you sure you want to delete this record?')
                .then(_ => {
                    const filtered = this.projectCollaborators.filter(p => p.key != key).map(r => r.key);
                    axios.put(`/api/collaborator/project`, {
                        projectId: this.key,
                        collaboratorIds: filtered
                    }).then(_ => this.getProjectCollaborators())
                    .catch(error => console.log(error))
                })
                .catch(_ => { console.log("action cancelled") });
        },

        addExistingCollaborator() {
            const _collaborators = this.projectCollaborators.map(p => p.key)
            const payload = [..._collaborators, ...[this.selectedCollaborator]]
            axios.put(`/api/collaborator/project`, {
                projectId: this.key,
                collaboratorIds: payload
            }).then(_ => {
                this.getProjectCollaborators()
                this.selectedCollaborator = "";
                this.addCollaboratorFormModal.hide();
            }).catch(error => console.log(error))
        },

        createCollaboratorModal() {
            this.setInitialCollaborator();
            this.editingCollaborator = false;
            this.editCollaboratorFormModal.show();
        },
        editCollaborator(record) {
            this.collaboratorForm = {
                projectId: this.key,
                key: record.key,
                name: record.name,
                organization: record.organization,
                email: record.email,
                phoneNumber: record.phoneNumber
            }
            this.editingCollaborator = true
            this.editCollaboratorFormModal.show()
        },

        handleCollaboratorSave() {
            const verb = this.editingCollaborator ? 'put' : 'post';
            axios[verb](`/api/collaborator`, this.collaboratorForm)
                .then(_ => {
                    this.getProjectCollaborators();
                    this.setInitialCollaborator();
                    this.editingCollaborator = false;
                    this.editCollaboratorFormModal.hide();
                });
        },

        updateProjectUsers() {
            const payload = {
                key: this.key,
                userIds: this.currentProjectUsers
            }

            axios.post('/api/project/updateUsers', payload)
                .then(_ => {
                    this.editAdministratorsModal.hide();
                    this.getData();
                })
        },
        

        setKey() {
            this.key = WMIS.getKey("#projectKey")
        },

        saveUpdate() {
            this.loading = true
            axios.put(`/api/Project/`, this.form)
                .then(_ => {
                    this.$message({
                        message: 'Record Updated Successfully!',
                        type: 'success'
                    });
                }).catch(error => console.log(error))
                .finally(() => {
                    setTimeout(() => this.loading = false, 1000)
                });
        }
    },

    mounted() {
        this.setKey()
        this.getData()
        this.getProjectCollaborators()

        this.editCollaboratorFormModal = new bootstrap.Modal(document.getElementById("editCollaboratorFormModal"), {
            keyboard: false,
            backdrop: 'static'
        });

        this.addCollaboratorFormModal = new bootstrap.Modal(document.getElementById("addCollaboratorFormModal"), {
            keyboard: false,
            backdrop: 'static'
        });

        this.editAdministratorsModal = new bootstrap.Modal(document.getElementById("editAdministratorsModal"), {
            keyboard: false,
            backdrop: 'static'
        });

        document.getElementById('editCollaboratorFormModal').addEventListener('hidden.bs.modal', () => {
            this.setInitialCollaborator();
            this.editingCollaborator = false;
        });

        this.setInitialCollaborator()
    },

    created() {
        // initialize Collars Data Table
        const vm = this;

        $(document).ready(function () {
            vm.table = $("#collarsTable").DataTable({
                "pageLength": 25,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": false,
                "ajax": {
                    "url": `/api/project/${vm.key}/collars`,
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
                    { "data": "animalId" },
                    { "data": "animalStatus.name" },
                    { "data": "herdPopulation.name" },
                    { "data": "animalSex.name" },
                    { "data": "collarStatus.name" },
                    { "data": "collarState.name" },
                    {
                        "data": "key",
                        "render": function (data, type, full, meta) {
                            return '<a href="/CollaredAnimal/Edit/' + data + '">View/Edit</a>';
                        },
                        "orderable": false
                    },
                    /*{
                        "data": null,
                        "width": "60px",
                        "className": "editHistory",
                        "render": function (data, type, row, meta) {
                            return `<span class='text-primary cursor-pointer' data-row-index=${meta.row}>EDIT</span>`
                        }
                    }*/
                ],
            });

            $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
                $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
            });

            /*$("#historyTabTemplate").on('click', 'td.editHistory span', function (event) {
                let rowIndex = $(event.target).data().rowIndex
                const rowData = vm.table.row(rowIndex).data();
                vm.form.key = rowData.key;
                vm.form.item = rowData.item;
                vm.form.value = rowData.value;
                vm.form.changeDate = rowData.changeDate;
                //vm.form.changeDate = moment(rowData.changeDate, moment.ISO_8601).format('L h:mm a');
                vm.form.comment = rowData.comment;

                vm.formModal.show();
            });*/

        });
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')