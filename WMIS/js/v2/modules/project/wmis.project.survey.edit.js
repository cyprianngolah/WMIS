const app = Vue.createApp({
    components: {
        BaseInput,
        BaseQSelect,
        BaseQSpeciesSearch,
        BaseButton,
        SurveyObservations,
        HistoryTab,
        FileTab,
        ElementSpeciesSelect
    },

    data() {
        return {
            key: null,
            form: {},
            project: null,
            loading: false,
            observationUploads:[]
        }
    },

    computed: {
        disabled() {
            return !this.form.targetSpecies
                || Object.keys(this.form.targetSpecies).length === 0
                || this.form.targetSpecies.key === 0
                || this.loading
        },
        hasObservations() {
            return this.observationUploads.length > 0
        }
    },


    methods: {
        getData() {
            this.setKey()
            axios.all([
                axios.get('/api/project/surveytype?startRow=0&rowCount=500&includeAllOption=false'),
                axios.get('/api/surveytemplate?startRow=0&rowCount=500'),
                axios.get(`/api/Project/Survey/${this.key}`),
                axios.get(`/api/observation/project/${this.key}`),
            ]).then(axios.spread((...responses) => {
                this.surveyTypes = responses[0].data.data
                this.surveyTemplates = responses[1].data.data
                this.form = responses[2].data
                this.observationUploads = responses[3].data
            })).then(() => {
                this.form.startDate = this.form.startDate ? moment(this.form.startDate, moment.ISO_8601).format('YYYY-MM-DD') : null
                this.getProjectInfo()
            })
            .catch(error => {
                console.log(error)
            })
        },

        getProjectInfo() {
            axios.get(`/api/Project/${this.form.projectKey}`)
                .then(response => {
                    this.project = response.data
                }).catch((error) => console.log(error))
        },


        submit() {
            
            this.setKey()
            this.loading = true
            if (this.form.startDate) {
                this.form.startDate = moment(this.form.startDate, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ss.SSSS')
            }
            axios.put(`/api/Project/Survey`, this.form)
                .then(() => {
                    this.getData()
                    
                }).catch(error => console.log(error))
                .finally(() => {
                    setTimeout(() => {
                        this.loading = false
                        this.$q.notify({
                            message: 'Record Updated!', type: 'positive', multiLine: true })
                    }, 1000)
                })
        },

        setKey() {
            this.key = WMIS.getKey("#surveyKey")
        }

    },

    mounted() {
        this.setKey()
        this.getData()
    }

})

app.use(ElementPlus)
app.use(Quasar)
app.mount('#wmis-app')