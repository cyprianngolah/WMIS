const app = Vue.createApp({
    components: {
        BaseInput,
        ElementSpeciesSelect
    },

    data() {
        return {
            key: null,
            form: {},
            project: null
        }
    },

    computed: {
        disabled() {
            return !this.form.targetSpecies
                || Object.keys(this.form.targetSpecies).length === 0
                || this.form.targetSpecies.key === 0
        }
    },

    methods: {
        getData() {
            this.setKey()
            axios.all([
                axios.get('/api/project/surveytype?startRow=0&rowCount=500&includeAllOption=false'),
                axios.get('/api/surveytemplate?startRow=0&rowCount=500'),
                axios.get(`/api/Project/Survey/${this.key}`),
            ]).then(axios.spread((...responses) => {
                this.surveyTypes = responses[0].data.data
                this.surveyTemplates = responses[1].data.data
                this.form = responses[2].data
            })).then(() => {
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
            if (this.disabled) {
                this.$message.error('Missing required data!');
                return;
            }
            this.setKey()
            axios.put(`/api/Project/Survey`, this.form)
                .then(response => {
                    console.log("Saved")
                    this.getProjectInfo()
                }).catch(error => console.log(error))
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

app.use(ElementPlus);
app.mount('#wmis-app')