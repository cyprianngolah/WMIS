const app = Vue.createApp({
    mixins: [GlobalMixin],

    components: {
        BaseInput,
        BaseButton
    },

    data: function() {
        return {
            form: {
                taxonomyKey: "",
                name: "",
            }
        }
    },

    computed: {
        disabled: function() {
            return this.form.name === ""
        }
    },

    methods: {
        submit: function() {
            if (this.disabled) {
                this.$message.error('Name is required!');
                return;
            }
            axios.post(`/api/ecoregion/`, this.form)
                .then(_ => {
                    window.location.href = "/Ecoregion";
                }).catch(error => console.log(error))
        },
        setKey: function() {
            const key = this.getKey("#ecoregionKey");
            if (key && key !== undefined) {
                this.form.key = key
                this.getEcoregion()
            }
        },

        getEcoregion: function() {
            this.showLoading();
            axios.get(`/api/Ecoregion/?key=${this.form.key}`)
                .then(response => {
                    const res = response.data.data
                    if (res.length > 0) {
                        this.form.name = res[0].name
                    }
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.hideLoading()
                }, 2000))
        },
    },

    mounted: function() {
        this.setKey()
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')