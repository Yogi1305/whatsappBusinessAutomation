import React, { useState, useEffect } from "react";
import { Trash2, Edit } from 'lucide-react';
import axiosInstance from '../../api';
import './catalog.css';
import { BlobServiceClient } from '@azure/storage-blob';
import { Position } from "@xyflow/react";

const Catalog = () => {

  const [loading, setLoading] = useState(true); 
  const [originalData, setOriginalData] = useState([]); 
  const [textToCopy, setTextToCopy] = useState({ display: "Copy Link", url: "" });
  const [catalogID, setCatalogID] = useState('')
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
        console.log("rcvd products: ", response.data)

        setTextToCopy(prevState => ({ ...prevState, url: response.data.spreadsheet_url }));
        setCatalogID(response.data.catalog_id)
        
        const initialData = products.map(product => ({
          product_id: product.product_id || generateRandomProductID(),
          title: product.title || "",
          description: product.description || "",
          link: product.link || "",
          image_link: product.image_link || "",
          condition: product.condition || "",
          quantity: product.quantity || "",
          price: product.price || "",
          brand: product.brand || "",
          status: product.status || ""
        })
      );
        console.log("Changing the Original Data...", initialData)
        setOriginalData([...initialData.map(item => ({...item}))]);
        setTableData(initialData);
        console.log("Initial Data: ", initialData)
        const initialImageURLs = {};
        initialData.forEach((item, index) => {
          if (item.image_link) {
            initialImageURLs[index] = item.image_link;
          }
        });
        setImageURLs(initialImageURLs);
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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageURLs, setImageURLs] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const uploadToBlob = async (e, rowIndex, field) => {
    try {
      const file = e.target.files[0]
      const account = "pdffornurenai";
      const sas = "sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2025-06-01T16:13:31Z&st=2024-06-01T08:13:31Z&spr=https&sig=8s7IAdQ3%2B7zneCVJcKw8o98wjXa12VnKNdylgv02Udk%3D";

      const containerName = 'pdf';
      const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);

      const containerClient = blobServiceClient.getContainerClient(containerName);
  
      const blobName = file.name + '-' + Date.now(); // Appending timestamp to the file name for uniqueness
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
      const uploadBlobResponse = await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: {
          blobContentType: file.type
        }
      });
  
      console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
  
      console.log(blockBlobClient.url); // Return the URL of the uploaded file
      const newData = [...tableData];
      const newValue = blockBlobClient.url;
      newData[rowIndex][field] = newValue;
      setTableData(newData);
      setImageURLs((prev) => ({
        ...prev,
        [rowIndex]: blockBlobClient.url,
      }))

    } catch (error) {
      console.error('Error uploading file to Azure:', error);
      throw error;
    }
  }
  

  const handleSubmitCatalog = async () => {
    try {
        setIsSubmitting(true)
        console.log("Table Data to be submitted: ", tableData
        )
      const dataToSubmit = tableData.map((row) => ({
        ...row,
        condition: row.condition || "new",
        availability: row.quantity > 0 ? "in_stock" : "out_of_stock",
        status: row.status || "active"
      }));
      console.log("Data To Submit: ", dataToSubmit)
      console.log("Original Data: ", originalData)
      console.log("Table Data: ", tableData)
      const changes = dataToSubmit.map((newRow) => {
        const originalRow = originalData.find(item => item.product_id === newRow.product_id); // Use the unique identifier
        if (!originalRow) {
          return { ...newRow, row_status: 'added' }; 
        }
        let isChanged = false;
        for (let key of Object.keys(newRow)) {
          console.log("NEW ROW: ", newRow)
          if (newRow[key] !== originalRow[key]) {
            console.log(`Field changed in row ${newRow.id}: ${key} (Original: ${originalRow[key]}, New: ${newRow[key]})`);
            isChanged = true;
          }
        }
  
        if (!isChanged) {
          console.log(`Row unchanged:`, newRow);
        }
        return { ...newRow, row_status: isChanged ? 'changed' : 'unchanged' };
      });

      console.log("Changes: ", changes)
      const filteredChanges = changes.filter(row => row.row_status !== 'unchanged');
      console.log("Filtered Changes: ", filteredChanges)
      const response = await axiosInstance.post('/catalog/', filteredChanges);
      console.log("Response catalog: ", response);
      setIsSubmitting(false)
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
      quantity: "",
      price: "",
      brand: "",
      status: ""
    };
    setTableData((prevData) => [...prevData, newRow]);
  };

  const handleEditClick = async () => {
    setIsPopupVisible(!isPopupVisible);
  }

  const handleInputChange = (e) => {
    setCatalogID(e.target.value)
  }

  const handleSaveCatalogID = () => {
    console.log("Catalog ID to save: ", catalogID)
    const response = axiosInstance.post('catalog-id/', {
      catalog_id: catalogID
    })
    handleEditClick()
  }

  return (
    <div className="bp-catalog">
     <div 
        className={`copy-text-box ${textToCopy.display === "Copied!" ? "copied" : ""}`} 
        onClick={handleCopyText}
      >
        {textToCopy.display}
      </div>
      <div className="hidden lg:flex items-center input-catalogid">
        <b>Catalog ID: {catalogID}</b>
      <Edit style={{ position: 'relative', marginLeft: '12px', cursor: 'pointer' }} size={18} onClick={handleEditClick}/>
      <div
          className={`absolute mt-2 p-2 bg-white border border-gray-300 shadow-lg rounded popup ${
            isPopupVisible ? 'popup-enter' : 'popup-exit'
          }`}
          style={{ top: '45px', left: '10px', transformOrigin: '85px -15px', borderRadius: '7px' }}
        >
          <p>Catalog ID:</p>
          <input type="text" placeholder="Enter new Catalog ID" className="mt-2 p-1 border rounded" value={catalogID} onChange={handleInputChange}/>
          <button onClick={handleSaveCatalogID} className="mt-2 p-1 bg-blue-500 text-white rounded">
            Save
          </button>
        </div>
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
            <th>Quantity</th>
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
              <td className="flex items-center space-x-4">
                
              {imageURLs[rowIndex] && (
                  <img src = {imageURLs[rowIndex]} alt="Preview" style={{width: "70px", height: "70px"}}/>
                )}
                <input
                  type="file"
                  accept="image/"
                  placeholder="Image"
                  onChange={(e) => uploadToBlob(e, rowIndex, "image_link")}
                  className="column-bg"
                />
              </td>
              <td>
                <select
                  value={row.condition}
                  onChange={(e) => handleCellChange(e, rowIndex, "condition")}
                  className="column-bg"
                //   defaultValue="new"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </td>
              <td>
              <input
                  type="number"
                  value={row.quantity}
                  placeholder="Quantity"
                  onChange={(e) => handleCellChange(e, rowIndex, "quantity")}
                  className="column-bg"
                  min="0"
                />
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
                //   defaultValue="active"
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
      {isSubmitting? 'Submitting...': 'Submit'}
    </button>
  </div>
      <button className="add-row-button" onClick={addRow}>+</button>
    </div>
  );
}

export default Catalog;
