const app = Vue.createApp({
    mixins: [GlobalMixin],

    components: {
        BaseInput,
        BaseButton,
        BaseLinkButton
    },

    data: function() {
        return {
            loading: false
        }
    },
    methods: {
        runArgosFileLoad: function() {
            this.showLoading("Executing Job");
            this.loading = true;
            axios.post('/api/argos/execute/')
                .then(_ => {
                    setTimeout(() => this.$message.success("Job Executed successfully!"), 300)
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.loading = false
                    this.hideLoading()
                }, 200))
        },


        updateSchedule: function() {
            this.loading = true;
            this.showLoading("Updating Schedule!");
            axios.post('/api/argos/schedule/')
                .then(_ => {
                    setTimeout(() => this.$message.success("Schedule successfully!"), 300)
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.loading = false
                    this.hideLoading()
                }, 200))
        },

    }
})

app.use(ElementPlus);
app.mount('#wmis-app')