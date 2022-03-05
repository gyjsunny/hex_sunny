import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js'

Object.keys(VeeValidateRules).forEach((rule) => {
    if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const url = "https://vue3-course-api.hexschool.io/v2";
const path = "constellation";//

const app = Vue.createApp({
    data(){
        return {
            products : [],
            productId:'',
            cartData : {},
            isLoadingItem : '',
            isLoading : false
        }
    },
    methods: { 
        clearitem(){
            this.isLoadingItem = ''
        } ,
        getProduct(){         
            axios.get(`${url}/api/${path}/products/all`)
            .then((res) => {
                this.products = res.data.products
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        openProductModal(id){
            this.isLoadingItem = id
            this.productId = id
            this.isLoading = true
            setTimeout(() => {
                this.isLoading = false
                this.$refs.productModal.openModal()
            }, 600)
        
        },
        addCart(id,qty = 1){
            const data = {
                product_id : id,
                qty
            }
            this.isLoadingItem = id
            axios.post(`${url}/api/${path}/cart`, {data})
            .then((res) => {
                alert(res.data.message)
                this.getCart()
                this.$refs.productModal.closeModal()
                this.isLoadingItem = ''
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        updatItemCart(item){
            const data = {
                product_id : item.id,
                qty : item.qty
            }
            this.isLoadingItem = item.id
            axios.put(`${url}/api/${path}/cart/${item.id}`, {data})
            .then((res) => {
                alert(res.data.message)
                this.getCart()
                this.isLoadingItem = ''
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        removeCart(id){
            this.isLoadingItem = id
            axios.delete(`${url}/api/${path}/cart/${id}`)
            .then((res) => {
                alert(res.data.message)
                this.getCart()
                this.isLoadingItem = ''
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        getCart(){
            axios.get(`${url}/api/${path}/cart`)
            .then((res) => {
                this.cartData = res.data.data
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        clearCart(){
            axios.delete(`${url}/api/${path}/carts`)
            .then((res) => {
                this.cartData = {}
                alert(res.data.message)
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/;
            return phoneNumber.test(value) ? true : "需要正確的電話號碼";
        },
        onSubmit() {
            alert("表單送出")
        },
    },
    mounted() {
        this.getProduct()
        this.getCart()
    },
})

app.component('productModal',{
    props:['id'],
    template: '#userProductModal',
    data(){
        return {
            modal : {},
            product : {},
            qty: 1,
        }
    },
    watch : {
        id(){
            this.getProduct()
            this.qty = 1
        },
    },
    methods:{
        openModal(){
            this.modal.show()            
        },
        closeModal(){
            this.modal.hide()  
        },   
        getProduct(){
            axios.get(`${url}/api/${path}/product/${this.id}`)
            .then((res)=>{
                this.product = res.data.product
            }).catch((err)=>{
                alert(err.data.message)
            })
        },
        addToCart(){
            this.$emit('add-cart',this.product.id,this.qty)
            
        }
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal) 
        this.$refs.modal.addEventListener('hidden.bs.modal', () => {
            this.$emit('clearitem')
        })  
    }
})

app.component("Loading", VueLoading.Component);
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

app.mount('#app')