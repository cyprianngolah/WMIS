const app = Vue.createApp({
    mixins: [GlobalMixin],

    components: {
        BaseInput,
        BaseButton,
        BaseLinkButton
    },

    data() {
        return {
            form: {
                key: "",
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
            axios.post(`/api/cosewicstatus/`, this.form)
                .then(_ => {
                    window.location.href = "/cosewicstatus";
                }).catch(error => console.log(error))
        },
        setKey() {
            const key = this.getKey("#key");
            if (key && key !== undefined) {
                this.form.key = key
                this.getData()
            }
        },

        getData() {
            this.showLoading()
            axios.get(`/api/cosewicstatus/?key=${this.form.key}`)
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