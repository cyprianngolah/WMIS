const app = Vue.createApp({
    components: {
        BaseInput,
        BaseButton
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
            axios.post(`/api/statusrank/`, this.form)
                .then(response => {
                    window.location.href = "/StatusRank";
                }).catch(error => console.log(error))
        },


        getStatusRank() {
            axios.get(`/api/statusrank/?key=${this.form.key}`)
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
            this.getStatusRank()
        }
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')