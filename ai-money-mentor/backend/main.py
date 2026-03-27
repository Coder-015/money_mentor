from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from groq import Groq
import math

from knowledge import KNOWLEDGE_BASE

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class AskRequest(BaseModel):
    question: str
    user_context: Optional[str] = None

class HealthScoreRequest(BaseModel):
    emergency_months: int
    has_health_insurance: bool
    has_term_insurance: bool
    monthly_sip: int
    monthly_income: int
    has_debt: bool
    debt_emi: int
    invests_in_80c: bool

class TaxWizardRequest(BaseModel):
    annual_income: int
    basic_salary: int
    hra_received: int
    rent_paid: int
    city_type: str  # "metro" or "non-metro"
    investments_80c: int
    health_insurance: int
    nps_contribution: int

class FirePlanRequest(BaseModel):
    age: int
    monthly_expenses: int
    current_savings: int
    monthly_sip: int
    expected_return: float

@app.post("/ask")
async def ask_question(request: AskRequest):
    try:
        system_prompt = f"""You are an AI Money Mentor specializing in Indian finance. Use this knowledge base to answer questions accurately:

{KNOWLEDGE_BASE}

Provide helpful, accurate, and personalized financial advice. Always mention that this is AI-generated advice and users should consult certified financial planners for major decisions."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Question: {request.question}"}
        ]
        
        if request.user_context:
            messages.append({"role": "user", "content": f"User Context: {request.user_context}"})
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        return {"answer": response.choices[0].message.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/health-score")
async def calculate_health_score(request: HealthScoreRequest):
    try:
        # Calculate scores for each dimension
        scores = {}
        
        # Emergency Fund (20 points)
        if request.emergency_months == 0:
            scores["emergency_fund"] = 0
        elif request.emergency_months < 3:
            scores["emergency_fund"] = 5
        elif request.emergency_months < 6:
            scores["emergency_fund"] = 10
        else:
            scores["emergency_fund"] = 20
        
        # Insurance (20 points)
        if not request.has_health_insurance and not request.has_term_insurance:
            scores["insurance"] = 0
        elif request.has_health_insurance and not request.has_term_insurance:
            scores["insurance"] = 10
        elif not request.has_health_insurance and request.has_term_insurance:
            scores["insurance"] = 10
        else:
            scores["insurance"] = 20
        
        # Investments (20 points)
        if request.monthly_income > 0:
            sip_percentage = (request.monthly_sip / request.monthly_income) * 100
            if sip_percentage < 10:
                scores["investments"] = 0
            elif sip_percentage < 20:
                scores["investments"] = 10
            else:
                scores["investments"] = 20
        else:
            scores["investments"] = 0
        
        # Debt Health (20 points)
        if request.has_debt and request.monthly_income > 0:
            debt_percentage = (request.debt_emi / request.monthly_income) * 100
            if debt_percentage > 50:
                scores["debt_health"] = 0
            elif debt_percentage > 20:
                scores["debt_health"] = 10
            else:
                scores["debt_health"] = 20
        elif not request.has_debt:
            scores["debt_health"] = 20
        else:
            scores["debt_health"] = 0
        
        # Tax Planning (20 points)
        scores["tax_planning"] = 20 if request.invests_in_80c else 0
        
        total_score = sum(scores.values())
        
        # Generate personalized tips using Groq
        context = f"""
        User Profile:
        - Emergency Fund: {request.emergency_months} months
        - Health Insurance: {request.has_health_insurance}
        - Term Insurance: {request.has_term_insurance}
        - Monthly SIP: ₹{request.monthly_sip:,}
        - Monthly Income: ₹{request.monthly_income:,}
        - Has Debt: {request.has_debt}
        - Debt EMI: ₹{request.debt_emi:,}
        - Invests in 80C: {request.invests_in_80c}
        - Total Score: {total_score}/100
        
        Provide 3 specific, actionable improvement tips based on their current financial situation.
        """
        
        messages = [
            {"role": "system", "content": f"You are an AI Money Mentor. Use this knowledge: {KNOWLEDGE_BASE}"},
            {"role": "user", "content": context}
        ]
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=300
        )
        
        tips_text = response.choices[0].message.content
        tips = [tip.strip() for tip in tips_text.split('\n') if tip.strip() and not tip.strip().startswith(('1.', '2.', '3.', '-'))]
        
        return {
            "score": total_score,
            "breakdown": scores,
            "tips": tips[:3] if tips else ["Focus on building an emergency fund", "Start investing in tax-saving instruments", "Review your insurance coverage"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tax-wizard")
async def calculate_tax(request: TaxWizardRequest):
    try:
        # Old Regime Calculation
        old_deductions = 0
        
        # Section 80C
        old_deductions += min(request.investments_80c, 150000)
        
        # Health Insurance (80D)
        old_deductions += min(request.health_insurance, 25000)
        
        # NPS (80CCD1B)
        old_deductions += min(request.nps_contribution, 50000)
        
        # HRA Calculation
        hra_exempt = 0
        if request.rent_paid > 0:
            basic_salary = request.basic_salary
            hra_received = request.hra_received
            rent_paid_annual = request.rent_paid * 12
            
            hra_percentage = 0.5 if request.city_type == "metro" else 0.4
            hra_basis = basic_salary * hra_percentage
            rent_minus_10percent = max(0, rent_paid_annual - (basic_salary * 0.1))
            
            hra_exempt = min(hra_received, hra_basis, rent_minus_10percent)
            old_deductions += hra_exempt
        
        old_taxable_income = max(0, request.annual_income - old_deductions)
        old_tax = calculate_old_regime_tax(old_taxable_income)
        
        # New Regime Calculation
        new_taxable_income = request.annual_income
        new_tax = calculate_new_regime_tax(new_taxable_income)
        
        # Determine recommendation
        if old_tax < new_tax:
            recommended = "old"
            savings = new_tax - old_tax
        else:
            recommended = "new"
            savings = old_tax - new_tax
        
        # Generate explanation
        context = f"""
        Tax Comparison:
        Old Regime: Gross ₹{request.annual_income:,}, Deductions ₹{old_deductions:,}, Tax ₹{old_tax:,}
        New Regime: Gross ₹{request.annual_income:,}, Tax ₹{new_tax:,}
        Recommended: {recommended} regime, Savings: ₹{savings:,}
        
        Explain in simple terms why {recommended} regime is better for this user.
        """
        
        messages = [
            {"role": "system", "content": f"You are an AI Money Mentor. Use this knowledge: {KNOWLEDGE_BASE}"},
            {"role": "user", "content": context}
        ]
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=300
        )
        
        explanation = response.choices[0].message.content
        
        return {
            "old_regime": {
                "tax": old_tax,
                "deductions": old_deductions,
                "net_tax": old_tax
            },
            "new_regime": {
                "tax": new_tax,
                "net_tax": new_tax
            },
            "recommended": recommended,
            "savings": savings,
            "explanation": explanation
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/fire-plan")
async def calculate_fire_plan(request: FirePlanRequest):
    try:
        # Calculate FIRE number (4% rule)
        annual_expenses = request.monthly_expenses * 12
        fire_number = annual_expenses * 25  # 4% withdrawal rate
        
        # Calculate years to FIRE
        monthly_return = request.expected_return / 100 / 12
        current_savings = request.current_savings
        monthly_sip = request.monthly_sip
        
        if monthly_return <= 0:
            years_to_fire = float('inf')
        else:
            # Using compound interest formula to solve for time
            if monthly_sip > 0:
                # Future value of SIP: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
                # We need to solve for n when FV + current_savings*(1+r)^n = fire_number
                years_to_fire = calculate_years_to_fire(current_savings, monthly_sip, monthly_return, fire_number)
            else:
                # Only current savings growing
                if current_savings >= fire_number:
                    years_to_fire = 0
                else:
                    years_to_fire = math.log(fire_number / current_savings) / (12 * math.log(1 + monthly_return))
        
        retirement_age = request.age + years_to_fire
        corpus_at_fire = fire_number
        
        # Generate AI action plan
        context = f"""
        User FIRE Profile:
        - Current Age: {request.age}
        - Monthly Expenses: ₹{request.monthly_expenses:,}
        - Current Savings: ₹{request.current_savings:,}
        - Monthly SIP: ₹{request.monthly_sip:,}
        - Expected Return: {request.expected_return}%
        - FIRE Number: ₹{fire_number:,}
        - Years to FIRE: {years_to_fire:.1f}
        - Retirement Age: {retirement_age:.1f}
        
        Provide a detailed month-by-month action plan to achieve FIRE faster. Include specific investment recommendations, expense optimization tips, and milestone targets.
        """
        
        messages = [
            {"role": "system", "content": f"You are an AI Money Mentor specializing in FIRE planning. Use this knowledge: {KNOWLEDGE_BASE}"},
            {"role": "user", "content": context}
        ]
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=800
        )
        
        action_plan = response.choices[0].message.content
        
        return {
            "fire_number": fire_number,
            "years_to_fire": years_to_fire,
            "retirement_age": retirement_age,
            "corpus_at_fire": corpus_at_fire,
            "action_plan": action_plan
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def calculate_old_regime_tax(taxable_income):
    tax = 0
    if taxable_income <= 250000:
        tax = 0
    elif taxable_income <= 500000:
        tax = (taxable_income - 250000) * 0.05
    elif taxable_income <= 1000000:
        tax = 12500 + (taxable_income - 500000) * 0.20
    else:
        tax = 112500 + (taxable_income - 1000000) * 0.30
    return int(tax)

def calculate_new_regime_tax(taxable_income):
    tax = 0
    if taxable_income <= 300000:
        tax = 0
    elif taxable_income <= 700000:
        tax = (taxable_income - 300000) * 0.05
    elif taxable_income <= 1000000:
        tax = 20000 + (taxable_income - 700000) * 0.10
    elif taxable_income <= 1200000:
        tax = 50000 + (taxable_income - 1000000) * 0.15
    elif taxable_income <= 1500000:
        tax = 80000 + (taxable_income - 1200000) * 0.20
    else:
        tax = 140000 + (taxable_income - 1500000) * 0.30
    return int(tax)

def calculate_years_to_fire(current_savings, monthly_sip, monthly_return, target_amount):
    # Simplified calculation using iteration
    months = 0
    max_months = 600  # 50 years max
    
    while months < max_months:
        future_value = current_savings * ((1 + monthly_return) ** months)
        if monthly_sip > 0:
            future_value += monthly_sip * (((1 + monthly_return) ** months - 1) / monthly_return)
        
        if future_value >= target_amount:
            return months / 12
        
        months += 1
    
    return float('inf')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
