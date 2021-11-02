class PicSearch{
    key = '24140308-35614eb13a9ed984638396bc8';
    key1 = '563492ad6f917000010000010abea7c2fc8a4675b4d2f186b78086c3';
    
    constructor() {
        this.pageNumber = 1;
        this.total = 0;
        this.totalPages = 1;
        this.perPage = 12;
        this.query = '';
        this.data = [];
        this.lastAction = '';
    }

    getUrl(){
        let q = this.query.replace(' ', '+');
        // return `https://api.pexels.com/v1/search?query=${q}&per_page=${this.perPage}&page=${this.pageNumber}`;
        return `https://pixabay.com/api/?key=${this.key}&q=${q}&per_page=${this.perPage}&page=${this.pageNumber}`;
    }

    fetch(){
        let url = this.getUrl();
        
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                //   'Authorization': this.key1
                },
                // referrerPolicy: 'no-referrer',
              })
            .then(res => res.json())
            .then((data) => { 

                this.total = data.totalHits;
                this.totalPages = Math.floor(this.total / this.perPage);
                this.data = this.data.concat(data.hits);

                resolve(data); 
            })
            .catch((err) => { reject(err); });
        })
        // return fetch(this.getUrl()).then(res => res.json());
    }

    isNext(){
        return this.lastAction === 'next';
    }

    next(){
        this.lastAction = 'next';
        this.pageNumber++;
        if(this.pageNumber >= this.totalPages)
            this.pageNumber = this.totalPages;
        return this.fetch();
    }

    previous(){
        this.lastAction = 'previous';
        this.pageNumber--;
        if(this.pageNumber <= 0)
            this.pageNumber = 1;
        return this.fetch();
    }

    getPageNumber(){
        return this.pageNumber;
    }

    getTotalPages(){
        return this.totalPages;
    }

    setSearch(q){
        this.lastAction = 'set_search';
        if(this.query != q)
            this.data = [];

        this.query = q;
    }

    getDataById(id){
        let f = this.data.filter(function(itm){
            return itm.id == id;
        });
        // console.log(f, this.data);
        if(f.length > 0)
            return f[0];
        return {};
    }
}

export default PicSearch;