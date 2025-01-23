import React from 'react';
import {Terminal, Clock, MessageSquare, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const WhatsAppCommands = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-black-50 to-white-50">
        <CardHeader className="text-center">
          <Terminal className="w-16 h-16 mx-auto text-black-600" /> {/* Rocket icon */}
          <CardTitle className="mt-4 text-4xl font-bold text-gray-900">
            Coming Soon!
          </CardTitle>
          <p className="mt-2 text-lg text-gray-600">
            We're working hard to bring you an amazing WhatsApp Commands feature. Stay tuned!
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex justify-center space-x-4 mt-6">
            {/* Feature Teasers */}
           ``
            <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-sm">
              <Settings className="w-6 h-6 text-green-500" />
              <span className="text-gray-700">Custom Commands</span>
            </div>
          </div>

          {/* Call-to-Action */}
          <div className="mt-8">
            <p className="text-gray-600 mb-4">
              You will be the first to know when we launch!
            </p>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppCommands;