
const SurveyObservations = {
    mixins: [GlobalMixin],
    components: {
        BaseButton,
        BaseInput,
        GoogleMap
    },

    props: {
        survey_id: Number,
    },

    template: "#survey-observations",

    data() {
        return {
            table: null,
            observationUploads: [],
            observationData: [],
            observations: null,
            initializedMap: false,
            observationsTableInitialized: false,
            selectedPass: null,

            argosPassStatuses: [],
            selectedPassForm: {},
            loading: false,

            // modals
            pickHeaderModal: null,
            columnMappingModal: null,
            dataPreviewModal: null,
            resumeObservationUploadModal: null,
            uploadObservationsModal: null,
            editObservationModal: null,


            columns: [],
            templateColumnMappings: [],
            workingUpload: null,
            workingData: [],
            headerRowIndex: 0,
            firstDataRowIndex: 1,
            observationConfirmationData: []
        }
    },

    computed: {
        
        hasObservations() {
            if (this.observations !== null && this.observationData.length > 0) {
                return true
            }
            return false;
        },
        rowsPicked() {
            return this.headerRowIndex >= 0 && this.firstDataRowIndex > 0 && this.headerRowIndex < this.firstDataRowIndex;
        },
        columnsPicked() {
            for (var i = 0; i < this.templateColumnMappings.length; i++) {
                var tc = this.templateColumnMappings[i];
                if (tc.surveyTemplateColumn.isRequired && tc.columnIndex == null)
                    return false;
            }
            return true;
        },

        uploadCellValues() {
            return this.workingData.map(wd => wd.cellValues)
        }
    },

    watch: {
        selectedPass: {
            deep: true,
            handler(newVal) {
                if (newVal && newVal.key) {
                    this.selectedPassForm = {
                        key: newVal.key,
                        argosPassStatusId: newVal.observationRowStatusId,
                        comment: newVal.comment
                    }
                }
            }
        },

        headerRowIndex(newValue) {
            if (newValue != null && (newValue >= this.firstDataRowIndex || this.firstDataRowIndex == null)) {
                this.firstDataRowIndex = ++newValue;
            }
            if (newValue == 0) {
                this.firstDataRowIndex = 1;
            }
        }
    },

    methods: {
        getObservations() {
            axios.get(`/api/observation/survey/${this.survey_id}/data`)
                .then(response => {
                    this.observations = response.data
                    this.observationData = response.data.observationData
                }).then(() => {
                    if (!this.observationsTableInitialized) {
                        this.initDataTable()
                        this.observationsTableInitialized=true
                    }
                    if (!this.initializedMap && this.hasObservations) {
                        this.initializedMap = true
                    }
                }).catch(error => {
                    console.log(error)
                })
        },

        reviewObservation(observation) {
            console.log(observation)
        },

        formatDate(dte) {
            if (!dte) return null;
            return moment(dte).format('L h:mm a')
        },

        getPassStatus(pass) {
            return pass.observationRowStatusId || 0;
        },

        getObservationUploads() {
            axios.get(`/api/observation/project/${this.survey_id}`)
                .then(response => this.observationUploads = response.data)
                .catch(error => console.log(error))
        },

        handleSelectedPass(data) {
            this.selectedPass = data
            this.editObservationModal.show();
        },

        getArgosPassStatuses() {
            axios.get("/api/argos/passStatuses?startRow=0&rowCount=500")
                .then(response => this.argosPassStatuses = response.data.data)
            .catch(error => console.log(error))
        },

        initDataTable() {
            const _this = this;
            this.table = $('#locationTable').DataTable({
                "pageLength": 200,
                "scrollX": true,
                "scrollY": 500,
                "scrollCollapse": true,
                "select": 'single',
                "dom": '<"top">rt<"bottom"ip><"clear">',
                "columnDefs": [
                    {
                        "targets": [0,1],
                        "visible": false,
                        "searchable": false
                    },
                ]
            });

            $('#locationTable tbody').on('click', 'tr', function () {
                _this.table.$('tr.highlightPassRow').removeClass('highlightPassRow')
                var rowKey = _this.table.row(this).data()[0];
                if (rowKey) {
                    const data = _this.observationData.find(d => d.key == parseInt(rowKey))
                    if (data) {
                        _this.selectedPass = data
                        $(this).addClass('highlightPassRow');
                    }
                }
            });
        },

        setSelected(key) {
            this.editObservationModal.show();
        },

        getStatusHighlight(statusId) {
            if (!statusId) return "";
            const status = this.argosPassStatuses.find(i => i.key == statusId);
            return status.isRejected ? 'rejected-status' : 'warning-status'
        },

        updateObservationRow() {
            if (!this.selectedPass) return;
            axios.put(`/api/observation/survey/row/`, this.selectedPassForm)
                .then(_ => {
                    this.observationData.forEach((element, index) => {
                        if (element.key === this.selectedPassForm.key) {
                            element.comment = this.selectedPassForm.comment;
                            element.observationRowStatusId = this.selectedPassForm.argosPassStatusId;
                        }
                    });
                    
                    editObservationModal.hide()
                }).catch(e => console.log(e))
        },

        uploadObservationFile() {
            const frm = this.$refs.observationFileUploadForm
            frm.submit();
        },

        handleUploadSuccess(observationUploadId) {
            axios.get(`/api/observation/upload/${observationUploadId}`)
                .then(response => {
                    this.workingUpload = response.data
                    this.observationUploads.push(response.data)
                    this.uploadObservationsModal.hide()
                })
                .then(() => this.showHeaderPicker())
                .catch(error => console.log(error))    
            
        },

        showHeaderPicker() {
            this.headerRowIndex = this.workingUpload.headerRowIndex || 0;
            this.firstDataRowIndex = this.workingUpload.firstDataRowIndex || 1;
            let observationUploadKey = this.workingUpload.key;
            axios.get(`/api/observation/upload/${observationUploadKey}/rows`)
                .then(response => {
                    this.workingData = response.data.map(d => {
                        let cells = d.cellValues.map((cv,index) => {
                            return {
                                id: d.rowIndex + ' - ' + index,
                                value: cv
                            }
                        })
                        return {
                            rowIndex: d.rowIndex,
                            cellValues: cells
                        }
                    });
                })
                .then(() => {
                    this.pickHeaderModal.show()
                })
                .catch(error => console.log(error))
        },

        saveHeaderPickerRows() {
            this.workingUpload.headerRowIndex = this.headerRowIndex;
            this.workingUpload.firstDataRowIndex = this.firstDataRowIndex;
            this.workingUpload.status.key = 2;
            this.loading = true;
            axios.put("/api/observation/upload/", this.workingUpload)
                .then(() => {
                    this.showColumnMapperModal()
                    this.loading = false;
                })
                .catch(error => console.log(error))
        },

        showColumnMapperModal() {
            let observationUploadKey = this.workingUpload.key;
            this.loading = true;
            axios.all([
                axios.get(`/api/observation/upload/${observationUploadKey}/templateColumnMappings`),
                axios.get(`/api/observation/upload/${observationUploadKey}/columns`)
            ]).then(axios.spread((...responses) => {
                this.templateColumnMappings = responses[0].data
                this.columns = responses[1].data
            })).then(() => {
                this.pickHeaderModal.hide()
                this.columnMappingModal.show()
                this.loading = false;
            }).catch(error => {
                console.log(error)
            })
        },

        saveMappedColumns() {
            let observationUploadKey = this.workingUpload.key;
            this.loading = true;
            axios.put(`/api/observation/upload/${observationUploadKey}/templateColumnMappings/`, this.templateColumnMappings)
                .then(() => {
                    this.showPreviewModal()
                    this.loading = false
                }).catch(error => console.log(error))
        },

        showPreviewModal() {
            let observationUploadKey = this.workingUpload.key;
            this.loading = true;
            axios.get(`/api/observation/upload/${observationUploadKey}/data/`)
                .then((response) => {
                    this.observationConfirmationData = response.data
                }).then(() => {
                    this.columnMappingModal.hide();
                    this.dataPreviewModal.show();
                    this.loading = false;
                }).catch(error => console.log(error))

            
        },

        confirmData() {
            this.workingUpload.status.key = 4;
            this.loading = true;
            axios.put("/api/observation/upload/", this.workingUpload)
                .then(() => {
                    this.dataPreviewModal.hide();
                    this.getObservations();
                    this.getObservationUploads();
                    this.loading = false;
                }).catch(error => console.log(error))
        },

        resumeObservationUpload(data) {
            this.resumeObservationUploadModal.hide();
            if (!data.status.nextStep) return;
            this.workingUpload = data;
            // Depending on the current state of the resumed Upload, open the appropriate Modal
            let nextStepKey = data.status.nextStep.key;

            switch (nextStepKey) {
                case 2:
                    this.showHeaderPicker();
                    break;
                case 3:
                    this.showColumnMapperModal();
                    break;
                case 4:
                    this.showPreviewModal();
                    break;
                case 5:
                    this.showPreviewModal();
                    break;
            }
        },

        

        
    },

    mounted() {
        const vm = this;
        this.getObservations()
        this.getArgosPassStatuses()
        this.getObservationUploads()

        this.uploadObservationsModal = this.createModal('uploadObservationsModal');
        this.pickHeaderModal = this.createModal('pickHeaderModal');
        this.columnMappingModal = this.createModal('columnMappingModal');
        this.dataPreviewModal = this.createModal('dataPreviewModal');
        this.resumeObservationUploadModal = this.createModal('resumeObservationUploadModal');
        this.editObservationModal = this.createModal('editObservationModal');

        document.getElementById('editObservationModal').addEventListener('hidden.bs.modal', () => {
            this.selectedPass = null;
            this.selectedPassForm = {};
            this.table.$('tr.highlightPassRow').removeClass('highlightPassRow');
        });

        // Create IE + others compatible event handler
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";


        // Listen to message from upload iframe
        eventer(messageEvent, function (event) {
            if (event.origin.indexOf(location.hostname) == -1) {
                alert('Origin not allowed! ' + event.origin + " != " + location.hostname);
                return;
            }

            if (event.data.indexOf("observationUploadError:") == 0) {
                var message = event.data.replace("observationUploadError:", "");
                vm.uploadError = message;
            }else if (event.data.indexOf("observationUpload:") == 0) {
                var observationUploadKey = event.data.replace("observationUpload:", "");
                vm.handleUploadSuccess(observationUploadKey);
            }

        }, false);
    },


}