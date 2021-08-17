﻿const app = Vue.createApp({
    components: {
        BaseInput,
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


        getData() {
            axios.get(`/api/References/?ReferenceKey=${this.form.key}`)
                .then(response => {
                    console.log(response)
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
        },
    },

    mounted() {
        const key = window.location.pathname.split('/').pop();
        if (key !== 'New') {
            this.form.key = key;
            this.getData()
        }
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')