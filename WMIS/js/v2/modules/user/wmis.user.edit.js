
const app = Vue.createApp({
    mixins: [GlobalMixin, DataTableMixin],
    components: {
        BaseButton,
        BaseLinkButton,
        BaseInput,
        HistoryTab
    },
    data: function() {
        return {
            form: {
                username: '',
                name: '',
                jobTitle: '',
                key: 0,
                projects: [],
                roles: []
            },

            selectedProjectIds: [],
            selectedRoleIds: [],

            roles: [],
            projects: []
        }
    },

    computed: {
        disableSave: function() {
            return this.form.username == "" || this.form.name.trim() == ""
        },
    },

    watch: {
        selectedProjectIds: function(newVal) {
            if (newVal.length == 0) {
                this.form.projects = []
            } else {
                this.form.projects = this.projects.filter(p => this.selectedProjectIds.includes(p.key))
            }
        },
        selectedRoleIds: function(newVal) {
            if (newVal.length == 0) {
                this.form.roles = []
            } else {
                this.form.roles = this.roles.filter(r => this.selectedRoleIds.includes(r.key))
            }
        }
    },

    methods: {
        reloadTable: function() {
            this.table.ajax.reload(null, false);
        },

        getRoles: function() {
            axios.get('/api/person/userRoles')
                .then(response => this.roles = response.data.data)
                .catch(error => console.log(error))
        },

        getProjects: function() {
            axios.get('/api/project?keyword=&startRow=0&rowCount=10000')
                .then(response => this.projects = response.data.data)
                .catch(error => console.log(error))
        },

        getUser: function() {
            this.showLoading();
            this.setKey();
            axios.get(`/api/person/${this.form.key}`)
                .then(response => {
                    this.form = response.data
                    this.selectedRoleIds = response.data.roles.map(r => r.key)
                    this.selectedProjectIds = response.data.projects.map(p => p.key)
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.hideLoading()
                }, 2000))
                
        },

        handleUpdateUser: function() {
            axios.put('/api/person/', this.form)
                .then(_ => {
                    window.location.href = "/User";
                }).catch(error => console.log(error))
        },

        setKey: function() {
            this.form.key = this.getKey("#userKey");
        }
    },

    mounted: function() {
        this.getUser()
    },

    created: function() {
        this.getRoles();
        this.getProjects();
        this.setKey();
    },

});

app.use(ElementPlus)
app.mount('#wmis-app')