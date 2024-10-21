import React from "react";
import { useCallback, useEffect, useRef, useState } from 'react';
import './catalog.css';
import axiosInstance from '../../api';
import axios from 'axios';
import { Trash2 } from 'lucide-react';


const Catalog = () => {

    const [tableData, setTableData] = useState([]);

    const handleCellChange = (e, rowIndex, field) => {
        const newData = [...tableData];
        newData[rowIndex][field] = e.target.value;
        setTableData(newData);
    };

    const addRow = () => {
        const newRow = { id: tableData.length + 1, name: "", price: 0 };
        setTableData([...tableData, newRow]);
    };

    const deleteRow = (rowIndex) => {
        const newData = tableData.filter((_, index) => index !== rowIndex);
        setTableData(newData);
    };

    const handleSubmitCatalog  = async (tableData) => {
        console.log("tableData: ", tableData)
        const response = await  axiosInstance.post('/catalog/', tableData)
        console.log("Response catalog: ", response)
    }

    return(
        <div className="bp-catalog">
            <button className='submit-button' onClick={() => handleSubmitCatalog(tableData)}>Submit</button>
            <h1 style={{fontSize:'36px', fontWeight:'600', fontFamily:'sans-serif', paddingBottom: 20}}>Catalog Management</h1>
            <table border="1" style={{ width: "100%", textAlign: "left", fontSize: 14 }}>
                <thead>
                <tr>
                    <th></th> 
                    <th>Product Retailer ID</th>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Item Price</th>
                    <th>Currency</th>
                    <th>Catalog ID</th>
                    <th>Quantity</th>
                    <th>Image URL</th>
                    <th>Product URL</th>
                </tr>
                </thead>
                <tbody>
                {tableData.map((row, rowIndex) => (
                    <tr key={row.product_retailer_id}>
                    <td>{rowIndex + 1}</td>
                    <td>
                    <input
                        type="text"
                        value={row.product_retailer_id}
                        placeholder="Retailer ID"
                        onChange={(e) => handleCellChange(e, rowIndex, "product_retailer_id")}
                    />
                    </td>
                    <td>
                    <input
                        type="text"
                        value={row.product_name}
                        placeholder="Product Name"
                        onChange={(e) => handleCellChange(e, rowIndex, "product_name")}
                    />
                    </td>
                    <td>
                    <input
                        type="text"
                        value={row.description}
                        placeholder="Description"
                        onChange={(e) => handleCellChange(e, rowIndex, "description")}
                    />
                    </td>
                    <td>
                    <input
                        type="text"
                        value={row.item_price}
                        placeholder="Item Price"
                        onChange={(e) => handleCellChange(e, rowIndex, "item_price")}
                    />
                    </td>
                    <td>
                    <input
                        type="text"
                        value={row.currency}
                        placeholder="Currency"
                        onChange={(e) => handleCellChange(e, rowIndex, "currency")}
                    />
                    </td>
                    <td>
                    <input
                        type="text"
                        value={row.catalog_id}
                        placeholder="Catalog ID"
                        onChange={(e) => handleCellChange(e, rowIndex, "catalog_id")}
                    />
                    </td>
                    <td>
                    <input
                        type="text"
                        value={row.quantity}
                        placeholder="Quantity"
                        onChange={(e) => handleCellChange(e, rowIndex, "quantity")}
                    />
                    </td>
                    <td>
                    <input
                        type="url"
                        value={row.image_url}
                        placeholder="Image URL"
                        onChange={(e) => handleCellChange(e, rowIndex, "image_url")}
                    />
                    </td>
                    <td>
                    <input
                        type="url"
                        value={row.product_url}
                        placeholder="Product URL"
                        onChange={(e) => handleCellChange(e, rowIndex, "product_url")}
                    />
                    </td>
                    <td>
                    <button className="btn btn-delete" onClick={() => deleteRow(rowIndex)}>
                        <Trash2 className="trash-icon" size={18} />
                    </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        
            <button className="add-row-button" onClick={addRow}>
                +
            </button>
            </div>
    )
}

export default Catalog