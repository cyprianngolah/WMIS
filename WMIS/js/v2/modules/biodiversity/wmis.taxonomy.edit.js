const app = Vue.createApp({
    mixins: [GlobalMixin],

    components: {
        BaseInput,
        BaseButton,
        BaseLinkButton,
        BaseDropdownSelect,
        SynonymTags
    },

    data: function() {
        return {
            key: 0,
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
        disabled: function() {
            return this.form.name === "" || this.form.taxonomyGroupKey === ""
        }
    },

    methods: {
        setKey: function() {
            this.key = this.getKey("taxonomyKey")
        },

        submit: function() {
            if (this.disabled) {
                this.$message.error('Name and Group are required!');
                return;
            }
            axios.post(`/api/taxonomy/`, this.form)
                .then(_ => {
                    window.location.href = "/Taxonomy";
                }).catch(error => console.log(error))
        },

        getTaxonomyGroups: function() {
            axios.get('/api/Taxonomy/TaxonomyGroup')
                .then(response => {
                    this.taxonomyGroups = response.data
                }).catch(error => console.log(error))
        },

        getTaxonomy: function() {
            this.showLoading();
            this.setKey();
            axios.get(`/api/Taxonomy/?TaxonomyKey=${this.key}`)
                .then(response => {
                    const res = response.data.data
                    if (res.length > 0) {
                        this.form.taxonomyGroupKey = res[0].taxonomyGroup.key
                        this.form.name = res[0].name
                    }
                    this.form.taxonomyKey=this.key
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.hideLoading()
                }, 2000))
        },

        getSynonym: function() {
            this.setKey()
            axios.post(`/api/taxonomy/synonym`, [this.key])
                .then(response => {
                    const res = response.data
                    if (res.length > 0) {
                        this.form.synonyms = res[0].synonyms
                    }

                }).catch(error => console.log(error))
        }
    },

    mounted: function() {
        this.getTaxonomyGroups()
        this.getSynonym()
        this.getTaxonomy()
    },

    created: function() {
        this.setKey()
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')