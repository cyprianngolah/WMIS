const app = Vue.createApp({
    components: {
        BaseInput,
        BaseButton
    },

    data() {
        return {
            loading: false
        }
    },
    methods: {
        runArgosFileLoad() {
            this.loading = true;

            axios.post('/api/argos/execute/')
                .then(_ => {
                    setTimeout(() => this.$message.success("Job Executed successfully!"), 1500)
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => this.loading = false, 1500))
        },


        updateSchedule() {
            this.loading = true;
            axios.post('/api/argos/schedule/')
                .then(_ => {
                    setTimeout(() => this.$message.success("Schedule successfully!"), 1500)
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => this.loading = false, 1500))
        },

    }
})

app.use(ElementPlus);
app.mount('#wmis-app')