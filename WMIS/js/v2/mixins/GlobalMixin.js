const GlobalMixin = {
    data: function() {
        return {
            loadingFlag: null
        }
    },

    methods: {
        showLoading: function(message) {
            this.loadingFlag = this.$loading({
                lock: true,
                text: message || 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.95)',
            })
        },

        hideLoading: function() {
            if (this.loadingFlag) {
                this.loadingFlag.close()
            }
        },

        getKey: function(selector) {
            return parseInt($(selector).val());
        },

        createModal: function(selector) {
            return new mdb.Modal(document.getElementById(selector), {
                keyboard: false,
                backdrop: 'static'
            });
        }
    }
}

const DataTableMixin = {

    data: function() {
        return {
            tab: "None",
        }
    },


    watch: {
        tab: function(newVal) {
            setTimeout(() => {
                $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
            }, 500)
            
        }
    },
}