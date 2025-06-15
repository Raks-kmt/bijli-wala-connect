
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '../../contexts/LanguageContext';
import { Wallet, Plus, Minus, CreditCard } from 'lucide-react';

const WalletSection = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'balance' | 'history'>('balance');
  const [amount, setAmount] = useState('');

  const walletBalance = 1250;
  const transactions = [
    {
      id: '1',
      type: 'debit',
      amount: 450,
      description: language === 'hi' ? 'फैन रिपेयर के लिए भुगतान' : 'Payment for Fan Repair',
      date: '2024-01-15',
      time: '2:30 PM'
    },
    {
      id: '2',
      type: 'credit',
      amount: 500,
      description: language === 'hi' ? 'वॉलेट में पैसे जोड़े गए' : 'Money added to wallet',
      date: '2024-01-14',
      time: '10:15 AM'
    }
  ];

  const addMoney = () => {
    if (amount) {
      console.log('Adding money:', amount);
      setAmount('');
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                {language === 'hi' ? 'वॉलेट बैलेंस' : 'Wallet Balance'}
              </h2>
              <p className="text-3xl font-bold">₹{walletBalance}</p>
            </div>
            <Wallet className="h-12 w-12 opacity-80" />
          </div>
        </CardContent>
      </Card>

      {/* Add Money Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'hi' ? 'पैसे जोड़ें' : 'Add Money'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder={language === 'hi' ? 'राशि दर्ज करें' : 'Enter amount'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              className="flex-1"
            />
            <Button onClick={addMoney}>
              <Plus className="h-4 w-4 mr-1" />
              {language === 'hi' ? 'जोड़ें' : 'Add'}
            </Button>
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[100, 500, 1000].map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
              >
                ₹{quickAmount}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'balance' ? 'default' : 'outline'}
          onClick={() => setActiveTab('balance')}
          className="flex-1"
        >
          {language === 'hi' ? 'बैलेंस' : 'Balance'}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          className="flex-1"
        >
          {language === 'hi' ? 'लेन-देन इतिहास' : 'Transaction History'}
        </Button>
      </div>

      {/* Transaction History */}
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
                      <p className="text-sm text-gray-500">{transaction.date} {transaction.time}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </p>
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
