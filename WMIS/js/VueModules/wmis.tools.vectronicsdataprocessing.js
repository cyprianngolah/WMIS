
new Vue({
    el: "#app",
    name: "VectronicLoad",
    data: {
        busy: false,
        message: {
            text: '',
            class: ''
        },
        wb: {},
        sheets: [],
        fileSelected: false,
        showTable: false,
        finalData: [],
        headers: [],
        sheetData: [],
        selections: {
            sheet: '',
            animalIdCol: '',
            latitudeCol: '',
            longitudeCol: '',
            locationDateCol: '',
            locationClassCol: ''
        }
    },
    
    methods: {
        handleDrop: function(e) {
            this.busy = true;
            this.wb = {};
            this.sheets = [];
            var file = this.$refs.selectedFile.files[0];
            //var file = e.target.files[0]
            var reader = new FileReader();

            reader.onload = (e) => {
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                this.wb = wb
                this.sheets = this.wb.SheetNames
            }

            reader.onloadend = (evnt) => {
                this.fileSelected = true
                this.busy = false
            }
            reader.readAsBinaryString(file);
        },

        sheetChanged: function() {
            const ws = this.wb.Sheets[this.selections.sheet]
            this.get_header_row(ws)
            this.sheetData = XLSX.utils.sheet_to_json(ws)
            this.generatePreview()
        },

        generatePreview: function() {
            if (this.selections.animalIdCol
                && this.selections.latitudeCol
                && this.selections.longitudeCol
                && this.selections.locationDateCol
                && this.selections.locationClassCol) {
                this.showTable = true
                var finalData = [];
                this.sheetData.forEach(d => {
                    finalData.push({
                        AnimalId: d[this.selections.animalIdCol],
                        Latitude: +d[this.selections.latitudeCol],
                        Longitude: +d[this.selections.longitudeCol],
                        LocationDate: new Date(d[this.selections.locationDateCol]),
                        LocationClass: d[this.selections.locationClassCol]
                    })
                })
                this.finalData = finalData
                console.log(this.finalData)
            } else {
                this.showTable = false
            }
        },

        get_header_row: function(sheet) {
            var headers = [], range = XLSX.utils.decode_range(sheet['!ref']);
            var C, R = range.s.r; /* start in the first row */
            for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
                var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
                var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
                if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
                headers.push(hdr);
            }
            this.headers = headers;
        },

        loadData: function() {
            this.busy = true;
            this.message.text = ''
            this.message.class = ''
            axios.post("/api/tools/loadVectronicsData", this.finalData)
                .then(response => {
                    this.message.text = "Process completed successfully."
                    this.message.class = "success"
                    this.busy = false
                    setTimeout(() => {
                        //window.location.href = "/WMISTools/BatchReject";
                    }, 3000)
                }).catch(error => {
                    console.log(error.response)
                    this.message.text = "An error occurred during the process. Please refresh the page and try again"
                    this.message.class = "danger"
                    this.busy = false;
                })
        }
    }
})
