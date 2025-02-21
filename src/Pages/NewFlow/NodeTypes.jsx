import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { FaTrash, FaCopy, FaMinus, FaPlus } from 'react-icons/fa';
import { useFlow } from './FlowContext';
import uploadToBlob from "../../azureUpload.jsx";
import { convertMentionsForBackend, convertMentionsForFrontend, MentionTextArea, ShowProducts } from './MentionTextArea';
import { useAuth } from '../../authContext.jsx';
import axiosInstance, { fastURL, djangoURL } from '../../api.jsx';
import { Clock, LogOut, Upload, ShoppingBag } from 'lucide-react';
import { Button, Card, Input } from 'antd';
import { CardContent } from '@mui/material';
import { CardHeader, CardTitle } from 'react-bootstrap';

const nodeStyles = {
  padding: '20px',
  borderRadius: '12px',
  width: '300px',
  fontSize: '14px',
  color: '#333',
  textAlign: 'left',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
  background: '#ffffff',
};

const inputStyles = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '14px',
  backgroundColor: '#f9f9f9',
  color: '#333',
  transition: 'border-color 0.3s, box-shadow 0.3s',
};

const buttonStyles = {
  background: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '6px',
  cursor: 'pointer',
  margin: '10px 5px',
  fontSize: '14px',
  transition: 'background-color 0.3s, transform 0.1s',
};

const handleStyles = {
  width: '12px',
  height: '12px',
  background: '#784212',
  border: '2px solid #fff',
};

const iconStyles = {
  cursor: 'pointer',
  margin: '0 5px',
  fontSize: '18px',
  color: '#555',
  transition: 'color 0.3s, transform 0.1s',
};

const selectStyles = {
  ...inputStyles,
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px top 50%',
  backgroundSize: '12px auto',
  paddingRight: '30px',
};

const textAreaStyles = {
  ...inputStyles,
  minHeight: '100px',
  resize: 'vertical',
};

const fileInputStyles = {
  ...inputStyles,
  padding: '12px',
  background: '#f0f0f0',
  cursor: 'pointer',
};

const errorStyles = {
  color: '#ff4d4f',
  fontSize: '12px',
  marginTop: '5px',
};

const mentionListStyles = {
  position: 'absolute',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  zIndex: 1000,
  maxHeight: '150px',
  overflowY: 'auto',
};

const mentionItemStyles = {
  padding: '8px 12px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
};

const mentionOptions = [
  { id: 'name', label: 'Name' },
  { id: 'phoneno', label: 'Phone Number' },
  { id: 'email', label: 'Email' },
  { id: 'description', label: 'Address' },
  { id: 'createdBy', label: 'Account' },
];

const highlightErrorStyle = {
  borderColor: '#ff4d4f',
  boxShadow: '0 0 0 2px rgba(255, 77, 79, 0.2)',
};

const getTenantIdFromUrl = () => {
  // Example: Extract tenant_id from "/3/home"
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    return pathArray[1]; // Assumes tenant_id is the first part of the path
  }
  return null; // Return null if tenant ID is not found or not in the expected place
};

