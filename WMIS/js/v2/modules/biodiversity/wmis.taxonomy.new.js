const app = Vue.createApp({
    components: {
        BaseInput,
        BaseButton,
        BaseLinkButton,
        BaseDropdownSelect,
        SynonymTags
    },

    data() {
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
        disabled() {
            return this.form.name === "" || this.form.taxonomyGroupKey === ""
        }
    },

    methods: {
        submit() {
            if (this.disabled) {
                this.$message.error('All fields are required!');
                return;
            }
            axios.post('/api/taxonomy/', this.form)
                .then(response => {
                    window.location.href = "/Taxonomy";
                }).catch(error => console.log(error))
        },

        getTaxonomyGroups() {
            axios.get('/api/Taxonomy/TaxonomyGroup')
                .then(response => {
                    this.taxonomyGroups = response.data
                }).catch(error => console.log(error))
        }
    },

    mounted() {
        this.getTaxonomyGroups()
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')