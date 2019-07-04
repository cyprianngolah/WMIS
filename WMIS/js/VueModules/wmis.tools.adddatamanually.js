new Vue({
    el: "#app",
   // mounted(){console.log("Hello Boy")},
    data: {
        busy: false,
        message: {
            text: '',
            class: ''
        },
        showTable: false,
        file: '',
        data: [],
        fileChosen: false
    },

    methods: {
        handleFileUpload() {
            this.file = this.$refs.downloadedFile.files[0];
            this.fileChosen = true;
        },

        uploadFile() {
            this.busy = true;
            let formData = new FormData();
            formData.append('file', this.file);
            axios.post('/api/tools/retrievedCollarData/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    this.data = response.data;
                    this.showTable = true;
                    this.busy = false;
                    this.$refs.downloadedFile.value = ""
                    this.fileChosen = false;
                }).catch(error => {
                    this.busy = false;
                    console.log(error.response);
                })
        },

        runProcess() {
            this.busy = true;
            this.message.text = '';
            this.message.class = '';
            axios.post("/api/tools/loaddatamanually", this.data)
                .then(response => {
                    this.message.text = "Data successfully loaded"
                    this.message.class = "success"
                    this.busy = false
                    this.fileChosen = false
                    setTimeout(() => {
                        //window.location.href = "/WMISTools/PostRetrievalDataProcessing";
                    }, 4000)
                }).catch(error => {
                    console.log(error.response)
                    this.message.text = "An error occurred during the process. Please refresh the page and try again"
                    this.message.class = "danger"
                    this.busy = false;
                })
        }


    }
})
