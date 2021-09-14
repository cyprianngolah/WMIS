const app = Vue.createApp({
    mixins: [GlobalMixin, DataTableMixin],

    components: {
        BaseInput,
        BaseButton,
        BaseLinkButton,
        FileTab,
        HistoryTab,
        BaseSpeciesSelect,
        CollaredAnimalMapping
    },

    data: function() {
        return {
            key: "",
            loading: false,
            form: {},
            collarType: [],
            collarRegions: [],
            collarStatuses: [],
            collarStates: [],
            collarMalfunctions: [],
            animalSexes: [],
            breedingStatusMethods: [],
            breedingStatuses: [],
            confidenceLevels: [],
            herdAssociationMethods: [],
            herdPopulations: [],
            ageClasses: [],
            animalMortalities: [],
            animalStatuses: [],
            programs: [],

            breedingStatusModal: null,
            herdAssociationModal: null,

            breedingStatusForm: {},
            herdAssociationForm: {},

            initialData: ""

        }
    },

    
    computed: {
        lastUpdated: function() {
            return this.form.lastUpdated ? moment.utc(this.form.lastUpdated, moment.ISO_8601).local().format('L h:mm a') : ""
        },
        disabled: function() {
            return true;
        },
        loaded: function() {
            return Object.keys(this.form).length > 0 && Object.keys(this.breedingStatusForm).length > 0
        },
        disableBreedingStatusCreate: function() {
            let flag = false;
            Object.keys(this.breedingStatusForm).forEach(k => {
                if (!this.checkKey(this.breedingStatusForm[k]) && k != 'breedingStatusDate') {
                    flag = true
                }
                if (k == 'breedingStatusDate' && !this.breedingStatusForm[k]) {
                    flag = true;
                }
            })

            return flag;
        },

        disableHerdAssociationCreate: function() {
            let flag = false;
            Object.keys(this.herdAssociationForm).forEach(k => {
                if (!this.checkKey(this.herdAssociationForm[k]) && k != 'herdAssociationDate') {
                    flag = true
                }
                if (k == 'herdAssociationDate' && !this.herdAssociationForm[k]) {
                    flag = true;
                }
            })

            return flag;
        }
    },

    methods: {
        checkKey: function(property) {
            if (!property) return false;
            return !!property.key;
        },
        setKey: function() {
            this.key = this.getKey("#collaredAnimalKey")
        },

        getCollarData: function() {
            this.setKey()
            this.showLoading();
            axios.get(`/api/collar/${this.key}`)
                .then(response => {
                    this.form = response.data
                    this.initialData = JSON.stringify(response.data);
                }).then(() => {
                    const payload = JSON.parse(this.initialData);
                    this.breedingStatusForm = {
                        breedingStatus: payload.breedingStatus,
                        breedingStatusConfidenceLevel: payload.breedingStatusConfidenceLevel,
                        breedingStatusDate: payload.breedingStatusDate,
                        breedingStatusMethod: payload.breedingStatusMethod,
                    }
                    this.herdAssociationForm = {
                        herdPopulation: payload.herdPopulation,
                        herdAssociationConfidenceLevel: payload.herdAssociationConfidenceLevel,
                        herdAssociationMethod: payload.herdAssociationMethod,
                        herdAssociationDate: payload.herdAssociationDate
                    }
                }).catch(error => console.log(error))
                .finally(() => {
                    setTimeout(() => this.hideLoading(), 1000)
                })
        },

        updateBreedingStatus: function() {
            this.form = { ...this.form, ...this.breedingStatusForm };
            this.breedingStatusModal.hide()
        },

        updateHerdAssociation: function() {
            this.form = { ...this.form, ...this.herdAssociationForm };
            this.herdAssociationModal.hide()
        },

        saveUpdate: function() {
            this.loading = true
            axios.put(`/api/collar/`, this.form)
                .then(_ => {
                    this.getCollarData();
                    $("#historyTable").DataTable().ajax.reload();
                    setTimeout(() => this.$message.success('Record Updated Successfully!'), 2000)
                }).catch(error => console.log(error))
                .finally(() => {
                    setTimeout(() => this.loading = false, 1500)
                })
        },

        getDropdowns: function() {
            axios.all([
                axios.get(`/api/collar/type?startRow=0&rowCount=500`), // collar types
                axios.get('/api/collar/region?startRow=0&rowCount=500'), // collar regions
                axios.get('/api/collar/status?startRow=0&rowCount=500'), // collar statuses
                axios.get('/api/collar/state?startRow=0&rowCount=500'), // collar states
                axios.get('/api/collar/malfunction?startRow=0&rowCount=500'), // collar malfunctions
                axios.get(`/api/collar/animalSexes?startRow=0&rowCount=500`), // animal sexes
                axios.get(`/api/collar/breedingStatusMethods?startRow=0&rowCount=500`), // breeding status methods
                axios.get(`/api/collar/breedingStatuses?startRow=0&rowCount=500`), // breeding statuses
                axios.get(`/api/collar/confidenceLevels?startRow=0&rowCount=500`), // confidence levels
                axios.get(`/api/collar/herdAssociationMethods?startRow=0&rowCount=500`), // herd assoc methods
                axios.get(`/api/collar/herdPopulations?startRow=0&rowCount=500`), // herd pops
                axios.get(`/api/collar/ageClasses?startRow=0&rowCount=500`), // age classes
                axios.get(`/api/collar/animalMortalities?startRow=0&rowCount=500`), // animal mortalities
                axios.get(`/api/collar/animalStatuses?startRow=0&rowCount=500`), // animal statuses
                axios.get(`/api/collar/programs?startRow=0&rowCount=500`), // programs
            ]).then(axios.spread((...responses) => {
                this.collarTypes = responses[0].data.data;
                this.collarRegions = responses[1].data.data;
                this.collarStatuses = responses[2].data.data;
                this.collarStates = responses[3].data.data;
                this.collarMalfunctions = responses[4].data.data;
                this.animalSexes = responses[5].data.data;
                this.breedingStatusMethods = responses[6].data.data;
                this.breedingStatuses = responses[7].data.data;
                this.confidenceLevels = responses[8].data.data;
                this.herdAssociationMethods = responses[9].data.data;
                this.herdPopulations = responses[10].data.data;
                this.ageClasses = responses[11].data.data;
                this.animalMortalities = responses[12].data.data;
                this.animalStatuses = responses[13].data.data;
                this.programs = responses[14].data.data;
            })).catch(error => {
                console.log(error)
            })
        },

    },

    
    mounted: function() {
        this.setKey()
        this.getCollarData()

        this.breedingStatusModal = this.createModal("breedingStatusModal")
        this.herdAssociationModal = this.createModal("herdAssociationModal")



    },

    created: function() {
        this.getDropdowns()
    }
})

app.use(ElementPlus);
app.mount('#wmis-app')