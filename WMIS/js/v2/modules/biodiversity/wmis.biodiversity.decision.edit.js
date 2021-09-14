const app = Vue.createApp({
    mixins: [GlobalMixin],

    components: {
        BaseInput,
        BaseLinkButton,
        BaseButton,
    },

    data: function() {
        return {
            statusRanks: [],
            cosewicStatuses: [],
            nwtSarcAssessments: [],
            initialData: "",
            form: {}
        }
    },

    computed: {
        lastUpdated: function() {
            return this.form.lastUpdated ? moment.utc(this.form.lastUpdated, moment.ISO_8601).local().format('L h:mm a') : ""
        },

        disabled: function() {
            return !this.isDirty || Object.keys(this.form).length == 0;
        },

        isDirty: function() {
            return this.initialData !== JSON.stringify(this.form)
        }


    },

    methods: {
        getData: function() {
            this.showLoading();
            const key = window.location.pathname.split('/').pop();
            axios.all([
                axios.get('/api/statusrank?startRow=0&rowCount=500'),
                axios.get('/api/cosewicstatus?startRow=0&rowCount=500'),
                axios.get('/api/nwtsarcassessment?startRow=0&rowCount=500'),
                axios.get(`/api/BioDiversity/Decision/${key}`)
            ]).then(axios.spread((...responses) => {
                this.statusRanks = responses[0].data.data
                this.cosewicStatuses = responses[1].data.data
                this.nwtSarcAssessments = responses[2].data.data
                this.form = responses[3].data
                this.initialData = JSON.stringify(responses[3].data)
            })).catch(error => {
                console.log(error)
            }).finally(() => setTimeout(() => {
                this.hideLoading()
            }, 1500))
        },


        submit: function() {
            if (this.disabled) return;
            this.showLoading()
            axios.put('/api/BioDiversity/Decision', this.form)
                .then(_ => {
                    this.initialData = JSON.stringify(this.form)
                    window.location.href = "/Biodiversity/";
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.hideLoading()
                }, 1500))
        },

        
    },

    created: function() {
        this.getData()
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')