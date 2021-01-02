import  DataTable from "./data_table.js";


const table_items                       =                   document.querySelector('#table-items');
const wrapper                           =                   document.querySelector('#main');

const get_data                          =                   async()     => 
{
    const response                      =                   await fetch('../json/items.json'); 
    const data                          =                   await response.json();         

    return data; 
}

get_data()
    .then(data                  =>      
        {
            for(let i = 0; i < 1; i++)
            {
                data.forEach((row, index)    => 
                    {
                        const tr            =                   document.createElement('tr');
                        tr.innerHTML        =                   `<td>${(index+1)}</td>
                                                                 <td>${row['name'].toUpperCase()}</td>
                                                                 <td>${row['price']}</td>
                                                                 <td>${row['stock']}</td>`
                    
                        table_items.querySelector('tbody').append(tr);
                    }
                ); 
            }

            new DataTable(table_items, wrapper);
        }
    )
    .catch(err      =>  
        {
            console.log(err);
        }
    )



