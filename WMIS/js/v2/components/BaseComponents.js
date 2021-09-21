
const BaseButton = {
    template: `
        <button class="btn shadow-3 ms-2" :class="plain ? 'btn-outline-' + color : 'btn-'+color"  v-bind="$attrs" :disabled="disabled || busy">
            <span v-show="busy" class="el-icon-loading is-loading loading me-1"></span>
            <slot></slot>
        </button>
    `,
    props: {
        type: {
            default: 'button'
        },
        color: {
            default: 'primary'
        },
        busy: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        plain: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'medium'
        },
    }
};


const BaseInput = {
    emits: ['update:modelValue'],
    template: `
        <el-input :disabled="disabled" :type="type" :model-value="modelValue" :id="id" class="w-100" @input="handleInput" :rows="5"></el-input>
   
    `,

    props: {
        id: {
            type: String,
            default: "",
        },
        modelValue: {
            type: [String, Number, Date],
            default: "",
        },
        type: {
            type: String,
            default: 'text'
        },
        label: {
            type: String,
            required: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
    },

    methods: {
        handleInput: function (value) {
            this.$emit("update:modelValue", value);
        }
    },

};

const BaseLinkButton = {
    template: `
        <a class="btn shadow-3 ms-2" v-bind="$attrs" :class="disabled ? 'btn-'+color+' disabled' : 'btn-'+color" role="button"><slot></slot></a>
    `,
    props: {
        type: {
            default: 'button'
        },
        color: {
            default: 'danger'
        },
        busy: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        plain: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'medium'
        }
    }
};



const BaseSpeciesSelect = {
    emits: ['update:modelValue'],
    template: `
        <el-select
            :model-value="modelValue"
            filterable
            remote
            reserve-keyword
            clearable
            class="w-100"
            placeholder="Please at least 1 character to search..."
            :remote-method="remoteMethod"
            @change="handleInput"
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item[label_field]"
              :value="item[value_field]">
            </el-option>
          </el-select>
<small class="text-info">Type at least 1 character to search species</small>
    `,

    props: {
        url: {
            type: String,
            required: true,
        },
        search_param_name: {
            type: String,
            default: 'searchString',
        },
        label_field: {
            type: String,
            default: 'name',
        },
        value_field: {
            type: String,
            default: 'key',
        },
        modelValue: {
            type: [String, Number,Object],
            default: "",
        }
    },

    data: function() {
        return {
            options: [],
            value: "",
            loading: false,
        }
    },

    methods: {
        transformRecord: function(d) {
            let name = d.name;
            if (d.commonName && d.commonName != "") {
                name += ` - ${d.commonName}`
            }

            return {
                key: d.key,
                name
            }
        },
        remoteMethod: function(query) {
            if (query !== '') {
                this.loading = true;
                axios.get(`/api/biodiversity?startRow=0&rowCount=25&${this.search_param_name}=${query}`)
                    .then(response => {
                        this.options = response.data.data.map(d => {
                            return this.transformRecord(d)
                        })
                    }).catch(error => console.log(error))
                    .finally(() => this.loading = false)
            } else {
                this.options = [];
            }
        },

        handleInput: function(value) {
            this.$emit("update:modelValue", value);
        },

        getSpeciesById: function() {
            axios.get(`/api/BioDiversity/${this.modelValue}`)
                .then(response => {
                    this.options.push(this.transformRecord(response.data))
                })
                .catch(error => console.log(error))
        }
    },

    mounted: function() {
        if (this.modelValue) {
            this.getSpeciesById()
        }
    }
}


const ElementSpeciesSelect = {
    template: `
        <el-select
            v-bind="$attrs"
            style="width:100%"
            :model-value="modelValue"
            filterable
            remote
            size="large"
            :reserve-keyword="false"
            placeholder="Start typing.."
            :remote-method="search"
            value-key="key"
            popper-class="el-drop"
            :popper-append-to-body="false"
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.name + ' - ' + item.commonName"
              :value="item">
            </el-option>
          </el-select>
        <small class="text-muted">Type a keyword to search species </small>
    `,

    props: {
        modelValue: [String, Number, Object, Array],
        initial: {
            type: Object,
            required:false
        }
    },

    data: function() {
        return {
            selected: [],
            options: [],
            loading: false,
        }
    },

    watch: {
        initial: {
            deep: true,
            immediate: true,
            handler: function(newVal) {
                if (newVal !== undefined) {
                    this.options.push(newVal)
                }
            }
        }
    },


    methods: {
        search: function(query) {
            if (query !== '') {
                axios.get(`/api/biodiversity?keywords=${query}&startRow=0&rowCount=25`)
                    .then(response => {
                        this.options = response.data.data.map(d => {
                            const name = d.name;
                            const commonName = d.commonName;
                            const key = d.key;
                            return {
                                commonName,
                                name,
                                key
                            }
                        })
                    }).catch(error => console.log(error))
                    .finally(() => this.loading = false)
            } else {
                this.options = [];
            }
        }
    }


}



const ElementReferenceSelect = {
    template: `
        <el-select
            v-bind="$attrs"
            style="width:100%"
            :model-value="modelValue"
            multiple
            filterable
            remote
            :reserve-keyword="false"
            placeholder="Start typing.."
            :remote-method="search"
            value-key="key"
            popper-class="el-drop"
            :popper-append-to-body="false"
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="generateLabel(item)"
              :value="item">
            </el-option>
          </el-select>
        <div class="text-muted">Type a keyword to search references </div>
    `,

    props: {
        modelValue: [String, Number, Array],
    },

    data: function() {
        return {
            selected: [],
            options: [],
            loading: false,
        }
    },


    methods: {
        search: function(query) {
            if (query !== '') {
                this.loading = true;
                axios.get(`/api/references?keywords=${query}&startRow=0&rowCount=25`)
                    .then(response => {
                        this.options = response.data.data
                    }).catch(error => console.log(error))
                    .finally(() => this.loading = false)
            } else {
                this.options = [];
            }
        },

        generateLabel: function(item) {
            return `${item.code} - ${item.author} - ${item.title} - ${item.year}`
        },
    },

    created: function() {
        this.options = this.modelValue
    }
}

