


new Vue({
    el: "#app",
    name: "OtherCleanup",
    data: {
        busy: false,
        message: {
            text: '',
            class: ''
        }
    },
    
    methods: {
        rejectPredeploymentLocations: function() {
            this.busy=true
            axios.get(`/api/tools/rejectPreDeployment`)
                .then(response => {
                    var cnt = response.data
                    this.message.text = 'Process completed successfully. Number of rows affected: ' + cnt ;
                    this.message.class = 'success'
                    this.busy = false

                    setTimeout(() => {
                        this.message.text = '';
                        this.message.class = '';
                    },4000)
                })
                .catch((error) => {
                    this.busy = false
                    thiis.message.text = 'Something went wrong. Please refresh the page and try again'
                    this.message.class = 'danger'
                })
        },

        rejectExactDuplicates: function() {
            this.busy = true
            axios.get(`/api/tools/rejectDuplicates`)
                .then(response => {
                    var cnt = response.data
                    this.message.text = 'Process completed successfully. Number of rows affected: ' + cnt;
                    this.message.class = 'success'
                    this.busy = false

                    setTimeout(() => {
                        this.message.text = '';
                        this.message.class = '';
                    }, 4000)
                })
                .catch((error) => {
                    this.busy = false
                    thiis.message.text = 'Something went wrong. Please refresh the page and try again'
                    this.message.class = 'danger'
                })
        },

        rejectPostInactiveDate: function() {
            this.busy = true
            axios.get(`/api/tools/rejectAfterInactiveDate`)
                .then(response => {
                    var cnt = response.data
                    this.message.text = 'Process completed successfully. Number of rows affected: ' + cnt;
                    this.message.class = 'success'
                    this.busy = false

                    setTimeout(() => {
                        this.message.text = '';
                        this.message.class = '';
                    }, 4000)
                })
                .catch((error) => {
                    this.busy = false
                    this.message.text = 'Something went wrong. Please refresh the page and try again'
                    this.message.class = 'danger'
                })
        }
    }
})
