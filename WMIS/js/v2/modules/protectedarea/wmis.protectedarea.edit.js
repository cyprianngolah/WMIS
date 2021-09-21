﻿const app = Vue.createApp({
    mixins: [GlobalMixin],

    components: {
        BaseInput,
        BaseButton,
        BaseLinkButton
    },

    data: function() {
        return {
            form: {
                key: "",
                name: "",
            }
        }
    },

    computed: {
        disabled: function() {
            return this.form.name === ""
        }
    },

    methods: {
        submit: function() {
            if (this.disabled) {
                this.$message.error('Name is required!');
                return;
            }
            axios.post(`/api/ProtectedArea/`, this.form)
                .then(_ => {
                    window.location.href = "/ProtectedArea";
                }).catch(error => console.log(error))
        },

        setKey: function() {
            const key = this.getKey("#protectedareaKey");
            if (key && key !== undefined) {
                this.form.key = key
                this.getProtectedarea()
            }
        },
        getProtectedarea: function() {
            this.showLoading();
            axios.get(`/api/ProtectedArea/?key=${this.form.key}`)
                .then(response => {
                    const res = response.data.data
                    if (res.length > 0) {
                        this.form.name = res[0].name
                    }
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.hideLoading()
                }, 200))
        },
    },

    mounted: function() {
        this.setKey();
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')