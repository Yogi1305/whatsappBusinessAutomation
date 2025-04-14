import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus, Copy, Loader2, Settings } from 'lucide-react';
import axiosInstance, { fastURL } from '../../api';
import { BlobServiceClient } from '@azure/storage-blob';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { showErrorToast } from "../Chatbot/Broadcast/Toastcomponent";
import { toast } from "sonner";
import { getTenantIdFromUrl } from "../Chatbot/chatbot/utilityfunctions.jsx";

const Catalog = () => {
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [textToCopy, setTextToCopy] = useState({ display: "Copy Link", url: "" });
  const [catalogID, setCatalogID] = useState('');
  const [tableData, setTableData] = useState([]);
  const [duplicateIndex, setDuplicateIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageURLs, setImageURLs] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState(null);
  
  // New state for catalog details dialog
  const [isCatalogDetailsOpen, setIsCatalogDetailsOpen] = useState(false);
  const [catalogDetails, setCatalogDetails] = useState({
    catalog_id: '',
    business_phone: '',
    razorpay_key: {
      id: '',
      secret: ''
    },
    spreadsheet_link: ''
  });
  const [isDetailSubmitting, setIsDetailSubmitting] = useState(false);
  const tenantId = getTenantIdFromUrl();

  // Default empty state for resetting the form
  const defaultCatalogDetails = {
    catalog_id: '',
    business_phone: '',
    razorpay_key: {
      id: '',
      secret: ''
    },
    spreadsheet_link: ''
  };

  const generateRandomProductID = () => {
    const characters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    let result = "";
    for (let i = 0; i < 7; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const fetchData = async () => {
    try {
      const django_promise = axiosInstance.post(`/create-spreadsheet/`);
      const fastResponse = await axiosInstance.get(`${fastURL}/catalog/`);
      
      const products = fastResponse.data;
      
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
      }));

      setOriginalData([...initialData.map(item => ({...item}))]);
      setTableData(initialData);

      const initialImageURLs = {};
      initialData.forEach((item, index) => {
        if (item.image_link) {
          initialImageURLs[index] = item.image_link;
        }
      });
      setImageURLs(initialImageURLs);

      const djangoResponse = await django_promise;
      setTextToCopy(prevState => ({ ...prevState, url: djangoResponse.data.spreadsheet_url }));
      setCatalogID(djangoResponse.data.catalog_id);
      
      // Also fetch catalog details if available
      try {
        const detailsResponse = await axiosInstance.get(`${fastURL}/catalogid`);
        if (detailsResponse.data) {
          setCatalogDetails({
            catalog_id: detailsResponse.data.catalog_id || '',
            business_phone: detailsResponse.data.business_phone || '',
            razorpay_key: {
              id: detailsResponse.data.razorpay_key?.id || '',
              secret: detailsResponse.data.razorpay_key?.secret || ''
            },
            spreadsheet_link: detailsResponse.data.spreadsheet_link || ''
          });
        }
      } catch (error) {
        // Silently fail if details aren't available yet
      }
      
    } catch (error) {
      //console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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
      showErrorToast("Minimum of 5 rows required. Cannot delete further.");
    }
  };

  const uploadToBlob = async (e, rowIndex, field) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      const account = "pdffornurenai";
      const sas = "sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2025-06-01T16:13:31Z&st=2024-06-01T08:13:31Z&spr=https&sig=8s7IAdQ3%2B7zneCVJcKw8o98wjXa12VnKNdylgv02Udk%3D";

      const containerName = 'pdf';
      const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);

      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blobName = file.name + '-' + Date.now();
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
      const uploadBlobResponse = await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: { blobContentType: file.type }
      });
  
      const newData = [...tableData];
      const newValue = blockBlobClient.url;
      newData[rowIndex][field] = newValue;
      setTableData(newData);
      setImageURLs(prev => ({
        ...prev,
        [rowIndex]: blockBlobClient.url,
      }));
      
      // Clear the file input
      e.target.value = '';
    } catch (error) {
      //console.error('Error uploading file to Azure:', error);
      toast.error("Failed to upload image");
      e.target.value = '';
    }
  };

  const handleSubmitCatalog = async () => {
    try {
      setIsSubmitting(true);
      const dataToSubmit = tableData.map((row) => ({
        ...row,
        condition: row.condition || "new",
        availability: row.quantity > 0 ? "in_stock" : "out_of_stock",
        status: row.status || "active"
      }));

      const changes = dataToSubmit.map((newRow) => {
        const originalRow = originalData.find(item => item.product_id === newRow.product_id);
        if (!originalRow) {
          return { ...newRow, row_status: 'added' };
        }
        
        let isChanged = false;
        for (let key of Object.keys(newRow)) {
          if (newRow[key] !== originalRow[key]) {
            isChanged = true;
          }
        }
        return { ...newRow, row_status: isChanged ? 'changed' : 'unchanged' };
      });

      const filteredChanges = changes.filter(row => row.row_status !== 'unchanged');
      const response = await axiosInstance.post(`/catalog/`, filteredChanges);
      toast.success("Catalog data submitted successfully");
    } catch (error) {
      //console.error("Error submitting catalog data: ", error);
      toast.error("Failed to submit catalog data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyText = async () => {
    if (textToCopy.url) {
      try {
        await navigator.clipboard.writeText(textToCopy.url);
        setTextToCopy(prevState => ({ ...prevState, display: "Copied!" }));
        setTimeout(() => {
          setTextToCopy(prevState => ({ ...prevState, display: "Copy Link" }));
        }, 1000);
      } catch (error) {
        //console.error("Failed to copy text: ", error);
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
    setTableData(prevData => [...prevData, newRow]);
  };

  const handleInputChange = (e) => {
    setCatalogID(e.target.value);
  };

  const handleSaveCatalogID = async () => {
    try {
      await axiosInstance.post('catalog-id/', {
        catalog_id: catalogID
      });
      setIsDialogOpen(false);
      toast.success("Catalog ID saved successfully");
    } catch (error) {
      //console.error("Error saving catalog ID:", error);
      toast.error("Failed to save catalog ID");
    }
  };
  
  // Handle catalog details form input changes
  const handleCatalogDetailChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested razorpay_key fields
    if (name === "razorpay_id") {
      setCatalogDetails(prev => ({
        ...prev,
        razorpay_key: {
          ...prev.razorpay_key,
          id: value
        }
      }));
    } else if (name === "razorpay_secret") {
      setCatalogDetails(prev => ({
        ...prev,
        razorpay_key: {
          ...prev.razorpay_key,
          secret: value
        }
      }));
    } else {
      // Handle other fields normally
      setCatalogDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Submit catalog details
  const handleSubmitCatalogDetails = async () => {
    try {
      setIsDetailSubmitting(true);
      
      // Prepare data in the required format
      const dataToSubmit = {
        catalog_id: parseInt(catalogDetails.catalog_id) || 0,
        business_phone: catalogDetails.business_phone,
        razorpay_key: {
          id: catalogDetails.razorpay_key.id,
          secret: catalogDetails.razorpay_key.secret
        },
        tenant_id: tenantId,
        spreadsheet_link: catalogDetails.spreadsheet_link
      };
      
      const response = await axiosInstance.post(`${fastURL}/catalogid`, dataToSubmit, {
        headers: {tenantId: localStorage.getItem("tenant_id")}
      });
      console.log(response);
      toast.success("Catalog details saved successfully");
      setIsCatalogDetailsOpen(false);
      // Reset the form
      setCatalogDetails(defaultCatalogDetails);
      
    } catch (error) {
      console.error("Error saving catalog details:", error);
      toast.error("Failed to save catalog details");
    } finally {
      setIsDetailSubmitting(false);
    }
  };

  // Handle dialog close with cancel button
  const handleCancelCatalogDetails = () => {
    setCatalogDetails(defaultCatalogDetails);
    setIsCatalogDetailsOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Catalog Management</CardTitle>
          <div className="flex items-center gap-4">
            {/* New Catalog Details Button */}
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsCatalogDetailsOpen(true)}
            >
              <Settings className="h-4 w-4" />
              Catalog Details
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Catalog ID:</span>
              <span className="text-sm text-muted-foreground">{catalogID}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Catalog ID</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm"
              onClick={handleCopyText}
            >
              <Copy className="h-4 w-4" />
              {textToCopy.display}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <div className="rounded-md border min-w-[1200px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="w-32">Product ID</TableHead>
                  <TableHead className="w-48">Product Name</TableHead>
                  <TableHead className="w-64">Description</TableHead>
                  <TableHead className="w-48">Product Link</TableHead>
                  <TableHead className="w-32">Image</TableHead>
                  <TableHead className="w-32">Condition</TableHead>
                  <TableHead className="w-24">Quantity</TableHead>
                  <TableHead className="w-24">Item Price</TableHead>
                  <TableHead className="w-32">Brand</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                  <TableHead className="w-12 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="text-center">{rowIndex + 1}</TableCell>
                    <TableCell>
                      <Input
                        value={row.product_id || ""}
                        onChange={(e) => handleCellChange(e, rowIndex, "product_id")}
                        className="w-full"
                        placeholder="Prod ID"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.title}
                        placeholder="Product Name"
                        onChange={(e) => handleCellChange(e, rowIndex, "title")}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.description}
                        placeholder="Description"
                        onChange={(e) => handleCellChange(e, rowIndex, "description")}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="url"
                        value={row.link}
                        placeholder="Product Link"
                        onChange={(e) => handleCellChange(e, rowIndex, "link")}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2 items-center">
                        {imageURLs[rowIndex] && (
                          <img
                            src={imageURLs[rowIndex]}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-md mb-2 cursor-pointer"
                            onDoubleClick={() => setFullImageUrl(imageURLs[rowIndex])}
                          />
                        )}
                        <div className="relative w-full">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => uploadToBlob(e, rowIndex, "image_link")}
                            className="w-full text-xs opacity-0 absolute top-0 left-0 cursor-pointer z-10"
                          />
                          <Button 
                            variant="outline" 
                            className="w-full text-xs"
                          >
                            Upload Image
                          </Button>
                        </div>
                      </div>

                      {fullImageUrl && (
                        <Dialog open={!!fullImageUrl} onOpenChange={() => setFullImageUrl(null)}>
                          <DialogContent className="max-w-4xl">
                            <img 
                              src={fullImageUrl} 
                              alt="Full Image" 
                              className="w-full h-auto max-h-[80vh] object-contain"
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.condition}
                        onValueChange={(value) => 
                          handleCellChange({ target: { value } }, rowIndex, "condition")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                          <SelectItem value="refurbished">Refurbished</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.quantity}
                        placeholder="Qty"
                        onChange={(e) => handleCellChange(e, rowIndex, "quantity")}
                        min="0"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.price}
                        placeholder="Price"
                        onChange={(e) => handleCellChange(e, rowIndex, "price")}
                        min="0"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.brand}
                        placeholder="Brand"
                        onChange={(e) => handleCellChange(e, rowIndex, "brand")}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.status}
                        onValueChange={(value) => 
                          handleCellChange({ target: { value } }, rowIndex, "status")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteRow(rowIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
        <Button
          className="rounded-full h-12 w-12"
          onClick={addRow}
        >
          <Plus className="h-6 w-6" />
        </Button>
        <Button
          className="px-6"
          onClick={handleSubmitCatalog}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </div>

      {/* Edit Catalog ID Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Catalog ID</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="catalogId">Catalog ID</Label>
              <Input
                id="catalogId"
                value={catalogID}
                onChange={handleInputChange}
                placeholder="Enter new Catalog ID"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={() => {
              handleSaveCatalogID();
              setIsDialogOpen(false);
            }}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Catalog Details Dialog */}
      <Dialog 
        open={isCatalogDetailsOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setCatalogDetails(defaultCatalogDetails);
          }
          setIsCatalogDetailsOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Catalog Integration Settings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Catalog ID */}
            <div className="grid gap-2">
              <Label htmlFor="catalog_id">WhatsApp Catalog ID</Label>
              <Input
                id="catalog_id"
                name="catalog_id"
                value={catalogDetails.catalog_id}
                onChange={handleCatalogDetailChange}
                placeholder="e.g., 8886521414801350"
                type="number"
              />
              <p className="text-xs text-gray-500">
                Your WhatsApp Business Catalog ID from Facebook Business Manager
              </p>
            </div>
            
            {/* Business Phone Number */}
            <div className="grid gap-2">
              <Label htmlFor="business_phone">Business Phone Number</Label>
              <Input
                id="business_phone"
                name="business_phone"
                value={catalogDetails.business_phone}
                onChange={handleCatalogDetailChange}
                placeholder="e.g., +919876543210"
              />
              <p className="text-xs text-gray-500">
                Your WhatsApp Business phone number with country code
              </p>
            </div>
            
            {/* Razorpay ID */}
            <div className="grid gap-2">
              <Label htmlFor="razorpay_id">Razorpay ID</Label>
              <Input
                id="razorpay_id"
                name="razorpay_id"
                value={catalogDetails.razorpay_key.id}
                onChange={handleCatalogDetailChange}
                placeholder="e.g., rzp_live_OrfVgEn4b0MyhY"
              />
              <p className="text-xs text-gray-500">
                Your Razorpay API key ID. Starts with "rzp_live_" or "rzp_test_"
              </p>
            </div>
            
            {/* Razorpay Secret */}
            <div className="grid gap-2">
              <Label htmlFor="razorpay_secret">Razorpay Secret</Label>
              <Input
                id="razorpay_secret"
                name="razorpay_secret"
                value={catalogDetails.razorpay_key.secret}
                onChange={handleCatalogDetailChange}
                placeholder="e.g., iLyVtyJ0s3xa6X1eL6NHP2Uj"
               
              />
              <p className="text-xs text-gray-500">
                Your Razorpay API secret key
              </p>
            </div>
            
            {/* Google Sheet Link */}
            <div className="grid gap-2">
              <Label htmlFor="spreadsheet_link">Google Sheet Link</Label>
              <Input
                id="spreadsheet_link"
                name="spreadsheet_link"
                value={catalogDetails.spreadsheet_link}
                onChange={handleCatalogDetailChange}
                placeholder="e.g., https://docs.google.com/spreadsheets/d/..."
              />
              <p className="text-xs text-gray-500">
                Full URL to your Google Sheet
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCancelCatalogDetails} variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitCatalogDetails}
              disabled={isDetailSubmitting}
            >
              {isDetailSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            Loading catalog data...
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;