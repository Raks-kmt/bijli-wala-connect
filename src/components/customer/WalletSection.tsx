
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Plus, Minus, CreditCard, History, Gift } from 'lucide-react';

const WalletSection = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [balance, setBalance] = useState(2500);
  const [addAmount, setAddAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'history' | 'offers'>('add');

  const transactions = [
    {
      id: '1',
      type: 'debit',
      amount: 450,
      description: language === 'hi' ? 'फैन रिपेयर पेमेंट' : 'Fan Repair Payment',
      date: '2024-01-15',
      electrician: language === 'hi' ? 'राम कुमार' : 'Ram Kumar'
    },
    {
      id: '2',
      type: 'credit',
      amount: 1000,
      description: language === 'hi' ? 'वॉलेट रीचार्ज' : 'Wallet Recharge',
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'debit',
      amount: 300,
      description: language === 'hi' ? 'वायरिंग चेक पेमेंट' : 'Wiring Check Payment',
      date: '2024-01-12',
      electrician: language === 'hi' ? 'सुनील वर्मा' : 'Sunil Verma'
    }
  ];

  const offers = [
    {
      id: '1',
      title: language === 'hi' ? '20% कैशबैक' : '20% Cashback',
      description: language === 'hi' ? 'पहली बुकिंग पर' : 'On first booking',
      code: 'FIRST20',
      discount: 20
    },
    {
      id: '2',
      title: language === 'hi' ? '₹100 बोनस' : '₹100 Bonus',
      description: language === 'hi' ? '₹500 एड करने पर' : 'On adding ₹500',
      code: 'ADD500',
      minAmount: 500
    }
  ];

  const handleAddMoney = () => {
    const amount = parseInt(addAmount);
    if (amount && amount >= 100) {
      setBalance(prev => prev + amount);
      setAddAmount('');
      toast({
        title: language === 'hi' ? 'सफल!' : 'Success!',
        description: language === 'hi' ? `₹${amount} आपके वॉलेट में जोड़ दिया गया` : `₹${amount} added to your wallet`,
      });
    } else {
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'कम से कम ₹100 जोड़ें' : 'Add minimum ₹100',
        variant: 'destructive'
      });
    }
  };

  const handleQuickAdd = (amount: number) => {
    setBalance(prev => prev + amount);
    toast({
      title: language === 'hi' ? 'सफल!' : 'Success!',
      description: language === 'hi' ? `₹${amount} आपके वॉलेट में जोड़ दिया गया` : `₹${amount} added to your wallet`,
    });
  };

  const handleApplyOffer = (offer: any) => {
    toast({
      title: language === 'hi' ? 'ऑफर लागू किया गया' : 'Offer Applied',
      description: language === 'hi' ? `कोड: ${offer.code}` : `Code: ${offer.code}`,
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Wallet Balance */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Wallet className="h-8 w-8 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold">
                {language === 'hi' ? 'वॉलेट बैलेंस' : 'Wallet Balance'}
              </h2>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-4">₹{balance}</div>
            <p className="text-gray-600">
              {language === 'hi' ? 'आपका वर्तमान बैलेंस' : 'Your current balance'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'add' ? 'default' : 'outline'}
          onClick={() => setActiveTab('add')}
          className="flex-1"
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === 'hi' ? 'पैसे जोड़ें' : 'Add Money'}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          className="flex-1"
        >
          <History className="h-4 w-4 mr-2" />
          {language === 'hi' ? 'इतिहास' : 'History'}
        </Button>
        <Button
          variant={activeTab === 'offers' ? 'default' : 'outline'}
          onClick={() => setActiveTab('offers')}
          className="flex-1"
        >
          <Gift className="h-4 w-4 mr-2" />
          {language === 'hi' ? 'ऑफर' : 'Offers'}
        </Button>
      </div>

      {/* Add Money Tab */}
      {activeTab === 'add' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'hi' ? 'पैसे जोड़ें' : 'Add Money'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="number"
                  placeholder={language === 'hi' ? 'राशि दर्ज करें' : 'Enter amount'}
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                />
              </div>
              
              {/* Quick Add Amounts */}
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {language === 'hi' ? 'त्वरित राशि' : 'Quick Amounts'}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[100, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => handleQuickAdd(amount)}
                      className="text-sm"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={handleAddMoney} className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                {language === 'hi' ? 'पेमेंट करें' : 'Make Payment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <Plus className="h-4 w-4 text-green-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      {transaction.electrician && (
                        <p className="text-sm text-gray-600">{transaction.electrician}</p>
                      )}
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Offers Tab */}
      {activeTab === 'offers' && (
        <div className="space-y-3">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{offer.title}</h3>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                    <Badge variant="outline" className="mt-1">
                      {offer.code}
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleApplyOffer(offer)}
                  >
                    {language === 'hi' ? 'लागू करें' : 'Apply'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletSection;
