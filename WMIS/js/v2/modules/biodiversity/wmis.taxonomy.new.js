const app = Vue.createApp({
    components: {
        BaseInput,
        BaseButton,
        BaseLinkButton,
        BaseDropdownSelect,
        SynonymTags
    },

    data: function() {
        return {
            taxonomyGroups: [],
            form: {
                taxonomyGroupKey: "",
                name: "",
                synonyms: []
            }
        }
    },

    computed: {
        disabled: function() {
            return this.form.name === "" || this.form.taxonomyGroupKey === ""
        }
    },

    methods: {
        submit: function() {
            if (this.disabled) {
                this.$message.error('All fields are required!');
                return;
            }
            axios.post('/api/taxonomy/', this.form)
                .then(response => {
                    window.location.href = "/Taxonomy";
                }).catch(error => console.log(error))
        },

        getTaxonomyGroups: function() {
            axios.get('/api/Taxonomy/TaxonomyGroup')
                .then(response => {
                    this.taxonomyGroups = response.data
                }).catch(error => console.log(error))
        }
    },

    mounted: function() {
        this.getTaxonomyGroups()
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')