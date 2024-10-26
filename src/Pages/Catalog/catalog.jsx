import React, { useState, useEffect } from "react";
import { Trash2 } from 'lucide-react';
import axiosInstance from '../../api';
import './catalog.css';

const Catalog = () => {

  const [loading, setLoading] = useState(true); 
  const [textToCopy, setTextToCopy] = useState({ display: "Copy Link", url: "" });
  
  const [tableData, setTableData] = useState([]);

  const generateRandomProductID = () => {
    const characters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    let result = "";
    for (let i = 0; i < 7; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post('/create-spreadsheet/');
        const products = response.data.products;

        setTextToCopy(prevState => ({ ...prevState, url: response.data.spreadsheet_url }));
        
        const initialData = products.map(product => ({
          product_id: product.product_id || generateRandomProductID(),
          title: product.title || "",
          description: product.description || "",
          link: product.link || "",
          image_link: product.image_link || "",
          condition: product.condition || "",
          availability: product.availability || "",
          price: product.price || "",
          brand: product.brand || "",
          status: product.status || ""
        }));
        
        setTableData(initialData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally{
        setLoading(false)
      }
    };

    fetchData();
  }, []);

  const [duplicateIndex, setDuplicateIndex] = useState(null);

  const handleCellChange = (e, rowIndex, field) => {
    const newData = [...tableData];
    const newValue = e.target.value;
    newData[rowIndex][field] = newValue;
    setTableData(newData);
  };

  const deleteRow = (rowIndex) => {
    if (tableData.length > 5) {
      const newData = tableData.filter((_, index) => index !== rowIndex);
      setTableData(newData);
    } else {
      alert("Minimum of 5 rows required. Cannot delete further.");
    }
  };

  const handleSubmitCatalog = async () => {
    try {
      const dataToSubmit = tableData.map((row) => ({
        ...row,
        condition: row.condition || "new",
        availability: row.availability || "in_stock",
        status: row.status || "active"
      }));
      const response = await axiosInstance.post('/catalog/', dataToSubmit);
      console.log("Response catalog: ", response);
    } catch (error) {
      console.error("Error submitting catalog data: ", error);
    }
  };


  const handleCopyText = async () => {
    if (textToCopy.url) {  // Check if URL is ready to be copied
      try {
        await navigator.clipboard.writeText(textToCopy.url);
        
        setTextToCopy(prevState => ({ ...prevState, display: "Copied!" }));
        setTimeout(() => {
          setTextToCopy(prevState => ({ ...prevState, display: "Copy Link" }));
        }, 1000);
      } catch (error) {
        console.error("Failed to copy text: ", error);
      }
    }
  };

  const addRow = () => {
    const newRow = {
      product_id: generateRandomProductID(),
      title: "",
      description: "",
      link: "",
      image_link: "",
      condition: "",
      availability: "",
      price: "",
      brand: "",
      status: ""
    };
    setTableData((prevData) => [...prevData, newRow]);
  };

  return (
    <div className="bp-catalog">
     <div 
        className={`copy-text-box ${textToCopy.display === "Copied!" ? "copied" : ""}`} 
        onClick={handleCopyText}
      >
        {textToCopy.display}
      </div>

      <h1 style={{ fontSize: '36px', fontWeight: '600', fontFamily: 'sans-serif', paddingBottom: 20, alignContent: 'center' }}>Catalog Management</h1>

      <table border="1" style={{ width: "125%", textAlign: "left", fontSize: 14 }}>
        <thead>
          <tr>
            <th></th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Description</th>
            <th>Product Link</th>
            <th>Image</th>
            <th>Condition</th>
            <th>Availability</th>
            <th>Item Price</th>
            <th>Brand</th>
            <th>Status</th>
            <th>Delete Row</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex} className={duplicateIndex === rowIndex ? "duplicate-input" : ""}>
              <td>{rowIndex + 1}</td>
              <td>
                <input
                  type="text"
                  value={row.product_id || ""}
                  onChange={(e) => handleCellChange(e, rowIndex, "product_id")}
                  className="column-bg"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.title}
                  placeholder="Product Name"
                  onChange={(e) => handleCellChange(e, rowIndex, "title")}
                  className="column-bg"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.description}
                  placeholder="Description"
                  onChange={(e) => handleCellChange(e, rowIndex, "description")}
                  className="column-bg"
                />
              </td>
              <td>
                <input
                  type="url"
                  value={row.link}
                  placeholder="Product Link"
                  onChange={(e) => handleCellChange(e, rowIndex, "link")}
                  className="column-bg"
                />
              </td>
              <td>
                <input
                  type="url"
                  value={row.image_link}
                  placeholder="Image"
                  onChange={(e) => handleCellChange(e, rowIndex, "image_link")}
                  className="column-bg"
                />
              </td>
              <td>
                <select
                  value={row.condition}
                  onChange={(e) => handleCellChange(e, rowIndex, "condition")}
                  className="column-bg"
                  defaultValue="new"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </td>
              <td>
                <select
                  value={row.availability}
                  onChange={(e) => handleCellChange(e, rowIndex, "availability")}
                  className="column-bg"
                  defaultValue="in_stock"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={row.price}
                  placeholder="Price"
                  onChange={(e) => handleCellChange(e, rowIndex, "price")}
                  className="column-bg"
                  min="0"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.brand}
                  placeholder="Brand Name"
                  onChange={(e) => handleCellChange(e, rowIndex, "brand")}
                  className="column-bg"
                />
              </td>
              <td>
                <select
                  value={row.status}
                  onChange={(e) => handleCellChange(e, rowIndex, "status")}
                  className="column-bg"
                  defaultValue="active"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
      <div className="submit-container">
    <button className="submit-button" onClick={handleSubmitCatalog}>
      Submit
    </button>
  </div>
      <button className="add-row-button" onClick={addRow}>+</button>
    </div>
  );
}

export default Catalog;
