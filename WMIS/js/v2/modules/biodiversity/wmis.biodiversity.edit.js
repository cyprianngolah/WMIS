const app = Vue.createApp({
    components: {
       BaseButton,
        ReferenceWidget,
        BaseInput,
        BaseSelect,
        PopulationTags,
        BaseDropdownSelect,
        HistoryTab,
        FileTab,
        SpeciesSynonymEditor
    },

    data() {
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
            ecozonesFull: [],
            ecoregions: [],
            ecoregionsFull: [],
            protectedAreasFull: [],
            protectedAreas: [],
            statusRanksFull: [],
            nwtSarcAssessments:[],
            nwtSarcAssessmentsFull: [],
            cosewicStatusesFull: [],
            
        }
    },

    computed: {
        isDirty() {
            return this.formString !== JSON.stringify(this.form)
        },
        lastUpdated() {
            return this.form.lastUpdated ? moment.utc(this.form.lastUpdated, moment.ISO_8601).local().format('L h:mm a') : ""
        },
    },

    methods: {
        setKey() {
            this.biodiversityKey = WMIS.getKey("#bdKey")
        },

        fetchBiodiversityData() {
            this.setKey()
            this.loading = true
            axios.get(`/api/BioDiversity/${this.biodiversityKey}`)
                .then(response => {
                    this.form = response.data
                    this.formString = JSON.stringify(response.data)
                    document.title = "WMIS - Biodiversity - " + this.form.commonName;
                }).catch(error => {
                    console.log(error.response)
                }).finally(() => setTimeout(() => this.loading = false, 2000))
        },

        fetchDropdowns() {
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
                this.kingdoms = WMIS.transformForSelect2(responses[0].data)
                this.phylums = WMIS.transformForSelect2(responses[1].data)
                this.subphylums = WMIS.transformForSelect2(responses[2].data)
                this.classes = WMIS.transformForSelect2(responses[3].data)
                this.subclasses = WMIS.transformForSelect2(responses[4].data)
                this.orders = WMIS.transformForSelect2(responses[5].data)
                this.suborders = WMIS.transformForSelect2(responses[6].data)
                this.infraorders = WMIS.transformForSelect2(responses[7].data)
                this.superfamilies = WMIS.transformForSelect2(responses[8].data)
                this.families = WMIS.transformForSelect2(responses[9].data)
                this.subfamilies = WMIS.transformForSelect2(responses[10].data)
                this.groups = WMIS.transformForSelect2(responses[11].data)
                this.statusRanks = responses[15].data.data
                this.statusRanksFull = JSON.stringify(responses[15].data.data)
                this.nwtSarcAssessmentsFull = JSON.stringify(responses[16].data.data)
                this.nwtSarcAssessments = responses[16].data.data
                this.cosewicStatusesFull = JSON.stringify(responses[17].data.data)
                this.cosewicStatuses = responses[17].data.data

                // full lists for filter
                this.ecozones = responses[13].data.data
                this.ecozonesFull = JSON.stringify(responses[13].data.data)
                this.ecoregions = responses[12].data.data
                this.ecoregionsFull = JSON.stringify(responses[12].data.data)
                this.protectedAreas = responses[14].data.data
                this.protectedAreasFull = JSON.stringify(responses[14].data.data)

            })).catch(error => {
                console.log(error)
            }).finally(() => setTimeout(() => this.loading=false, 1500))
        },

        updateReference({ references, category }) {
            let filteredList = this.form.references.filter(r => r.categoryKey !== category)
            references.forEach(r => filteredList.push({ categoryKey: category, reference: r }))
            this.form.references = filteredList
        },

        saveBioDiversity() {
            this.loading = true
            axios.put("/api/BioDiversity/", this.form)
                .then(_ => {
                    this.fetchBiodiversityData()
                    this.$message.success("Record updated successfully")
                }).catch(error => console.log(error))
        }
    },

    mounted() {
        this.setKey()
        this.fetchBiodiversityData()
    },

    created() {
        this.fetchDropdowns()
    }
});

app.use(ElementPlus);
app.mount('#wmis-app')