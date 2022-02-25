import pagnation from "./pagnation.js";
const url = "https://vue3-course-api.hexschool.io/v2";
const path = "constellation";
let productModal = {}
let delProductModal = {}
Vue.createApp({
    data() {
        return {
            temp: {
                imagesUrl : []
            },
            products: [],
            isadd : false,
            pagination : {},
            
        };
    },
    components :{
        pagnation        
    },
    methods: {
        checklogin() {
            const token = document.cookie.replace(
                /(?:(?:^|.*;\s*)hextoken\s*\=\s*([^;]*).*$)|^.*$/,
                "$1"
            );
            if (token) axios.defaults.headers.common["Authorization"] = token;
            else {
                alert("請先登入");
                window.location = "vue_login.html";
            }
            axios.post(`${url}/api/user/check`).then((res) => {
                console.log(res)
            });
        },
        getData(page = this.pagination.current_page) {
            axios
                .get(`${url}/api/${path}/admin/products/?page=${page}`)
                .then((res) => {
                    this.products = res.data.products
                    this.pagination = res.data.pagination
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        openmodal(status,product){
            if(status === "update"){
                this.temp = {...product}
                this.isadd = false
                productModal.show()
                if(!this.temp.imagesUrl){
                    this.temp.imagesUrl = []
                }
            }else if(status == "add"){
                this.temp = {
                    imagesUrl : [],
                }
                this.isadd = true
                productModal.show()
            }else if(status == "delete"){
                delProductModal.show()
                this.temp = {...product}
            }
        },
    },
    mounted() {
        this.checklogin();
        this.getData();
        productModal = new bootstrap.Modal(document.getElementById('productModal'))
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'))
    },
}).component('productModal',{
    props : ['temp','isadd'],
    template : '#templateForProduct',
    methods :{
        updateProduct(){
            let appUrl = `${url}/api/${path}/admin/product`
            let methods = 'post'
            if(!this.isadd){
                appUrl = `${url}/api/${path}/admin/product/${this.temp.id}`
                methods = 'put'
            }
            //新增+修改商品
            axios[methods](appUrl,{data : this.temp})
            .then( (res) => {
                console.log("內層",res)
                // this.getData()
                this.$emit('get-products')
                productModal.hide()
            }).catch((err) => {
                console.log(err)
            })
        },
    }
}).component('deleteModal',{
    props : ['temp'],
    template : '#deleteForProudct',
    methods : {
        deleteData() {
            console.log(this.temp.id)
            axios
            .delete(`${url}/api/${path}/admin/product/${this.temp.id}`)
            .then((res) => {
                this.$emit('get-products')
            })
            .catch((err) => {
                alert(err.data.message);
            });
            delProductModal.hide()
        },
    }
}).mount("#app");