const NodeWrapper = ({ children, style, type }) => {

  const { deleteElements, setNodes, getNode } = useReactFlow();

  const onDelete = useCallback(() => {
    deleteElements({ nodes: [{ id: getNode(type).id }] });
  }, [deleteElements, getNode, type]);

  const onCopy = useCallback(() => {
    const node = getNode(type);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    setNodes((nds) => nds.concat({
      ...node,
      id: `${type}-${nds.length + 1}`,
      position,
    }));
  }, [getNode, setNodes, type]);

  return (
    <div style={{ ...nodeStyles, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      </div>
      {children}
    </div>
  );
};

export const AskQuestionNode = ({id, data, isConnectable }) => {
  const [question, setQuestion] = useState(data.question || '');
  const [optionType, setOptionType] = useState(data.optionType || 'Buttons');
  const [options, setOptions] = useState(data.options || []);

  const [variable, setVariable] = useState(data.variable || '');
  const [dataType, setDataType] = useState(data.dataType || '');
  const [errors, setErrors] = useState({});
  const { updateNodeData } = useFlow();

  useEffect(() => {
    validateNode(); 
  }, [question, options, variable, dataType]);

  const validateNode = () => {
    let newErrors = {};
    if (!question.trim()) {
      newErrors.question = 'Question is required';
    }
    if (optionType !== 'Text') {
      options.forEach((option, index) => {
        if (!option.trim()) {
          newErrors[`option-${index}`] = 'Option cannot be empty';
        }
        if (optionType === 'Buttons' && option.length > 20) {
          newErrors[`option-${index}`] = 'Button text cannot exceed 20 characters';
        }
        if (optionType === 'Lists' && option.length > 24) {
          newErrors[`option-${index}`] = 'List item cannot exceed 24 characters';
        }
      });
    }
    if (variable && !dataType) {
      newErrors.dataType = 'Data type is required when variable is set';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuestionChange = (e) => {
    const newQuestion = e.target.value;
    setQuestion(newQuestion);
    updateNodeData(id, { 
      question: convertMentionsForBackend(newQuestion), 
      optionType, 
      options, 
      dataType 
    });
  };

  const handleOptionTypeChange = (e) => {
    const newOptionType = e.target.value;
    let newOptions = [];
    if (newOptionType === 'Buttons') {
      newOptions = options.slice(0, 3);
    } else if (newOptionType === 'Lists') {
      newOptions = options.slice(0, 10);
    }
    setOptionType(newOptionType);
    setOptions(newOptions);
    updateNodeData(id, { question, optionType: newOptionType, options: newOptions, variable, dataType });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = options.map((opt, i) => i === index ? value : opt);
    setOptions(newOptions);
    updateNodeData(id, { question, optionType, options: newOptions, variable, dataType });
  };

  const handleVariableChange = (value) => {
    setVariable(value);
    updateNodeData(id, { question, optionType, options, variable: value, dataType });
  };

  const handleDataTypeChange = (value) => {
    setDataType(value);
    updateNodeData(id, { question, optionType, options, variable, dataType: value });
  };

  const addOption = () => {
    if ((optionType === 'Buttons' && options.length < 3) || 
        (optionType === 'Lists' && options.length < 10)) {
      const newOptions = [...options, ''];
      setOptions(newOptions);
      updateNodeData(id, { question, optionType, options: newOptions, variable, dataType });
    }
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    updateNodeData(id, { question, optionType, options: newOptions, variable, dataType });
  };

  const getOptionStyle = (type, index) => {
    const baseStyle = {
      ...inputStyles,
      width: 'calc(100% - 60px)',
    };

    const errorStyle = errors[`option-${index}`] ? { borderColor: 'red' } : {};

    switch (type) {
      case 'Buttons':
        return {
          ...baseStyle,
          ...errorStyle,
          background: '#e6f7ff',
          border: '1px solid #91d5ff',
          borderRadius: '20px',
          padding: '8px 15px',
          cursor: 'pointer',
          color: '#0050b3',
          fontWeight: 'bold',
        };
      case 'Lists':
        return {
          ...baseStyle,
          ...errorStyle,
          background: '#f6ffed',
          borderLeft: '3px solid #b7eb8f',
          borderRadius: '0 6px 6px 0',
          paddingLeft: '15px',
          color: '#389e0d',
        };
      default:
        return { ...baseStyle, ...errorStyle };
    }
  };

  const renderOptions = () => {
    if (optionType === 'Text') {
      return (
        <Handle
          type="source"
          position={Position.Right}
          id="text"
          style={handleStyles}
          isConnectable={isConnectable}
        />
      );
    } else {
      return options.map((option, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', position: 'relative' }}>
          <Handle
            type="source"
            position={Position.Right}
            id={`option-${index}`}
            style={{
              ...handleStyles,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            isConnectable={isConnectable}
          />
          <input
            style={getOptionStyle(optionType, index)}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`${optionType === 'Buttons' ? 'Button' : 'List item'} ${index + 1}`}
            maxLength={optionType === 'Buttons' ? 20 : 24}
          />
          <FaMinus onClick={() => removeOption(index)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
          {errors[`option-${index}`] && <div style={errorStyle}>{errors[`option-${index}`]}</div>}
        </div>
      ));
    }
  };

  return (
    <NodeWrapper style={{ background: '#fff5f5', borderColor: errors.question ? 'red' : '#ffa39e' }} type="askQuestion">
      <Handle type="target" style={{
        top: '50%',
        right: '-10px',
        background: '#784212',
        width: '12px',
        height: '12px',
      }} position={Position.Left} isConnectable={isConnectable} />
      <h3 style={{ marginBottom: '15px', color: '#cf1322' }}>Ask Question</h3>
      <MentionTextArea
        value={convertMentionsForFrontend(question)}
        onChange={handleQuestionChange}
        placeholder="Enter question"
        style={errors.question ? { borderColor: 'red' } : {}}
      />
      {errors.question && <div style={errorStyle}>{errors.question}</div>}
      <h4>Variables (Optional)</h4>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <input
          style={{ ...inputStyles, width: 'calc(60% - 10px)', marginRight: '10px' }}
          value={variable}
          onChange={(e) => handleVariableChange(e.target.value)}
          placeholder='Variable Name'
        />
        <select
          value={dataType}
          onChange={(e) => handleDataTypeChange(e.target.value)}
          style={{ ...selectStyles, width: '40%', borderColor: errors.dataType ? 'red' : undefined }}
        >
          <option value="">Select Type</option>
          <option value="string">Word/Sentence</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="date">Date</option>
        </select>
      </div>
      {errors.dataType && <div style={errorStyle}>{errors.dataType}</div>}
      <select 
        value={optionType} 
        onChange={handleOptionTypeChange}
        style={selectStyles}
      >
        <option value="Buttons">Buttons</option>
        <option value="Lists">Lists</option>
        <option value="Text">Text</option>
      </select>
      {renderOptions()}
      {optionType !== 'Text' && ((optionType === 'Buttons' && options.length < 3) || (optionType === 'Lists' && options.length < 10)) && (
        <button style={buttonStyles} onClick={addOption}>
          <FaPlus style={{ marginRight: '5px' }} /> Add Option
        </button>
      )}
    </NodeWrapper>
  );
};

const errorStyle = {
  color: 'red',
  fontSize: '12px',
  marginTop: '5px',
};

export const SendMessageNode = ({ id,data, isConnectable }) => {
  const [field, setField] = useState(data.fields || { type: 'Message', content: { text: '', caption: '', med_id: '' } });
 // const { id } = data;
  // console.log("this is a GOATA",id);
  const { updateNodeData } = useFlow();
  const textAreaRef = useRef(null);
  const { userId } = useAuth();
  const tenantId = getTenantIdFromUrl();
  const [accessToken, setAccessToken] = useState('');
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the business phone ID
        const bpidResponse = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`, {
          headers: {
            'X-Tenant-ID': tenantId
          }
        });
      //  console.log("fetch data response: ",bpidResponse.data)
        const fetchedBusinessPhoneNumberId = bpidResponse.data.whatsapp_data[0].business_phone_number_id;
        setBusinessPhoneNumberId(fetchedBusinessPhoneNumberId);
      //  console.log("BPID: ", businessPhoneNumberId)
        const fetchedAccessToken = bpidResponse.data.whatsapp_data[0].access_token
        setAccessToken(fetchedAccessToken);
     //  console.log("ACCCES TOKEN: ", accessToken)

        // Fetch the access token using the obtained business phone ID
        // const tenantResponse = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`);
      } catch (error) {
      //  console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [tenantId]);


  const updateNodeDataSafely = (newFields) => {
  //  console.log(id,newFields,"pippity bpi");
    updateNodeData(id, { fields: newFields });
  };


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', file.type.startsWith('image/') ? 'image' : 'document');
        formData.append('messaging_product', 'whatsapp');
      //  console.log("bpid: ",businessPhoneNumberId)
      //  console.log("Access token: ", accessToken)
        const response = await axiosInstance.post(
          `https://graph.facebook.com/v16.0/${businessPhoneNumberId}/media`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

      //  console.log('File uploaded to WhatsApp, ID:', response.data.id);
        const blobUrl = await uploadToBlob(file, userId, tenantId);

        setField({
          type: file.type.startsWith('image/') ? 'Image' : file.type.startsWith('video/') ? 'Video' : 'Document',
          content: {
            url: blobUrl,
            med_id: response.data.id,  // Store the media ID instead of the URL
            text: '',
            caption: ''
          }
        });

        if (file.type.startsWith('image/')) {
          setPreviewUrl(URL.createObjectURL(file));
        }

      } catch (error) {
      //  console.error('Error uploading file to WhatsApp Media API:', error);
      }
    }
  };

  const handleTextAreaChange = (e) => {
    const { value } = e.target;
    setField(prevField => ({
      type: 'text',
      content: { ...prevField.content, text: convertMentionsForBackend(value) }
    }));
  };


  const handleCaptionChange = (e) => {
    const { value } = e.target;
    setField(prevField => ({
      ...prevField,
      content: { ...prevField.content, caption: convertMentionsForBackend(value) }
    }));
  };

  useEffect(() => {
    updateNodeDataSafely(field);
    if (field.type === 'Image' && field.content && field.content.url) {
      setPreviewUrl(field.content.url);
    }
  }, [field]);



  const renderInput = () => {
    switch (field.type) {
      case 'Image':
      case 'Video':
      case 'Document':
        return (
          <div>
            {field.content && field.content.med_id && (
              <div style={{ marginBottom: '10px' }}>
                {field.type === 'Image' && previewUrl && (
                  <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                )}
              </div>
            )}
            <input
              type="file"
              accept={`${field.type.toLowerCase()}/*`}
              onChange={handleFileChange}
              style={fileInputStyles}
              ref={fileInputRef}
            />
            <MentionTextArea
              value={convertMentionsForFrontend(field.content?.caption || '')}
              onChange={handleCaptionChange}
              placeholder="Enter caption"
            />
          </div>
        );
      default:
        return (
          <div style={{ position: 'relative' }} ref={textAreaRef}>
            <MentionTextArea
             value={convertMentionsForFrontend(field.content?.text || '')}
              onChange={handleTextAreaChange}
              placeholder="Enter message"
            />
          </div>
        );
    }
  };
  
  return (
    <NodeWrapper style={{ background: '#FFEFD5', borderColor: '#FFD700' }} type="sendMessage">
      <Handle type="target" style={{
        top: '50%',
        left: '-5px',
        background: '#784212',
        width: '12px',
        height: '12px',
      }} position={Position.Left} isConnectable={isConnectable} />
      <h3 style={{ marginBottom: '15px', color: '#006d75' }}>Send Message</h3>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <select 
            value={field.type} 
            onChange={(e) => setField({ type: e.target.value, content: { text: '', caption: '', med_id: '' } })}
            style={{ ...selectStyles, width: '100%', marginRight: '10px', color:'black' }}
          >
            <option value="Message">Message</option>
            <option value="Image">Image</option>
            <option value="Document">Document</option>
            <option value="Video">Video</option>
          </select>
        </div>
        {renderInput()}
      </div>
      <Handle type="source" style={{
        top: '50%',
        right: '-5px',
        background: '#784212',
        width: '12px',
        height: '12px',
      }} position={Position.Right} isConnectable={isConnectable} />
    </NodeWrapper>
  );
};

export const SetConditionNode = ({ id,data, isConnectable }) => {
  const [condition, setCondition] = useState(data.condition || '');
 // const { id } = data;
//  console.log("this is a GOAT",id);
const { updateNodeData } = useFlow();


const handleConditionChange = (e) => {
  const newCondition = e.target.value;
//  console.log(newCondition,id,"lookity look");
  setCondition(newCondition);
  updateNodeData(id, { condition: convertMentionsForBackend(newCondition) });
};

  return (
    <NodeWrapper style={{ background: '#f9f0ff', borderColor: '#d3adf7' }} type="setCondition">
      <Handle type="target"  style={{ top: '50%', right: '-10px', background: '#784212', width: '12px', height: '12px'}} position={Position.Left} isConnectable={isConnectable} />
      <h3 style={{ marginBottom: '15px', color: '#531dab' }}>Set Condition</h3>
      <MentionTextArea
        value={convertMentionsForFrontend(condition)}
        onChange={handleConditionChange}
        placeholder="Enter condition"
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <div style={{ background: '#d9f7be', padding: '5px 10px', borderRadius: '4px', color: '#389e0d' }}>True</div>
        <div style={{ background: '#ffccc7', padding: '5px 10px', borderRadius: '4px', color: '#cf1322' }}>False</div>
      </div>
      <Handle type="source"  position={Position.Right} id="true" isConnectable={isConnectable}  style={{ top: '50%', background: '#389e0d',right: '-5px',width: '12px',height: '12px', }} />
      <Handle type="source" position={Position.Right} id="false" isConnectable={isConnectable}  style={{ top: '80%', background: '#cf1322', right: '-5px',width: '12px',height: '12px', }} />
    </NodeWrapper>
  );
};

export const AINode = ({ id, data, isConnectable }) => {
  const { updateNodeData } = useFlow();

  return (
<Card className="w-34 h-20 border-purple-200">
  <Handle type="target" position="top" isConnectable={isConnectable} />
  <CardHeader className="pb-3">
    <CardTitle className="text-lg font-semibold text-black-700 flex items-center">
      <Upload className="w-5 h-5 mr-2" />AI {/* Optional: wrap "AI" in a span for better alignment */}
    </CardTitle>
  </CardHeader>
      <CardContent className="space-y-2">
        </CardContent>
  <Handle type="source" position="bottom" isConnectable={isConnectable} />
</Card>

  );
};

export const product = ({ id, data, isConnectable }) => {
  const { updateNodeData } = useFlow();
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([""]);

  useEffect(() => {
    const fetchProducts = async () => {
      try{
        const response = await axiosInstance.get('catalog/')
      //  console.log("catalog get Response: ", response.data)
        setProducts(response.data)

      }catch (error) {
     //  console.error("Error fetching product IDs:", error);
      }
    };

    fetchProducts();
  }, [])

  const handleProductSelection = (index, newProduct) => {
    const updatedSelectedProductIds = [...selectedProductIds];
  //  console.log(newProduct,id,"lookity look");
    updatedSelectedProductIds[index] = newProduct;
    setSelectedProductIds(updatedSelectedProductIds);

    updateNodeData(id, {product_ids: updatedSelectedProductIds});
  };

  const addProduct = () => {
    setSelectedProductIds([...selectedProductIds, ""])
  }


  return (
    <Card className="w-304 h-200 border-pink-200">
      <Handle type="target" position="left" isConnectable={isConnectable} />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-pink-700 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2" /> Product
        </CardTitle>

        {selectedProductIds.map((selectedProductId, index) => (
          <ShowProducts
            key={index}
            products={products}
            selectedProductId={selectedProductId}
            onSelect={(newProductId) => handleProductSelection(index, newProductId)}
            style={{ marginTop: '10%' }}
          />
        ))}

        <button style={{
          background: '#4CAF50',
          color: 'white',
          borderRadius: '16px',
          cursor: 'pointer',
          marginTop: '13px',
          transition: 'background-color 0.3s, transform 0.1s',
          width: '100%',
          height: '30px',
          display: 'flex',   
          alignItems: 'center',   
          justifyContent: 'center' 
        }} onClick={addProduct}>
            <FaPlus style={{ marginRight: '5px' }} /> Add Product
        </button>
      </CardHeader>
      <CardContent className="space-y-2"></CardContent>
      <Handle type="source" position="right" isConnectable={isConnectable} />
    </Card>
  );
};
export const APINode = ({ id, data, isConnectable }) => {
  const [endpoint, setEndpoint] = useState(data.endpoint || '');
  const [method, setMethod] = useState(data.method || 'GET');
  const [variable, setVariable] = useState(data.variable || '');
  const [headers, setHeaders] = useState(data.headers || '');
  const { updateNodeData } = useFlow();

  const handleEndpointChange = (e) => {
    const newEndpoint = e.target.value;
    setEndpoint(newEndpoint);
    updateNodeData(id, { endpoint: newEndpoint, method, variable, headers });
  };

  const handleMethodChange = (e) => {
    const newMethod = e.target.value;
    setMethod(newMethod);
    updateNodeData(id, { endpoint, method: newMethod, variable, headers });
  };

  const handleVariableChange = (e) => {
    const newVariable = e.target.value;
    setVariable(newVariable);
    updateNodeData(id, { endpoint, method, variable: newVariable, headers });
  };

  const handleHeadersChange = (e) => {
    const newHeaders = e.target.value;
    setHeaders(newHeaders);
    updateNodeData(id, { endpoint, method, variable, headers: newHeaders });
  };

  return (
    <NodeWrapper style={{ background: '#e6fffb', borderColor: '#87e8de' }} type="api">
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{
          top: '50%',
          left: '-5px',
          background: '#784212',
          width: '12px',
          height: '12px',
        }}
        isConnectable={isConnectable} 
      />
      
      <h3 style={{ marginBottom: '15px', color: '#1d39c4' }}>API Request</h3>
      
      <select
        value={method}
        onChange={handleMethodChange}
        style={selectStyles}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>

      <input
        style={{ ...inputStyles, marginTop: '10px' }}
        value={endpoint}
        onChange={handleEndpointChange}
        placeholder="Enter API endpoint"
      />

      <input
        style={{ ...inputStyles, marginTop: '10px' }}
        value={headers}
        onChange={handleHeadersChange}
        placeholder="Headers (JSON format)"
      />

      <input
        style={{ ...inputStyles, marginTop: '10px' }}
        value={variable}
        onChange={handleVariableChange}
        placeholder="Store response in variable (optional)"
      />

      <Handle 
        type="source" 
        position={Position.Right}
        style={{
          top: '50%',
          right: '-5px',
          background: '#784212',
          width: '12px',
          height: '12px',
        }}
        isConnectable={isConnectable} 
      />
    </NodeWrapper>
  );
};

export const DelayNode = ({ id, data, isConnectable }) => {
  const [delay, setDelay] = useState(data.delay || 0);
  const { updateNodeData } = useFlow();

  const handleDelayChange = (e) => {
    const newDelay = parseInt(e.target.value);
    setDelay(newDelay);
    updateNodeData(id, { delay: newDelay });
  };

  return (
    <NodeWrapper style={{ background: '#fff3e6', borderColor: '#ffb347', width: '200px' }} type="delay">
      <Handle 
        type="target" 
        position={Position.Left}
        style={{
          top: '50%',
          left: '-5px',
          background: '#784212',
          width: '12px',
          height: '12px',
        }}
        isConnectable={isConnectable} 
      />
      
      <h3 style={{ marginBottom: '15px', color: '#d46b08', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock size={18} />
        Delay Timer
      </h3>

      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px',
        backgroundColor: '#fff8f0',
        borderRadius: '8px',
        border: '1px solid #ffd8a8'
      }}>
        <input 
          type="number"
          value={delay}
          onChange={handleDelayChange}
          min="0"
          style={{
            width: '80px',
            padding: '8px',
            border: '1px solid #ffb347',
            borderRadius: '4px',
            backgroundColor: 'white',
            color: '#d46b08',
            fontSize: '14px'
          }}
        />
        <span style={{ color: '#d46b08', fontSize: '14px' }}>seconds</span>
      </div>

      <Handle 
        type="source" 
        position={Position.Right}
        style={{
          top: '50%',
          right: '-5px',
          background: '#784212',
          width: '12px',
          height: '12px',
        }}
        isConnectable={isConnectable} 
      />
    </NodeWrapper>
  );
};