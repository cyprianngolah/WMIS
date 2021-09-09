const SpeciesSynonymEditor = {
    template: `
        <div class="mt-1" v-if="!editing">
            <span class="el-icon-edit h6 cursor-pointer" @click="startEditing"></span> {{ displayString }}
        </div>
        <div class="my-2 w-100" v-else="editing">
            <el-select class="w-100 mb-1" v-model="records" multiple
                no-data-text="Type synonym and press ENTER"
                placeholder="Enter Synonym"
                allow-create default-first-option filterable>
                <el-option
                    v-for="item in options"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
            <div class="text-end">
                <el-button size="mini" @click="cancelEditing" :disabled="loading" plain type="danger">Cancel</el-button>
                <el-button size="mini" @click="handleSave" :loading="loading" type="success">Save</el-button>
            </div>
        </div>
    `,

    props: {
        species_synonym_type_id: {
            type: Number,
            default: null
        },
        entity_id: [String, Number],
        entity_type: {
            type: String,
            default: 'species'
        }
    },

    watch: {
        entity_id(newId) {
            this.fetchSynonyms()
        }
    },

    computed: {
        displayString() {
            const synonyms = this.records
            if (synonyms.length == 0) {
                return "Synonyms: None";
            } else if (synonyms.length == 1) {
                return "Synonym: " + synonyms[0];
            } else {
                return "Synonyms: " + synonyms.join(", ");
            }
        }
    },

    data() {
        return {
            records: [],
            editing: false,
            loading: false
        }
    },

    methods: {
        formatString() {
            if (this.records.length == 0) {
                return "Synonyms: None";
            } else if (this.records.length == 1) {
                return "Synonym: " + this.records[0];
            } else {
                return "Synonyms: " + this.records.join(", ");
            }
        },
        handleBlur(e) {
            const val = e.target.value
            if (val !== '') {
                this.records.push(val)
            }
        },
        fetchSynonyms() {
            if (this.entity_type == 'taxonomy') {
                this.fetchTaxonomySynonyms()
            } else {
                this.fetchSpeciesSynonyms()
            }
        },
        fetchTaxonomySynonyms() {
            this.loading = true
            axios.post(`/api/taxonomy/synonym`,
                [this.entity_id]
            )
                .then(response => {
                    this.records = response.data[0].synonyms || []
                }).catch(error => console.log(error))
                .finally(() => this.loading = false)
        },

        fetchSpeciesSynonyms() {
            this.loading = true
            axios.get(`/api/biodiversity/synonym/${this.entity_id}`)
                .then(response => {
                    let payload = response.data
                    this.records = payload.synonymsDictionary[this.species_synonym_type_id] || []
                }).catch(error => console.log(error))
                .finally(() => this.loading = false)
        },  

        cancelEditing() {
            this.fetchSynonyms()
            this.editing = false
        },

        startEditing() {
            this.editing = true
        },

        async handleSave() {
            this.loading = true
            if (this.entity_type == 'taxonomy') {
                await this.saveTaxonomySynonyms()
            } else {
                await this.saveSpeciesSynonyms()
            }

            setTimeout(() => this.loading=false, 1000)
        },

        saveSpeciesSynonyms() {
            axios.post(`/api/biodiversity/synonym/save`, {
                speciesId: this.entity_id,
                speciesSynonymTypeId: this.species_synonym_type_id,
                synonyms: this.records
            })
            .then(() => this.editing = false)
            .catch(error => console.log(error))
        },

        saveTaxonomySynonyms() {
            axios.post(`/api/taxonomy/synonym/savemany`, {
                taxonomyId: this.entity_id,
                synonyms: this.records
            })
                .then(() => this.editing = false)
                .catch(error => console.log(error))
        }


    },

    mounted() {
        this.fetchSynonyms()
    }
}