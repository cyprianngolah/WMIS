const app = Vue.createApp({
    components: {
        BaseInput,
        BaseLinkButton,
        BaseButton
    },

    data: function() {
        return {
            form: {
                name: "",
            }
        }
    },

    computed: {
        disabled: function() {
            return this.form.name.trim() === ""
        }
    },

    methods: {
        submit: function() {
            if (this.disabled) {
                this.$message.error('All fields are required!');
                return;
            }
            axios.post('/api/project/', this.form)
                .then(response => {
                    window.location.href = "/project/edit/" + response.data;
                }).catch(error => console.log(error))
        },

    }
})

app.use(ElementPlus);
app.mount('#wmis-app')