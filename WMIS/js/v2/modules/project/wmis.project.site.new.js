
const app = Vue.createApp({
    mixins: [GlobalMixin],
    components: {
        BaseInput,
        BaseButton,
    },

    data: function() {
        return {
            key: "",
            form: {
                aspect: null,
                cliffHeight: null,
                comments: "",
                dateEstablished: null,
                habitat: null,
                initialObserver: null,
                latitude: null,
                longitude: null,
                map: null,
                name: "",
                nearestCommunity: null,
                nestHeight: null,
                nestType: null,
                projectKey: null,
                projectName: "",
                reference: null,
                reliability: null,
                siteNumber: "",
            },
            loading: false
        }
    },

    computed: {
        disabled: function() {
            if (Object.keys(this.form).length == 0) return true
            if (!this.form.name || this.form.name.trim == "") return true
            if (!this.form.latitude || !this.form.longitude || this.form.latitude == "" || this.form.longitude == "") return true
            if (Math.abs(this.form.latitude) > 90) return true
            if (Math.abs(this.form.longitude) > 180) return true

            return false;
        },
    },

    methods: {

        fetchProject: function() {
            this.showLoading()
            this.setKey()
            axios.get(`/api/Project/${this.key}`)
                .then(response => {
                    this.form.projectName = response.data.name
                })
                .catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.hideLoading()
                }, 2000))
        },

        save: function() {
            this.loading = true
            this.form.canSave = !this.disabled
            this.setKey()
            axios.post("/api/site", this.form)
                .then(_ => {
                    this.returnToProject()
                }).catch(error => console.log(error))
                .finally(() => this.loading = false)
        },

        setKey: function() {
            this.key = this.getKey("#projectKey")
            this.form.projectKey = this.key
        },

        returnToProject: function() {
            window.location.href = `/Project/Edit/${this.key}`
        }

    },

    mounted: function() {
        this.fetchProject()
    },

    created: function() {
        this.setKey()
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')