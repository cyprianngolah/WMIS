const app = Vue.createApp({
    components: {
        BaseInput,
        BaseButton,
    },

    data() {
        return {
            statusRanks: [],
            cosewicStatuses: [],
            nwtSarcAssessments: [],
            initialData: "",
            form: {}
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
            })
        },


        submit() {
            if (this.disabled) return;
            axios.put('/api/BioDiversity/Decision', this.form)
                .then(response => {
                    this.initialData = JSON.stringify(this.form)
                    window.location.href = "/Biodiversity/";
                }).catch(error => console.log(error))
        },

        
    },

    created() {
        this.getData()

        $(window).bind('beforeunload', () => {
            if (this.isDirty) {
                return "You have unsaved changes, are you sure you want to continue without saving?";
            }
        });
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')