const app = Vue.createApp({
    mixins: [GlobalMixin],
    components: {
        BaseInput,
        BaseButton,
        BaseLinkButton,
        ElementSpeciesSelect
    },

    data: function() {
        return {
            key: null,
            form: {}
        }
    },

    computed: {
        disabled: function() {
            return !this.form.targetSpecies
                || Object.keys(this.form.targetSpecies).length === 0
                || this.form.targetSpecies.key === 0
        }
    },

    methods: {
        getData: function() {
            this.setKey()
            this.showLoading()
            axios.all([
                axios.get('/api/project/surveytype?startRow=0&rowCount=500&includeAllOption=false'),
                axios.get('/api/surveytemplate?startRow=0&rowCount=500'),
                axios.get('/api/Project/Survey/0'),
            ]).then(axios.spread((...responses) => {
                this.surveyTypes = responses[0].data.data
                this.surveyTemplates = responses[1].data.data
                this.form = responses[2].data
            })).then(() => {
                this.form.projectKey = this.key;
            })
            .catch(error => {
                console.log(error)
            })
                .finally(() => setTimeout(() => {
                    this.hideLoading()
                }, 200))
        },

        submit: function() {
            if (this.disabled) {
                this.$message.error('Missing required data!');
                return;
            }
            this.setKey()
            axios.post(`/api/Project/Survey`, this.form)
                .then(_ => {
                    window.location.href = "/Project/Edit/" + this.key + "/#surveysTab";
                }).catch(error => console.log(error))
        },

        setKey: function() {
            this.key = this.getKey("#projectKey")
        }

    },

    mounted: function() {
        this.setKey()
        this.getData()
    }
    
})

app.use(ElementPlus);
app.mount('#wmis-app')