/**
 *  Reference Widget 
 */

const ReferenceWidget = {
    template: `
        <div class="row h5 m-0 d-flex align-items-center">
            <div class="col-md-7">{{ category_name }}</div>
            <div class="col-md-5 text-end">
                <span>References {{ display }}</span> 
                <a class="btn btn-text shadow-0 p-0" data-mdb-toggle="modal" :href="'#modal-'+category_id" role="button">
                    <img src="/Content/images/icon-0-24x24-documents.png" />
                </a>
            </div>
        </div>

        <div class="modal fade reference-list references" data-mdb-backdrop="static" data-mdb-keyboard="false" :id="'modal-'+category_id" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalToggleLabel">References - {{ category_name }}</h5>
                        <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="overflow-y:inherit !important; z-index: 1;">
                        <element-reference-select ref="referenceSearch" v-model="selected_references" />
                    </div>
                    <div class="modal-footer">
                        <button @click="cancelModal" type="button" class="btn btn-danger" data-mdb-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="applyChange" data-mdb-dismiss="modal">Apply Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `,

    components: {
        ElementReferenceSelect
    },

    emits: ['reference-updated', 'update:modelValue'],

    props: {
        references: Array,
        category_name: String,
        category_id: [String, Number],
        update_function: Function,
    },

    data: function() {
        return {
            selected_references: [],
            initialList: ""
        }
    },

    watch: {
        references: {
            deep: true,
            immediate: true,
            handler: function(value) {
                if (typeof value != 'undefined') {
                    this.selected_references = value.filter(r => r.categoryKey == this.category_id).map(r => r.reference)
                }

            }
        },
    },

    computed: {
        display: function() {
            if (!this.selected_references || !this.selected_references.length) return "";
            return "(" + this.selected_references.map(r => r.code).join(", ") + ")"
        }
    },

    methods: {
        cancelModal: function() {
            this.selected_references = JSON.parse(this.initialList)
        },

        applyChange: function() {
            this.update_function({
                references: this.selected_references,
                category: this.category_id
            })
        },

        buildString: function(ref_list) {
            if (!this.selected_references || !this.selected_references.length) return "";
            return "(" + ref_list.map(r => r.code).join(", ") + ")"
        }
    },

    mounted: function() {
        this.initialList = JSON.stringify(this.selected_references)
    }
}



const BaseDropdownSelect = {
    template: `
        <el-select v-bind="$attrs" :value-key="value_field" filterable :placeholder="placeholder" style="width:100%;">
            <el-option v-for="item in options"
                        :key="item[value_field]"
                        :label="item[label_field]"
                        :value="return_object ? item : item[value_field]">
            </el-option>
        </el-select>
    `,

    props: {
        options: {
            type: Array,
            required: true
        },
        placeholder: {
            type: String,
            default: 'Select an option'
        },
        value_field: {
            type: String,
            default: 'key'
        },
        label_field: {
            type: String,
            default: 'name'
        },
        return_object: {
            type: Boolean,
            default: true
        }

    }


}

/**
 * Population Tags Input
 */

const PopulationTags = {
    template: `
    <div class="d=flex">
    <el-tag
            :key="tag"
            v-for="tag in populations"
            type="info"
            effect="dark"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
            class="me-2">
            {{tag}}
    </el-tag>
    <el-input
            style="width:200px;"
            class="input-new-tag"
            v-if="inputVisible"
            v-model.trim="inputValue"
            ref="saveTagInput"
            size="medium"
            @keyup.enter.prevent="handleInputConfirm"
            @blur="handleInputConfirm">
        </el-input>
        <el-button native-type="button" type="primary" plain v-else size="small" @click="showInput">+ Add Population</el-button>
    </div>
    `,
    props: [
        'populations'
    ],

    emits: ['update:modelValue'],
    data: function() {
        return {
            inputVisible: false,
            inputValue: ''
        }
    },

    methods: {
        handleClose: function(tag) {
            this.populations.splice(this.populations.indexOf(tag), 1);
        },

        showInput: function() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm: function() {
            if (this.inputValue !== "" && !this.populations.includes(this.inputValue)) {
                this.populations.push(this.inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }

    }
}




/**
 * Synonym Tags Input
 */

const SynonymTags = {
    template: `
    <div class="d=flex">
    <el-tag
            :key="tag"
            v-for="tag in synonyms"
            type="info"
            effect="dark"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
            class="me-2">
            {{tag}}
    </el-tag>
    <el-input
            style="width:200px;"
            class="input-new-tag"
            v-if="inputVisible"
            v-model.trim="inputValue"
            ref="saveTagInput"
            size="medium"
            @keyup.enter.prevent="handleInputConfirm"
            @blur="handleInputConfirm">
        </el-input>
        <el-button native-type="button" type="primary" plain v-else size="small" @click="showInput">+ Add Synonym</el-button>
    </div>
    `,
    props: [
        'synonyms'
    ],

    emits: ['update:modelValue'],
    data: function() {
        return {
            inputVisible: false,
            inputValue: ''
        }
    },

    methods: {
        handleClose: function(tag) {
            this.synonyms.splice(this.synonyms.indexOf(tag), 1);
        },

        showInput: function() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm: function() {
            if (this.inputValue !== "" && !this.synonyms.includes(this.inputValue)) {
                this.synonyms.push(this.inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }

    }
}