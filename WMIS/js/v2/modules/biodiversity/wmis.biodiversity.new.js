const app = Vue.createApp({
    components: {
        BaseInput,
        BaseButton
    },

    data() {
        return {
            form: {
                subSpeciesName: "",
                name: "",
                ecoType: ""
            }
        }
    },

    computed: {
        disabled() {
            return this.form.name === "" || this.form.subSpeciesName === "" || this.form.ecoType === ""
        }
    },

    methods: {
        submit() {
            if (this.disabled) {
                this.$message.error('All fields are required!');
                return;
            }
            axios.post('/api/biodiversity/', this.form)
                .then(response => {
                    window.location.href = "/Biodiversity/Edit/" + response.data;
                }).catch(error => console.log(error))
        }
    },
})

app.use(ElementPlus);
app.mount('#wmis-app')