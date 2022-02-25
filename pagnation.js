export default{
    props : ['pages'],
    template : `<nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" 
                v-if="pages.has_pre"
                @click="$emit('get-page',pages.current_page - 1)">
                <a class="page-link" href="#">Previous</a>
            </li>        
            <li class="page-item" 
                :class="{active : page === pages.current_page}"
                v-for="page in pages.total_pages" :key="page + 'page'"
            ><a class="page-link" href="#" @click="$emit('get-page',page)">{{page}}</a>
            </li>
            <li class="page-item" 
                v-if="pages.has_next" 
                @click="$emit('get-page',pages.current_page + 1)">
                <a class="page-link" href="#">Next</a>
            </li>
        </ul>
    </nav>`
}