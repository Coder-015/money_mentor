import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileText, Calculator, TrendingDown, TrendingUp, Info } from 'lucide-react';

const TaxWizard = () => {
  const [formData, setFormData] = useState({
    annual_income: 1200000,
    basic_salary: 600000,
    hra_received: 240000,
    rent_paid: 15000,
    city_type: 'metro',
    investments_80c: 150000,
    health_insurance: 25000,
    nps_contribution: 50000
  });

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTax = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/tax-wizard', formData);
      setResults(response.data);
    } catch (error) {
      console.error('Error calculating tax:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = results ? [
    {
      name: 'Old Regime',
      Tax: results.old_regime.tax,
      'Taxable Income': results.old_regime.deductions > 0 ? formData.annual_income - results.old_regime.deductions : formData.annual_income
    },
    {
      name: 'New Regime',
      Tax: results.new_regime.tax,
      'Taxable Income': formData.annual_income
    }
  ] : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-muted/30 p-3 rounded-lg">
          <p className="text-sm font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Tax Wizard</h2>
        <p className="text-muted">Compare old vs new tax regime and find your optimal choice</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card space-y-6">
          <h3 className="font-semibold flex items-center space-x-2">
            <FileText className="w-5 h-5 text-accent" />
            <span>Your Income Details</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Annual CTC</label>
              <input
                type="number"
                value={formData.annual_income}
                onChange={(e) => handleInputChange('annual_income', parseInt(e.target.value) || 0)}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Basic Salary</label>
              <input
                type="number"
                value={formData.basic_salary}
                onChange={(e) => handleInputChange('basic_salary', parseInt(e.target.value) || 0)}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">HRA Received (Annual)</label>
              <input
                type="number"
                value={formData.hra_received}
                onChange={(e) => handleInputChange('hra_received', parseInt(e.target.value) || 0)}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Monthly Rent Paid</label>
              <input
                type="number"
                value={formData.rent_paid}
                onChange={(e) => handleInputChange('rent_paid', parseInt(e.target.value) || 0)}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">City Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="metro"
                    checked={formData.city_type === 'metro'}
                    onChange={(e) => handleInputChange('city_type', e.target.value)}
                    className="text-accent"
                  />
                  <span>Metro</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="non-metro"
                    checked={formData.city_type === 'non-metro'}
                    onChange={(e) => handleInputChange('city_type', e.target.value)}
                    className="text-accent"
                  />
                  <span>Non-Metro</span>
                </label>
              </div>
            </div>
          </div>

          <h3 className="font-semibold flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-accent" />
            <span>Deductions</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                80C Investments (Max ₹1,50,000)
              </label>
              <input
                type="number"
                min="0"
                max="150000"
                value={formData.investments_80c}
                onChange={(e) => handleInputChange('investments_80c', Math.min(150000, parseInt(e.target.value) || 0))}
                className="input-field w-full"
              />
              <div className="text-xs text-muted mt-1">
                Includes ELSS, PPF, EPF, LIC, NSC, etc.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Health Insurance Premium (80D)
              </label>
              <input
                type="number"
                min="0"
                max="25000"
                value={formData.health_insurance}
                onChange={(e) => handleInputChange('health_insurance', Math.min(25000, parseInt(e.target.value) || 0))}
                className="input-field w-full"
              />
              <div className="text-xs text-muted mt-1">
                Max ₹25,000 for self (₹50,000 for senior citizens)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                NPS Contribution (80CCD1B)
              </label>
              <input
                type="number"
                min="0"
                max="50000"
                value={formData.nps_contribution}
                onChange={(e) => handleInputChange('nps_contribution', Math.min(50000, parseInt(e.target.value) || 0))}
                className="input-field w-full"
              />
              <div className="text-xs text-muted mt-1">
                Additional ₹50,000 over 80C limit
              </div>
            </div>
          </div>

          <button
            onClick={calculateTax}
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Calculating...' : 'Compare Tax Regimes'}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Winner Banner */}
            <div className={`card p-4 border-l-4 ${
              results.recommended === 'old' 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-blue-500 bg-blue-500/10'
            }`}>
              <div className="flex items-center space-x-3">
                {results.recommended === 'old' ? (
                  <TrendingDown className="w-6 h-6 text-green-500" />
                ) : (
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                )}
                <div>
                  <div className="font-semibold text-lg">
                    {results.recommended === 'old' ? 'Old Regime' : 'New Regime'} is Better!
                  </div>
                  <div className="text-sm text-muted">
                    You save {formatCurrency(results.savings)} in taxes
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`card p-4 border-2 ${
                results.recommended === 'old' 
                  ? 'border-green-500' 
                  : 'border-muted/30'
              }`}>
                <h4 className="font-semibold mb-3 text-green-500">Old Regime</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Gross Income:</span>
                    <span>{formatCurrency(formData.annual_income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Deductions:</span>
                    <span className="text-green-500">-{formatCurrency(results.old_regime.deductions)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Taxable Income:</span>
                    <span>{formatCurrency(formData.annual_income - results.old_regime.deductions)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tax:</span>
                    <span className="text-green-500">{formatCurrency(results.old_regime.tax)}</span>
                  </div>
                </div>
              </div>

              <div className={`card p-4 border-2 ${
                results.recommended === 'new' 
                  ? 'border-blue-500' 
                  : 'border-muted/30'
              }`}>
                <h4 className="font-semibold mb-3 text-blue-500">New Regime</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Gross Income:</span>
                    <span>{formatCurrency(formData.annual_income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Deductions:</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Taxable Income:</span>
                    <span>{formatCurrency(formData.annual_income)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tax:</span>
                    <span className="text-blue-500">{formatCurrency(results.new_regime.tax)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="card">
              <h3 className="font-semibold mb-4">Visual Comparison</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis 
                    stroke="#9ca3af"
                    tickFormatter={(value) => {
                      if (value >= 100000) return `${(value / 100000).toFixed(0)}L`;
                      return value;
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Tax" fill="#e94560" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Taxable Income" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Explanation */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="w-4 h-4 text-accent" />
                <h3 className="font-semibold">AI Explanation</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                {results.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxWizard;
