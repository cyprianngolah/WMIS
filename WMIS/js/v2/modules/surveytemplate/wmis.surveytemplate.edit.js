
const initialColumnData = {
    key: 0,
    surveyTemplateId: 0,
    isRequired: false,
    name: '',
    order: 0,
    columnType: {
        name: '',
        key: 0
    }
}

const app = Vue.createApp({
    mixins: [GlobalMixin],
    components: {
        BaseButton,
        BaseLinkButton,
        BaseInput,
    },
    data: function() {
        return {
            surveyTemplateId: 0,
            surveyTemplate: {},

            columnData: initialColumnData,
            updateColumnForm: {},
            columns:[],
            columnTypes: [],

            createColumnModal: null,
            editColumnModal: null,
            selectedForEdit: {}
        }
    },

    computed: {
        disableSave: function() {
            if (!this.surveyTemplate.name) return true;
            return this.surveyTemplate.name.trim() == ""
        },

        disableColumnSave: function() {
            return this.columnData.name.trim()=="" || this.columnData.columnType.key==0
        },

        columnsCanBeEdited: function() {
            return this.surveyTemplate.projectCount == 0;
        }
    },


    methods: {
        requiredColumnFormatter: function(value) {
            return value ? "Yes" : "No";
        },
        getTemplate: function() {
            this.showLoading();
            this.setKey();
            axios.get(`/api/surveytemplate/${this.surveyTemplateId}`)
                .then(response => {
                    this.surveyTemplate = response.data
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.hideLoading()
                }, 200))

        },

        getColumnTypes: function() {
            axios.get('/api/surveytemplate/columnTypes')
                .then(response => this.columnTypes = response.data)
                .catch(error => console.log(error))

        },

        getTemplateColumns: function() {
            axios.get(`/api/surveytemplate/columns/${this.surveyTemplateId}`)
                .then(response => {
                    this.columns = response.data
                    this.columnData = initialColumnData
                }).catch(error => console.log(error))
        },

        saveSurveyTemplate: function() {
            axios.post('/api/surveytemplate/', { surveyTemplateId: this.surveyTemplateId, name: this.surveyTemplate.name })
                .then(_ => {
                    window.location.href = "/SurveyTemplate";
                }).catch(error => console.log(error))
        },


        save: function() {
            this.columnData.surveyTemplateId = this.surveyTemplateId;

            axios.post('/api/surveytemplate/column', this.columnData)
                .then(_ => {
                    this.getTemplateColumns()
                    this.createColumnModal.hide()
                }).catch(error => console.log(error))
                
        },

        showEditModal: function(columnData) {
            this.columnData = JSON.parse(JSON.stringify(columnData))
            this.createColumnModal.show();
        },

        showCreateModal: function() {
            this.columnData = JSON.parse(JSON.stringify(initialColumnData))
            this.createColumnModal.show();
        },

        removeColumn: function(id) {
            axios.delete(`/api/surveytemplate/column/${id}`)
                .then(_ => {
                    this.getTemplateColumns()
                }).catch(error => console.log(error))
        },

        setKey: function() {
            this.surveyTemplateId = this.getKey("#templateKey");
        },

        handleCancelModal: function() {
            this.columnData = initialColumnData;
        }
    },

    mounted: function() {
        this.getTemplate()
        this.getTemplateColumns()
        this.createColumnModal = this.createModal("createColumnModal");
    },

    created: function() {
        this.getColumnTypes();
        this.setKey();
    },

});

app.use(ElementPlus)
app.mount('#wmis-app')