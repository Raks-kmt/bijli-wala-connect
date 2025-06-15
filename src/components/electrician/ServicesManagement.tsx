
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';

const ServicesManagement = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [services, setServices] = useState([
    {
      id: '1',
      name: language === 'hi' ? 'फैन इंस्टालेशन' : 'Fan Installation',
      category: language === 'hi' ? 'इंस्टालेशन' : 'Installation',
      basePrice: 150,
      description: language === 'hi' ? 'सीलिंग फैन की स्थापना' : 'Ceiling fan installation',
      status: 'approved',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      name: language === 'hi' ? 'वायरिंग रिपेयर' : 'Wiring Repair',
      category: language === 'hi' ? 'रिपेयर' : 'Repair',
      basePrice: 200,
      description: language === 'hi' ? 'घरेलू वायरिंग की मरम्मत' : 'Home wiring repair',
      status: 'pending',
      createdAt: '2024-01-12'
    },
    {
      id: '3',
      name: language === 'hi' ? 'स्विच रिप्लेसमेंट' : 'Switch Replacement',
      category: language === 'hi' ? 'रिप्लेसमेंट' : 'Replacement',
      basePrice: 80,
      description: language === 'hi' ? 'इलेक्ट्रिक स्विच बदलना' : 'Electric switch replacement',
      status: 'rejected',
      createdAt: '2024-01-08'
    }
  ]);

  const [newService, setNewService] = useState({
    name: '',
    category: '',
    basePrice: '',
    description: ''
  });

  const categories = [
    language === 'hi' ? 'इंस्टालेशन' : 'Installation',
    language === 'hi' ? 'रिपेयर' : 'Repair',
    language === 'hi' ? 'रिप्लेसमेंट' : 'Replacement',
    language === 'hi' ? 'मेंटेनेंस' : 'Maintenance',
    language === 'hi' ? 'आपातकाल' : 'Emergency'
  ];

  const handleAddService = () => {
    if (!newService.name || !newService.category || !newService.basePrice) {
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'कृपया सभी फील्ड भरें' : 'Please fill all fields',
        variant: 'destructive'
      });
      return;
    }

    const service = {
      id: Date.now().toString(),
      ...newService,
      basePrice: parseInt(newService.basePrice),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setServices([...services, service]);
    setNewService({ name: '', category: '', basePrice: '', description: '' });
    setShowAddService(false);

    toast({
      title: language === 'hi' ? 'सेवा जोड़ी गई' : 'Service Added',
      description: language === 'hi' ? 'सेवा सफलतापूर्वक जोड़ी गई, एडमिन की मंजूरी का इंतजार' : 'Service added successfully, waiting for admin approval'
    });
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      category: service.category,
      basePrice: service.basePrice.toString(),
      description: service.description
    });
    setShowAddService(true);
  };

  const handleUpdateService = () => {
    if (editingService) {
      const updatedServices = services.map(service =>
        service.id === editingService.id
          ? {
              ...service,
              ...newService,
              basePrice: parseInt(newService.basePrice),
              status: 'pending' // Reset to pending after edit
            }
          : service
      );
      
      setServices(updatedServices);
      setEditingService(null);
      setNewService({ name: '', category: '', basePrice: '', description: '' });
      setShowAddService(false);

      toast({
        title: language === 'hi' ? 'सेवा अपडेट की गई' : 'Service Updated',
        description: language === 'hi' ? 'सेवा सफलतापूर्वक अपडेट की गई' : 'Service updated successfully'
      });
    }
  };

  const handleDeleteService = (serviceId) => {
    setServices(services.filter(service => service.id !== serviceId));
    toast({
      title: language === 'hi' ? 'सेवा हटाई गई' : 'Service Deleted',
      description: language === 'hi' ? 'सेवा सफलतापूर्वक हटाई गई' : 'Service deleted successfully'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === 'hi' ? 'सेवा प्रबंधन' : 'Service Management'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {language === 'hi' ? 'मेरी सेवाएं' : 'My Services'}
            </h3>
            <Button onClick={() => setShowAddService(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'नई सेवा जोड़ें' : 'Add New Service'}
            </Button>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{service.name}</h4>
                        <Badge className={getStatusColor(service.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(service.status)}
                            {language === 'hi' ? 
                              (service.status === 'approved' ? 'मंजूर' : 
                               service.status === 'pending' ? 'प्रतीक्षारत' : 'अस्वीकृत') :
                              service.status
                            }
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'hi' ? 'श्रेणी:' : 'Category:'} {service.category}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'hi' ? 'मूल्य:' : 'Price:'} ₹{service.basePrice}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <p className="text-xs text-gray-400">
                        {language === 'hi' ? 'जोड़ा गया:' : 'Added:'} {service.createdAt}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {service.status !== 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Add/Edit Service Modal */}
        <Dialog open={showAddService} onOpenChange={setShowAddService}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService 
                  ? (language === 'hi' ? 'सेवा संपादित करें' : 'Edit Service')
                  : (language === 'hi' ? 'नई सेवा जोड़ें' : 'Add New Service')
                }
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="serviceName">
                  {language === 'hi' ? 'सेवा का नाम' : 'Service Name'}
                </Label>
                <Input
                  id="serviceName"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder={language === 'hi' ? 'जैसे: फैन इंस्टालेशन' : 'e.g., Fan Installation'}
                />
              </div>
              <div>
                <Label htmlFor="category">
                  {language === 'hi' ? 'श्रेणी' : 'Category'}
                </Label>
                <select
                  id="category"
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">
                    {language === 'hi' ? 'श्रेणी चुनें' : 'Select Category'}
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="basePrice">
                  {language === 'hi' ? 'मूल मूल्य (₹)' : 'Base Price (₹)'}
                </Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={newService.basePrice}
                  onChange={(e) => setNewService({ ...newService, basePrice: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="description">
                  {language === 'hi' ? 'विवरण' : 'Description'}
                </Label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder={language === 'hi' ? 'सेवा का विस्तृत विवरण' : 'Detailed description of the service'}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddService(false);
                    setEditingService(null);
                    setNewService({ name: '', category: '', basePrice: '', description: '' });
                  }}
                  className="flex-1"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button
                  onClick={editingService ? handleUpdateService : handleAddService}
                  className="flex-1"
                >
                  {editingService 
                    ? (language === 'hi' ? 'अपडेट करें' : 'Update')
                    : (language === 'hi' ? 'जोड़ें' : 'Add')
                  }
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default ServicesManagement;
