
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
    data() {
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
        disableSave() {
            if (!this.surveyTemplate.name) return true;
            return this.surveyTemplate.name.trim() == ""
        },

        disableColumnSave() {
            return this.columnData.name.trim()=="" || this.columnData.columnType.key==0
        },

        columnsCanBeEdited() {
            return this.surveyTemplate.projectCount == 0;
        }
    },


    methods: {
        requiredColumnFormatter(value) {
            return value ? "Yes" : "No";
        },
        getTemplate() {
            this.showLoading();
            this.setKey();
            axios.get(`/api/surveytemplate/${this.surveyTemplateId}`)
                .then(response => {
                    this.surveyTemplate = response.data
                }).catch(error => console.log(error))
                .finally(() => setTimeout(() => {
                    this.hideLoading()
                }, 2000))

        },

        getColumnTypes() {
            axios.get('/api/surveytemplate/columnTypes')
                .then(response => this.columnTypes = response.data)
                .catch(error => console.log(error))

        },

        getTemplateColumns() {
            axios.get(`/api/surveytemplate/columns/${this.surveyTemplateId}`)
                .then(response => {
                    this.columns = response.data
                    this.columnData = initialColumnData
                }).catch(error => console.log(error))
        },

        saveSurveyTemplate() {
            axios.post('/api/surveytemplate/', { surveyTemplateId: this.surveyTemplateId, name: this.surveyTemplate.name })
                .then(_ => {
                    window.location.href = "/SurveyTemplate";
                }).catch(error => console.log(error))
        },


        save() {
            this.columnData.surveyTemplateId = this.surveyTemplateId;

            axios.post('/api/surveytemplate/column', this.columnData)
                .then(_ => {
                    this.getTemplateColumns()
                    this.createColumnModal.hide()
                }).catch(error => console.log(error))
                
        },

        async showEditModal(columnData) {
            this.columnData = await JSON.parse(JSON.stringify(columnData))
            this.createColumnModal.show();
        },

        showCreateModal() {
            this.columnData = JSON.parse(JSON.stringify(initialColumnData))
            this.createColumnModal.show();
        },

        removeColumn(id) {
            axios.delete(`/api/surveytemplate/column/${id}`)
                .then(_ => {
                    this.getTemplateColumns()
                }).catch(error => console.log(error))
        },

        setKey() {
            this.surveyTemplateId = this.getKey("#templateKey");
        },

        handleCancelModal() {
            this.columnData = initialColumnData;
        }
    },

    mounted() {
        this.getTemplate()
        this.getTemplateColumns()
        this.createColumnModal = this.createModal("createColumnModal");
    },

    created() {
        this.getColumnTypes();
        this.setKey();
    },

});

app.use(ElementPlus)
app.mount('#wmis-app')