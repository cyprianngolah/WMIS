const GlobalMixin = {
    data() {
        return {
            loadingFlag: null
        }
    },

    methods: {
        showLoading(message) {
            this.loadingFlag = this.$loading({
                lock: true,
                text: message || 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.95)',
            })
        },

        hideLoading() {
            if (this.loadingFlag) {
                this.loadingFlag.close()
            }
        },

        getKey(selector) {
            return parseInt($(selector).val());
        },

        createModal(selector) {
            return new mdb.Modal(document.getElementById(selector), {
                keyboard: false,
                backdrop: 'static'
            });
        }
    }
}

const DataTableMixin = {

    data() {
        return {
            tab: "None",
        }
    },


    watch: {
        tab(newVal) {
            setTimeout(() => {
                $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
            }, 1000)
            
        }
    },
}