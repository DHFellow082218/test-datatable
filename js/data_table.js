export default class DataTable
{
    state                           =           {
                                                    "current_page"      :       0, 
                                                    "items_per_page"    :       5, 
                                                };
    table; 
    data; 

    constructor(table, wrapper)
    {
        this.table                  =           this.create_table_structure(table); 
        this.data                   =           this.get_table_data(); 

        this.setup_pagination();
        this.add_events();
        this.append_to_wrapper(wrapper);         
    }

    create_table_structure(table)
    {
        const wrapper               =           document.createElement('div');
        const structure             =           `<section class='data-table-header'>
                                                        <aside class='data-table-item-show'>
                                                            <strong>Show</strong>
                                                            <span class="custom-select">
                                                                <select class=''>
                                                                    <option value="5" selected>5</option>
                                                                    <option value="10">10</option>
                                                                    <option value="15">15</option>
                                                                    <option value="20">20</option>
                                                                    <option value="20">25</option>
                                                                    <option value="ALL">ALL</option>
                                                                </select>
                                                                <span class="custom-arrow">
                                                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                                </span>
                                                            </span>
                                                            <strong>Items</strong>
                                                        </aside>
                                                        <aside class='data-table-item-search'>
                                                            <label for="search-item">Search :</label>
                                                            <input id="search-item" type="text" class='custom-input' placeholder="Search">
                                                        </aside>
                                                    </section>
                                                    <section class='data-table-main'>
                                                                                                      
                                                    </section>
                                                    <section class='data-table-footer'>                  
                                                        <ul class='data-table-page-select'>
                                                            <li class='page-previous'>Previous</li>
                                                            <li class='active'>1</li>
                                                            <li>2</li>
                                                            <li class='page-next'>Next</li>
                                                        </ul>
                                                    </section>`;     
                                                    
        wrapper.classList.add('data-table'); 
        wrapper.innerHTML         =             structure; 
        wrapper.querySelector('.data-table-main').appendChild(table); 

        return wrapper; 
    }

    get_table_data()
    {
        return Array.prototype.slice.call(this.table.querySelectorAll('table tbody tr')); 
    }

    setup_pagination()
    {
        const start             =           this.state['items_per_page'] * this.state['current_page']; 
        const end               =           this.state['items_per_page'] == 'ALL' ? this.data.length :  (start + this.state['items_per_page']); 

        const data              =           this.data.slice(start, end);
        const pages             =           Math.ceil(this.data.length / this.state["items_per_page"]);
        let   buttons           =           ''; 

      
        this.table.querySelector('table tbody').innerHTML           =       ""

        data.forEach((row, index)                                   =>  
            {
                if((index < this.state["items_per_page"]) || this.state["items_per_page"] == 'ALL')
                {
                    this.table.querySelector('table tbody').append(row);
                }
            }
        );

        buttons                 =           "<li class='page-previous'>Previous</li>";

        for(let i = 0; i < pages; i++)
        {
            buttons             +=          `<li class="page-item ${i == this.state["current_page"] ? 'active' : ''}" data-value="${i}">${i + 1}</li>`;
        }

        buttons                 +=          "<li class='page-next'>Next</li>";

        this.table.querySelector('.data-table-footer .data-table-page-select').innerHTML  =   buttons; 
    }

    add_events()
    {
        //FILTER EVENT
        this.table.querySelector('.data-table-item-search input').addEventListener('input', (e)  =>  
            {
                if(e.target.value.trim() == "")
                {
                    this.setup_pagination();
                    return false; 
                }

                const search                                            =       e.target.value.toUpperCase().trim(); 
                const rows                                              =       [];
                           
                this.table.querySelector('table tbody').innerHTML       =       '';

                this.data.forEach(row    =>  
                {
                    row.querySelectorAll('td').forEach(cell => 
                        {
                            if(cell.innerText.toUpperCase().indexOf(search) > -1 && rows.length < this.state['items_per_page'])
                            {
                                rows.push(row);
                            }
                        }
                    ); 
                });

                rows.forEach(row    =>  
                    {
                        this.table.querySelector('table tbody').append(row);
                    }
                );        
            }
        );

        //SHOW ITEMS EVENT
        this.table.querySelector('.data-table-item-show select').addEventListener('change', (e)  =>  
            {
                this.state['items_per_page']        =       e.target.value; 
                this.setup_pagination();
            }
        );

        //TRAVERSE PAGE EVENT 
        this.table.querySelector('.data-table-footer .data-table-page-select').addEventListener('click', (e)  =>  
            {
                if(!(e.target.classList.contains('page-item') || e.target.classList.contains('page-previous') || e.target.classList.contains('page-next')))
                {
                    return false; 
                }
                
                if(e.target.classList.contains('page-previous') && this.state["current_page"] > 0 )
                {
                    this.state["current_page"]--; 
                }

                if(e.target.classList.contains('page-item'))
                {
                    this.state["current_page"]      =       e.target.dataset.value;
                }

                if(e.target.classList.contains('page-next') && (this.state['current_page'] + 1) < Math.ceil(this.data.length / this.state["items_per_page"]))
                {
                    this.state["current_page"]++; 
                }
                    
                this.setup_pagination();
            }
        );

        

    }

    append_to_wrapper(wrapper)
    {
        wrapper.appendChild(this.table);
    }
}
