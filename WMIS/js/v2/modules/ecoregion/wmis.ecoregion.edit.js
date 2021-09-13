const app = Vue.createApp({
    mixins: [GlobalMixin],

    components: {
        BaseInput,
        BaseButton
    },

    data() {
        return {
            form: {
                taxonomyKey: "",
                name: "",
            }
        }
    },

    computed: {
        disabled() {
            return this.form.name === ""
        }
    },

    methods: {
        submit() {
            if (this.disabled) {
                this.$message.error('Name is required!');
                return;
            }
            axios.post(`/api/ecoregion/`, this.form)
                .then(_ => {
                    window.location.href = "/Ecoregion";
                }).catch(error => console.log(error))
        },
        setKey() {
            const key = this.getKey("#ecoregionKey");
            if (key && key !== undefined) {
                this.form.key = key
                this.getEcoregion()
            }
        },

        getEcoregion() {
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

    mounted() {
        this.setKey()
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')