
const app = Vue.createApp({
    mixins: [GlobalMixin],

    components: {
        BaseButton,
        BaseLinkButton
    },
    data: function() {
        return {
            table: null,
            draw: 1,
            selectedKey: null,
            form: {
                familyKey: '',
                groupKey: '',
                orderKey: '',
                keywords: '',
            },

            showModal: false,
            uploadError: ""
        }
    },

    computed: {
        isSelected: function() {
            return this.selectedKey !== null && this.selectedKey !== undefined;
        }
    },

    watch: {
        draw: function() {
            this.selectedKey = null;
        }
    },


    methods: {
        downloadSelectedFile: function() {
            window.open("/api/biodiversity/uploads/download?fileName=" + this.selectedKey, '_blank');
        },

        uploadObservationFile: function() {
            this.showLoading()
            const frm = this.$refs.uploadSpeciesForm
            frm.submit();

            setTimeout(() => {
                this.hideLoading()
            }, 2000)
        },

        // listens to upload event from upload iframe.
        addEventHandlers: function() {
            const vm = this;
            // Create IE + others compatible event handler
            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

            // Listen to message from upload iframe
            eventer(messageEvent, function(event) {
                if (event.origin.indexOf(location.hostname) == -1) {
                    alert('Origin not allowed! ' + event.origin + " != " + location.hostname);
                    return;
                }
                if (event.data.indexOf("observationUploadError:") == 0) {
                    var message = event.data.replace("observationUploadError:", "");
                    vm.uploadError = message;
                }
                if (event.data.indexOf("FileDownloadError:") == 0) {
                    var message = event.data.replace("FileDownloadError:", "");
                    vm.uploadError = message;
                }
                else if (event.data.indexOf("BiodiversityBulkUpload") == 0) {
                    window.location.href = "/BioDiversity/Upload";
                }
            }, false);
        }
    },

    mounted: function() {
        this.addEventHandlers();
    },

    created: function() {
        const vm = this;
        document.title = "WMIS Biodiversity";
        $(document).ready(function () {
            vm.table = $("#bulkUploadTable").DataTable({
                "pageLength": 15,
                "scrollX": true,
                "searching": false,
                "processing": true,
                "serverSide": true,
                "select": 'single',
                "ajax": {
                    "url": "/api/biodiversity/uploads/",
                    "data": function (d, settings) {
                        let sortDirection = null;
                        let sortedColumnName = null;

                        if (settings.aaSorting.length > 0) {
                            sortDirection = settings.aaSorting[0][1];
                            let sortedColumnIndex = settings.aaSorting[0][0];
                            sortedColumnName = settings.aoColumns[sortedColumnIndex].mData;
                        }

                        vm.draw = settings.iDraw

                        return {
                            startRow: d.start,
                            rowCount: d.length,
                            sortBy: sortedColumnName,
                            sortDirection: sortDirection,
                            i: settings.iDraw,
                        }

                    },
                    "dataSrc": function (json) {
                        json.draw = vm.draw;
                        json.recordsTotal = json.resultCount;
                        json.recordsFiltered = json.resultCount;

                        return json.data
                    },

                    "drawCallback": function (settings) {
                        vm.selectedKey = null;
                        vm.table.$('tr.bg-info').removeClass('bg-info');
                    }
                },
                "dom": '<"top">rt<"bottom"ip><"clear">',
                "columns": [
                    { "data": "originalFileName" },
                    { "data": "uploadType" },
                    {
                        "data": "createdAt",
                        "render": function (data, type, row) {
                            if (typeof (data) != 'undefined' && data != null)
                                return moment(data, moment.ISO_8601).local().format('L h:mm a');
                            else
                                return "";
                        }
                    }
                ],
            });

            $('#bulkUploadTable tbody').on('click', 'tr', function () {
                vm.table.$('tr.bg-info').removeClass('bg-info');
                const data = vm.table.row(this).data();
                if ($(this).hasClass('bg-info') || data.fileName === vm.selectedKey) {
                    $(this).removeClass('bg-info');
                    vm.selectedKey = null
                } else {
                    if (data) {
                        vm.selectedKey = data.fileName
                        $(this).addClass('bg-info');
                    }
                }
            });

        });

    },

});

app.use(ElementPlus)
app.mount('#wmis-app')