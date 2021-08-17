const app = Vue.createApp({
    components: {
        BaseInput,
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
            const id = window.location.pathname.split('/').pop()
            axios.post(`/api/cosewicstatus/`, this.form)
                .then(response => {
                    window.location.href = "/cosewicstatus";
                }).catch(error => console.log(error))
        },


        getData() {
            axios.get(`/api/cosewicstatus/?key=${this.form.key}`)
                .then(response => {
                    const res = response.data.data
                    if (res.length > 0) {
                        this.form.name = res[0].name
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