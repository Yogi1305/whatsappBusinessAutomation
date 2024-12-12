import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const TemplateMessages = ({
  templates,
  resetTemplateForm,
  setShowTemplatePopup,
  handleEditTemplate,
  handleDeleteTemplate
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Template Messages</h1>
        <button
          onClick={() => {
            resetTemplateForm();
            setShowTemplatePopup(true);
          }}
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base sm:text-lg">{template.name}</h3>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
                    ${template.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                      template.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {template.status}
                  </span>
                </div>

                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <p>Category: {template.category}</p>
                  <p>Language: {template.language}</p>
                  <p className="line-clamp-2">
                    Body: {template.components.find(c => c.type === "BODY")?.text}
                  </p>
                  {template.components.find(c => c.type === "BUTTONS") && (
                    <p>
                      Buttons: {template.components.find(c => c.type === "BUTTONS").buttons.length}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:pt-4">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.name)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateMessages;