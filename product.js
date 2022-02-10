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
        };
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
            axios.post(`${url}/api/user/check`).then((res) => {});
        },
        getData() {
            axios
                .get(`${url}/api/${path}/admin/products`)
                .then((res) => {
                    this.products = res.data.products;
                    console.log(res);
                })
                .catch((err) => {
                alert(err.data.message);
                });
        },
        deleteData() {
            console.log(this.temp.id)
            axios
            .delete(`${url}/api/${path}/admin/product/${this.temp.id}`)
            .then((res) => {
                this.getData();
            })
            .catch((err) => {
                alert(err.data.message);
            });
            delProductModal.hide()
            this.temp = {
                imagesUrl : []
            }
        },
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
                console.log(res)
                this.getData()
                productModal.hide()
                this.temp = {
                    imagesUrl : []
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        openmodal(status,product){
            console.log(status,product)
            if(status === "update"){
                this.temp = {...product}
                this.isadd = false
                productModal.show()
            }else if(status == "add"){
                this.temp = {
                    imagesUrl : [],
                }
                this.isadd = true
                productModal.show()
            }else if(status == "delete"){
                delProductModal.show()
                this.temp = {...product}
                // this.deleteData(this.temp.id)
            }
        },
    },
    mounted() {
        this.checklogin();
        this.getData();
        productModal = new bootstrap.Modal(document.getElementById('productModal'))
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'))
    },
}).mount("#app");