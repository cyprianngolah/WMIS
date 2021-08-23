
const BaseInput = {
    emits: ['update:modelValue'],
    template: `
        <el-input :type="type" :model-value="modelValue" :id="id" @input="handleInput"></el-input>
        <!--<input :value="modelValue" type="text" class="form-control"  :id="id" @input="handleInput">-->
    `,

    props: {
        id: {
            type: String,
            default: "",
        },
        modelValue: {
            type: [String, Number],
            default: "",
        },
        type: {
            type: String,
            default: 'text'
        },
    },

    methods: {
        handleInput(value) {
            //this.$emit("update:modelValue", event.target.value);
            this.$emit("update:modelValue", value);
        }
    },

}


const BaseSelect = {
    data() {
        return {
            select2: null
        };
    },

    template: `
        <div>
            <select class="form-control" :id="id" :name="name" :disabled="disabled" :required="required" style="width: 100%">
                <option v-for="o in options" :key="o.key" :value="o.key">{{ o.name }}</option>
            </select>
        </div>
    `,
    emits: ['update:modelValue'],
    props: {
        modelValue: [String, Number, Array], // previously was `value: String`
        id: {
            type: String,
            default: ''
        },
        valueField: {
            type: String,
            default: 'key'
        },
        textField: {
            type: String,
            default: 'name'
        },
        name: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        settings: {
            type: Object,
            default: () => { }
        },
    },

    watch: {
        options: {
            handler(val) {
                this.setOption(val);
            },
            deep: true
        },
        modelValue: {
            handler(val) {
                this.setValue(val);
            },
            deep: true
        },
    },

    methods: {
        setOption(val = []) {
            if (!this.select2) return;

            this.select2.empty();
            this.select2.select2({
                placeholder: this.placeholder,
                ...this.settings,
                data: val
            });
            this.setValue(this.modelValue);

        },
        setValue(val) {
            if (val instanceof Array) {
                this.select2.val([...val]);
            } else {
                this.select2.val([val]);
            }
            this.select2.trigger('change');
        }
    },

    mounted() {
        setTimeout(() => {
            this.select2 = $(this.$el)
                .find('select')
                .select2({
                    placeholder: this.placeholder,
                    ...this.settings,
                    data: this.options,
                    theme: "bootstrap-5",
                    selectionCssClass: "select2--medium", // For Select2 v4.1
                    dropdownCssClass: "select2--small",
                })
                .on('select2:select select2:unselect', ev => {
                    this.$emit('update:modelValue', this.select2.val());
                    this.$emit('select', ev['params']['data']);
                });
            this.setValue(this.modelValue);
        }, 0)
    },

    beforeUnmount() {
        this.select2.select2('destroy');
    }
}


/**
 * References Search Multiple
 * 
 * */
