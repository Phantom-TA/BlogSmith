class ApiClient {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api',
        this.defaultHeaders ={
            'Content-type' :'application/json',
            'Accept':'application/json'
        };
    }

    async customFetch(endpoint , options ={}){
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const headers = { ...this.defaultHeaders , ...options.headers};

            const config={
                ...options,
                headers,
                credentials: 'include'
            };
            console.log(`Fetching URL : ${url}`)
            const response = await fetch(url,config)
            if(response.status === 401){
                const refreshResponse = await fetch(`${this.baseUrl}/refresh`,{
                    method:'POST',
                    credentials:'include'
                })

                if(refreshResponse.ok){
                    const retry = await fetch(url,config)
                    return await retry.json()
                }
            
                else{
                    throw new Error('Session expired')
                }  
            }
            const data = await response.json();
            return data;
        } 
        catch (error) {
            console.error('API error:' ,error)
            throw error;
        }
    }

    async register(data) {
            
        return this.customFetch('/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async login(data) {
        return this.customFetch('/login',{
            method: 'POST',
            body: JSON.stringify(data)
        })
    }
    async logout() {
        return this.customFetch('/logout',{
            method: 'POST'
        })
    }
    async refreshToken() {
        return this.customFetch('/refresh',{
            method: 'POST'
            
        })
    }
    async changePassword(data) {
        return this.customFetch('/change-password',{
            method: 'PUT',
            body: JSON.stringify(data)
        })
    }

    async createBlog(data) {
     
        return this.customFetch('/blog/create',{
            method: 'POST',
            body: JSON.stringify(data)
        })
    }
    async editBlog(blogId,data) {
        return this.customFetch(`/blog/${blogId}/edit`,{
            method: 'PUT',
            body: JSON.stringify(data)
        })
    }
    async deleteBlog(blogId) {
        return this.customFetch(`/blog/${blogId}`,{
            method: 'DELETE'
            
        })
    }
    async getBlogById(blogId) {
        return this.customFetch(`/blog/${blogId}`,{
            method: 'GET',
           
        })
    }
    async getAllBlogs(page=1){
        return this.customFetch(`/blogs?page=${page}`,{
            method:'GET'
        })
    }
    async getUserBlogs(){
        return this.customFetch('/user/blogs',{
            method:'GET'
        })
    }
    async likeBlog(blogId){
        return this.customFetch(`/blog/${blogId}/like`,{
            method:'PUT'
        })
    }
    async getCurrentUser() {
        return this.customFetch('/me', {
            method: 'GET'
        });
    }

}
const apiClient = new ApiClient();
export default apiClient
