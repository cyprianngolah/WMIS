
const app = Vue.createApp({
    mixins: [GlobalMixin],
    components: {
        BaseInput,
        BaseButton,
    },

    data: function() {
        return {
            key: "",
            form: {},
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
        fetchSite: function() {
            this.setKey();
            this.showLoading();
            axios.get(`/api/site/${this.key}`)
                .then(response => {
                    if (response.data.data.length > 0) {
                        let d = response.data.data[0];
                        this.form.name = d.name;
                        this.form.projectKey = d.projectKey;
                        this.form.siteNumber = d.siteNumber;
                        this.form.latitude = d.latitude;
                        this.form.longitude = d.longitude;
                        this.form.dateEstablished = d.dateEstablished;
                        this.form.aspect = d.aspect;
                        this.form.cliffHeight = d.cliffHeight;
                        this.form.comments = d.comments;
                        this.form.habitat = d.habitat;
                        this.form.initialObserver = d.initialObserver;
                        this.form.map = d.map;
                        this.form.nearestCommunity = d.nearestCommunity;
                        this.form.nestHeight = d.nestHeight;
                        this.form.nestType = d.nestType;
                        this.form.reference = d.reference;
                        this.form.reliability = d.reliability;
                    }
                }).then(() => {
                    this.fetchProject();
                })
                .catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.hideLoading()
                }, 2000))
        },

        fetchProject: function() {
            axios.get(`/api/Project/${this.form.projectKey}`)
                .then(response => {
                    this.form.projectName = response.data.name
                })
                .catch(error => console.log(error))
        },

        save: function() {
            this.loading = true
            this.form.canSave = !this.disabled
            this.form.key = this.key
            axios.post("/api/site", this.form)
                .then(_ => {
                    this.returnToProject()
                }).catch(error => console.log(error))
                .finally(() => this.loading = false)
        },

        setKey: function() {
            this.key = this.getKey("#siteKey")
            this.form.key = this.key
        },

        returnToProject: function() {
            window.location.href=`/Project/Edit/${this.form.projectKey}`
        }

    },

    mounted: function() {
        this.fetchSite()
    },

    created: function() {
        this.setKey()
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')