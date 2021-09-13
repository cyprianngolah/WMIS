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
                code: "",
                author: "",
                year: "",
                title: "",
                editionPublicationOrganization: "",
                volumePage: "",
                publisher: "",
                city: "",
                location: ""
            }
        }
    },

    computed: {
        disabled() {
            return this.form.code === ""
        }
    },

    methods: {
        submit() {
            if (this.disabled) {
                this.$message.error('Missing required data!');
                return;
            }
            const id = window.location.pathname.split('/').pop()
            axios.post(`/api/References/`, this.form)
                .then(response => {
                    window.location.href = "/Reference/Index";
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
            axios.get(`/api/References/?ReferenceKey=${this.form.key}`)
                .then(response => {
                    const res = response.data.data
                    if (res.length > 0) {
                        this.form.code = res[0].code
                        this.form.author = res[0].author
                        this.form.year = res[0].year
                        this.form.title = res[0].title
                        this.form.editionPublicationOrganization = res[0].editionPublicationOrganization
                        this.form.volumePage = res[0].volumePage
                        this.form.publisher = res[0].publisher
                        this.form.city = res[0].city
                        this.form.location = res[0].location
                        document.title = "WMIS - Reference - " + res[0].title;
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