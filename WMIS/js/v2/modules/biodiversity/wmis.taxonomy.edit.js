const app = Vue.createApp({
    components: {
        BaseInput,
        BaseButton,
        BaseDropdownSelect,
        SynonymTags
    },

    data() {
        return {
            taxonomyGroups: [],
            form: {
                taxonomyKey: "",
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
                this.$message.error('Name and Group are required!');
                return;
            }
            const id = window.location.pathname.split('/').pop()
            axios.post(`/api/taxonomy/`, this.form)
                .then(response => {
                    window.location.href = "/Taxonomy";
                }).catch(error => console.log(error))
        },

        getTaxonomyGroups() {
            axios.get('/api/Taxonomy/TaxonomyGroup')
                .then(response => {
                    this.taxonomyGroups = response.data
                }).catch(error => console.log(error))
        },

        getTaxonomy() {
            const id = window.location.pathname.split('/').pop()
            axios.get(`/api/Taxonomy/?TaxonomyKey=${id}`)
                .then(response => {
                    const res = response.data.data
                    if (res.length > 0) {
                        this.form.taxonomyGroupKey = res[0].taxonomyGroup.key
                        this.form.name = res[0].name
                        this.form.taxonomyKey = id
                    }
                    //this.form.taxonomyGroupKey = response.data[0]
                }).catch(error => console.log(error))
        },

        getSynonym() {
            const id = window.location.pathname.split('/').pop();
            axios.post(`/api/taxonomy/synonym`, [id])
                .then(response => {
                    const res = response.data
                    if (res.length > 0) {
                        this.form.synonyms = res[0].synonyms
                    }

                }).catch(error => console.log(error))
        }
    },

    mounted() {
        this.getTaxonomyGroups()
        this.getSynonym()
        this.getTaxonomy()
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')