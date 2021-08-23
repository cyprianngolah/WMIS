const app = Vue.createApp({
    components: {
        BaseInput,
        BaseDropdownSelect,
        ProjectSurveys
    },

    data() {
        return {
            statuses: [],
            projectLeads: [],
            regions: [],
            surveyTypes: [],
            key: "",
            form: {
                
            },

            
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
        }
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
            ]).then(axios.spread((...responses) => {
                this.form = responses[0].data
                this.statuses = responses[1].data.data
                this.projectLeads = responses[2].data.data
                this.regions = responses[3].data.data
                this.surveyTypes = responses[4].data.data
            })).catch(error => {
                console.log(error)
            })
        },

        setKey() {
            this.key = WMIS.getKey("#projectKey")
        },
    },

    mounted() {
        this.setKey()
        this.getData()
    },

    created() {
        
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')