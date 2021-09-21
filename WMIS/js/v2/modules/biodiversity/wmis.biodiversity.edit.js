const app = Vue.createApp({
    mixins: [GlobalMixin, DataTableMixin],

    components: {
        BaseButton,
        BaseLinkButton,
        ReferenceWidget,
        BaseInput,
        PopulationTags,
        BaseDropdownSelect,
        HistoryTab,
        FileTab,
        SpeciesSynonymEditor
    },

    data: function() {
        return {
            biodiversityKey: null,
            loading: false,
            form: {},
            formString: "",
            kingdoms: [],
            groups: [],
            phylums: [],
            subphylums: [],
            classes: [],
            subclasses: [],
            orders: [],
            suborders: [],
            infraorders: [],
            superfamilies: [],
            families: [],
            subfamilies: [],

            speciesSynonyms: [],

            statusRanks: [],
            cosewicStatuses: [],
            ecozones: [],
            ecoregions: [],
            protectedAreas: [],
            nwtSarcAssessments:[],
            
        }
    },

    computed: {
        isDirty: function() {
            return this.formString !== JSON.stringify(this.form)
        },
        lastUpdated: function() {
            return this.form.lastUpdated ? moment.utc(this.form.lastUpdated, moment.ISO_8601).local().format('L h:mm a') : ""
        },
    },

    methods: {
        setKey: function() {
            this.biodiversityKey = this.getKey("#bdKey")
        },

        fetchBiodiversityData: function() {
            this.setKey()
            this.loading = true
            this.showLoading()
            axios.get(`/api/BioDiversity/${this.biodiversityKey}`)
                .then(response => {
                    this.form = response.data
                    this.formString = JSON.stringify(response.data)
                    document.title = "WMIS - Biodiversity - " + this.form.commonName;
                }).catch(error => {
                    console.log(error.response)
                }).finally(() => setTimeout(() => {
                    this.loading = false
                    this.hideLoading()
                }, 1000))
        },

        fetchDropdowns: function() {
            this.loading = true
           
            axios.all([
                axios.get('/api/taxonomy/kingdom'),
                axios.get('/api/taxonomy/phylum'),
                axios.get('/api/taxonomy/subphylum'),
                axios.get('/api/taxonomy/class'),
                axios.get('/api/taxonomy/subclass'),
                axios.get('/api/taxonomy/order'),
                axios.get('/api/taxonomy/suborder'),
                axios.get('/api/taxonomy/infraorder'),
                axios.get('/api/taxonomy/superfamily'),
                axios.get('/api/taxonomy/family'),
                axios.get('/api/taxonomy/subfamily'),
                axios.get('/api/taxonomy/group'),
                axios.get('/api/ecoregion?startRow=0&rowCount=500'),
                axios.get('/api/ecozone?startRow=0&rowCount=500'),
                axios.get('/api/protectedArea?startRow=0&rowCount=500'),
                axios.get('/api/statusrank?startRow=0&rowCount=500'),
                axios.get('/api/nwtsarcassessment?startRow=0&rowCount=500'),
                axios.get('/api/cosewicstatus?startRow=0&rowCount=500'),
            ]).then(axios.spread((...responses) => {
                this.kingdoms = responses[0].data
                this.phylums = responses[1].data
                this.subphylums = responses[2].data
                this.classes = responses[3].data
                this.subclasses = responses[4].data
                this.orders = responses[5].data
                this.suborders = responses[6].data
                this.infraorders = responses[7].data
                this.superfamilies = responses[8].data
                this.families = responses[9].data
                this.subfamilies = responses[10].data
                this.groups = responses[11].data
                this.statusRanks = responses[15].data.data
                this.nwtSarcAssessments = responses[16].data.data
                this.cosewicStatuses = responses[17].data.data

                // full lists for filter
                this.ecozones = responses[13].data.data
                this.ecoregions = responses[12].data.data
                this.protectedAreas = responses[14].data.data

            })).catch(error => {
                console.log(error)
            }).finally(() => setTimeout(() => this.loading=false, 200))
        },

        updateReference: function({ references, category }) {
            let filteredList = this.form.references.filter(r => r.categoryKey !== category)
            references.forEach(r => filteredList.push({ categoryKey: category, reference: r }))
            this.form.references = filteredList
        },

        saveBioDiversity: function() {
            this.loading = true
            this.showLoading()
            axios.put("/api/BioDiversity/", this.form)
                .then(_ => {
                    this.fetchBiodiversityData()
                    this.$message.success("Record updated successfully")
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.loading = false
                    this.hideLoading()
                }, 200))
        }
    },

    mounted: function() {
        this.setKey()
        this.fetchBiodiversityData()
    },

    created: function() {
        this.fetchDropdowns()
    }
});

app.use(ElementPlus);
app.mount('#wmis-app')