const BaseReferenceInput = {
    template: `
        <div>
            <select multiple class="form-control" :id="id" style="width: 100%"></select>
        </div>
    `,
    props: {
        modelValue: [String, Number, Array],
        id: {
            type: String,
            default: ''
        },
        parent: String,
        placeholder: {
            type: String,
            default: ''
        },
    },

    
    data() {
        return {
            selected: [],
            options: [],
            select2: null
        };
    },

    watch: {
        modelValue(newval) {
            //console.log(newval)
        }
    },

    methods: {
        transformData(records) {
            if (records == undefined) return;
            for (const r of records) {
                r.text = `${r.code} - ${r.author} - ${r.title} - ${r.year}`
                r.id = r.key;
            }
            return records
        },

        setValue(val) {
            /*if (!this.select2) return;
            if (val instanceof Array) {
                this.select2.val([...val]);
            } else {
                this.select2.val([val]);
            }
            this.select2.trigger('change');*/
        }
    },

   

    created() {
        const vm = this;
        const initial = this.transformData(this.modelValue);

        setTimeout(() => {
            this.select2 = $(this.$el)
                .find('select')
                .select2({
                    placeholder: this.placeholder,
                    minimumInputLength: 1,
                    multiple: true,
                    tags: true,
                    dropdownParent: $(`#${vm.parent}`),
                    ajax: {
                        url: `/api/references`,
                        dataType: 'json',
                        delay: 250, // wait 250 milliseconds before triggering the request
                        data: function (params) {
                            var query = {
                                keywords: params.term,
                                startRow: 0,
                                rowCount: 25
                            }
                            return query;
                        },
                        processResults: function (data) {
                            return {
                                results: vm.transformData(data.data)
                            };
                        }
                    },
                    theme: "bootstrap-5",
                    selectionCssClass: "select2--medium",
                    dropdownCssClass: "select2--small",
                }).on('select2:select select2:unselect', ev => {
                    this.$emit('update:modelValue', this.select2.val());
                    this.$emit('select', ev['params']['data']);

                });;


            initial.forEach(i => {
                var option = new Option(i.text, i.id, true, true);
                this.select2.append(option).trigger('change');
            })

            this.select2.trigger({
                type: 'select2:select',
                params: {
                    data: initial
                }
            });
        }, 100)
       
    },

    beforeUnmount() {
        this.select2.select2('destroy');
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

    data() {
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
            handler(newVal) {
                if (newVal !== undefined) {
                    this.options.push(newVal)
                }
            }
        }
    },


    methods: {
        search(query) {
            if (query !== '') {
                axios.get(`/api/biodiversity?keywords=${query}&startRow=0&rowCount=25`)
                    .then(response => {
                        this.options = response.data.data.map(d => {
                            return { commonName: d.commonName, name: d.name, key: d.key }
                        })
                    }).catch(error => console.log(error))
                    .finally(() => this.loading = false)
            } else {
                this.options = [];
            }
        }
    },


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

    data() {
        return {
            selected: [],
            options: [],
            loading: false,
        }
    },


    methods: {
        search(query) {
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

        generateLabel(item) {
            return `${item.code} - ${item.author} - ${item.title} - ${item.year}`
        },
    },

    created() {
        this.options = this.modelValue
    }
}

/**
 *  Reference Widget 
 */

const ReferenceWidget = {
    template: `
        <div class="row mt-4 mb-2">
            <div class="col-md-12 h5">
                <div class="row">
                    <div class="col-md-4 d-flex py-2 align-items-center bg-light">{{ category_name }}</div>
                    <div class="col-md-8 d-flex align-items-center bg-light justify-content-end text-end">
                        <span>References {{ display }}</span> 
                        <a class="btn btn-text" data-bs-toggle="modal" :href="'#modal-'+category_id" role="button">
                            <img src="/Content/images/icon-0-24x24-documents.png" />
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade reference-list" data-bs-backdrop="static" data-bs-keyboard="false" :id="'modal-'+category_id" aria-hidden="true">
            <div class="modal-dialog modal-lgx">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalToggleLabel">References - {{ category_name }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="overflow-y:inherit !important; z-index: 1;">
                        <element-reference-select ref="referenceSearch" v-model="selected_references" />
                    </div>
                    <div class="modal-footer">
                        <button @click="cancelModal" type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="applyChange" data-bs-dismiss="modal">Apply Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `,

    components: {
        BaseSelect,
        ElementReferenceSelect
    },

    emits: ['reference-updated', 'update:modelValue'],

    props: {
        references: Array,
        category_name: String,
        category_id: [String, Number],
        update_function: Function,
    },

    data() {
        return {
            selected_references: [],
            initialList: ""
        }
    },

    watch: {
        references: {
            deep: true,
            immediate: true,
            handler(value) {
                if (typeof value != 'undefined') {
                    this.selected_references = value.filter(r => r.categoryKey == this.category_id).map(r => r.reference)
                }

            }
        },
    },

    computed: {
        display() {
            if (!this.selected_references || !this.selected_references.length) return "";
            return "(" + this.selected_references.map(r => r.code).join(", ") + ")"
        }
    },

    methods: {
        cancelModal() {
            this.selected_references = JSON.parse(this.initialList)
        },

        applyChange() {
            this.update_function({
                references: this.selected_references,
                category: this.category_id
            })
        },

        buildString(ref_list) {
            if (!this.selected_references || !this.selected_references.length) return "";
            return "(" + ref_list.map(r => r.code).join(", ") + ")"
        }
    },

    mounted() {
        this.initialList = JSON.stringify(this.selected_references)
    }
}



const BaseDropdownSelect = {
    template: `
        <el-select v-bind="$attrs" :value-key="value_field" filterable :placeholder="placeholder" style="width:100%;">
            <el-option v-for="item in options"
                        :key="item.key"
                        :label="item[label_field]"
                        :value="item">
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
    data() {
        return {
            inputVisible: false,
            inputValue: ''
        }
    },

    methods: {
        handleClose(tag) {
            this.populations.splice(this.populations.indexOf(tag), 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
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
    data() {
        return {
            inputVisible: false,
            inputValue: ''
        }
    },

    methods: {
        handleClose(tag) {
            this.synonyms.splice(this.synonyms.indexOf(tag), 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            if (this.inputValue !== "" && !this.synonyms.includes(this.inputValue)) {
                this.synonyms.push(this.inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }

    }
}