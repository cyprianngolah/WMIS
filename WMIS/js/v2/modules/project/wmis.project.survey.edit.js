﻿const app = Vue.createApp({
    mixins: [GlobalMixin, DataTableMixin],
    components: {
        BaseInput,
        BaseLinkButton,
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
            this.showLoading();
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
                this.getProjectInfo()
            })
            .catch(error => {
                console.log(error)
            })
                .finally(() => setTimeout(() => {
                    this.hideLoading()
                }, 2000))
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
           
            axios.put(`/api/Project/Survey`, this.form)
                .then(() => {
                    this.getData()

                    setTimeout(() => {
                        this.$message.success({
                            message: 'Record Updated!', type: 'positive', multiLine: true
                        })
                    }, 1100)
                    
                }).catch(error => console.log(error))
                .finally(() => {
                    setTimeout(() => {
                        this.loading = false
                    }, 1000)
                })
        },

        setKey() {
            this.key = this.getKey("#surveyKey")
        }

    },

    mounted() {
        this.setKey()
        this.getData()
    }

})

app.use(ElementPlus)
app.mount('#wmis-app')