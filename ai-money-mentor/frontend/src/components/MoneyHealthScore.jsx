import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Heart, Shield, TrendingUp, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const MoneyHealthScore = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    emergency_months: 0,
    has_health_insurance: false,
    has_term_insurance: false,
    monthly_sip: 0,
    monthly_income: 0,
    has_debt: false,
    debt_emi: 0,
    invests_in_80c: false
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      id: 'emergency',
      title: 'Emergency Fund',
      icon: Heart,
      question: 'How many months of expenses do you have saved?',
      field: 'emergency_months',
      type: 'slider',
      min: 0,
      max: 12,
      unit: 'months'
    },
    {
      id: 'insurance',
      title: 'Insurance Coverage',
      icon: Shield,
      question: 'What insurance do you have?',
      type: 'checkbox',
      options: [
        { field: 'has_health_insurance', label: 'Health Insurance' },
        { field: 'has_term_insurance', label: 'Term Life Insurance' }
      ]
    },
    {
      id: 'investments',
      title: 'Investments',
      icon: TrendingUp,
      question: 'What percentage of your monthly income do you invest?',
      field: 'investment_percentage',
      type: 'slider',
      min: 0,
      max: 50,
      unit: '%'
    },
    {
      id: 'debt',
      title: 'Debt Health',
      icon: AlertCircle,
      question: 'What percentage of your income goes to EMI payments?',
      field: 'debt_percentage',
      type: 'slider',
      min: 0,
      max: 80,
      unit: '%'
    },
    {
      id: 'tax',
      title: 'Tax Planning',
      icon: CheckCircle,
      question: 'Do you invest in tax-saving instruments (80C)?',
      field: 'invests_in_80c',
      type: 'toggle'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateHealthScore = async () => {
    setIsLoading(true);
    
    // Calculate monthly_sip from percentage
    const monthly_sip = Math.round((formData.investment_percentage / 100) * formData.monthly_income);
    
    // Calculate debt_emi from percentage
    const debt_emi = Math.round((formData.debt_percentage / 100) * formData.monthly_income);
    
    const requestData = {
      ...formData,
      monthly_sip,
      debt_emi
    };

    try {
      const response = await axios.post('/api/health-score', requestData);
      setResults(response.data);
    } catch (error) {
      console.error('Error calculating health score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (currentStep === steps.length - 1) {
      calculateHealthScore();
    } else {
      handleNext();
    }
  };

  const getScoreColor = (score) => {
    if (score <= 40) return '#ef4444'; // red
    if (score <= 70) return '#f59e0b'; // amber
    return '#10b981'; // green
  };

  const getScoreMessage = (score) => {
    if (score <= 40) return 'Needs Attention';
    if (score <= 70) return 'Fair';
    return 'Excellent';
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    const Icon = step.icon;

    if (step.type === 'slider') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Icon className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted">{step.question}</p>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {formData[step.field] || 0}{step.unit}
              </div>
            </div>
            
            <input
              type="range"
              min={step.min}
              max={step.max}
              value={formData[step.field] || 0}
              onChange={(e) => handleInputChange(step.field, parseInt(e.target.value))}
              className="slider"
            />
            
            <input
              type="number"
              min={step.min}
              max={step.max}
              value={formData[step.field] || 0}
              onChange={(e) => handleInputChange(step.field, parseInt(e.target.value))}
              className="input-field w-full"
            />
          </div>

          {step.field === 'investment_percentage' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Monthly Income (for calculation)</label>
              <input
                type="number"
                placeholder="Enter your monthly income"
                value={formData.monthly_income || ''}
                onChange={(e) => handleInputChange('monthly_income', parseInt(e.target.value) || 0)}
                className="input-field w-full"
              />
              {formData.monthly_income > 0 && (
                <p className="text-sm text-muted">
                  Monthly SIP: ₹{Math.round((formData.investment_percentage / 100) * formData.monthly_income).toLocaleString('en-IN')}
                </p>
              )}
            </div>
          )}

          {step.field === 'debt_percentage' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Monthly Income (for calculation)</label>
              <input
                type="number"
                placeholder="Enter your monthly income"
                value={formData.monthly_income || ''}
                onChange={(e) => handleInputChange('monthly_income', parseInt(e.target.value) || 0)}
                className="input-field w-full"
              />
              {formData.monthly_income > 0 && (
                <p className="text-sm text-muted">
                  Monthly EMI: ₹{Math.round((formData.debt_percentage / 100) * formData.monthly_income).toLocaleString('en-IN')}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }

    if (step.type === 'checkbox') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Icon className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted">{step.question}</p>
          </div>

          <div className="space-y-4">
            {step.options.map((option) => (
              <label key={option.field} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[option.field]}
                  onChange={(e) => handleInputChange(option.field, e.target.checked)}
                  className="w-5 h-5 text-accent bg-primary border-muted rounded focus:ring-accent"
                />
                <span className="text-lg">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (step.type === 'toggle') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Icon className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted">{step.question}</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleInputChange(step.field, false)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                !formData[step.field]
                  ? 'bg-accent text-white'
                  : 'bg-card border border-muted/30 text-muted'
              }`}
            >
              No
            </button>
            <button
              onClick={() => handleInputChange(step.field, true)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                formData[step.field]
                  ? 'bg-accent text-white'
                  : 'bg-card border border-muted/30 text-muted'
              }`}
            >
              Yes
            </button>
          </div>
        </div>
      );
    }
  };

  const renderResults = () => {
    if (!results) return null;

    const chartData = [
      { name: 'Emergency Fund', score: results.breakdown.emergency_fund, max: 20 },
      { name: 'Insurance', score: results.breakdown.insurance, max: 20 },
      { name: 'Investments', score: results.breakdown.investments, max: 20 },
      { name: 'Debt Health', score: results.breakdown.debt_health, max: 20 },
      { name: 'Tax Planning', score: results.breakdown.tax_planning, max: 20 },
    ];

    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (results.score / 100) * circumference;

    return (
      <div className="space-y-6">
        {/* Score Gauge */}
        <div className="card text-center">
          <h3 className="text-xl font-semibold mb-6">Your Money Health Score</h3>
          <div className="relative inline-block">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="#374151"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke={getScoreColor(results.score)}
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold" style={{ color: getScoreColor(results.score) }}>
                {results.score}
              </div>
              <div className="text-sm text-muted">/ 100</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold" style={{ color: getScoreColor(results.score) }}>
              {getScoreMessage(results.score)}
            </div>
          </div>
        </div>

        {/* Breakdown Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                domain={[0, 20]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #374151' }}
                labelStyle={{ color: '#fffffe' }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getScoreColor((entry.score / entry.max) * 100)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tips */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personalized Tips</h3>
          {results.tips.map((tip, index) => (
            <div key={index} className="card border-l-4 border-accent">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-accent text-sm font-semibold">{index + 1}</span>
                </div>
                <p className="text-sm leading-relaxed">{tip}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setResults(null);
            setCurrentStep(0);
            setFormData({
              emergency_months: 0,
              has_health_insurance: false,
              has_term_insurance: false,
              monthly_sip: 0,
              monthly_income: 0,
              has_debt: false,
              debt_emi: 0,
              invests_in_80c: false,
              investment_percentage: 0,
              debt_percentage: 0
            });
          }}
          className="btn-secondary w-full"
        >
          Retake Assessment
        </button>
      </div>
    );
  };

  if (results) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Money Health Score</h2>
          <p className="text-muted">Complete financial health assessment</p>
        </div>
        {renderResults()}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Money Health Score</h2>
        <p className="text-muted">Assess your financial health in 5 simple steps</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm text-muted">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="card mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="btn-primary flex items-center space-x-2"
        >
          <span>{currentStep === steps.length - 1 ? (isLoading ? 'Calculating...' : 'Calculate Score') : 'Next'}</span>
          {currentStep !== steps.length - 1 && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default MoneyHealthScore;
