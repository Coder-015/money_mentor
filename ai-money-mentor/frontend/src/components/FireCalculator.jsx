import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, TrendingUp, Target, Calendar, Lightbulb, X } from 'lucide-react';

const FireCalculator = () => {
  const [formData, setFormData] = useState({
    age: 25,
    monthly_expenses: 50000,
    current_savings: 500000,
    monthly_sip: 15000,
    expected_return: 12
  });

  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [actionPlan, setActionPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  const calculateFire = () => {
    const annual_expenses = formData.monthly_expenses * 12;
    const fire_number = annual_expenses * 25; // 4% rule
    const monthly_return = formData.expected_return / 100 / 12;
    
    let years_to_fire = 0;
    let corpus = formData.current_savings;
    const data = [{ year: 0, corpus: corpus }];
    
    if (monthly_return > 0) {
      while (corpus < fire_number && years_to_fire < 50) {
        years_to_fire++;
        corpus = corpus * (1 + monthly_return) + formData.monthly_sip * (((1 + monthly_return) ** years_to_fire - 1) / monthly_return);
        data.push({ year: years_to_fire, corpus: corpus });
      }
    }
    
    const retirement_age = formData.age + years_to_fire;
    
    setResults({
      fire_number,
      years_to_fire,
      retirement_age,
      corpus_at_fire: fire_number
    });
    
    setChartData(data);
  };

  useEffect(() => {
    calculateFire();
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getActionPlan = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/fire-plan', formData);
      setActionPlan(response.data.action_plan);
      setShowActionPlan(true);
    } catch (error) {
      console.error('Error getting action plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-card border border-muted/30 p-3 rounded-lg">
          <p className="text-sm font-semibold">Year {payload[0].payload.year}</p>
          <p className="text-sm text-muted">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">FIRE Calculator</h2>
        <p className="text-muted">Calculate your Financial Independence, Retire Early number</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card space-y-6">
          <h3 className="font-semibold flex items-center space-x-2 mb-6">
            <Calculator className="w-5 h-5 text-accent" />
            <span>Your Details</span>
          </h3>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                Current Age: {formData.age} years
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  className="flex-1 slider"
                />
                <input
                  type="number"
                  min="20"
                  max="60"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  className="input-field w-24 text-center"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                Monthly Expenses: {formatCurrency(formData.monthly_expenses)}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={formData.monthly_expenses}
                  onChange={(e) => handleInputChange('monthly_expenses', parseInt(e.target.value))}
                  className="flex-1 slider"
                />
                <input
                  type="number"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={formData.monthly_expenses}
                  onChange={(e) => handleInputChange('monthly_expenses', parseInt(e.target.value))}
                  className="input-field w-32 text-center"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                Current Savings: {formatCurrency(formData.current_savings)}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={formData.current_savings}
                  onChange={(e) => handleInputChange('current_savings', parseInt(e.target.value))}
                  className="flex-1 slider"
                />
                <input
                  type="number"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={formData.current_savings}
                  onChange={(e) => handleInputChange('current_savings', parseInt(e.target.value))}
                  className="input-field w-32 text-center"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                Monthly SIP: {formatCurrency(formData.monthly_sip)}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="1000"
                  max="200000"
                  step="1000"
                  value={formData.monthly_sip}
                  onChange={(e) => handleInputChange('monthly_sip', parseInt(e.target.value))}
                  className="flex-1 slider"
                />
                <input
                  type="number"
                  min="1000"
                  max="200000"
                  step="1000"
                  value={formData.monthly_sip}
                  onChange={(e) => handleInputChange('monthly_sip', parseInt(e.target.value))}
                  className="input-field w-32 text-center"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                Expected Annual Return: {formData.expected_return}%
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="6"
                  max="18"
                  value={formData.expected_return}
                  onChange={(e) => handleInputChange('expected_return', parseInt(e.target.value))}
                  className="flex-1 slider"
                />
                <input
                  type="number"
                  min="6"
                  max="18"
                  value={formData.expected_return}
                  onChange={(e) => handleInputChange('expected_return', parseInt(e.target.value))}
                  className="input-field w-16 text-center"
                />
                <span className="text-sm text-muted">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results && (
            <>
              <div className="card overflow-hidden">
                <h3 className="font-semibold flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-accent" />
                  <span>Your FIRE Number</span>
                </h3>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-accent animate-pulse">
                    {formatCurrency(results.fire_number)}
                  </div>
                  <p className="text-sm text-muted">Amount needed to retire comfortably</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="card overflow-hidden">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Years to FIRE</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {results.years_to_fire === 50 ? '50+' : results.years_to_fire.toFixed(1)}
                  </div>
                </div>

                <div className="card overflow-hidden">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Retirement Age</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {results.retirement_age === 80 ? '80+' : results.retirement_age.toFixed(0)}
                  </div>
                </div>
              </div>

              <button
                onClick={getActionPlan}
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center space-x-2 transition-transform hover:scale-105"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{isLoading ? 'Generating...' : 'Get AI Action Plan'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="card overflow-hidden">
          <h3 className="font-semibold mb-4">Corpus Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="year" 
                stroke="#9ca3af"
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="#9ca3af"
                tickFormatter={(value) => {
                  if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
                  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
                  return value;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="corpus" 
                stroke="#e94560" 
                fill="#e94560" 
                fillOpacity={0.3}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Action Plan Modal */}
      {showActionPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <span>Personalized FIRE Action Plan</span>
                </h3>
                <button
                  onClick={() => setShowActionPlan(false)}
                  className="text-muted hover:text-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-text leading-relaxed">
                  {actionPlan}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FireCalculator;
